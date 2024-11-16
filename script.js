class Minesweeper {
    constructor() {
        this.difficulties = {
            easy: { rows: 9, cols: 9, mines: 10 },
            medium: { rows: 16, cols: 16, mines: 40 },
            hard: { rows: 16, cols: 30, mines: 99 }
        };
        this.board = [];
        this.gameOver = false;
        this.minesLeft = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.firstClick = true;

        this.initializeDOM();
        this.setupEventListeners();
        this.startNewGame();
    }

    initializeDOM() {
        this.boardElement = document.getElementById('game-board');
        this.mineCountElement = document.getElementById('mine-count');
        this.timerElement = document.getElementById('timer');
        this.gameOverElement = document.getElementById('game-over');
        this.messageElement = document.querySelector('#game-over .message');
        this.difficultySelect = document.getElementById('difficulty');
        this.themeToggle = document.getElementById('theme-toggle');
    }

    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('restart').addEventListener('click', () => this.startNewGame());
        this.difficultySelect.addEventListener('change', () => this.startNewGame());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
    }

    startNewGame() {
        this.gameOver = false;
        this.firstClick = true;
        this.gameOverElement.classList.add('hidden');
        clearInterval(this.timerInterval);
        this.timer = 0;
        this.updateTimer();

        const difficulty = this.difficulties[this.difficultySelect.value];
        this.rows = difficulty.rows;
        this.cols = difficulty.cols;
        this.minesLeft = difficulty.mines;
        this.updateMineCount();

        this.createBoard();
        this.renderBoard();
    }

    createBoard() {
        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0
                };
            }
        }
    }

    placeMines(firstRow, firstCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.minesLeft) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            if (!this.board[row][col].isMine && !(row === firstRow && col === firstCol)) {
                this.board[row][col].isMine = true;
                minesPlaced++;
            }
        }

        this.calculateNeighborMines();
    }

    calculateNeighborMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].isMine) {
                    let count = 0;
                    this.forEachNeighbor(row, col, (r, c) => {
                        if (this.board[r][c].isMine) count++;
                    });
                    this.board[row][col].neighborMines = count;
                }
            }
        }
    }

    forEachNeighbor(row, col, callback) {
        for (let r = Math.max(0, row - 1); r <= Math.min(this.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.cols - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    callback(r, c);
                }
            }
        }
    }

    renderBoard() {
        const isMobile = window.innerWidth <= 600;
        const cellSize = isMobile ? 25 : 30;
        const borderSize = 2; // Taille de la bordure
        
        this.boardElement.style.gridTemplateColumns = `repeat(${this.cols}, ${cellSize}px)`;
        this.boardElement.innerHTML = '';

        // Calculer la largeur totale de la grille avec les bordures
        const totalWidth = (this.cols * cellSize) + (this.cols * borderSize) + (borderSize * 2); // Inclure le padding
        this.boardElement.style.width = `${totalWidth}px`;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                cell.addEventListener('click', (e) => this.handleClick(row, col));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(row, col);
                });

                this.updateCellDisplay(cell, this.board[row][col]);
                this.boardElement.appendChild(cell);
            }
        }
    }

    updateCellDisplay(cell, cellData) {
        cell.className = 'cell';
        if (cellData.isRevealed) {
            cell.classList.add('revealed');
            if (cellData.isMine) {
                cell.classList.add('mine');
                cell.textContent = '💣';
            } else if (cellData.neighborMines > 0) {
                cell.textContent = cellData.neighborMines;
            }
        } else if (cellData.isFlagged) {
            cell.classList.add('flagged');
            cell.textContent = '🚩';
        } else {
            cell.textContent = '';
        }
    }

    handleClick(row, col) {
        if (this.gameOver || this.board[row][col].isFlagged) return;

        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(row, col);
            this.startTimer();
        }

        if (this.board[row][col].isMine) {
            this.gameOver = true;
            this.revealAll();
            this.endGame(false);
        } else {
            this.revealCell(row, col);
            if (this.checkWin()) {
                this.gameOver = true;
                this.endGame(true);
            }
        }

        this.renderBoard();
    }

    handleRightClick(row, col) {
        if (this.gameOver || this.board[row][col].isRevealed) return;

        this.board[row][col].isFlagged = !this.board[row][col].isFlagged;
        this.minesLeft += this.board[row][col].isFlagged ? -1 : 1;
        this.updateMineCount();
        this.renderBoard();
    }

    revealCell(row, col) {
        if (this.board[row][col].isRevealed || this.board[row][col].isFlagged) return;

        this.board[row][col].isRevealed = true;
        
        // Ne révéler les cases adjacentes que si la case actuelle est vide (0 mine adjacente)
        if (this.board[row][col].neighborMines === 0) {
            let revealed = new Set(); // Pour éviter les révélations en boucle
            let toCheck = [[row, col]];
            
            while (toCheck.length > 0) {
                let [r, c] = toCheck.pop();
                let key = `${r},${c}`;
                
                if (revealed.has(key)) continue;
                revealed.add(key);
                
                // Si c'est une case vide, ajouter ses voisins à vérifier
                if (this.board[r][c].neighborMines === 0) {
                    this.forEachNeighbor(r, c, (nr, nc) => {
                        let nKey = `${nr},${nc}`;
                        if (!revealed.has(nKey) && !this.board[nr][nc].isFlagged) {
                            this.board[nr][nc].isRevealed = true;
                            if (this.board[nr][nc].neighborMines === 0) {
                                toCheck.push([nr, nc]);
                            }
                        }
                    });
                }
            }
        }
    }

    revealAll() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col].isRevealed = true;
            }
        }
    }

    checkWin() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].isMine && !this.board[row][col].isRevealed) {
                    return false;
                }
            }
        }
        return true;
    }

    endGame(won) {
        clearInterval(this.timerInterval);
        this.gameOverElement.classList.remove('hidden');
        this.messageElement.textContent = won ? 'Félicitations ! Vous avez gagné ! 🎉' : 'Game Over ! 💥';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        this.timerElement.textContent = `⏱️ ${this.timer}`;
    }

    updateMineCount() {
        this.mineCountElement.textContent = `💣 ${this.minesLeft}`;
    }
}

// Démarrer le jeu
new Minesweeper();
