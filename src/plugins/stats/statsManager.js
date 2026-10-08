// src/plugins/stats/statsManager.js
const STATS_STORAGE_KEY = "jconj_aggregate_stats_v1";

export class StatsManager {
	constructor() {
		this.session = { total: 0, correct: 0, breakdown: {} };
		this.aggregates = this.loadAggregates();
	}

	loadAggregates() {
		try {
			const saved = localStorage.getItem(STATS_STORAGE_KEY);
			return saved ? JSON.parse(saved) : {};
		} catch (e) {
			return {};
		}
	}

	saveAggregates() {
		try {
			localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(this.aggregates));
		} catch (e) {
			console.error("Failed to save stats", e);
		}
	}

	cleanWordText(kanjiHtml) {
        if (!kanjiHtml) return "";
        return kanjiHtml
            .replace(/<(rt|rp)>.*?<\/(rt|rp)>/gi, "") // Remove furigana text inside <rt> and <rp>
            .replace(/<[^>]*>/g, "");                // Strip remaining HTML tags (<ruby>, </ruby>, etc.)
    }

	generateKey(word) {
		const wordBase = this.cleanWordText(word.wordJSON.kanji);
		const pos = word.wordJSON.type;
		const type = word.conjugation.type;
		const polite = word.conjugation.polite === true ? "polite" : word.conjugation.polite === false ? "plain" : "na";
		const affirmative = word.conjugation.affirmative === true ? "affirmative" : word.conjugation.affirmative === false ? "negative" : "na";
		return `${wordBase}:${pos}:${type}:${polite}:${affirmative}`;
	}

	recordAnswer(word, isCorrect) {
		const key = this.generateKey(word);
		const english = word.wordJSON.eng || "";

		this.session.total += 1;
		if (isCorrect) this.session.correct += 1;

		if (!this.session.breakdown[key]) this.session.breakdown[key] = { correct: 0, total: 0 };
		this.session.breakdown[key].total += 1;
		if (isCorrect) this.session.breakdown[key].correct += 1;

		if (!this.aggregates[key]) this.aggregates[key] = { correct: 0, total: 0, english };
		this.aggregates[key].total += 1;
		if (isCorrect) this.aggregates[key].correct += 1;

		this.saveAggregates();
	}

	getSessionSummary() {
		const pct = this.session.total > 0 ? Math.round((this.session.correct / this.session.total) * 100) : 0;
		return { total: this.session.total, correct: this.session.correct, percentage: pct };
	}

	getAggregateBreakdown() {
		const result = [];
		for (const [key, data] of Object.entries(this.aggregates)) {
			const [wordBase, pos, type, polite, affirmative] = key.split(":");
			const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
			result.push({ key, wordBase, english: data.english || "", partOfSpeech: pos, conjugationType: type, polite, affirmative, correct: data.correct, total: data.total, percentage });
		}
		return result;
	}

	resetAllData() {
		this.session = { total: 0, correct: 0, breakdown: {} };
		this.aggregates = {};
		localStorage.removeItem(STATS_STORAGE_KEY);
	}
}