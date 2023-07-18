const vosk = require('vosk');

const fs = require("fs");
const axios = require("axios");
const sound = require("sound-play");
const path = require("path");
const mic = require("mic");
const record = require('node-mic-record')
//const {handleMicData} = require("./handler");
const  handler = require("./handler");
const  myRecognizer = require("./recognizer");
const  wakeDetector = require("./wake-word-detector");
const { SpeechRecorder, devices } = require("speech-recorder");
const WavFileWriter = require('wav').FileWriter;


MODEL_PATH = "./vosk-model-small-uk-v3-small"
SAMPLE_RATE = 16000

if (!fs.existsSync(MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
    process.exit()
}

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);
const recognizer = new vosk.Recognizer({model: model, sampleRate: SAMPLE_RATE});

const micInstance = mic({
    rate: String(SAMPLE_RATE),
    channels: '1',
    debug: false,
    exitOnSilence: 6
    // device: 'default',
});

const micInputStream = micInstance.getAudioStream();

const init = handler.init(recognizer, micInstance);



//micInputStream.on('data', data => init.handleMicData(data));

micInputStream.on('audioProcessExitComplete', () => {
    console.log("Cleaning up");
    console.log(recognizer.finalResult());
    recognizer.free();
    model.free();
});




process.on('SIGINT', () => {
    console.log("\nStopping");
    porcupine.release()
    recorder.release();
    micInstance.stop();
});

micInputStream.on('error', (err) => {
    console.log("Error in Input Stream: " + err);
});







//const writeStream = fs.createWriteStream("./audio.wav", { encoding: 'binary' });

let writeStream = new WavFileWriter("./audio.wav", {
    sampleRate: 16000,
    bitDepth: 16,
    channels: 1
});

console.log(devices());

console.log("Recording for 5 seconds...");
//speechRecorder.start();

micInputStream.on('resumeComplete', function() {
    console.log("Got SIGNAL resumeComplete");
    setTimeout(function() {
        micInstance.stop();
    }, 5000);
});

micInputStream.on('silence', function() {
    console.log("Got SIGNAL silence");
    setTimeout(function() {
        console.log("Stopping microphone")
        micInstance.stop();
        myRecognizer.recognize()
    }, 1000);
});



wakeDetector.listenForWakeWord().then(d => {
    micInputStream.pipe(writeStream);
    micInstance.start();
})



// Import module.
const AudioRecorder = require('node-audiorecorder')

// Initialize recorder and file stream.
const audioRecorder = new AudioRecorder({
    program: 'sox',
    silence: 2,
    thresholdStart: 0.1,        // Silence threshold to start recording.
    thresholdStop: 0.2,
    // device:'plughw:1'
}, console);

// Log information on the following events.
audioRecorder.on('error', function () {
    console.warn('Recording error.');
});
audioRecorder.on('end', function () {
    console.warn('Recording ended.');
});

/*audioRecorder.start()
audioRecorder.stream().pipe(writeStream);

setTimeout(() => {
    writeStream.end()
    audioRecorder.stop()
}, 5000)*/

