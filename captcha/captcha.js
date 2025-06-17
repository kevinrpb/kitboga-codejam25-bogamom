console.log("Hello world");

const State = {
	Start: "state-start",
	ShowMoves: "state-show-moves",
	ThrowBall: "state-throw-ball",
};

const States = {
	Start: () => ({ name: State.Start }),
	ShowMoves: () => ({ name: State.ShowMoves }),
	ThrowBall: () => ({ name: State.ThrowBall }),
};

let currentState = States.Start();

const bogaball = document.getElementById("bogaball");
const bitcoinImage = document.getElementById("bitcoin-image");

const ballButton = document.getElementById("ball-button");
const fightButton = document.getElementById("fight-button");
const movesContainer = document.getElementById("moves-container");

fightButton.addEventListener("click", () => {
	movesContainer.classList.remove("hide");
	currentState = States.ShowMoves();
});

ballButton.addEventListener("click", () => {
	bogaball.classList.add("throw");
	bitcoinImage.classList.add("throw");
	currentState = States.ThrowBall();
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		if (currentState.name === State.ShowMoves) {
			movesContainer.classList.add("hide");
			currentState = States.Start();
		} else if (currentState.name === State.ThrowBall) {
			bogaball.classList.remove("throw");
			bitcoinImage.classList.remove("throw");
			currentState = States.Start();
		}
	}
});
