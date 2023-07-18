const vosk = require('vosk')

const fs = require("fs");
const axios = require("axios");
const sound = require("sound-play");
const path = require("path");
const mic = require("mic");

//ffi.DynamicLibrary('/Users/master/NodeProjects/vosk-demo/libvosk.so')
/*

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
    // device: 'default',
});

const micInputStream = micInstance.getAudioStream();

let wakeUpTriggered = false;
let wakeUpTriggeredWithoutFurtherCommand = true;

const startTimerForEmptyPhrase = () => {
    setTimeout(() => {

        if (wakeUpTriggeredWithoutFurtherCommand) {
            micInstance.resume();
            wakeUpTriggered = false;
        }else{
            wakeUpTriggeredWithoutFurtherCommand = true;
        }
    }, 2000);
}

const playSound = (name) => {
    const filePath = path.join(__dirname, `${name}.mp3`);
    sound.play(filePath).then((response) => console.log(`Playing ${name} - done`));
}

const processIntent = (searchText) => {
    const options = {
        headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YTBlMTUzNTdkNDU0ZmJiYWE4YWU4NTBmZWJmNWUyMCIsImlhdCI6MTY4OTE4NDU5MCwiZXhwIjoyMDA0NTQ0NTkwfQ._B-HrWD1sdkFbkidD6rrv9HnSFD-4m9y6RiYpDMN9U0'}
    };

    micInstance.pause();
    console.log(`Sending request with phrase: ${searchText}`)

    axios.post('http://192.168.1.107:8123/api/conversation/process',
        {
            text: searchText,
            language: 'uk'
        }, options
    ).then((response) => {
        const data = response.data;
        console.log(data);
        console.log(data.response.speech.plain);

        if (data.response.response_type === 'error') {
            playSound('error');
        } else {
            playSound('done');
        }
        wakeUpTriggered = false;
        micInstance.resume();

    }, (error) => {
        console.log(error);
        wakeUpTriggered = false;
        micInstance.resume();
    });
}

const WAKEUP_WORD = 'команда';
const handleMicData = (data) => {
    if (recognizer.acceptWaveform(data)) {
        let fullResult = recognizer.result().text;
        console.log(fullResult);

        // if there is no wakeup phrase previously triggered
        // check if phrase contains wakeup word
        if (!wakeUpTriggered && fullResult.includes(WAKEUP_WORD)) {
            wakeUpTriggered = true;

            // play sound if phrase contains wakeup word
            playSound('wakeup');

            // check if the intent phrase comes along with wakeup phrase
            let chunks = fullResult.split(WAKEUP_WORD);
            //console.log(chunks)
            if (chunks[1]) {
                console.log('Found wake up phrase with next command. Ready for invocation');
                processIntent(chunks[1].trim());
            } else {
                console.log('Found wake up phrase. Listening for the text');
                startTimerForEmptyPhrase()
            }

            // if wakeup word was found and there are further text
            // process the intent phrase
        } else if (wakeUpTriggered && fullResult) {
            wakeUpTriggeredWithoutFurtherCommand = false;
            processIntent(fullResult);
        }
    } else if (!wakeUpTriggered) {
        console.log(recognizer.partialResult());
    }
}

micInputStream.on('data', handleMicData);

micInputStream.on('audioProcessExitComplete', function () {
    console.log("Cleaning up");
    console.log(recognizer.finalResult());
    recognizer.free();
    model.free();
});

process.on('SIGINT', function () {
    console.log("\nStopping");
    micInstance.stop();
});

micInputStream.on('error', function (err) {
    console.log("Error in Input Stream: " + err);
});

micInstance.start();*/
