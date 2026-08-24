// Global variable to track speech state
let isSpeaking = false;

function speak() {
    // 1. Check if the browser/device supports speech
    if (!('speechSynthesis' in window)) {
        alert("Your device does not support audio reading.");
        return;
    }

    // 2. If it's already speaking, stop it (Toggle behavior)
    if (synth.speaking) {
        synth.cancel();
        isSpeaking = false;
        return;
    }

    // 3. Get the text from the reader
    const text = document.getElementById('bible-display').innerText;
    if (!text || text.includes("Loading")) return;

    // 4. Create the Utterance
    const utter = new SpeechSynthesisUtterance(text);
    
    // 5. Android/Chrome Fix: Force voice selection
    // Android often fails if a voice isn't explicitly assigned
    const voices = synth.getVoices();
    utter.voice = voices.find(v => v.lang.includes('en')) || voices[0];

    // 6. Set properties
    utter.rate = 0.95; // Slightly slower for clarity
    utter.pitch = 1.0;
    utter.volume = 1.0;

    // 7. Android Lifecycle Events
    utter.onstart = () => { isSpeaking = true; };
    utter.onend = () => { isSpeaking = false; };
    utter.onerror = (err) => { 
        console.error("Speech Error:", err);
        isSpeaking = false; 
    };

    // 8. THE ANDROID FIX: 
    // We must call cancel() immediately before speak() to clear the buffer
    synth.cancel();
    setTimeout(() => {
        synth.speak(utter);
    }, 50); 
}

// Special fix for Android Chrome: Speech often pauses after 30 seconds
// This "heartbeat" keeps the audio engine alive
setInterval(() => {
    if (synth.speaking && isSpeaking) {
        synth.pause();
        synth.resume();
    }
}, 10000);
