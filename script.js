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
        //gameboard closure made below
        return {getBoardContent, getOpenSquares, fillSquare, checkResult, clearBoard, getWinner};
    })();// <- immediately invoked and stored on gameboard

    //now we create the game's display object
const displayController= (()=> {
    //and the html, storing their inputs in arrays
const board=[];
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
    const gridContainer= document.getElementById("grid-container");
    for (let i=0; i<9;  i++) {
        const index= i;
        const square = document.createElement("div");
        square.classList.add("boardSquare");
        gridContainer.appendChild(square);
        square.addEventListener("click", ()=> {
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
const initializeNameInputs= ()=> {
for (let i =0 ;i<2; i++){
    const player =gameController.getPlayer(i);
    nameDisplay= nameDisplays[i];
    const input=document.createElement("input");
    input.classList.add("nameInput");
    input.value = player.getName(); // getName and getCurrentPlayer will return the name of the player, and current turn.
    input.setAttribute("maxLength", 10);
    input.addEventListener("blur", () => {
        const char = /\S/; // if there's a string, and no whitespaces, player.setName(input.value)
        if(input.value !== "" && input.value.search(char) !== -1) {
            player.setName(input.value);
        } else {
            input.value = player.getName();
        }
        displayName(player);
        displayScore();
});
    nameInputs.push(input);
    editNameButtons[i].addEventListener("click", ()=> { //button are stored on the editNameButtons array
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
    const displayStatus= (key) => {
switch (key) {
    case "win": 
    statusText.textContent = `${gameController.getCurrentPlayer().getName()} wins!`; //
    break;
    case "tie":
    statusText.textContent = "It's a tie";
    break;
    case "start":
    statusText.textContent= "Press START to begin";
    break;
    case "clear":
    statusText.textContent= "";
        break;
}

    }

    // Update the name displayed for a player
    const displayName= (player) => {
        const index = player.getTurnIndex();  //turn index gets the player's turn order index, thats between 0 and 1
        nameDisplays[index].textContent=`${player.getName()} [${player.getMark()}]`;
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
        scoreTextP1.textContent = `${GameController.getPlayer(0).getName()}: ${GameController.getPlayer(0).getScore()}`;
        scoreTextP2.textContent = `${GameController.getPlayer(1).getName()}: ${GameController.getPlayer(1).getScore()}`;
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

return {initializeBoard,initializeNameInputs,displayBoard,displayStatus,displayName,displayScore,enableCheckboxes,disableCheckboxes,getAICheckboxes} 
//inputName is included in initializeBoard, so isnt returned. (just need It 1 time)
})();

//A factory function to create objects for each player



    

