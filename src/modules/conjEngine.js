import regularRules from "../data/regularRules.json" with { type: "json" };
import irregularRules from "../data/irregularRules.json" with { type: "json" };
import kanaShifts from "../data/kanaShifts.json" with { type: "json" };
import { CONJUGATION_TYPES } from "../constants.js";


// Index bases from irregularRules.json for O(1) lookup
const IRREGULAR_BASE_INDEX = new Map();
for (const [ruleKey, ruleData] of Object.entries(irregularRules)) {
	if (Array.isArray(ruleData.bases)) {
		ruleData.bases.forEach((base) => IRREGULAR_BASE_INDEX.set(base, ruleKey));
	}
}

// Sort bases by length descending to match longer compound bases first
const IRREGULAR_BASES_SORTED = Array.from(IRREGULAR_BASE_INDEX.entries())
	.sort((a, b) => b[0].length - a[0].length);

/** Resolves rule key and matched base for both simple and compound verbs */
function resolveIrregular(baseWord, groupKey) {
	if (groupKey && irregularRules[groupKey]) {
		const rule = irregularRules[groupKey];
		const matchedBase = rule.bases?.find((b) => baseWord.endsWith(b)) || baseWord;
		return { ruleKey: groupKey, matchedBase };
	}

	if (IRREGULAR_BASE_INDEX.has(baseWord)) {
		return { ruleKey: IRREGULAR_BASE_INDEX.get(baseWord), matchedBase: baseWord };
	}

	for (const [base, ruleKey] of IRREGULAR_BASES_SORTED) {
		if (baseWord.endsWith(base)) {
			return { ruleKey, matchedBase: base };
		}
	}

	return { ruleKey: null, matchedBase: null };
}

// Japanese name and formatting alias mapping
const TYPE_ALIASES = {
	"て": "te",
	"過去": "past",
	"現在": "present",
	"意向": "volitional",
	"受身": "passive",
	"使役": "causative",
	"可能": "potential",
	"命令": "imperative",
	"使役受身": "causativepassive",
	"副詞": "adverb"
};

export function evaluateAnswer(validAnswers, userInput) {
  if (!userInput || typeof userInput !== "string") return false;
  
  const normalizedInput = userInput.trim();
  return validAnswers.some((ans) => {
    const cleanAnswer = ans.replace(/<[^>]*>/g, "").trim();
    return cleanAnswer === normalizedInput;
  });
}

/** Normalizes Japanese/English conjugation type names to JSON rule keys */
export function normalizeKey(str) {
	if (!str) return "";
	const cleaned = String(str)
		.toLowerCase()
		.replace(/[-_\s]/g, "")
		.replace(/(form|形)$/i, "");

	return TYPE_ALIASES[cleaned] || cleaned;
}

/** Resolves override block inside rule.overrides */
function findOverrideMap(rule, conjugationType) {
	if (!rule?.overrides) return null;
	const targetKey = normalizeKey(conjugationType);

	for (const [key, value] of Object.entries(rule.overrides)) {
		if (normalizeKey(key) === targetKey) {
			return value;
		}
	}
	return null;
}

/** Shifts trailing kana of a stem to a target vowel row */
export function shiftKana(stem, vowel) {
	const lastChar = stem.slice(-1);
	const targetKey = `to${vowel.toUpperCase()}`;
	const shifted = kanaShifts[targetKey]?.[lastChar] || lastChar;
	return stem.slice(0, -1) + shifted;
}

/** Combines base stems with standard form suffixes */
export function applyForm(stems, suffixes, affirmative, polite) {
	if (affirmative === null || polite === null) {
		const stemList = [].concat(stems);
		const suffixList = [].concat(suffixes.all || suffixes);
		const results = stemList.flatMap((stem) => suffixList.map((s) => stem + s));
		return results.length === 1 ? results[0] : results;
	}

	const key = `${affirmative ? "aff" : "neg"}_${polite ? "polite" : "plain"}`;
	const suffixList = [].concat(suffixes[key] || []);
	const stemList = [].concat(stems);

	const results = stemList.flatMap((stem) =>
		suffixList.map((s) => stem + s)
	);

	return results.length === 1 ? results[0] : results;
}

/**
 * Pure Standard Conjugator for regular Godan & Ichidan verbs.
 */
export function conjugateStandard(base, type, conjugationType, aff, pol) {
	const lastChar = base.slice(-1);
	const stem = type === "godan" ? shiftKana(base, "i") : base.slice(0, -1);
	const normType = normalizeKey(conjugationType);

	switch (normType) {
		case "present": {
			const negStem = type === "godan" ? shiftKana(base, "a") + "ない" : stem + "ない";
			return applyForm("", {
				aff_polite: stem + "ます",
				aff_plain: base,
				neg_polite: [stem + "ません", negStem + "です"],
				neg_plain: negStem,
			}, aff, pol);
		}

		case "past": {
			const plainPast = type === "godan" 
				? base.slice(0, -1) + kanaShifts.pastPlain[lastChar]
				: stem + "た";
			const negPlain = type === "godan" 
				? shiftKana(base, "a") + "なかった" 
				: stem + "なかった";

			return applyForm("", {
				aff_polite: stem + "ました",
				aff_plain: plainPast,
				neg_polite: [stem + "ませんでした", negPlain + "です"],
				neg_plain: negPlain,
			}, aff, pol);
		}

		case "te": {
			return type === "godan" 
				? base.slice(0, -1) + kanaShifts.te[lastChar]
				: stem + "て";
		}

		case "volitional": {
			const affPlain = type === "godan" ? shiftKana(base, "o") + "う" : stem + "よう";
			const negPlain = type === "godan" ? shiftKana(base, "a") + "ないだろう" : stem + "ないだろう";
			const negPolite = type === "godan" 
				? [stem + "ましょう", shiftKana(base, "a") + "ないでしょう"] 
				: [stem + "ましょう", stem + "ないでしょう"];

			return applyForm("", {
				aff_plain: affPlain,
				aff_polite: stem + "ましょう",
				neg_plain: [negPlain, base + "まい"],
				neg_polite: negPolite,
			}, aff, pol);
		}

		case "passive": {
			const root = shiftKana(base, "a");
			return applyForm(root, {
				aff_plain: "れる",
				aff_polite: "れます",
				neg_plain: "れない",
				neg_polite: "れません",
			}, aff, pol);
		}

		case "causative": {
			const root = type === "ichidan" ? stem + "さ" : shiftKana(base, "a");
			return applyForm(root, {
				aff_plain: "せる",
				aff_polite: "せます",
				neg_plain: "せない",
				neg_polite: "せません",
			}, aff, pol);
		}

		case "potential": {
			const roots = type === "godan" 
				? [shiftKana(base, "e")] 
				: [stem + "られ", stem + "れ"];

			return applyForm(roots, {
				aff_plain: "る",
				aff_polite: "ます",
				neg_plain: "ない",
				neg_polite: "ません",
			}, aff, pol);
		}

		case "imperative": {
			if (type === "ichidan") {
				return [stem + "ろ", stem + "よ"];
			}
			return shiftKana(base, "e");
		}

		case "causativepassive": {
			const roots = [];
			if (type === "godan") {
				const root = shiftKana(base, "a");
				if (lastChar === "す") {
					roots.push(root + "せられ");
				} else {
					roots.push(root + "せられ", root + "され");
				}
			} else {
				roots.push(stem + "させられ");
			}

			return applyForm(roots, {
				aff_plain: "る",
				aff_polite: "ます",
				neg_plain: "ない",
				neg_polite: "ません",
			}, aff, pol);
		}

		default:
			throw new Error(`Unsupported conjugation type: ${conjugationType}`);
	}
}

/**
 * Main Conjugation Router.
 */
export function conjugateVerb(baseWord, type, conjugationType, aff, pol, groupKey = null) {
	const { ruleKey, matchedBase } = resolveIrregular(baseWord, groupKey);
	const rule = irregularRules[ruleKey];

	if (rule) {
		const overrideMap = findOverrideMap(rule, conjugationType);

		if (overrideMap) {
			const formKey = (aff === null || aff === undefined || pol === null || pol === undefined)
				? "all"
				: `${aff ? "aff" : "neg"}_${pol ? "polite" : "plain"}`;

			// Strictly check formKey or 'all' — do NOT fall back to Object.values(overrideMap)[0]
			const override = overrideMap[formKey] ?? overrideMap.all;

			if (override) {
				const prefix = baseWord.slice(0, baseWord.length - matchedBase.length);
				const process = (val) => {
					let conjugatedPart = val;
					if (val.startsWith("+")) {
						const matchedStem = matchedBase.slice(0, -1);
						conjugatedPart = matchedStem + val.slice(1);
					}
					return prefix + conjugatedPart;
				};

				return Array.isArray(override) ? override.map(process) : process(override);
			}
		}

		// Fall back to standard engine (Godan) when polite form is not explicitly overridden
		return conjugateStandard(baseWord, rule.fallbackType || "godan", conjugationType, aff, pol);
	}

	return conjugateStandard(baseWord, type, conjugationType, aff, pol);
}
/**
 * Adjective Conjugator for い-adjectives, な-adjectives, and irregular adjectives (いい / 良い).
 */
export function conjugateAdjective(baseWord, type, conjugationType, aff, pol) {
	const normType = normalizeKey(conjugationType);
	const isIrr = type === "irr_adj" || baseWord === "いい" || baseWord === "良い";

	let actualType = type;
	let stem = baseWord;

	if (isIrr) {
		actualType = "i_adj";
		stem = baseWord === "良い" ? "良" : "よ";
	} else if (actualType === "i_adj") {
		stem = baseWord.endsWith("い") ? baseWord.slice(0, -1) : baseWord;
	}

	if (actualType === "i_adj") {
		switch (normType) {
			case "present":
				if (isIrr && aff && !pol) return baseWord;
				if (isIrr && aff && pol) return baseWord + "です";

				return applyForm(stem, {
					aff_plain: "い",
					aff_polite: "いです",
					neg_plain: "くない",
					neg_polite: ["くないです", "くありません"],
				}, aff, pol);

			case "past":
				return applyForm(stem, {
					aff_plain: "かった",
					aff_polite: "かったです",
					neg_plain: "くなかった",
					neg_polite: ["くなかったです", "くありませんでした"],
				}, aff, pol);

			case "te":
				return stem + "くて";

			case "adverb":
			case "adverbial":
				return stem + "く";

			default:
				throw new Error(`Unsupported adjective conjugation type: ${conjugationType}`);
		}
	}

	if (actualType === "na_adj") {
		switch (normType) {
			case "present":
				return applyForm(stem, {
					aff_plain: "だ",
					aff_polite: "です",
					neg_plain: ["じゃない", "ではない"],
					neg_polite: ["じゃないです", "ではありません"],
				}, aff, pol);

			case "past":
				return applyForm(stem, {
					aff_plain: "だった",
					aff_polite: "でした",
					neg_plain: ["じゃなかった", "ではなかった"],
					neg_polite: ["じゃなかったです", "ではありませんでした"],
				}, aff, pol);

			case "te":
				return stem + "で";

			case "adverb":
			case "adverbial":
				return stem + "に";

			default:
				throw new Error(`Unsupported adjective conjugation type: ${conjugationType}`);
		}
	}

	throw new Error(`Unsupported adjective type: ${type}`);
}