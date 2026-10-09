// tests/app.test.js
import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { evaluateAnswer } from "../modules/conjEngine.js";
import { EventBus } from "../eventBus.js";

// Mock global localStorage for Node test runner
if (typeof globalThis.localStorage === "undefined") {
	const storageMap = new Map();
	globalThis.localStorage = {
		getItem: (key) => storageMap.get(key) ?? null,
		setItem: (key, value) => storageMap.set(key, String(value)),
		removeItem: (key) => storageMap.delete(key),
		clear: () => storageMap.clear(),
	};
}

import { StatsManager } from "../plugins/stats/statsManager.js";

describe("Headless Stats Manager", () => {
	test("saves and retrieves aggregate performance from localStorage mock", () => {
		const statsManager = new StatsManager();

		const mockWord = {
			wordJSON: { kanji: "飲む", type: "godan", eng: "drink" },
			conjugation: { type: "present", polite: true, affirmative: true },
		};

		statsManager.recordAnswer(mockWord, true);

		// Verify session summary
		const summary = statsManager.getSessionSummary();
		assert.equal(summary.total, 1);
		assert.equal(summary.correct, 1);
		assert.equal(summary.percentage, 100);

		// Verify mock storage updated
		assert.notEqual(globalThis.localStorage.getItem("jconj_aggregate_stats_v1"), null);
	});
});

describe("Conjugation Engine", () => {
  test("correctly evaluates valid furigana-stripped conjugation answers", () => {
    const validAnswers = ["<ruby>買<rt>か</rt></ruby>わなかった", "かわなかった"];

    assert.equal(evaluateAnswer(validAnswers, "かわなかった"), true);
    assert.equal(evaluateAnswer(validAnswers, "買わなかった"), false); // IF exact target requires kana
    assert.equal(evaluateAnswer(validAnswers, "かいました"), false);
  });
});

describe("Headless EventBus & Stats Integration", () => {
  test("records session accuracy and updates aggregate breakdown on event emission", () => {
    const eventBus = new EventBus();
    const statsManager = new StatsManager();

    // Subscribe statsManager to eventBus directly in Node environment
    eventBus.on("answer:submitted", ({ word, isCorrect }) => {
      statsManager.recordAnswer(word, isCorrect);
    });

    const mockWord = {
      wordJSON: { kanji: "<ruby>始<rt>はじ</rt></ruby>める", type: "ichidan", eng: "begin" },
      conjugation: { type: "Causative-Passive", polite: false, affirmative: false }
    };

    // Emit 3 simulated answer events
    eventBus.emit("answer:submitted", { word: mockWord, userInput: "はじめさせられない", isCorrect: true });
    eventBus.emit("answer:submitted", { word: mockWord, userInput: "はじめさせる", isCorrect: false });
    eventBus.emit("answer:submitted", { word: mockWord, userInput: "はじめさせられない", isCorrect: true });

    // Assert session summary stats directly in memory
    const session = statsManager.getSessionSummary();
    assert.equal(session.total, 3);
    assert.equal(session.correct, 2);
    assert.equal(session.percentage, 67);

    // Assert aggregate breakdown key calculations
    const breakdown = statsManager.getAggregateBreakdown();
    const targetItem = breakdown.find((b) => b.wordBase === "始める");
    assert.ok(targetItem);
    assert.equal(targetItem.correct, 2);
    assert.equal(targetItem.total, 3);
  });
});

