
class offscreenRecorder {
    mediaRecorder: MediaRecorder;
    state: "recording" | "stop";
    recordedChunks: any[];

    constructor() {
        this.initRecorder()
    }

    async initRecorder() {
        console.log("initalize tab recorder");
        chrome.runtime.onMessage.addListener(async (message) => {
            if (message.target !== 'offscreen') return;
            
            if (message.type === 'start-recording') {
                const config = {
                    audio: {
                      mandatory: {
                        chromeMediaSource: "tab",
                        chromeMediaSourceId: message.data,
                      },
                    },
                    video: {
                      mandatory: {
                        chromeMediaSource: "tab",
                        chromeMediaSourceId: message.data,
                      },
                    },
                  }

              const media = await navigator.mediaDevices.getUserMedia(config as MediaStreamConstraints);
          
              // Continue to play the captured audio to the user.
              const output = new AudioContext();
              const source = output.createMediaStreamSource(media);
              source.connect(output.destination);
          
              // TODO: Do something to recording the MediaStream.
            }
          });
    }
}

new offscreenRecorder()