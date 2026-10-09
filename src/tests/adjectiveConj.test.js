import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { conjugateAdjective } from "../modules/conjEngine.js";
import { CONJUGATION_TYPES } from "../constants.js";

describe("Adjective Conjugations — Comprehensive Coverage", () => {

	describe("i-Adjectives (高い / 安い)", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, true, false), "高い");
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, true, true), "高いです");
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, false, false), "高くない");
			assert.deepEqual(
				conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.present, false, true),
				["高くないです", "高くありません"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.past, true, false), "高かった");
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.past, true, true), "高かったです");
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.past, false, false), "高くなかった");
			assert.deepEqual(
				conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.past, false, true),
				["高くなかったです", "高くありませんでした"]
			);
		});

		test("Te-form & Adverbial", () => {
			assert.equal(conjugateAdjective("高い", "i_adj", CONJUGATION_TYPES.te, null, null), "高くて");
			assert.equal(conjugateAdjective("高い", "i_adj", "adverb", null, null), "高く");
		});
	});

	describe("na-Adjectives (静か / 有名)", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.present, true, false), "静かだ");
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.present, true, true), "静かです");
			assert.deepEqual(
				conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.present, false, false),
				["静かじゃない", "静かではない"]
			);
			assert.deepEqual(
				conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.present, false, true),
				["静かじゃないです", "静かではありません"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.past, true, false), "静かだった");
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.past, true, true), "静かでした");
			assert.deepEqual(
				conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.past, false, false),
				["静かじゃなかった", "静かではなかった"]
			);
			assert.deepEqual(
				conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.past, false, true),
				["静かじゃなかったです", "静かではありませんでした"]
			);
		});

		test("Te-form & Adverbial", () => {
			assert.equal(conjugateAdjective("静か", "na_adj", CONJUGATION_TYPES.te, null, null), "静かで");
			assert.equal(conjugateAdjective("静か", "na_adj", "adverb", null, null), "静かに");
		});
	});

	describe("Irregular Adjectives (いい / 良い)", () => {
		test("Present (Stem Preserved for Affirmative, Shifted for Negative)", () => {
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.present, true, false), "いい");
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.present, true, true), "いいです");
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.present, false, false), "よくない");
			assert.deepEqual(
				conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.present, false, true),
				["よくないです", "よくありません"]
			);
		});

		test("Past (Stem Shifted to よ / 良)", () => {
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.past, true, false), "よかった");
			assert.equal(conjugateAdjective("良い", "irr_adj", CONJUGATION_TYPES.past, true, false), "良かった");
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.past, true, true), "よかったです");
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.past, false, false), "よくなかった");
			assert.deepEqual(
				conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.past, false, true),
				["よくなかったです", "よくありませんでした"]
			);
		});

		test("Te-form & Adverbial", () => {
			assert.equal(conjugateAdjective("いい", "irr_adj", CONJUGATION_TYPES.te, null, null), "よくて");
			assert.equal(conjugateAdjective("良い", "irr_adj", CONJUGATION_TYPES.te, null, null), "良くて");
			assert.equal(conjugateAdjective("いい", "irr_adj", "adverb", null, null), "よく");
			assert.equal(conjugateAdjective("良い", "irr_adj", "adverb", null, null), "良く");
		});
	});

});