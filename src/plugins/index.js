// src/plugins/index.js
import "./index.css";
import { eventBus } from "../eventBus.js";

// 1. Import all plugins you want active
import { StatsPlugin } from "./statsPlugin.js";
// import { AudioPlugin } from "./audioPlugin.js";
// import { AnkiExportPlugin } from "./ankiExportPlugin.js";

function createPluginDock() {
	if (document.getElementById("plugin-dock")) return;

	const dock = document.createElement("div");
	dock.id = "plugin-dock";
	document.body.appendChild(dock);

    // Mount inside #main-view beneath the input field and verb box
	const mainView = document.getElementById("main-view");
	if (mainView) {
		mainView.appendChild(dock);
	} else {
		document.body.appendChild(dock);
	}
}

const plugins = [
	new StatsPlugin(),
	// new AudioPlugin(),
	// new AnkiExportPlugin(),
];

export function initPlugins() {
    // Create the dock container once before any plugin initializes
	if (plugins.length > 0) {
        createPluginDock();
    }

	plugins.forEach((plugin) => {
		if (typeof plugin.install === "function") {
			plugin.install(eventBus);
		}
	});
}