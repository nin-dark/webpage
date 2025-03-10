let audioContext;
let masterGain;

function initializeAudio() {
    audioContext = new Tone.Context();
    masterGain = new Tone.Gain(0.5).toDestination();
    
    // Start audio context on user interaction
    document.body.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });
}

function playClickSound() {
    const synth = new Tone.Synth({
        oscillator: {
            type: 'sine'
        },
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0,
            release: 0.1
        }
    }).connect(masterGain);
    
    synth.triggerAttackRelease('C4', '0.1');
}

function playSuccessSound() {
    const synth = new Tone.Synth({
        oscillator: {
            type: 'triangle'
        },
        envelope: {
            attack: 0.01,
            decay: 0.3,
            sustain: 0.1,
            release: 0.5
        }
    }).connect(masterGain);
    
    synth.triggerAttackRelease('C5', '0.3');
    setTimeout(() => synth.triggerAttackRelease('E5', '0.3'), 100);
    setTimeout(() => synth.triggerAttackRelease('G5', '0.3'), 200);
}

function playErrorSound() {
    const synth = new Tone.Synth({
        oscillator: {
            type: 'square'
        },
        envelope: {
            attack: 0.01,
            decay: 0.3,
            sustain: 0,
            release: 0.1
        }
    }).connect(masterGain);
    
    synth.triggerAttackRelease('C3', '0.2');
    setTimeout(() => synth.triggerAttackRelease('B2', '0.2'), 200);
}

function playHintSound() {
    const synth = new Tone.Synth({
        oscillator: {
            type: 'sine'
        },
        envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.2,
            release: 0.5
        }
    }).connect(masterGain);
    
    synth.triggerAttackRelease('E4', '0.2');
}
