import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { conjugateVerb } from "../modules/conjEngine.js";
import { CONJUGATION_TYPES } from "../constants.js";

describe("Compound Irregular Verbs — Comprehensive Coverage", () => {

	describe("iku Compounds (持って行く / 持っていく)", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.present, true, false), "持って行く");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.present, true, true), "持って行きます");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.present, false, false), "持って行かない");
			assert.deepEqual(
				conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.present, false, true),
				["持って行きません", "持って行かないです"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.past, true, false), "持って行った");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.past, true, true), "持って行きました");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.past, false, false), "持って行かなかった");
			assert.deepEqual(
				conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.past, false, true),
				["持って行きませんでした", "持って行かなかったです"]
			);
		});

		test("Te-form", () => {
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.te, null, null), "持って行って");
			assert.equal(conjugateVerb("持っていく", "godan", CONJUGATION_TYPES.te, null, null), "持っていって");
		});

		test("Volitional", () => {
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.volitional, true, false), "持って行こう");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.volitional, true, true), "持って行きましょう");
		});

		test("Passive, Causative, Potential, Imperative, Causative-Passive", () => {
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.passive, true, false), "持って行かれる");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.causative, true, false), "持って行かせる");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.potential, true, false), "持って行ける");
			assert.equal(conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.imperative, null, null), "持って行け");
			assert.deepEqual(
				conjugateVerb("持って行く", "godan", CONJUGATION_TYPES.causativePassive, true, false),
				["持って行かせられる", "持って行かされる"]
			);
		});
	});

	describe("kuru Compounds (持ってくる / 連れてくる)", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.present, true, false), "持ってくる");
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.present, true, true), "持ってきます");
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.present, false, false), "持ってこない");
			assert.deepEqual(
				conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.present, false, true),
				["持ってきません", "持ってこないです"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.past, true, false), "持ってきた");
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.past, true, true), "持ってきました");
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.past, false, false), "持ってこなかった");
			assert.deepEqual(
				conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.past, false, true),
				["持ってきませんでした", "持ってこなかったです"]
			);
		});

		test("Te-form & Volitional & Imperative", () => {
			assert.equal(conjugateVerb("連れてくる", "irr_verb", CONJUGATION_TYPES.te, null, null), "連れてきて");
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.volitional, true, false), "持ってこよう");
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.volitional, true, true), "持ってきましょう");
			assert.equal(conjugateVerb("持ってくる", "irr_verb", CONJUGATION_TYPES.imperative, null, null), "持ってこい");
		});
	});

	describe("suru Compounds (勉強する / 案内する)", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.present, true, false), "勉強する");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.present, true, true), "勉強します");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.present, false, false), "勉強しない");
			assert.deepEqual(
				conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.present, false, true),
				["勉強しません", "勉強しないです"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.past, true, false), "勉強した");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.past, true, true), "勉強しました");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.past, false, false), "勉強しなかった");
			assert.deepEqual(
				conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.past, false, true),
				["勉強しませんでした", "勉強しなかったです"]
			);
		});

		test("Te-form, Volitional, Passive, Causative, Potential, Imperative", () => {
			assert.equal(conjugateVerb("案内する", "irr_verb", CONJUGATION_TYPES.te, null, null), "案内して");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.volitional, true, false), "勉強しよう");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.volitional, true, true), "勉強しましょう");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.passive, true, false), "勉強される");
			assert.equal(conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.causative, true, false), "勉強させる");
			assert.deepEqual(
				conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.potential, true, false),
				["勉強できる", "勉強出来る"]
			);
			assert.deepEqual(
				conjugateVerb("勉強する", "irr_verb", CONJUGATION_TYPES.imperative, null, null),
				["勉強しろ", "勉強せよ"]
			);
		});
	});

});