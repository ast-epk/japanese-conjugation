import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { conjugateAdjective } from "../modules/conjEngine.js";
import { CONJUGATION_TYPES } from "../constants.js";

describe("Adjective Conjugation Engine", () => {
	describe("い-adjectives (高い)", () => {
		test("Present forms", () => {
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, true, false), "高い");
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, true, true), "高いです");
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, false, false), "高くない");
			assert.deepEqual(
				conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, false, true),
				["高くないです", "高くありません"]
			);
		});

		test("Past & Te forms", () => {
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.past, true, false), "高かった");
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.te, null, null), "高くて");
		});

		test("Adverbial forms", () => {
			assert.equal(conjugateAdjective("高い", "i_adj", "adverb", null, null), "高く");
			assert.equal(conjugateAdjective("高い", "i_adj", "adverbial", null, null), "高く");
		});
	});

	describe("な-adjectives (静か)", () => {
		test("Present & Past forms", () => {
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.present, true, false), "静かだ");
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.present, true, true), "静かです");
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.past, true, false), "静かだった");
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.past, true, true), "静かでした");
		});

		test("Te & Adverbial forms", () => {
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.te, null, null), "静かで");
			assert.equal(conjugateAdjective("静か", "na_adj", "adverb", null, null), "静かに");
			assert.equal(conjugateAdjective("静か", "na_adj", "adverbial", null, null), "静かに");
		});
	});

	describe("Irregular Adjective (いい / 良い)", () => {
		test("Preserves いい / いいです for Present Affirmative", () => {
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.present, true, false), "いい");
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.present, true, true), "いいです");
		});

		test("Shifts stem to よ / 良 for negative, past, and adverbial forms", () => {
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.present, false, false), "よくない");
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.past, true, false), "よかった");
			assert.equal(conjugateAdjective("良い", "irr_adj", CONJUGATION_TYPES.past, true, false), "良かった");
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.te, null, null), "よくて");
			assert.equal(conjugateAdjective("いい", "irr_adj", "adverbial", null, null), "よく");
			assert.equal(conjugateAdjective("良い", "irr_adj", "adverbial", null, null), "良く");
		});
	});
});