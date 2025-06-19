/**
 ** Settings
 */

const ATTACK_CHANCE = 0.5;
const ATTACK_VALUE = 0.25;

// Health below -> chance
const CAPTURE_CHANCE = [
	[0.1, 0.5],
	[0.25, 0.25],
	[0.5, 0.1],
	[1.0, 0.0],
];

const FORCE_CAPTURING = false;

/**
 ** State definitions
 */

/**
 *
 * @param {(state: { name: string, data?: object }) => void} onChange
 */
const baseState = (onChange) => ({
	/**
	 *
	 * @param {string} state
	 * @param {EventListenerOrEventListenerObject} handler
	 */
	on: (state, handler) => {
		document.addEventListener(state, handler);
	},
	/**
	 *
	 * @param {{ name: string, data?: object }} state
	 */
	set: (state) => {
		onChange(state);
		const event = new CustomEvent(state.name, { detail: state });
		document.dispatchEvent(event);
	},
});

const UIState = {
	Start: "ui-state-start",
	StartDisabled: "ui-state-start-disabled",
	ShowMoves: "ui-state-show-moves",
	Captured: "ui-state-captured",
	Run: "ui-state-run",
	UsedMove: "ui-state-used-move",

	...baseState((state) => {
		uiState = state;
	}),
};

const GameState = {
	Start: "state-start",
	ThrowBall: "state-throw-ball",
	Capturing: "state-capturing",
	Captured: "state-captured",
	CaptureFailed: "state-capture-failed",

	...baseState((state) => {
		gameState = state;
	}),
};

const UIStates = {
	Start: () => ({ name: UIState.Start }),
	StartDisabled: () => ({ name: UIState.StartDisabled }),
	ShowMoves: () => ({ name: UIState.ShowMoves }),
	Captured: () => ({ name: UIState.Captured }),
	Run: () => ({ name: UIState.Run }),
	UsedMove: () => ({ name: UIState.UsedMove }),
};

const GameStates = {
	Start: () => ({ name: GameState.Start }),
	ThrowBall: () => ({ name: GameState.ThrowBall }),
	Capturing: () => ({ name: GameState.Capturing }),
	Captured: () => ({ name: GameState.Captured }),
	CaptureFailed: () => ({ name: GameState.CaptureFailed }),
};

/**
 ** Variables & Elements
 */

let uiState = {};
let gameState = {};

let enemyHealth = 1.0;

const bogaball = document.getElementById("bogaball");
const bitcoinImage = document.getElementById("bitcoin-image");

const dialogText = document.getElementById("dialog-text");
const actionMenu = document.getElementById("action-menu");

const ballButton = document.getElementById("ball-button");
const fightButton = document.getElementById("fight-button");
const specialButton = document.getElementById("special-button");
const runButton = document.getElementById("run-button");

const movesContainer = document.getElementById("moves-container");
const moveRuse = document.getElementById("move-ruse");
const moveGrift = document.getElementById("move-grift");

const bitcoinHealthValue = document.getElementById("bitcoin-health-value");

/**
 ** Utils
 */

/**
 * @param {boolean} disabled
 */
const setButtonsDisabled = (disabled) => {
	const buttons = [ballButton, fightButton, specialButton, runButton];

	for (const button of buttons) {
		if (disabled) {
			button.setAttribute("disabled", "true");
		} else {
			button.removeAttribute("disabled");
		}
	}
};

/**
 * @param {HTMLElement} element
 * @param {boolean} visible
 */
const setElementVisible = (element, visible) => {
	if (visible) {
		element.classList.remove("hide");
	} else {
		element.classList.add("hide");
	}
};

/**
 * @param {HTMLElement} healthElement
 * @param {number} oldHealth
 * @param {number} newHealth
 */
const updateHealth = (healthElement, oldHealth, newHealth) => {
	const oldClass = `v${Math.floor(oldHealth * 100)}`;
	const newClass = `v${Math.floor(newHealth * 100)}`;

	healthElement.classList.remove(oldClass);
	healthElement.classList.add(newClass);
};

/**
 ** UI State transitions
 */

UIState.on(UIState.Start, () => {
	setElementVisible(actionMenu, true);
	setElementVisible(movesContainer, false);
	setButtonsDisabled(false);
	dialogText.innerText = "";
});

UIState.on(UIState.StartDisabled, () => {
	setElementVisible(actionMenu, true);
	setElementVisible(movesContainer, false);
	setButtonsDisabled(true);
	dialogText.innerText = "";
});

UIState.on(UIState.ShowMoves, () => {
	setElementVisible(actionMenu, true);
	setElementVisible(movesContainer, true);
	setButtonsDisabled(true);
	dialogText.innerText = "";
});

UIState.on(UIState.Captured, () => {
	setElementVisible(actionMenu, false);
	setElementVisible(movesContainer, false);
	setButtonsDisabled(true);
	dialogText.innerText = "You captured the bitcoin!";
});

UIState.on(UIState.Run, () => {
	setElementVisible(actionMenu, false);
	setElementVisible(movesContainer, false);
	setButtonsDisabled(true);
	dialogText.innerText = "You can't escape!";

	setTimeout(() => {
		UIState.set(UIStates.Start());
	}, 1000);
});

UIState.on(UIState.UsedMove, () => {
	setElementVisible(actionMenu, false);
	setElementVisible(movesContainer, false);
	setButtonsDisabled(true);

	const r = Math.random();
	if (r <= ATTACK_CHANCE) {
		const oldHealth = enemyHealth;
		const newHealth = enemyHealth - ATTACK_VALUE;
		updateHealth(bitcoinHealthValue, oldHealth, newHealth);

		enemyHealth = newHealth;

		if (newHealth <= 0.05) {
			dialogText.innerText = "You lost the bitcoin!";

			setTimeout(() => {
				updateHealth(bitcoinHealthValue, enemyHealth, 1.0);
				enemyHealth = 1.0;
			}, 1000);
		} else {
			dialogText.innerText = "You attacked!";
		}
	} else {
		dialogText.innerText = "You missed!";
	}

	setTimeout(() => {
		UIState.set(UIStates.Start());
	}, 1000);
});

/**
 ** Game State transitions
 */

GameState.on(GameState.Start, () => {
	bogaball.classList.remove("throw", "throw-reverse");
	bitcoinImage.classList.remove("throw", "throw-reverse");
	bogaball.classList.remove("capturing");
});

GameState.on(GameState.ThrowBall, () => {
	bogaball.classList.add("throw");
	bitcoinImage.classList.add("throw");
});

GameState.on(GameState.Capturing, () => {
	bogaball.classList.add("capturing");

	const r = Math.random();

	let shouldCapture = false;
	for (const [health, chance] of CAPTURE_CHANCE) {
		if (FORCE_CAPTURING || enemyHealth <= health) {
			if (FORCE_CAPTURING || r <= chance) {
				shouldCapture = true;
			}

			break;
		}
	}

	if (shouldCapture) {
		// This needs to match the "capturing" animation duration and iterations!
		setTimeout(() => {
			UIState.set(UIStates.Captured());
			GameState.set(GameStates.Captured());
		}, 3 * 1000);
	} else {
		setTimeout(
			() => {
				GameState.set(GameStates.CaptureFailed());
			},
			Math.random() * 3 * 1000,
		);
	}
});

GameState.on(GameState.Captured, () => {
	setTimeout(captchaSuccess, 2000);
});

GameState.on(GameState.CaptureFailed, () => {
	bogaball.classList.remove("capturing");
	bogaball.classList.add("throw-reverse");
	bitcoinImage.classList.add("throw-reverse");

	// This needs to match the "throw" animation duration!
	setTimeout(() => {
		UIState.set(UIStates.Start());
		GameState.set(GameStates.Start());
	}, 1000);
});

/**
 ** UI Handling
 */

fightButton.addEventListener("click", () => UIState.set(UIStates.ShowMoves()));

ballButton.addEventListener("click", () => {
	UIState.set(UIStates.StartDisabled());
	GameState.set(GameStates.ThrowBall());

	// This needs to match the "throw" animation duration!
	setTimeout(() => GameState.set(GameStates.Capturing()), 1000);
});

runButton.addEventListener("click", () => UIState.set(UIStates.Run()));
moveGrift.addEventListener("click", () => UIState.set(UIStates.UsedMove()));
moveRuse.addEventListener("click", () => UIState.set(UIStates.UsedMove()));

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		if (uiState.name === UIState.ShowMoves) {
			UIState.set(UIStates.Start());
		} else if (
			uiState.name === UIState.Captured ||
			gameState.name === GameState.Captured
		) {
			UIState.set(UIStates.Start());
			GameState.set(GameStates.Start());
		} else if (gameState.name === GameState.ThrowBall) {
			UIState.set(UIStates.Start());
			GameState.set(GameStates.Start());
		} else if (gameState.name === GameState.Capturing) {
			UIState.set(UIStates.Start());
			GameState.set(GameStates.Start());
		}
	}
});

/**
 ** Init
 */

UIState.set(UIStates.Start());
GameState.set(GameStates.Start());
