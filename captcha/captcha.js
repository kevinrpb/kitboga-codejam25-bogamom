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
	...baseState((state) => {
		uiState = state;
	}),
};

const GameState = {
	Start: "state-start",
	ThrowBall: "state-throw-ball",
	...baseState((state) => {
		gameState = state;
	}),
};

const UIStates = {
	Start: () => ({ name: UIState.Start }),
	StartDisabled: () => ({ name: UIState.StartDisabled }),
	ShowMoves: () => ({ name: UIState.ShowMoves }),
};

const GameStates = {
	Start: () => ({ name: GameState.Start }),
	ThrowBall: () => ({ name: GameState.ThrowBall }),
};

/**
 ** Variables & Elements
 */

let uiState = {};
let gameState = {};

const bogaball = document.getElementById("bogaball");
const bitcoinImage = document.getElementById("bitcoin-image");

const ballButton = document.getElementById("ball-button");
const fightButton = document.getElementById("fight-button");
const specialButton = document.getElementById("special-button");
const runButton = document.getElementById("run-button");
const movesContainer = document.getElementById("moves-container");

/**
 ** UI State transitions
 */

UIState.on(UIState.Start, () => {
	movesContainer.classList.add("hide");
	ballButton.removeAttribute("disabled");
	fightButton.removeAttribute("disabled");
	specialButton.removeAttribute("disabled");
	runButton.removeAttribute("disabled");
});

UIState.on(UIState.StartDisabled, () => {
	movesContainer.classList.add("hide");
	ballButton.setAttribute("disabled", "true");
	fightButton.setAttribute("disabled", "true");
	specialButton.setAttribute("disabled", "true");
	runButton.setAttribute("disabled", "true");
});

UIState.on(UIState.ShowMoves, () => {
	movesContainer.classList.remove("hide");
});

/**
 ** Game State transitions
 */

GameState.on(GameState.Start, () => {
	bogaball.classList.remove("throw");
	bitcoinImage.classList.remove("throw");
});

GameState.on(GameState.ThrowBall, () => {
	bogaball.classList.add("throw");
	bitcoinImage.classList.add("throw");
});

/**
 ** UI Handling
 */

fightButton.addEventListener("click", () => UIState.set(UIStates.ShowMoves()));
ballButton.addEventListener("click", () => {
	UIState.set(UIStates.StartDisabled());
	GameState.set(GameStates.ThrowBall());
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		if (uiState.name === UIState.ShowMoves) {
			UIState.set(UIStates.Start());
		} else if (gameState.name === GameState.ThrowBall) {
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
