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
function normalizeKey(str) {
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

	switch (conjugationType) {
		case CONJUGATION_TYPES.present: {
			const negStem = type === "godan" ? shiftKana(base, "a") + "ない" : stem + "ない";
			return applyForm("", {
				aff_polite: stem + "ます",
				aff_plain: base,
				neg_polite: [stem + "ません", negStem + "です"],
				neg_plain: negStem,
			}, aff, pol);
		}

		case CONJUGATION_TYPES.past: {
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

		case CONJUGATION_TYPES.te: {
			return type === "godan" 
				? base.slice(0, -1) + kanaShifts.te[lastChar]
				: stem + "て";
		}

		case CONJUGATION_TYPES.volitional: {
			if (pol) return stem + "ましょう";
			return type === "godan" ? shiftKana(base, "o") + "う" : stem + "よう";
		}

		case CONJUGATION_TYPES.passive: {
			const root = shiftKana(base, "a");
			return applyForm(root, {
				aff_plain: "れる",
				aff_polite: "れます",
				neg_plain: "れない",
				neg_polite: "れません",
			}, aff, pol);
		}

		case CONJUGATION_TYPES.causative: {
			const root = type === "ichidan" ? stem + "さ" : shiftKana(base, "a");
			return applyForm(root, {
				aff_plain: "せる",
				aff_polite: "せます",
				neg_plain: "せない",
				neg_polite: "せません",
			}, aff, pol);
		}

		case CONJUGATION_TYPES.potential: {
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

		case CONJUGATION_TYPES.imperative: {
			if (type === "ichidan") {
				return [stem + "ろ", stem + "よ"];
			}
			return shiftKana(base, "e");
		}

		case CONJUGATION_TYPES.causativePassive: {
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
export function conjugateVerb(baseWord, type, conjugationType, aff, pol, groupKey = null, debug = false) {
	if (debug == true) {
    console.log("\n--- [DEBUG conjugateVerb] ---");
    console.log(`INPUT -> baseWord: "${baseWord}", type: "${type}", conjugationType: "${conjugationType}", aff: ${aff}, pol: ${pol}, groupKey: ${groupKey}`);

    const indexedKey = IRREGULAR_BASE_INDEX.get(baseWord);
    const ruleKey = groupKey || indexedKey;
    console.log(`LOOKUP -> indexedKey: "${indexedKey}", resolved ruleKey: "${ruleKey}"`);

    const rule = irregularRules[ruleKey];
    console.log(`RULE FOUND ->`, rule ? `Key "${ruleKey}" exists in irregularRules.json` : "NONE (Undefined rule)");

    if (rule) {
      const overrideMap = findOverrideMap(rule, conjugationType);
      console.log(`OVERRIDE MAP -> normalizeKey("${conjugationType}") = "${normalizeKey(conjugationType)}"`);
      console.log(`OVERRIDE MAP RESULT ->`, overrideMap || "NULL (No matching key in rule.overrides)");

      if (overrideMap) {
        const formKey = (aff === null || aff === undefined)
          ? "all"
          : `${aff ? "aff" : "neg"}_${pol ? "polite" : "plain"}`;

        console.log(`FORM KEY CALCULATED -> "${formKey}"`);
        const override = overrideMap[formKey] || overrideMap.all;
        console.log(`OVERRIDE MATCHED ->`, override || "UNDEFINED (Form key missing inside overrideMap)");

        if (override) {
          const process = (val) => val.startsWith("+") ? baseWord.slice(0, -1) + val.slice(1) : val;
          const result = Array.isArray(override) ? override.map(process) : process(override);
          console.log(`>>> RETURNING OVERRIDE ->`, result);
          return result;
        }
      }

      console.log(`>>> FALLING BACK to conjugateStandard with fallbackType: "${rule.fallbackType || 'godan'}"`);
      return conjugateStandard(baseWord, rule.fallbackType || "godan", conjugationType, aff, pol);
    }

    console.log(`>>> FALLING BACK to conjugateStandard with original type: "${type}"`);
    return conjugateStandard(baseWord, type, conjugationType, aff, pol);
  } else {
      const indexedKey = IRREGULAR_BASE_INDEX.get(baseWord);
      const ruleKey = groupKey || indexedKey;

      const rule = irregularRules[ruleKey];

      if (rule) {
        const overrideMap = findOverrideMap(rule, conjugationType);

        if (overrideMap) {
          const formKey = (aff === null || aff === undefined || pol === null || pol === undefined)
            ? "all"
            : `${aff ? "aff" : "neg"}_${pol ? "polite" : "plain"}`;

          // Try specific formKey first, fall back to 'all', or default to first available entry
          const override = overrideMap[formKey] ?? overrideMap.all ?? Object.values(overrideMap)[0];

          if (override) {
            const process = (val) => val.startsWith("+") ? baseWord.slice(0, -1) + val.slice(1) : val;
            return Array.isArray(override) ? override.map(process) : process(override);
          }
        }

        return conjugateStandard(baseWord, rule.fallbackType || "godan", conjugationType, aff, pol);
      }
    //fallback
    return conjugateStandard(baseWord, type, conjugationType, aff, pol);
  }
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