console.log("Hello world");

const State = {
	Start: "state-start",
	ShowMoves: "state-show-moves",
};

const States = {
	Start: () => ({ name: State.Start }),
	ShowMoves: () => ({ name: State.ShowMoves }),
};

let currentState = States.Start();

const fightButton = document.getElementById("fight-button");
const movesContainer = document.getElementById("moves-container");

fightButton.addEventListener("click", () => {
	movesContainer.classList.remove("hide");
	currentState = States.ShowMoves();
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && currentState.name === State.ShowMoves) {
		movesContainer.classList.add("hide");
		currentState = States.Start();
	}
});
