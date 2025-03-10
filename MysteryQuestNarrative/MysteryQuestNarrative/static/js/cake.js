document.addEventListener('DOMContentLoaded', function() {
    console.log('Cake.js loaded');
    const tools = document.querySelectorAll('.tool');
    const candles = document.querySelectorAll('.candle');
    const cake = document.querySelector('.cake');
    const cakeSlice = document.querySelector('.cake-slice');
    const letterReveal = document.querySelector('.letter-reveal');
    const instructionText = document.querySelector('.instruction-text');
    let selectedTool = null;
    let candlesLit = 0;
    let cakeCut = false;

    // Initialize Tone.js
    const audioContext = new Tone.Context();
    Tone.setContext(audioContext);

    // Log initial elements
    console.log('Tools found:', tools.length);
    console.log('Candles found:', candles.length);

    // Tool selection
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            console.log('Tool clicked:', tool.classList.contains('lighter') ? 'lighter' : 'knife');
            if (tool.dataset.selected === 'true') {
                deselectTool(tool);
            } else {
                selectTool(tool);
            }
        });
    });

    function selectTool(tool) {
        console.log('Selecting tool:', tool.classList.contains('lighter') ? 'lighter' : 'knife');
        // Deselect all tools first
        tools.forEach(t => deselectTool(t));

        tool.dataset.selected = 'true';
        selectedTool = tool;

        if (tool.classList.contains('knife')) {
            document.body.style.cursor = 'crosshair';
            instructionText.textContent = 'Click on the cake to cut a slice!';
        } else {
            document.body.style.cursor = 'pointer';
            instructionText.textContent = 'Click on the candles to light them!';
        }

        // Visual feedback
        tool.style.transform = 'scale(1.1)';
        tool.style.backgroundColor = '#FF69B4';
        tool.querySelector('i').style.color = 'white';
    }

    function deselectTool(tool) {
        tool.dataset.selected = 'false';
        tool.style.transform = '';
        tool.style.backgroundColor = '';
        tool.querySelector('i').style.color = '#4A4A4A';

        if (tool === selectedTool) {
            selectedTool = null;
            document.body.style.cursor = 'default';
        }
    }

    // Candle interaction
    candles.forEach((candle, index) => {
        candle.addEventListener('click', () => {
            console.log('Candle clicked:', index);
            if (selectedTool && selectedTool.classList.contains('lighter') && candle.dataset.lit === 'false') {
                lightCandle(candle);
            }
        });

        // Add touch support
        candle.addEventListener('touchend', (e) => {
            e.preventDefault();
            console.log('Candle touched:', index);
            if (selectedTool && selectedTool.classList.contains('lighter') && candle.dataset.lit === 'false') {
                lightCandle(candle);
            }
        });
    });

    function lightCandle(candle) {
        console.log('Lighting candle');
        const flame = candle.querySelector('.flame');
        flame.classList.remove('hidden');
        candle.dataset.lit = 'true';
        candlesLit++;
        playSound('light');

        console.log('Candles lit:', candlesLit, 'of', candles.length);
        if (candlesLit === candles.length) {
            setTimeout(() => {
                instructionText.textContent = 'Now grab the knife to cut the cake!';
                const knife = document.querySelector('.knife');
                if (knife) knife.style.display = 'block';
            }, 1000);
        }
    }

    // Cake cutting
    cake.addEventListener('click', handleCakeCut);
    cake.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleCakeCut();
    });

    function handleCakeCut() {
        console.log('Cake clicked, selected tool:', selectedTool ? selectedTool.classList : 'none');
        console.log('Conditions:', {
            hasSelectedTool: !!selectedTool,
            isKnife: selectedTool?.classList.contains('knife'),
            candlesLit: candlesLit === candles.length,
            notCut: !cakeCut
        });

        if (selectedTool && 
            selectedTool.classList.contains('knife') && 
            candlesLit === candles.length && 
            !cakeCut) {
            cutCake();
        }
    }

    function cutCake() {
        console.log('Cutting cake');
        cakeCut = true;
        cake.style.transform = 'translateX(-20px)';
        cakeSlice.classList.remove('hidden');
        playSound('cut');

        setTimeout(() => {
            letterReveal.classList.remove('hidden');
            instructionText.textContent = 'Your special message awaits!';
        }, 1500);
    }

    // Sound effects
    function playSound(action) {
        try {
            const synth = new Tone.Synth({
                oscillator: {
                    type: action === 'light' ? 'sine' : 'triangle'
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.1,
                    release: 0.1
                }
            }).toDestination();

            if (action === 'light') {
                synth.triggerAttackRelease('C5', '0.1');
            } else if (action === 'cut') {
                synth.triggerAttackRelease('G4', '0.2');
            }
        } catch (error) {
            console.error('Audio error:', error);
        }
    }

    // Start audio context on first user interaction
    document.body.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }, { once: true });

    // Prevent scrolling when interacting with tools on mobile
    document.addEventListener('touchmove', function(e) {
        if (selectedTool) {
            e.preventDefault();
        }
    }, { passive: false });

    // Log initial setup complete
    console.log('Cake.js initialization complete');
});