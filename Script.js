class ChoiceName {
	static rock = "ROCK";
	static paper = "PAPER";
	static scissors = "SCISSORS";
	static lizard = "LIZARD";
	static spock = "SPOCK";
	static notReady = "NOT READY";
}
class Result {
	static win = "WIN";
	static loose = "LOOSE";
	static draw = "DRAW";
}
class Choice {
	constructor(choiceName) {
		this.choiceName = choiceName;
		this.beatNames = [];

		//create html element of the object
		this.rootEl = document.createElement("div");
		this.rootEl.className = "ver-wrapper";
		this.rootEl.innerHTML = `<h3 class="player-name">cek</h3>`;
		this.element = document.createElement("div");
		this.element.className = "choice";
		let elBody = "";

		switch (this.choiceName) {
			case ChoiceName.rock:
				this._addBeatChoiceNames([ChoiceName.lizard, ChoiceName.scissors]);
				this.element.classList.add("rock");
				elBody = `<div class="inner"><img src="./images/icon-rock.svg" alt="" /></div>`;
				break;
			case ChoiceName.paper:
				this._addBeatChoiceNames([ChoiceName.rock, ChoiceName.spock]);
				this.element.classList.add("paper");
				elBody = `<div class="inner">
                            <img src="./images/icon-paper.svg" alt="" />
                        </div>
                        `;
				break;
			case ChoiceName.scissors:
				this._addBeatChoiceNames([ChoiceName.paper, ChoiceName.lizard]);
				this.element.classList.add("scissor");
				elBody = `
                        <div class="inner">
							<img src="./images/icon-scissors.svg" alt="" />
						</div>
                `;
				break;
			case ChoiceName.lizard:
				this._addBeatChoiceNames([ChoiceName.spock, ChoiceName.paper]);
				this.element.classList.add("lizard");
				elBody = `
                        <div class="inner">
							<img src="./images/icon-lizard.svg" alt="" />
						</div>
                `;
				break;
			case ChoiceName.spock:
				this._addBeatChoiceNames([ChoiceName.scissors, ChoiceName.rock]);
				this.element.classList.add("spock");
				elBody = `
                        <div class="inner">
							<img src="./images/icon-spock.svg" alt="" />
						</div>
                `;
				break;
			default:
				this.element.classList.add("empty");
				elBody = `<div class="inner"></div>`;
		}
		this.element.innerHTML = elBody;
		this.rootEl.appendChild(this.element);
	}
	_addBeatChoiceNames = (choiceNames) => {
		choiceNames.forEach((name) => {
			this.beatNames.push(name);
		});
	};
	beats = (choice) => {
		if (this.beatNames.indexOf(choice.choiceName) !== -1) {
			return true;
		}
		return false;
	};
	isBeaten = (choice) => {
		return !this.beats(choice);
	};
	render = (parentEl) => {
		parentEl.appendChild(this.rootEl);
	};
}
class ChoiceLog {
	constructor(choiceName, resultName) {
		this.choiceName = choiceName;
		this.resultName = resultName;
	}
}
class Player {
	static scoreOffset = 1;
	constructor(name = "You") {
		this.name = name;
		this.lastScore = 0;
		this.choiceLogs = [];
	}
	addLog = (choiceName, resultName) => {
		const log = new ChoiceLog(choiceName, resultName);
		this.choiceLogs.push(log);
	};
	getLogs = () => {
		return this.choiceLogs;
	};
	makeChoice = (choice) => {
		this.currentChoice = choice;
		this.currentChoice.rootEl.querySelector("h3").innerText =
			this.name + " Picked";
	};
	getChoice = () => {
		return this.currentChoice;
	};
	uppdateScore = (opponentChoice) => {
		if (this.currentChoice.beats(opponentChoice)) {
			this.lastScore += Player.scoreOffset;
			this.addLog(this.currentChoice.choiceName, Result.win);
		} else if (opponentChoice.beats(this.currentChoice)) {
			this.lastScore -= Player.scoreOffset;
			this.addLog(this.currentChoice.choiceName, Result.loose);
		} else {
			this.addLog(this.currentChoice.choiceName, Result.draw);
		}
	};
}
class BotPlayer extends Player {
	makeChoice = () => {
		this.currentChoice = new Choice(ChoiceName.notReady);
		this.currentChoice.rootEl.querySelector("h3").innerText =
			"The " + this.name + " Picked";
		this.currentChoice.render(
			document.querySelector("div.main-board.result-board")
		);
		setTimeout(() => {
			console.log("The house is making decission!");
			let outNum = Math.floor(Math.random() * 10);
			let choiceName = "";
			if (outNum == 0 || outNum == 1) {
				choiceName = ChoiceName.scissors;
			} else if (outNum == 2 || outNum == 3) {
				choiceName = ChoiceName.paper;
			} else if (outNum == 4 || outNum == 5) {
				choiceName = ChoiceName.rock;
			} else if (outNum == 6 || outNum == 7) {
				choiceName = ChoiceName.lizard;
			} else {
				choiceName = ChoiceName.spock;
			}
			this.currentChoice = new Choice(choiceName);
			this.currentChoice.rootEl.querySelector("h3").innerText =
				"The " + this.name + " Picked";
			console.log("The house done making decision:");
			console.log(this.currentChoice);
			return this.currentChoice;
		}, 1000);
	};
}
class App {
	constructor() {
		this._initRuleEl();
		this._initBoards();

		this.firstPlayer = new Player("You");
		this.secondPlayer = new BotPlayer("House");

		//try browser storage
		if (typeof Storage !== "undefined") {
			console.log("Web storage supported!");
			if (localStorage.getItem("firstPlayerScore") !== null) {
				this.firstPlayer.lastScore = parseInt(
					localStorage.getItem("firstPlayerScore")
				);
				this.secondPlayer.lastScore = parseInt(
					localStorage.getItem("secondPlayerScore")
				);
				//render first player score
				this.scoreLabel.innerText = this.firstPlayer.lastScore;
			} else {
				this.savePlayersScore();
			}
		} else {
			console.log("Web storage NOT SUPPORTED!");
		}
	}
	savePlayersScore = () => {
		if (typeof Storage !== "undefined") {
			localStorage.setItem("firstPlayerScore", this.firstPlayer.lastScore);
			localStorage.setItem("secondPlayerScore", this.secondPlayer.lastScore);
			console.log("players score saved");
			console.log(
				localStorage.getItem("firstPlayerScore"),
				localStorage.getItem("secondPlayerScore")
			);
		}
	};
	_initRuleEl = () => {
		const ruleWindow = document.querySelector("div.rule-wrapper");
		ruleWindow.style.display = "none";
		const ruleWindowClose = ruleWindow.querySelector("a.close-rule");
		ruleWindowClose.addEventListener("click", () => {
			ruleWindow.style.display = "none";
		});

		const showRuleTriger = document.querySelector("a.button");
		showRuleTriger.addEventListener("click", () => {
			this._showRule();
		});
	};
	_showRule = () => {
		const ruleWindow = document.querySelector("div.rule-wrapper");
		ruleWindow.style.display = "block";
	};

	_initBoards = () => {
		this.scoreLabel = document.querySelector("p.score-number");
		this.playBoard = document.getElementById("playBoard");
		this.resultBoard = document.querySelector("div.main-board.result-board");
		this.resultBoard.innerHTML = "";
		this.resultBoard.style.display = "none";
		this.winnerBoard = document.createElement("section");
		this.winnerBoard.className = "result";
		this.winnerBoard.innerHTML = `
                                    <h2>You Win</h2>
                                    <a href="#" class="play-again" aria-label="play again">Play again</a>             
        `;
		this.winnerBoard.style.display = "none";
		this.resultBoard.appendChild(this.winnerBoard);

		//go to next match when nextMatchBtn clicked
		const nextMatchBtn = this.winnerBoard.addEventListener("click", () => {
			this._nextMatch();
		});

		//add click event listener to all choices buttons
		/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		/* ~~~~~~~~~~~ STEP 1 ~~~~~~~~~~~~~*/
		/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		const scissorChoice = this.playBoard.querySelector("div.choice.scissor");
		scissorChoice.addEventListener("click", () => {
			this.firstPlayer.makeChoice(new Choice(ChoiceName.scissors));
			this._nextSteps();
		});
		const spockChoice = this.playBoard.querySelector("div.choice.spock");
		spockChoice.addEventListener("click", () => {
			this.firstPlayer.makeChoice(new Choice(ChoiceName.spock));
			this._nextSteps();
		});
		const paperChoice = this.playBoard.querySelector("div.choice.paper");
		paperChoice.addEventListener("click", () => {
			this.firstPlayer.makeChoice(new Choice(ChoiceName.paper));
			this._nextSteps();
		});
		const lizardChoice = this.playBoard.querySelector("div.choice.lizard");
		lizardChoice.addEventListener("click", () => {
			this.firstPlayer.makeChoice(new Choice(ChoiceName.lizard));
			this._nextSteps();
		});
		const rockChoice = this.playBoard.querySelector("div.choice.rock");
		rockChoice.addEventListener("click", () => {
			this.firstPlayer.makeChoice(new Choice(ChoiceName.rock));
			this._nextSteps();
		});
	};
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	/*~~~~~~~~~~~~ STEP 2 ~~~~~~~~~~~~~*/
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	_nextSteps = () => {
		this._showResult();
		console.log(this.firstPlayer.getChoice());

		/** CRITICAL PROCCESS IS HERE **/
		const choiceMade = new Promise((resolve, reject) => {
			resolve(this.secondPlayer.makeChoice());
		});
		choiceMade
			.then(
				() =>
					new Promise((resolve) => {
						setTimeout(() => {
							this._showResult();
							this.secondPlayer.getChoice().render(this.resultBoard);
							resolve("done bot decide!");
						}, 2000);
					})
			)
			.then(() => {
				this._showWinner();
			});
	};
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	/* ~~~~~~~~~~~ STEP 3 ~~~~~~~~~~~~~*/
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	_showResult = () => {
		this.playBoard.style.display = "none";
		this.resultBoard.style.display = "grid";
		this.firstPlayer.getChoice().render(this.resultBoard);
	};
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	/* ~~~~~~~~~~~ STEP 4 ~~~~~~~~~~~~~*/
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	_showWinner = () => {
		this.resultBoard.innerHTML = "";

		this.winnerBoard.style.display = "flex";

		let winOrLoose = "";
		//update each player score based on its oppenent choice
		this.firstPlayer.uppdateScore(this.secondPlayer.getChoice());
		this.secondPlayer.uppdateScore(this.firstPlayer.getChoice());
		//update latest score to browser storage
		this.savePlayersScore();

		if (this.firstPlayer.getChoice().beats(this.secondPlayer.getChoice())) {
			winOrLoose = "You Win";
			this.firstPlayer.currentChoice.element.classList.add("win");
		} else if (
			this.secondPlayer.getChoice().beats(this.firstPlayer.getChoice())
		) {
			winOrLoose = "You Loose";
			this.secondPlayer.currentChoice.element.classList.add("win");
		} else {
			winOrLoose = "Draw";
		}
		this.winnerBoard.querySelector("h2").innerText = winOrLoose;

		this.firstPlayer.getChoice().render(this.resultBoard);
		this.resultBoard.appendChild(this.winnerBoard);
		this.secondPlayer.getChoice().render(this.resultBoard);

		//render first player score
		this.scoreLabel.innerText = this.firstPlayer.lastScore;
		console.log("Your choice logs:");
		console.log(this.firstPlayer.getLogs());
		console.log("The house choice logs:");
		console.log(this.secondPlayer.getLogs());
	};
	_nextMatch = () => {
		this.resultBoard.innerHTML = "";
		this.resultBoard.display = "none";
		this.playBoard.style.display = "flex";
	};
}

_app = new App();
