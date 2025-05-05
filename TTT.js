// Class project - Tic tac toe, by nitsan salton.
// base logic - i wanted to make a scalable tic tac toe, thus i couldnt use a simple defined array for win Condition
// thus i needed to make a "crawler" function to check cells. to handle its move i created a sub indexes for rows and columns.
// i built the check win function, that uses a crawler.
// this way i can also get a boolean to condition the Tie
// clicker checks if a click is possible. if so - it adds the symbol to the cell, updates the turn count, 
// check win condition (didnt optimize to start only after (grid size*2 -1) because of small scale),
// then flippes the turn. the ai uses this function as well

//element decleration

const container = document.querySelector('.container');
const cell = document.querySelectorAll('.cell');
const announcer = document.querySelector('#announcer');
const reset = document.querySelector('#reset');
let gridSize = parseInt(document.querySelector('#GridSize').value);
let winCondition = gridSize;
let currentPlayer = "circle";
let turnCount = 0;
let gameOver = false;
let aiMode = document.querySelector('#aiMode').checked;

console.log(`gridSize: ${gridSize}, winCondition: ${winCondition}`);
announcer.innerHTML = `its ${currentPlayer}'s turn!`;

function checkWin(row, col, player) {
    if (LineCrawler(row, 0, 0, 1, player)) {  // Check the row
        console.log(`found a row`);
        return true;
    } else if (LineCrawler(0, col, 1, 0, player)) {  // Check the column
        console.log(`found a column`);
        return true;
    } else if (LineCrawler(0, 0, 1, 1, player)) { // Check diagonal: top-left to bottom-right
        console.log(`found a diagonal TL to BR`);
        return true;
    } else if (LineCrawler(0, gridSize - 1, 1, -1, player)) {  // Check diagonal: top-right to bottom-left       
        console.log(`found a diagonal TR to BL`);
        return true;
    }
    
    return false; // No win detected
}


function LineCrawler(initRow, initCol, deltaRow, deltaCol, player) {
    let symbolCount = 0;
    let winCells = [];

    for (let i = 0; i <winCondition; i++){

        const stepRow = parseInt(initRow) + (i * deltaRow);
        const stepCol = parseInt(initCol) + (i * deltaCol);
        const stepCell = document.querySelector(`[data-row="${stepRow}"][data-col="${stepCol}"]`);
        // console.log(`checking cell ${stepRow}, ${stepCol}`); crawler debug
        if (stepCell && stepCell.getAttribute("data-player") === player) {
            winCells.push(stepCell);
            symbolCount++;
        } else {
            winCells = [];
            
        }
    }
    //retun true or false
    if (symbolCount === winCondition) {
        winCells.forEach(cell => cell.classList.add("win-line"));
        return true;
    }
    return symbolCount === winCondition;
};

function aiMove() {
    const cells = document.querySelectorAll('.cell')
    const availableCells = Array.from(cells).filter(c => !c.classList.contains("disabled"));
    // console.log(availableCells);
    const chosenCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    // console.log(chosenCell);
    const row = chosenCell.getAttribute('data-row');
    const col = chosenCell.getAttribute('data-col');
    
    const aiClickEvent = new MouseEvent("click", { bubbles: true }); //needed to bypass the blocked click event
    Object.defineProperty(aiClickEvent, "detail", { value: "ai" });
    
    chosenCell.dispatchEvent(aiClickEvent);
}

//click handler
console.log(`its ${currentPlayer}'s turn`);
container.addEventListener ("click", (e) => {
    const isAIMove = e.detail === "ai";
    if (gameOver || (aiMode && currentPlayer === "x" && !isAIMove)) return;
    //eliminate non clicking on container:
    const clickedCell = e.target.closest(".cell");
    if (!clickedCell || !container.contains(clickedCell)) {
    return;
    }
 
    const row = clickedCell.getAttribute('data-row');
    const col = clickedCell.getAttribute('data-col');
    console.log(`row: ${row}, col: ${col}`); //debugging
    
    //disabling clicked cells
    if (clickedCell.classList.contains("disabled")) {
        clickedCell.classList.add("error");
        // Remove the class after animation completes (300ms in this case)
        setTimeout(() => {
            clickedCell.classList.remove("error");
        }, 300);
        return;
    } else {
        clickedCell.classList.add("disabled");

        
        //add current player sign to cell
        clickedCell.setAttribute('data-player', currentPlayer);
        if (currentPlayer === "circle") {
            clickedCell.innerHTML = `<i class="fa-regular fa-circle"></i>`;
        } else {
            clickedCell.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        }
        turnCount++;
        console.log(`turnCount: ${turnCount}`);

        //win condition
        if (checkWin(row, col, currentPlayer)) {
            announcer.innerHTML = `${currentPlayer.toUpperCase()} wins!`;
            announcer.classList.add("win");
            console.log(`${currentPlayer} wins`);
            gameOver = true;
            return;
        }
        //tie condition
        if (turnCount === gridSize * gridSize) {
            announcer.innerHTML = `It's a tie!`;
            console.log("tie");
            gameOver = true;
            return;
        }      

        //turn flipping
        if (currentPlayer === "circle") {
            currentPlayer = "x";
        } else {
            currentPlayer = "circle";
        }

        console.log(`its ${currentPlayer}'s turn`);
        announcer.innerHTML = `its ${currentPlayer}'s turn!`;
        if (aiMode && currentPlayer === "x") {
            setTimeout(aiMove, 300); // Delay AI move 
        }
    };

});

//board creation
function DrawBoard() {
    container.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    
    for (let row =0; row < gridSize ; row++) {
        for (let col =0; col < gridSize ; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            container.appendChild(cell);
        }
    };
}

//handele every clean slate (to prevent repeats)
function cleaner() {
    console.clear();
    container.innerHTML = '';
    announcer.classList.remove("win");
    announcer.innerHTML = `its ${currentPlayer}'s turn!`;
    gameOver = false;
    turnCount = 0;
    DrawBoard();
    console.log(`gridSize: ${gridSize}, winCondition: ${winCondition}`);
    console.log(`its ${currentPlayer}'s turn`);
    
}

//Board size change
document.querySelector('#GridSize').addEventListener('change', () => {
    gridSize = parseInt(document.querySelector('#GridSize').value);
    winCondition = gridSize;
    cleaner();
})


//reset button
reset.addEventListener("click", () => {
    cleaner()
    if (aiMode && currentPlayer === "x") {
        setTimeout(aiMove, 300);
    };
})

//ai listener 
document.querySelector('#aiMode').addEventListener('change', () => {
    aiMode = document.querySelector('#aiMode').checked;
    if (aiMode) {
        console.clear();
        console.log("initialise AI mode")
        console.log("It's your move!")
    } else {
        console.clear();
        console.log("initialise PVP")
        currentPlayer = "circle";
    }    announcer.innerHTML = `It's ${currentPlayer}'s turn!`;
    gameOver = false;
    turnCount = 0;
    container.innerHTML = '';
    DrawBoard();
    announcer.classList.remove("win");
    if (aiMode && currentPlayer === "x") {
        setTimeout(aiMove, 300);
    }
});

DrawBoard();    


