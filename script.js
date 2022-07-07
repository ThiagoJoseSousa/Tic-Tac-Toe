// here is all the logic, second will be the display
const gameboard = (() => {
    const boardContent = ["", "", "", "", "", "", "", "", ""];
    const getBoardContent = () => { return boardContent };

    const getOpenSquares = (board) => {
        const openSquares = [];
        board.forEach((square, index) => {
            if (square === "") {
                openSquares.push(index);
            }
        });
        return openSquares;
    };
    const fillSquare = (index) => {
        if (boardContent[index] === "") {
            // gameController is an object that controls who plays, whose turn is, getmark will show X or O of the player
            boardContent[index] = gameController.getCurrentPlayer().getMark();
            return true;
        } else {
            return false;
        }
    };


    const checkResult = (board) => {
        //board is how the array of the game is at the moment
        const winLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < winLines.length; i++) {
            if (board[winLines[i][0]] !== "" && board[winLines[i][1]] == board[winLines[i][0]] && board[winLines[i][2]] == board[winLines[i][0]]) {

                return "win";
            }
        }
        // in case didnt return yes already, checks if something is empty
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                return false;
            }
        }
        // in case the two ifs are passed
        return "tie";

    };

    const getWinner = (board) => {
        const winLines = [
            // Same function as above but on win returns the symbol of the winner
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < winLines.length; i++) {
            if (board[winLines[i][0]] !== "" && board[winLines[i][1]] == board[winLines[i][0]] && board[winLines[i][2]] == board[winLines[i][0]]) {

                return board[winLines[i][0]];
            }
        }
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                return false;
            }
        }

        return "tie";
    };
    //Clear the board content
    const clearBoard = () => {
        for (let i = 0; i < boardContent.length; i++) {
            boardContent[i] = "";
        }
        displayController.displayBoard(); //updates the board
    };
    //gameboard closure made belowr, returning objects with the {}
    return { getBoardContent, getOpenSquares, fillSquare, checkResult, clearBoard, getWinner };
})();// <- immediately invoked and stored on gameboard

//now we create the game's display object
const displayController = (() => {
    //and the html, storing their inputs in arrays
    const board = [];
    const statusText = document.getElementById("statusText");
    const scoreTextP1 = document.getElementById("scoreTextP1");
    const scoreTextP2 = document.getElementById("scoreTextP2");
    const startButton = document.getElementById("startButton");
    const restartButton = document.getElementById("restartButton");
    const resetButton = document.getElementById("resetButton");
    const editNameButtons = [];
    editNameButtons.push(document.getElementById("editNameP1"));
    editNameButtons.push(document.getElementById("editNameP2"));
    const nameDisplays = [];
    nameDisplays.push(document.getElementById("nameP1"));
    nameDisplays.push(document.getElementById("nameP2"));
    const nameInputs = [];
    const AICheckboxes = [];
    AICheckboxes.push(document.getElementById("AIP1"));
    AICheckboxes.push(document.getElementById("AIP2"));

    //Initialize the empty game board

    const initializeBoard = () => {
        const gridContainer = document.getElementById("grid-container");
        for (let i = 0; i < 9; i++) {
            const index = i;
            const square = document.createElement("div");
            square.classList.add("boardSquare");
            gridContainer.appendChild(square);
            square.addEventListener("click", () => {
                gameController.playTurn(index);

            });
            board.push(square);
        }
        startButton.addEventListener("click", gameController.startGame);
        restartButton.addEventListener("click", gameController.restartGame);
        resetButton.addEventListener("click", gameController.resetScores);
        displayStatus("start");
        //event listeners added as soon as the board is initialized. 
    };
    //initialize name input
    const initializeNameInputs = () => {
        for (let i = 0; i < 2; i++) {
            const player = gameController.getPlayer(i);
            nameDisplay = nameDisplays[i];
            const input = document.createElement("input");
            input.classList.add("nameInput");
            input.value = player.getName(); // getName and getCurrentPlayer will return the name of the player, and current turn.
            input.setAttribute("maxLength", 10);
            input.addEventListener("blur", () => {
                const char = /\S/; // if there's a string, and no whitespaces, player.setName(input.value)
                if (input.value !== "" && input.value.search(char) !== -1) {
                    player.setName(input.value);
                } else {
                    input.value = player.getName();
                }
                displayName(player);
                displayScore();
            });
            nameInputs.push(input);
            editNameButtons[i].addEventListener("click", () => { //button are stored on the editNameButtons array
                inputName(player);
            });
        }
    }
    const displayBoard = () => {
        gameboard.getBoardContent().forEach((content, index) => {
            board[index].textContent = content;
            //overwrites the board elements with the getboard elements, so it gets updated, and displayed.
        });
    };
    // Update the result text
    const displayStatus = (key) => {
        switch (key) {
            case "win":
                statusText.textContent = `${gameController.getCurrentPlayer().getName()} wins!`; //
                break;
            case "tie":
                statusText.textContent = "It's a tie";
                break;
            case "start":
                statusText.textContent = "Press START to begin";
                break;
            case "clear":
                statusText.textContent = "";
                break;
        }

    }

    // Update the name displayed for a player
    const displayName = (player) => {
        const index = player.getTurnIndex();  //turn index gets the player's turn order index, thats between 0 and 1
        nameDisplays[index].textContent = `${player.getName()} [${player.getMark()}]`;
        nameInputs[index].replaceWith(nameDisplays[index]); //nameinputs is the text input set before
    }
    //Replace the name display for a player with an input field to change the player's name
    const inputName = (player) => {
        const input = nameInputs[player.getTurnIndex()];
        nameDisplay = nameDisplays[player.getTurnIndex()];
        nameDisplay.replaceWith(input);
        input.focus(); //focus set the element as being tabbed, in this case the textbox
    };
    //Update the score text
    const displayScore = () => {
        scoreTextP1.textContent = `${gameController.getPlayer(0).getName()}: ${gameController.getPlayer(0).getScore()}`;
        scoreTextP2.textContent = `${gameController.getPlayer(1).getName()}: ${gameController.getPlayer(1).getScore()}`;
    };
    //Enable or disable clicking AI checkboxes, useful when game begun
    const enableCheckboxes = () => {
        AICheckboxes[0].disabled = false;
        AICheckboxes[1].disabled = false;
    };

    const disableCheckboxes = () => {
        AICheckboxes[0].disabled = true;
        AICheckboxes[1].disabled = true;
    };
    //buttons stored in array AI
    const getAICheckboxes = () => {
        return AICheckboxes;
    };

    return { initializeBoard, initializeNameInputs, displayBoard, displayStatus, displayName, displayScore, enableCheckboxes, disableCheckboxes, getAICheckboxes }
    //inputName is included in initializeBoard, so isnt returned. (just need It 1 time)
})();

//A factory function to create objects for each player
//We didnt create objects till now, just atributted properties to existing ones. args argument is the new object
// This one will relate to player individualities
function Player(args) {
    let AI = false; //computer is also a player
    let name = args.name; //variable that stores the new object property 'name'

    //Get the player's mark
    const getMark = () => {
        return args.mark;
    }

    //Get the player's name
    const getName = () => {
        return name;
    }

    const setName = (newName) => {
        name = newName;
    }

    //Get the player's turn order index
    const getTurnIndex = () => {
        return args.turnIndex;
    };

    // The player's current score
    let score = 0; //starts at 0
    const getScore = () => {
        return score;
    };
    const incrementScore = (increment) => {
        score += increment;
    };

    const resetScore = () => {
        score = 0;
    }
    const isAI = () => {
        return AI;
    }

    const setAI = (bool) => {
        AI = bool;
    }
    return { getScore, getMark, getName, setName, getTurnIndex, incrementScore, resetScore, isAI, setAI }

}
//An object to control AI players

const AIController = (() => {
    const getRandomMove = () => { // first IA move
        const openSquares = gameboard.getOpenSquares(gameboard.getBoardContent())
        const playIndex = openSquares[Math.floor(Math.random() * (openSquares.length))]; //random number between 0 and 8
        return playIndex;
    }

    const getMax = (arr) => {
        let topVal = arr[0];
        arr.forEach(item => {
            if (item > topVal) {
                topVal = item;
            } // if the first value of the array is minor than other of its values, top value gets equal
            // this function defines and returns the greatest value of the array
// wait, isn't It used?
        })
        return topVal;
    }
    const getMin= (arr => {
        let minVal= arr[0]
        arr.forEach(item =>{
            if (item<minVal) {
                minVal = item;
            }
        })
        return minVal;}
        )


        const getValue = (result) => { // get the winner into a number so we can use minmax
            if (result==="X") {
                return 1;
            } else if (result==="O") {
                return -1;
            }else if (result==="tie") {
                return 0;
            } else {
                return false; 
            }
        
        }
        const minimax=(markToPlay, board) => {
            if(gameboard.checkResult(board)) { //checks if the game ended
                return getValue(gameboard.getWinner(board)); 
            }
            const maximizing = (markToPlay==="X") ? true:false; 
            const nextMark = (markToPlay==="X") ? "O" : "X";
            const scores= [];
            for (let i=0; i<9; i++){ 
                if (board[i]==="") {
                    const simBoard = [...board]; //sim means pc game
                    simBoard[i] = markToPlay; // marks the array element
                    scores.push(minimax(nextMark,simBoard)) // recursive function with a condition of having empty spaces. And mark.
                } 
            } //scores.push executes the minimax 9 times and store it in scores, It stores new array boards inside scores
            if(maximizing) { // return
                return Math.max(...scores); // return the 1 and 0 
            } else {
                return Math.min(...scores); // return the -1 and 0
            } 
        } //minimax algorithm
        const getBestMove= () => {
            const markToPlay=gameController.getCurrentPlayer().getMark();
            const maximizing= (markToPlay==="X") ? true : false;
            const nextMark = (markToPlay==="X") ? "O" : "X"
            const board=gameboard.getBoardContent();
            let highestValueMove;
            let lowestValueMove;
            let highestScore = -99;  //this could be -infinite, getbestmove consists in returning an index.
            let lowestScore = 99 ;
            for (let i=0; i<9;i++){ // adds depth to minimax
                if (board[i]==="") {
                    const simBoard=[...board];
                    simBoard[i]=markToPlay;
                    const score=minimax(nextMark,simBoard);
                    if (score>highestScore) { //chooses the minimum value between both
                        highestScore=score;
                        highestValueMove=i; //and assigns the position that the lesser scored i It can have. ("if" isnt needed here)
                    }
                    if (score<lowestScore) {
                        lowestScore=score;
                        lowestValueMove=i;
                    }

                }
            }
            if (maximizing) {
                return highestValueMove;
            } else {
                return lowestValueMove;
            }
        }
        const makeRandomPlay = () => {
            if(gameController.getCurrentPlayer().isAI()) {
                gameController.playTurn(getRandomMove());
            } else {
                return false;
            }
        };
    
        const makePlay = () => {
            if(gameController.getCurrentPlayer().isAI()) {
                gameController.playTurn(getBestMove());
            } else {
                return false;
            }
        };
    
        return {makePlay, getBestMove, getValue, minimax};
    })();


const gameController = (() =>{
    let currentPlayer;
    let active;
    const players = [];
    //initialize the board and the players
    const initializeGame= () => {
    active = false;
    players.push(Player({name: "Player 1", mark: "X", turnIndex: 0}));
    players.push(Player({name: "Player 2", mark: "O", turnIndex: 1}));
    displayController.initializeBoard();
    displayController.initializeNameInputs();
    displayController.displayName(players[0]);
    displayController.displayName(players[1]);
    displayController.displayBoard();
    displayController.displayScore();
    displayController.enableCheckboxes();
};

//Restart the game
const restartGame = () => {
    active = false;
    displayController.displayStatus("start");
    gameboard.clearBoard();
    displayController.enableCheckboxes();
    currentPlayer = players[0];
};

//Start the game (from an inactive state)
const startGame = () => {
    if(!active) {
        restartGame();
        active = true;
        displayController.displayStatus("clear");
        displayController.disableCheckboxes();
        players.forEach(player => {
            const index = player.getTurnIndex();
            player.setAI(displayController.getAICheckboxes()[index].checked);
        });
        AIController.makePlay();
    }
};

//Reset the scores of all players
const resetScores = () => {
    players.forEach(player => {
        player.resetScore();
    });
    DisplayController.displayScore();
};

//Advance to the next player's turn
const advanceTurn = () => {
    currentPlayer = getOtherPlayer(currentPlayer);
};

//Get the player whose turn it currently is
const getCurrentPlayer = () => {
    return currentPlayer;
};

//Get a player by turn index
const getPlayer = (turnIndex) => {
    return players[turnIndex];
};

//Given a player, get the other player
const getOtherPlayer = (player) => {
    const newIndex = (player.getTurnIndex() + 1) % (players.length);
    return players[newIndex];
};

//Play out a turn
const playTurn = (index) => {
    if(!active) {
        return false;
    }
    const empty = gameboard.fillSquare(index);
    if(!empty) {
        return false;
    }
    displayController.displayBoard();
    const result = gameboard.checkResult(gameboard.getBoardContent());
    if(result) {
        active = false;
        if(result === "win") {
            currentPlayer.incrementScore(1);
        }
        displayController.displayStatus(result);
        displayController.displayScore();
        displayController.enableCheckboxes();
    } else {
        advanceTurn();
        AIController.makePlay();
    }
};
return {getCurrentPlayer, initializeGame, playTurn, getPlayer, getOtherPlayer, startGame, restartGame, resetScores};
})();

gameController.initializeGame();

