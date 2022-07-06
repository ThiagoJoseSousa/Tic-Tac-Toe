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
            // gamecontroller will be a factory function with the players, getmark will show X or O of the player
            boardContent[index] = Gamecontroller.getCurrentPlayer().getMark();
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

    

