import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { conjugateVerb } from "../modules/conjEngine.js";
import { CONJUGATION_TYPES } from "../constants.js";

describe("Irregular Conjugation Engine", () => {
	describe("iku / 行く (Godan fallback with targeted overrides)", () => {
		test("applies override for te-form (て-形)", () => {
			const kanjiResult = conjugateVerb(
				"行く",
				"iku",
				CONJUGATION_TYPES.te,
				null,
				null
			);
			const kanaResult = conjugateVerb(
				"いく",
				"iku",
				CONJUGATION_TYPES.te,
				null,
				null
			);

			assert.equal(kanjiResult, "行って");
			assert.equal(kanaResult, "いって");
		});

		test("applies override for plain past affirmative", () => {
			const result = conjugateVerb(
				"行く",
				"iku",
				CONJUGATION_TYPES.past,
				true,
				false
			);
			assert.equal(result, "行った");
		});

		test("falls back to standard godan for non-overridden forms", () => {
			const politePresent = conjugateVerb(
				"行く",
				"iku",
				CONJUGATION_TYPES.present,
				true,
				true
			);
			const plainNegative = conjugateVerb(
				"行く",
				"iku",
				CONJUGATION_TYPES.present,
				false,
				false
			);

			assert.equal(politePresent, "行きます");
			assert.equal(plainNegative, "行かない");
		});
	});

	describe("aru / ある (Negative & te overrides)", () => {
		test("overrides plain present negative to ない", () => {
			const result = conjugateVerb(
				"ある",
				"aru",
				CONJUGATION_TYPES.present,
				false,
				false
			);
			assert.equal(result, "ない");
		});

		test("overrides polite present negative to array of valid forms", () => {
			const result = conjugateVerb(
				"ある",
				"aru",
				CONJUGATION_TYPES.present,
				false,
				true
			);
			assert.deepEqual(result, ["ありません", "ないです"]);
		});

		test("overrides plain past negative to なかった", () => {
			const result = conjugateVerb(
				"ある",
				"aru",
				CONJUGATION_TYPES.past,
				false,
				false
			);
			assert.equal(result, "なかった");
		});

		test("overrides te-form to あって", () => {
			const result = conjugateVerb(
				"ある",
				"aru",
				CONJUGATION_TYPES.te,
				null,
				null
			);
			assert.equal(result, "あって");
		});
	});
});