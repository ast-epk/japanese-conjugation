import "./statsPlugin.css";
import { StatsManager} from "./statsManager.js";

const statsManager = new StatsManager();

export class StatsPlugin {
	constructor() {
		this.name = "StatsPlugin";
	}

	install(eventBus) {
		// Listen for answer submissions and record performance
		eventBus.on("answer:submitted", ({ word, isCorrect }) => {
			statsManager.recordAnswer(word, isCorrect);
		});

		// Inject button and set up UI overlays once core app boots
		eventBus.on("app:init", ({ app }) => {
			this.injectStatsButton(app);
		});
	}

	injectStatsButton(app) {
        if (document.getElementById("stats-button")) return;

        const dock = document.getElementById("plugin-dock");
        if (!dock) return;

        const statsBtn = document.createElement("button");
        statsBtn.id = "stats-button";
        statsBtn.type = "button";
        statsBtn.textContent = "📊 Stats";

        dock.appendChild(statsBtn);

        document.body.addEventListener("click", (e) => {
            if (e.target && e.target.id === "stats-button") {
                e.stopPropagation();
                e.preventDefault();
                this.showStatsOverlay(app);
            }
        });
    }

    exportToCSV() {
		const data = statsManager.getAggregateBreakdown();
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

        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');

        const timestamp = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join('');
        
		link.setAttribute("href", url);
		link.setAttribute("download", `jconj_stats_${timestamp}.csv`);
		link.style.visibility = "hidden";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	showStatsOverlay(app) {
		const existing = document.getElementById("stats-modal");
		if (existing) existing.remove();

		const session = statsManager.getSessionSummary();
		const aggregates = statsManager.getAggregateBreakdown();
		aggregates.sort((a, b) => a.percentage - b.percentage);

		const modal = document.createElement("div");
		modal.id = "stats-modal";
		modal.className = "stats-modal-backdrop";

		const tableRows = aggregates
			.map(
				(item) => `
			<tr class="${item.percentage < 70 ? "low-accuracy" : ""}">
				<td><strong>${item.wordBase}</strong></td>
				<td>${item.partOfSpeech}</td>
				<td>${item.conjugationType}</td>
				<td>${item.polite}</td>
				<td>${item.affirmative}</td>
				<td>${item.percentage}%</td>
				<td>${item.correct}/${item.total}</td>
			</tr>
		`
			)
			.join("");

		modal.innerHTML = `
			<div class="stats-modal-content">
				<h2>Conjugation Statistics</h2>
				<p><strong>Session Accuracy:</strong> ${session.percentage}% (${session.correct}/${session.total})</p>
				
				<h3>All-Time Accuracy by Word & Form</h3>
				${
					aggregates.length === 0
						? "<p>No data recorded yet. Start practicing!</p>"
						: `
					<table class="stats-table">
						<thead>
							<tr>
								<th>Word</th>
								<th>Type</th>
								<th>Form</th>
								<th>Polite</th>
								<th>Polarity</th>
								<th>Accuracy</th>
								<th>Count</th>
							</tr>
						</thead>
						<tbody>
							${tableRows}
						</tbody>
					</table>
				`
				}

				<div class="stats-modal-actions" style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
					<button id="export-csv-btn" class="stats-action-btn">Export CSV</button>
					<button id="reset-stats-btn" class="stats-action-btn danger">Reset All Stats</button>
					<button id="close-stats-btn" class="stats-action-btn primary">Close</button>
				</div>
			</div>
		`;

		document.body.appendChild(modal);

		document.getElementById("export-csv-btn").addEventListener("click", (evt) => {
			evt.stopPropagation();
			this.exportToCSV();
		});

		document.getElementById("reset-stats-btn").addEventListener("click", (evt) => {
			evt.stopPropagation();
			if (confirm("Are you sure you want to reset all saved aggregate statistics?")) {
				statsManager.resetAllData();
				modal.remove();
				this.showStatsOverlay(app);
			}
		});

		const closeModal = (evt) => {
			if (evt) evt.stopPropagation();
			modal.remove();
			if (app?.state?.activeScreen === 0) {
				const input = document.getElementById("main-text-input");
				if (input) input.focus();
			}
		};

		document.getElementById("close-stats-btn").addEventListener("click", closeModal);
		modal.addEventListener("click", (evt) => {
			if (evt.target === modal) closeModal(evt);
		});
	}
}