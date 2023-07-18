const axios = require("axios");
const sound = require("sound-play");
const path = require("path");

const WAKEUP_WORD = 'команда';

const options = {
    headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YTBlMTUzNTdkNDU0ZmJiYWE4YWU4NTBmZWJmNWUyMCIsImlhdCI6MTY4OTE4NDU5MCwiZXhwIjoyMDA0NTQ0NTkwfQ._B-HrWD1sdkFbkidD6rrv9HnSFD-4m9y6RiYpDMN9U0'}
};

let wakeUpTriggered = false;
let wakeUpTriggeredWithoutFurtherCommand = true;


const playSound = (name) => {
    const filePath = path.join(__dirname, `${name}.mp3`);
    sound.play(filePath).then((response) => console.log(`Playing ${name} - done`));
}

const startTimerForEmptyPhrase = (micInstance) => {
    setTimeout(() => {

        if (wakeUpTriggeredWithoutFurtherCommand) {
            micInstance.resume();
            wakeUpTriggered = false;
        } else {
            wakeUpTriggeredWithoutFurtherCommand = true;
        }
    }, 4000);
}

const processIntent = (searchText, micInstance) => {
    console.log(`Sending request with phrase: ${searchText}`)
    micInstance.pause();
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


const init = (recognizer, micInstance) => {


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
                    let searchText = chunks[1].trim();
                    processIntent(searchText, micInstance);
                } else {
                    console.log('Found wake up phrase. Listening for the text');
                    startTimerForEmptyPhrase(micInstance)
                }

                // if wakeup word was found and there are further text
                // process the intent phrase
            } else if (wakeUpTriggered && fullResult) {
                wakeUpTriggeredWithoutFurtherCommand = false;
                processIntent(fullResult, micInstance);
            }
        } else if (!wakeUpTriggered) {
            console.log(recognizer.partialResult());
        }
    }

    return {handleMicData: handleMicData}
}

module.exports = {
    init,
    //handleMicData
}