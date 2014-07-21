(function(window, undefined) {
    'use strict';

    var floodFillGame = new FloodFillGame(),
        directions = {
            up: {
                column: 0,
                row: -1
            },
            down: {
                column: 0,
                row: 1
            },
            left: {
                column: -1,
                row: 0
            },
            right: {
                column: 1,
                row: 0
            }
        };

    createGUI();

    //Classes
    function FloodFillGame() {
        var currentColor,
            gameboard = [],
            numberOfTurns = 0,
            boardLength = 14,
            isGameOver = false,
            buttonColors = [
                '#F16745',
                '#FFC65D',
                '#7BC8A4',
                '#4CC3D9',
                '#93648D',
                '#404040'
            ];

        this.populateGrid = function() {
            for (var row = 0; row < boardLength; row += 1) {
                gameboard[row] = [];
                for (var column = 0; column < boardLength; column += 1) {
                    gameboard[row].push(buttonColors[getRandomInt(0, 6)]);
                }
            }
            currentColor = gameboard[0][0];
        };

        //This pattern works as a getter and setter. If colors is defined,
        //buttonColors will be set to that value. If not, it remains unchanged.
        //Either way, buttonColors is returned by this call
        this.ButtonColors = function(colors) {
            if (colors) {
                buttonColors = colors;
            }
            return buttonColors;
        };

        this.CurrentColor = function(color) {

            if (color) {
                currentColor = color;
            }
            return currentColor;
        };

        this.NumberOfTurns = function() {
            return numberOfTurns;
        };

        this.incrementTurns = function() {
            numberOfTurns += 1;
        };

        this.BoardLength = function() {
            return boardLength;
        };

        this.GameBoard = function() {
            return gameboard;
        };

        this.checkForWin = function() {
            var currentColor = gameboard[0][0];
            for (var row = 0; row < boardLength; row += 1) {
                for (var column = 0; column < boardLength; column += 1) {
                    if (currentColor !== gameboard[row][column]) {
                        if (numberOfTurns === 25) {
                            alert('You have lost! I implore you to try again!');
                            isGameOver = true;
                        }
                        return false;
                    }
                }
            }
            isGameOver = true;
            return true;
        };

        this.IsGameOver = function(value) {
            if (value) {
                isGameOver = value;
            }
            return isGameOver;
        };

        this.resetGame = function() {
            isGameOver = false;
            numberOfTurns = 0;
            this.populateGrid();
        };
    }

    //GUI
    function createGUI() {
        createControlPanel();
        floodFillGame.resetGame();
        createGameBoard();
    }

    function createControlPanel() {
        var controlPanel,
            buttons,
            currentButton,
            newGameButton;

        controlPanel = document.getElementById('controlPanel');
        buttons = controlPanel.getElementsByTagName('button');

        for (var index = 0; index < buttons.length; index += 1) {
            currentButton = buttons[index];
            currentButton.addEventListener('click', buttonClickListener);
            currentButton.style.background = floodFillGame.ButtonColors()[index];
        }

        newGameButton = document
            .getElementById('bottomPanel')
            .getElementsByTagName('button')[0];
        newGameButton.addEventListener('click', function() {
            startNewGame();
        });
    }

    function buttonClickListener() {
        var color = window
            .getComputedStyle(this)
            .getPropertyValue('background-color');
        color = rgbToHex(color);

        if ((!floodFillGame.IsGameOver()) &&
            floodFillGame.CurrentColor() !== color) {

            fillWithColor(color);
            floodFillGame.CurrentColor(color);
            floodFillGame.incrementTurns();
            updateGUI();
            if (floodFillGame.checkForWin()) {
                alert('You win! *High five*');
            }
        }
    }

    function createGameBoard() {
        var newTableRow,
            newTableCell,
            table,
            gameboard = floodFillGame.GameBoard();

        table = document.getElementById('gameboard');

        for (var row = 0; row < floodFillGame.BoardLength(); row += 1) {
            newTableRow = document.createElement('tr');

            for (var column = 0; column < floodFillGame.BoardLength(); column += 1) {
                newTableCell = document.createElement('td');
                newTableCell.style.background = gameboard[row][column];
                newTableRow.appendChild(newTableCell);
            }
            table.appendChild(newTableRow);
        }
    }

    function updateGUI() {
        var controlPanel,
            tableRow,
            tableCell,
            table = document.getElementById('gameboard'),
            gameboard = floodFillGame.GameBoard();

        controlPanel = document.getElementById('controlPanel');
        controlPanel.getElementsByTagName('span')[0].innerHTML =
            'Turn: ' + ('0' + floodFillGame.NumberOfTurns()).slice(-2) + '/ 25';

        //Update color of cells
        for (var row = 0; row < floodFillGame.BoardLength(); row += 1) {
            tableRow = table.childNodes[row];
            for (var column = 0; column < floodFillGame.BoardLength(); column += 1) {
                tableCell = tableRow.childNodes[column];
                tableCell.style.background = gameboard[row][column];
            }
        }
    }

    //Game Logic
    function fillWithColor(color) {
        var currentSquare,
            queue = [],
            neighbors = [],
            row,
            column,
            currentColor = floodFillGame.GameBoard()[0][0];

        queue.push({
            row: 0,
            column: 0
        });

        while (queue.length > 0) {
            currentSquare = queue.pop();
            neighbors = getNeighborSquares(currentSquare);

            //if neighbor is correct color, add to queue
            for (var neighbor in neighbors) {
                row = neighbors[neighbor].row;
                column = neighbors[neighbor].column;

                if (floodFillGame
                    .GameBoard()[row][column] === currentColor) {
                    queue.push(neighbors[neighbor]);
                }
            }

            //change color of this square
            floodFillGame.GameBoard()[currentSquare.row][currentSquare.column]
                = color;
        }
    }

    function getNeighborSquares(selectedSquare) {
        var neighbors = [],
            neighborColumn,
            neighborRow;

        for (var direction in directions) {

            neighborRow = selectedSquare.row + directions[direction].row;
            neighborColumn = selectedSquare.column + directions[direction].column;

            if (neighborColumn > -1 &&
                neighborColumn < floodFillGame.BoardLength() &&
                neighborRow > -1 &&
                neighborRow < floodFillGame.BoardLength())
            {
                neighbors.push({
                    row: neighborRow,
                    column: neighborColumn
                });
            }
        }
        return neighbors;
    }

    function startNewGame() {
        floodFillGame.resetGame();
        updateGUI();
    }

    //Utilities
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function rgbToHex(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }
        return ('#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
    }
}(window));