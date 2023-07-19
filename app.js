const vosk = require('vosk');

const fs = require("fs");
const axios = require("axios");
const sound = require("sound-play");
const path = require("path");
const mic = require("mic");
//const {handleMicData} = require("./handler");
const  handler = require("./handler");
const  recognizer = require("./recognizer");
//const  wakeDetector = require("./wake-word-detector");
const WavFileWriter = require('wav').FileWriter;



MODEL_PATH = "./vosk-model-small-uk-v3-small"
//SAMPLE_RATE = 16000
SAMPLE_RATE = process.env.SAMPLE_RATE || 16000
DEVICE_NAME = process.env.DEVICE_NAME || ''


const micInstance = mic({
    rate: String(SAMPLE_RATE),
    channels: '1',
    debug: false,
    exitOnSilence: 6,
    device: DEVICE_NAME,
});

const micInputStream = micInstance.getAudioStream();



//micInputStream.on('data', data => init.handleMicData(data));




process.on('SIGINT', () => {
    console.log("Stopping");
    process.exit(0)
});







//const writeStream = fs.createWriteStream("./audio.wav", { encoding: 'binary' });



micInputStream.on('data', function(data) {
    console.log("Recieved Input Stream: " + data.length);
});

micInputStream.on('error', function(err) {
    cosole.log("Error in Input Stream: " + err);
});

micInputStream.on('startComplete', function() {
    console.log("Got SIGNAL startComplete");
});

micInputStream.on('stopComplete', function() {
    console.log("Got SIGNAL stopComplete");
    recognizer.recognize()
});

micInputStream.on('pauseComplete', function() {
    console.log("Got SIGNAL pauseComplete");
});

micInputStream.on('resumeComplete', function() {
    console.log("Got SIGNAL resumeComplete");
});

micInputStream.on('silence', function() {
    console.log("Got SIGNAL silence");
    setTimeout(function() {
        micInstance.stop();
    }, 5000);
});

micInputStream.on('processExitComplete', function() {
    console.log("Got SIGNAL processExitComplete");
});

let writeStream = new WavFileWriter("./audio.wav", {
    sampleRate: SAMPLE_RATE,
    bitDepth: 16,
    channels: 1
});

micInputStream.pipe(writeStream);
micInstance.start();

/*
wakeDetector.listenForWakeWord().then(d => {
    micInputStream.pipe(writeStream);
    micInstance.start();
})
*/




// Initialize recorder and file stream.
/*const audioRecorder = new AudioRecorder({
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
});*/

/*audioRecorder.start()
audioRecorder.stream().pipe(writeStream);

setTimeout(() => {
    writeStream.end()
    audioRecorder.stop()
}, 5000)*/

