/**
 ** State definitions
 */

const State = {
	Start: "state-start",
	ShowMoves: "state-show-moves",
	ThrowBall: "state-throw-ball",
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
		currentState = state;
		const event = new CustomEvent(state.name, { detail: state });
		document.dispatchEvent(event);
	},
};

const States = {
	Start: () => ({ name: State.Start }),
	ShowMoves: () => ({ name: State.ShowMoves }),
	ThrowBall: () => ({ name: State.ThrowBall }),
};

/**
 ** Variables & Elements
 */

let currentState = States.Start();

const bogaball = document.getElementById("bogaball");
const bitcoinImage = document.getElementById("bitcoin-image");

const ballButton = document.getElementById("ball-button");
const fightButton = document.getElementById("fight-button");
const movesContainer = document.getElementById("moves-container");

/**
 ** State transitions
 */

State.on(State.Start, () => {
	movesContainer.classList.add("hide");
});

State.on(State.ShowMoves, () => {
	movesContainer.classList.remove("hide");
});

State.on(State.ThrowBall, () => {
	bogaball.classList.add("throw");
	bitcoinImage.classList.add("throw");
});

/**
 ** UI Handling
 */

fightButton.addEventListener("click", () => State.set(States.ShowMoves()));
ballButton.addEventListener("click", () => State.set(States.ThrowBall()));

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		if (currentState.name === State.ShowMoves) {
			State.set(States.Start());
		} else if (currentState.name === State.ThrowBall) {
			State.set(States.Start());
		}
	}
});
