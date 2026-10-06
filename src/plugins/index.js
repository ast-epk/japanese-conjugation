// src/plugins/index.js
import { eventBus } from "../eventBus.js";

// 1. Import all plugins you want active
import { StatsPlugin } from "./statsPlugin.js";
// import { AudioPlugin } from "./audioPlugin.js";
// import { AnkiExportPlugin } from "./ankiExportPlugin.js";

const plugins = [
	new StatsPlugin(),
	// new AudioPlugin(),
	// new AnkiExportPlugin(),
];

export function initPlugins() {
	plugins.forEach((plugin) => {
		if (typeof plugin.install === "function") {
			plugin.install(eventBus);
		}
	});
}