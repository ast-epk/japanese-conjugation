// src/plugins/audioPlugin.js
import "./audioPlugin.css";

const AUDIO_PREF_KEY = "jconj_audio_enabled";

export class AudioPlugin {
	constructor() {
		this.name = "AudioPlugin";
		this.isEnabled = localStorage.getItem(AUDIO_PREF_KEY) !== "false";
		this.audioCtx = null;
	}

	install(eventBus) {
		// Listen for answer submissions
		eventBus.on("answer:submitted", ({ word, isCorrect }) => {
			if (!this.isEnabled) return;

			// 1. Play sound effect chime
			this.playSoundEffect(isCorrect);

			// 2. Speak the target Japanese answer after a short delay
			const primaryAnswer = word.conjugation.validAnswers[0];
			if (primaryAnswer) {
				this.speakJapanese(primaryAnswer);
			}
		});

		// Inject UI toggle into #plugin-dock
		eventBus.on("app:init", () => {
			this.injectToggleButton();
		});
	}

	/**
	 * Lazy-initialize Web Audio Context on first user interaction
	 * to comply with browser autoplay policies.
	 */
	getAudioContext() {
		if (!this.audioCtx) {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioCtx = new AudioContext();
		}
		if (this.audioCtx.state === "suspended") {
			this.audioCtx.resume();
		}
		return this.audioCtx;
	}

	/**
	 * Synthesizes instant sound effects using Web Audio API oscillators.
	 */
	playSoundEffect(isCorrect) {
		try {
			const ctx = this.getAudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			const now = ctx.currentTime;

			if (isCorrect) {
				// High two-tone arpeggio (E5 -> A5) for correct answers
                osc.type = "sine";
				osc.frequency.setValueAtTime(659.25, now); // E5 (659Hz)
				osc.frequency.setValueAtTime(880.00, now + 0.12); // A5 (880Hz)

				gain.gain.setValueAtTime(0.2, now);
				gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

				osc.start(now);
				osc.stop(now + 0.4);
			} else {
				// Low double buzz for incorrect answers
				osc.type = "sawtooth";
				osc.frequency.setValueAtTime(150, now);
				gain.gain.setValueAtTime(0.1, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

				osc.start(now);
				osc.stop(now + 0.25);
			}
		} catch (e) {
			console.warn("Audio Context playback failed:", e);
		}
	}

	/**
	 * Uses Web Speech API (SpeechSynthesis) to pronounce Japanese text.
	 */
	speakJapanese(text) {
		if (!("speechSynthesis" in window)) return;

		// Cancel any speech currently playing
		window.speechSynthesis.cancel();

		// Clean HTML tags if present
		const cleanText = text.replace(/<[^>]*>/g, "");

		const utterance = new SpeechSynthesisUtterance(cleanText);
		utterance.lang = "ja-JP";
		utterance.rate = 0.95; // Slightly deliberate pace for learning clarity

		// Select a Japanese voice if available
		const voices = window.speechSynthesis.getVoices();
		const jaVoice = voices.find((v) => v.lang.includes("ja"));
		if (jaVoice) {
			utterance.voice = jaVoice;
		}

		window.speechSynthesis.speak(utterance);
	}

	injectToggleButton() {
		if (document.getElementById("audio-toggle-btn")) return;

		const dock = document.getElementById("plugin-dock");
		if (!dock) return;

		const btn = document.createElement("button");
		btn.id = "audio-toggle-btn";
		btn.type = "button";
		this.updateButtonLabel(btn);

		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			this.isEnabled = !this.isEnabled;
			localStorage.setItem(AUDIO_PREF_KEY, this.isEnabled);
			this.updateButtonLabel(btn);

			if (!this.isEnabled && "speechSynthesis" in window) {
				window.speechSynthesis.cancel();
			}
		});

		dock.appendChild(btn);
	}

	updateButtonLabel(btn) {
		if (this.isEnabled) {
			btn.textContent = "Active 🔊";
			btn.classList.remove("muted");
		} else {
			btn.textContent = "Inactive 🔇";
			btn.classList.add("muted");
		}
	}
}