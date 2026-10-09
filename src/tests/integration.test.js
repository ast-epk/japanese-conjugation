import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { CONJUGATION_TYPES, PARTS_OF_SPEECH } from "../constants.js";
import { wordData } from "../data/dict/index.js";
import { conjugateVerb, conjugateAdjective } from "../modules/conjEngine.js";

describe("main.js <-> conjEngine.js Contract Integration Test", () => {

	const POLARITY_PERMUTATIONS = [
		{ aff: true, pol: false, name: "Plain Affirmative" },
		{ aff: true, pol: true, name: "Polite Affirmative" },
		{ aff: false, pol: false, name: "Plain Negative" },
		{ aff: false, pol: true, name: "Polite Negative" },
		{ aff: null, pol: null, name: "Form-only (Te/Imperative)" }
	];

	describe("Verbs Dataset Coverage", () => {
		test("Every verb in wordData conjugates cleanly across all CONJUGATION_TYPES", () => {
			assert.ok(Array.isArray(wordData.verbs), "wordData.verbs must be an array");

			for (const word of wordData.verbs) {
				const baseSpelling = word.kanji.replace(/<[^>]*>/g, ""); // Strip furigana tags

				for (const [typeKey, conjType] of Object.entries(CONJUGATION_TYPES)) {
					// Skip adjective-only forms for verbs
					if (conjType === CONJUGATION_TYPES.adverb) continue;

					for (const { aff, pol } of POLARITY_PERMUTATIONS) {
						assert.doesNotThrow(
							() => {
								const result = conjugateVerb(
									baseSpelling,
									word.type,
									conjType,
									aff,
									pol,
									word.group
								);

								assert.ok(
									result,
									`Null/undefined returned for verb "${baseSpelling}" (${word.type}) with form "${conjType}"`
								);

								if (Array.isArray(result)) {
									assert.ok(result.length > 0, `Empty array returned for verb "${baseSpelling}"`);
								}
							},
							`Failed while conjugating verb "${baseSpelling}" (${word.type}) for "${conjType}" (aff: ${aff}, pol: ${pol})`
						);
					}
				}
			}
		});
	});

	describe("Adjectives Dataset Coverage", () => {
		test("Every adjective in wordData conjugates cleanly across relevant CONJUGATION_TYPES", () => {
			assert.ok(Array.isArray(wordData.adjectives), "wordData.adjectives must be an array");

			const supportedAdjectiveForms = [
				CONJUGATION_TYPES.present,
				CONJUGATION_TYPES.past,
				CONJUGATION_TYPES.te,
				CONJUGATION_TYPES.adverb,
				"adverbial"
			];

			for (const word of wordData.adjectives) {
				const baseSpelling = word.kanji.replace(/<[^>]*>/g, ""); // Strip furigana tags

				for (const conjType of supportedAdjectiveForms) {
					for (const { aff, pol } of POLARITY_PERMUTATIONS) {
						assert.doesNotThrow(
							() => {
								const result = conjugateAdjective(
									baseSpelling,
									word.type,
									conjType,
									aff,
									pol
								);

								assert.ok(
									result,
									`Null/undefined returned for adjective "${baseSpelling}" (${word.type}) with form "${conjType}"`
								);

								if (Array.isArray(result)) {
									assert.ok(result.length > 0, `Empty array returned for adjective "${baseSpelling}"`);
								}
							},
							`Failed while conjugating adjective "${baseSpelling}" (${word.type}) for "${conjType}" (aff: ${aff}, pol: ${pol})`
						);
					}
				}
			}
		});
	});

});