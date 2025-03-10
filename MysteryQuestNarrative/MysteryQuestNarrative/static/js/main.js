document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio
    initializeAudio();

    // Puzzle progression
    const checkSolutionBtn = document.querySelector('.check-solution');
    if (checkSolutionBtn) {
        checkSolutionBtn.addEventListener('click', function() {
            const puzzleId = document.querySelector('.puzzle-page').dataset.puzzleId;
            let solution;

            if (puzzleId === 'puzzle2') {
                solution = document.querySelector('#lock-input').value;
            } else {
                solution = document.querySelector('#puzzle-solution').value;
            }

            checkSolution(solution);
        });
    }

    // Skip puzzle functionality
    const skipButtons = document.querySelectorAll('.skip-puzzle');
    skipButtons.forEach(btn => {
        btn.addEventListener('click', skipPuzzle);
    });

    // Hint system
    const hintButtons = document.querySelectorAll('.show-hint');
    hintButtons.forEach(btn => {
        btn.addEventListener('click', showHint);
    });

    // Initialize puzzle-specific features
    const puzzlePage = document.querySelector('.puzzle-page');
    if (puzzlePage) {
        const puzzleId = puzzlePage.dataset.puzzleId;
        initializePuzzle(puzzleId);
    }
});

function checkSolution(solution) {
    const puzzleId = document.querySelector('.puzzle-page').dataset.puzzleId;

    fetch('/check_solution', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            puzzle_id: puzzleId,
            solution: solution
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            playSuccessSound();
            const nextPage = getNextPage(puzzleId);
            setTimeout(() => window.location.href = nextPage, 1000);
        } else {
            playErrorSound();
            alert('Try again!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    });
}

function skipPuzzle() {
    const puzzleId = document.querySelector('.puzzle-page').dataset.puzzleId;

    fetch('/skip_puzzle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const nextPage = getNextPage(puzzleId);
            window.location.href = nextPage;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    });
}

function showHint() {
    const puzzleId = document.querySelector('.puzzle-page').dataset.puzzleId;
    const hints = {
        'puzzle1': 'Think about what we\'re celebrating...',
        'puzzle2': 'Look for numbers hidden in the previous clue',
        'puzzle3': 'Click the glowing letters to reveal the message'
    };

    const hintModal = new bootstrap.Modal(document.getElementById('hint-modal'));
    document.getElementById('hint-text').textContent = hints[puzzleId];
    hintModal.show();
    playHintSound();
}

function getNextPage(currentPuzzle) {
    const pages = {
        'puzzle1': '/puzzle2',
        'puzzle2': '/puzzle3',
        'puzzle3': '/finale'
    };
    return pages[currentPuzzle];
}