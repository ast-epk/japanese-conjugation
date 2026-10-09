import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { conjugateVerb, conjugateStandard } from "../modules/conjEngine.js";
import { CONJUGATION_TYPES } from "../constants.js";

describe("Conjugation Engine & Router Verification", () => {
	test("conjugateStandard: Regular Godan (書く)", () => {
		assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.te, null, null), "書いて");
		assert.equal(conjugateStandard("書く", "godan", CONJUGATION_TYPES.past, true, false), "書いた");
	});

	test("conjugateVerb: Irregular Exception (行く / いく)", () => {
		assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.te, null, null), "行って");
		assert.equal(conjugateVerb("いく", "godan", CONJUGATION_TYPES.te, null, null), "いって");
		assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.past, true, false), "行った");
		assert.equal(conjugateVerb("行く", "godan", CONJUGATION_TYPES.present, true, true), "行きます");
	});

	test("conjugateVerb: Irregular Exception (ある)", () => {
		assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.present, false, false), "ない");
		assert.equal(conjugateVerb("ある", "irr_verb", CONJUGATION_TYPES.te, null, null), "あって");
	});
});