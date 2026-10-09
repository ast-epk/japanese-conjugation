import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { conjugateStandard } from "../modules/conjEngine.js";
import { CONJUGATION_TYPES } from "../constants.js";

describe("Regular Verbs — Comprehensive Coverage", () => {

	describe("Godan Verbs (書く, 泳ぐ, 話す, 待つ, 飲む, 買う)", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.present, true, false), "書く");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.present, true, true), "書きます");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.present, false, false), "書かない");
			assert.deepEqual(
				conjugateStandard("書く", "godan", CONJUGATION_TYPES.present, false, true),
				["書きません", "書かないです"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.past, true, false), "書いた");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.past, true, true), "書きました");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.past, false, false), "書かなかった");
			assert.deepEqual(
				conjugateStandard("書く", "godan", CONJUGATION_TYPES.past, false, true),
				["書きませんでした", "書かなかったです"]
			);
		});

		test("Te-form (Euphoning Kana Shifts)", () => {
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.te, null, null), "書いて");
			assert.equal(conjugateStandard("泳ぐ", "godan", CONJUGATION_TYPES.te, null, null), "泳いで");
			assert.equal(conjugateStandard("話す", "godan", CONJUGATION_TYPES.te, null, null), "話して");
			assert.equal(conjugateStandard("待つ", "godan", CONJUGATION_TYPES.te, null, null), "待って");
			assert.equal(conjugateStandard("飲む", "godan", CONJUGATION_TYPES.te, null, null), "飲んで");
			assert.equal(conjugateStandard("買う", "godan", CONJUGATION_TYPES.te, null, null), "買って");
		});

		test("Volitional (Plain & Polite)", () => {
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.volitional, true, false), "書こう");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.volitional, true, true), "書きましょう");
		});

		test("Passive & Causative", () => {
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.passive, true, false), "書かれる");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.passive, true, true), "書かれます");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.causative, true, false), "書かせる");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.causative, true, true), "書かせます");
		});

		test("Potential, Imperative, Causative-Passive", () => {
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.potential, true, false), "書ける");
			assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.imperative, null, null), "書け");
			assert.deepEqual(
				conjugateStandard("書く", "godan", CONJUGATION_TYPES.causativePassive, true, false),
				["書かせられる", "書かされる"]
			);
			assert.deepEqual(conjugateStandard("話す", "godan", CONJUGATION_TYPES.causativePassive, true, false),"話させられる");
		});
	});

	describe("Ichidan Verbs (食べる / 見る)", () => {
		test("Present (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.present, true, false), "食べる");
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.present, true, true), "食べます");
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.present, false, false), "食べない");
			assert.deepEqual(
				conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.present, false, true),
				["食べません", "食べないです"]
			);
		});

		test("Past (Affirmative & Negative, Plain & Polite)", () => {
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.past, true, false), "食べた");
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.past, true, true), "食べました");
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.past, false, false), "食べなかった");
			assert.deepEqual(
				conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.past, false, true),
				["食べませんでした", "食べなかったです"]
			);
		});

		test("Te-form & Volitional", () => {
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.te, null, null), "食べて");
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.volitional, true, false), "食べよう");
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.volitional, true, true), "食べましょう");
		});

		test("Passive, Causative, Potential, Imperative, Causative-Passive", () => {
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.passive, true, false), "食べられる");
			assert.equal(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.causative, true, false), "食べさせる");
			assert.deepEqual(
				conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.potential, true, false),
				["食べられる", "食べれる"]
			);
			assert.deepEqual(
				conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.imperative, null, null),
				["食べろ", "食べよ"]
			);
			assert.deepEqual(conjugateStandard("食べる", "ichidan", CONJUGATION_TYPES.causativePassive, true, false), "食べさせられる");
		});
	});

});