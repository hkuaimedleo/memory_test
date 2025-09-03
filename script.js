document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    const gridSize = 5;
    const totalTiles = gridSize * gridSize;
    let tilesPerRound = 5; // Default number of tiles
    let flashDuration = 0.5; // Default flash duration in seconds
    let patternToRemember = [];
    let userSelections = [];
    let canSelect = false;
    
    // DOM elements
    const gridElement = document.getElementById('grid');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const showAnswersButton = document.getElementById('show-answers-btn');
    const resultElement = document.getElementById('result');
    const settingsButton = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const tilesCountSlider = document.getElementById('tiles-count');
    const tilesCountValue = document.getElementById('tiles-count-value');
    const flashDurationSlider = document.getElementById('flash-duration');
    const flashDurationValue = document.getElementById('flash-duration-value');
    
    // Create the grid
    function createGrid() {
        gridElement.innerHTML = '';
        for (let i = 0; i < totalTiles; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = i;
            tile.addEventListener('click', handleTileClick);
            gridElement.appendChild(tile);
        }
    }
    
    // Handle tile click event
    function handleTileClick(event) {
        if (!canSelect) return;
        
        const index = parseInt(event.target.dataset.index);
        const tile = event.target;
        
        // Toggle selection if not already selected
        if (!userSelections.includes(index)) {
            userSelections.push(index);
            tile.classList.add('selected');
            
            // Check if the user has selected the required number of tiles
            if (userSelections.length === tilesPerRound) {
                checkResult();
            }
        }
    }
    
    // Start a new round
    function startRound() {
        // Reset game state
        userSelections = [];
        patternToRemember = [];
        canSelect = false;
        answersRevealed = false;
        
        // Reset Reveal button text
        showAnswersButton.textContent = 'Reveal';
        
        // Show the reset and show answers buttons when the game starts
        resetButton.style.display = 'inline-block';
        showAnswersButton.style.display = 'inline-block';
        
        // Update UI
        startButton.style.display = 'none';
        resultElement.textContent = '';
        resultElement.className = 'result';
        
        // Clear any previous tile states
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.classList.remove('selected', 'correct', 'incorrect', 'flash');
        });
        
        // Generate random pattern
        generatePattern();
        
        // Show the pattern
        showPattern();
    }
    
    // Generate a random pattern of tiles
    function generatePattern() {
        // Generate random indices
        while (patternToRemember.length < tilesPerRound) {
            const randomIndex = Math.floor(Math.random() * totalTiles);
            if (!patternToRemember.includes(randomIndex)) {
                patternToRemember.push(randomIndex);
            }
        }
    }
    
    // Show the pattern to the user
    function showPattern() {
        const tiles = document.querySelectorAll('.tile');
        
        // Show all tiles at once for the specified duration
        patternToRemember.forEach(tileIndex => {
            tiles[tileIndex].classList.add('flash');
        });
        
        // Hide tiles after the specified duration and allow user to select
        setTimeout(() => {
            patternToRemember.forEach(tileIndex => {
                tiles[tileIndex].classList.remove('flash');
            });
            canSelect = true;
        }, flashDuration * 1000); // Convert seconds to milliseconds
    }
    
    // Check if the user's selections match the pattern
    function checkResult() {
        canSelect = false;
        const tiles = document.querySelectorAll('.tile');
        let allCorrect = true;
        
        // Sort arrays for comparison
        const sortedPattern = [...patternToRemember].sort((a, b) => a - b);
        const sortedSelections = [...userSelections].sort((a, b) => a - b);
        
        // Check each selection
        userSelections.forEach(selectedIndex => {
            if (patternToRemember.includes(selectedIndex)) {
                tiles[selectedIndex].classList.add('correct');
            } else {
                tiles[selectedIndex].classList.add('incorrect');
                allCorrect = false;
            }
        });
        
        // Show missed tiles
        patternToRemember.forEach(patternIndex => {
            if (!userSelections.includes(patternIndex)) {
                setTimeout(() => {
                    tiles[patternIndex].classList.add('flash');
                    setTimeout(() => {
                        tiles[patternIndex].classList.remove('flash');
                    }, 1000);
                }, 500);
                allCorrect = false;
            }
        });
        
        // Show result
        if (allCorrect) {
            resultElement.textContent = 'Correct! Well done!';
            resultElement.classList.add('success');
        } else {
            resultElement.textContent = 'Incorrect. Revenge? 😏';
            resultElement.classList.add('failure');
        }
        
        // Ensure the reset button is visible after game completion
        resetButton.style.display = 'inline-block';
        
        // Don't show start button after rounds
    }
    
    // Toggle settings panel
    function toggleSettings() {
        settingsPanel.classList.toggle('active');
    }
    
    // Update tiles count value
    function updateTilesCount() {
        tilesPerRound = parseInt(tilesCountSlider.value);
        tilesCountValue.textContent = tilesPerRound;
    }
    
    // Update flash duration value
    function updateFlashDuration() {
        flashDuration = parseFloat(flashDurationSlider.value);
        flashDurationValue.textContent = flashDuration;
    }
    
    // Event listeners
    startButton.addEventListener('click', startRound);
    resetButton.addEventListener('click', startRound);
    showAnswersButton.addEventListener('click', showAnswers);
    settingsButton.addEventListener('click', toggleSettings);
    
    // Make sure sliders work with both input and change events
    tilesCountSlider.addEventListener('input', updateTilesCount);
    tilesCountSlider.addEventListener('change', updateTilesCount);
    flashDurationSlider.addEventListener('input', updateFlashDuration);
    flashDurationSlider.addEventListener('change', updateFlashDuration);
    
    // Toggle showing/hiding answers
    let answersRevealed = false;
    
    function showAnswers() {
        if (patternToRemember.length > 0) {
            const tiles = document.querySelectorAll('.tile');
            
            if (!answersRevealed) {
                // Show answers
                answersRevealed = true;
                canSelect = false;
                
                // Highlight the correct tiles
                patternToRemember.forEach(tileIndex => {
                    tiles[tileIndex].classList.add('flash');
                });
                
                // Add an explanation to the result area
                resultElement.textContent = 'Answers revealed';
                resultElement.className = 'result info';
                
                // Change button text (optional visual cue)
                showAnswersButton.textContent = 'Hide';
            } else {
                // Hide answers
                answersRevealed = false;
                canSelect = true;
                
                // Remove highlighting from tiles
                patternToRemember.forEach(tileIndex => {
                    tiles[tileIndex].classList.remove('flash');
                });
                
                // Clear the result message
                resultElement.textContent = '';
                resultElement.className = 'result';
                
                // Change button text back
                showAnswersButton.textContent = 'Reveal';
            }
        }
    }
    
    // Initialize the game
    createGrid();
    updateTilesCount();
    updateFlashDuration();
    
    // Hide the reset and show answers buttons before the game starts
    resetButton.style.display = 'none';
    showAnswersButton.style.display = 'none';
});
