import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { conjugateVerb } from "../modules/conjEngine.js";
import { CONJUGATION_TYPES } from "../constants.js";

describe("Irregular Conjugation Engine — Complete Coverage", () => {

	describe("iku / 行く / いく", () => {
		test("Te-form (Override vs. Kana Shift)", () => {
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.te, null, null), "行って");
			assert.equal(conjugateVerb("いく", "godan", CONJUGATION_TYPES.te, null, null), "いって");
		});

		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.present, true, false), "行く");
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.present, true, true), "行きます");
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.present, false, false), "行かない");
			assert.deepEqual(
				conjugateVerb("行く", "godan", CONJUGATION_TYPES.present, false, true),
				["行きません", "行かないです"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.past, true, false), "行った");
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.past, true, true), "行きました");
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.past, false, false), "行かなかった");
			assert.deepEqual(
				conjugateVerb("行く", "godan", CONJUGATION_TYPES.past, false, true),
				["行きませんでした", "行かなかったです"]
			);
		});

		test("Volitional, Potential, Imperative", () => {
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.volitional, true, false), "行こう");
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.volitional, true, true), "行きましょう");
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.potential, true, false), "行ける");
			assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.imperative, null, null), "行け");
		});
	});

	describe("aru / ある", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.present, true, false), "ある");
			assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.present, true, true), "あります");
			assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.present, false, false), "ない");
			assert.deepEqual(
				conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.present, false, true),
				["ありません", "ないです"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.past, true, false), "あった");
			assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.past, true, true), "ありました");
			assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.past, false, false), "なかった");
			assert.deepEqual(
				conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.past, false, true),
				["ありませんでした", "なかったです"]
			);
		});

		test("Te-form", () => {
			assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.te, null, null), "あって");
		});
	});

	describe("kuru / 来る / くる", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.present, true, false), "くる");
			assert.equal(conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.present, true, true), "きます");
			assert.equal(conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.present, false, false), "こない");
			assert.deepEqual(
				conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.present, false, true),
				["きません", "こないです"]
			);
		});

		test("Past & Te-form & Volitional & Imperative", () => {
			assert.equal(conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.past, true, false), "きた");
			assert.equal(conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.past, true, true), "きました");
			assert.equal(conjugateVerb("くる", "irr_verb", CONJUGATION_TYPES.te, null, null), "きて");
			assert.equal(conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.volitional, true, false), "こよう");
			assert.equal(conjugateVerb("来る", "irr_verb", CONJUGATION_TYPES.imperative, null, null), "こい");
		});
	});

	describe("suru / する", () => {
		test("Present & Past", () => {
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.present, true, false), "する");
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.present, true, true), "します");
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.present, false, false), "しない");
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.past, true, false), "した");
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.past, true, true), "しました");
		});

		test("Te-form, Volitional, Potential, Passive, Imperative", () => {
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.te, null, null), "して");
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.volitional, true, false), "しよう");
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.volitional, true, true), "しましょう");
			assert.equal(conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.passive, true, false), "される");
			assert.deepEqual(
				conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.potential, true, false),
				["できる", "出来る"]
			);
			assert.deepEqual(
				conjugateVerb("する", "irr_verb", CONJUGATION_TYPES.imperative, null, null),
				["しろ", "せよ"]
			);
		});
	});

});