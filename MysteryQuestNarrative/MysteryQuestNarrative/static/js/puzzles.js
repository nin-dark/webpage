function initializePuzzle(puzzleId) {
    switch(puzzleId) {
        case 'puzzle1':
            initializeWordScramble();
            break;
        case 'puzzle2':
            initializeLockPuzzle();
            break;
        case 'puzzle3':
            initializeHiddenLetters();
            break;
    }
}

function initializeWordScramble() {
    const letters = document.querySelectorAll('.draggable-letter');
    letters.forEach(letter => {
        letter.addEventListener('dragstart', dragStart);
        letter.addEventListener('dragend', dragEnd);
        letter.addEventListener('dragover', dragOver);
        letter.addEventListener('drop', drop);
    });
}

function initializeLockPuzzle() {
    const numberBtns = document.querySelectorAll('.number-btn');
    const lockInput = document.querySelector('#lock-input');
    const clearBtn = document.querySelector('.clear-btn');
    const submitBtn = document.querySelector('.check-solution');

    numberBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (lockInput.value.length < 10) {
                if (btn.textContent === '/' && !isValidSlashPosition(lockInput.value.length)) {
                    return;
                }
                lockInput.value += btn.textContent;
                playClickSound();
            }
        });
    });

    clearBtn.addEventListener('click', () => {
        lockInput.value = '';
        playClickSound();
    });

    submitBtn.addEventListener('click', () => {
        if (isValidDateFormat(lockInput.value)) {
            checkSolution(lockInput.value);
        } else {
            alert('Please enter a valid date in DD/MM format');
            playErrorSound();
        }
    });
}

function isValidSlashPosition(position) {
    return position === 2 || position === 5;
}

function isValidDateFormat(value) {
    return /^\d{2}\/\d{2}$/.test(value);
}

function initializeHiddenLetters() {
    const letterCells = document.querySelectorAll('.letter-cell');
    letterCells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.classList.contains('revealed')) return;

            cell.classList.add('revealed');
            playClickSound();

            if (isCorrectLetter(cell.textContent)) {
                cell.style.backgroundColor = '#4CAF50';
            } else {
                cell.style.backgroundColor = '#ff3333';
            }
        });
    });
}

// Drag and Drop Functions
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedContent = e.dataTransfer.getData('text/plain');
    const targetContent = e.target.textContent;

    const dragged = document.querySelector('.dragging');
    dragged.textContent = targetContent;
    e.target.textContent = draggedContent;

    playClickSound();
}

function isCorrectLetter(letter) {
    const solution = 'BHOOMI';
    return solution.includes(letter);
}

// Assuming playClickSound and playErrorSound are defined elsewhere.
//Add dummy functions for compilation
function playClickSound() {}
function playErrorSound() {}
function checkSolution(value) {}