// src/statsManager.js

const STATS_STORAGE_KEY = "jconj_aggregate_stats_v1";

class StatsManager {
	constructor() {
		this.session = {
			total: 0,
			correct: 0,
			breakdown: {},
		};
		this.aggregates = this.loadAggregates();
	}

    getSessionSummary() {
        const percentage =
            this.session.total > 0
                ? Math.round((this.session.correct / this.session.total) * 100)
                : 0;

        return {
            total: this.session.total,
            correct: this.session.correct,
            incorrect: this.session.total - this.session.correct,
            percentage,
            breakdown: this.session.breakdown,
        };
    }

	loadAggregates() {
		try {
			const saved = localStorage.getItem(STATS_STORAGE_KEY);
			return saved ? JSON.parse(saved) : {};
		} catch (e) {
			console.error("Failed to load aggregate stats from localStorage", e);
			return {};
		}
	}

	saveAggregates() {
		try {
			localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(this.aggregates));
		} catch (e) {
			console.error("Failed to save aggregate stats to localStorage", e);
		}
	}

	/**
	 * Helper to strip HTML tags like <ruby> and <rt> from wordJSON.kanji
	 */
	cleanWordText(kanjiHtml) {
		if (!kanjiHtml) return "";
		return kanjiHtml.replace(/<[^>]*>/g, "");
	}

	/**
	 * Generates a unique key including the specific word base form.
	 * Format: "word:type:form:polite:polarity"
	 * Example: "食べる:ru:present:polite:affirmative"
	 */
	generateKey(word) {
		const wordBase = this.cleanWordText(word.wordJSON.kanji); // Base word text
		const pos = word.wordJSON.type; // 'u', 'ru', 'irv', 'i', 'na', 'ira'
		const type = word.conjugation.type; // 'present', 'past', 'te', etc.
		const polite =
			word.conjugation.polite === true
				? "polite"
				: word.conjugation.polite === false
				? "plain"
				: "na";
		const affirmative =
			word.conjugation.affirmative === true
				? "affirmative"
				: word.conjugation.affirmative === false
				? "negative"
				: "na";

		return `${wordBase}:${pos}:${type}:${polite}:${affirmative}`;
	}

	recordAnswer(word, isCorrect) {
		const key = this.generateKey(word);
		const englishMeaning = word.wordJSON.eng || "";

		// 1. Update Session Stats
		this.session.total += 1;
		if (isCorrect) this.session.correct += 1;

		if (!this.session.breakdown[key]) {
			this.session.breakdown[key] = { correct: 0, total: 0 };
		}
		this.session.breakdown[key].total += 1;
		if (isCorrect) this.session.breakdown[key].correct += 1;

		// 2. Update Persistent Aggregate Stats (Include English metadata)
		if (!this.aggregates[key]) {
			this.aggregates[key] = { correct: 0, total: 0, english: englishMeaning };
		}
		this.aggregates[key].total += 1;
		if (isCorrect) this.aggregates[key].correct += 1;

		this.saveAggregates();
	}

	getAggregateBreakdown() {
		const result = [];
		for (const [key, data] of Object.entries(this.aggregates)) {
			const [wordBase, pos, type, polite, affirmative] = key.split(":");
			const percentage =
				data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

			result.push({
				key,
				wordBase,
				english: data.english || "",
				partOfSpeech: pos,
				conjugationType: type,
				polite,
				affirmative,
				correct: data.correct,
				total: data.total,
				percentage,
			});
		}
		return result;
	}

	exportToCSV() {
		const data = this.getAggregateBreakdown();
		if (data.length === 0) {
			alert("No data available to export.");
			return;
		}

		// Header includes specific word and English translation columns
		const headers = [
			"Word",
			"English Meaning",
			"Part of Speech",
			"Form",
			"Polite/Plain",
			"Polarity",
			"Accuracy (%)",
			"Correct",
			"Total",
		];

		const rows = data.map((item) => [
			`"${item.wordBase}"`,
			`"${item.english}"`,
			`"${item.partOfSpeech}"`,
			`"${item.conjugationType}"`,
			`"${item.polite}"`,
			`"${item.affirmative}"`,
			item.percentage,
			item.correct,
			item.total,
		]);

		const csvContent =
			"\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n"); // \uFEFF adds UTF-8 BOM for Japanese Kanji support in Excel

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		const timestamp = new Date().toISOString().slice(0, 10);
		link.setAttribute("href", url);
		link.setAttribute("download", `japanese_conjugation_word_stats_${timestamp}.csv`);
		link.style.visibility = "hidden";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	resetAllData() {
		this.session = { total: 0, correct: 0, breakdown: {} };
		this.aggregates = {};
		localStorage.removeItem(STATS_STORAGE_KEY);
	}
}

export const statsManager = new StatsManager();