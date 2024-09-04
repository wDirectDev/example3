import FreeQueue from "../../../free-queue/free-queue.js";
import Application from "./oscilloscope/index.mjs";

const nkMemory = window.document.querySelector( "nk-memory" );

const CONFIG = {
    audio: {
        ctx: false,
        analyser: false,
        waveform: false,
        master: {
            gain: false
        }
    },
    html: {
        scope: {
            canvas: false,
            context:false
        },
        button: {
            start: false,
            radios: {
                this: false,
                length: false
            }
        }
    },
    player: {
        start: false,
        stop: false,
        isPlaying: false
    },
    stream: {
        song: false,
        source: false,
        path: false,
    },
    web: {
        crossOrigin: 'anonymous'
    },
    application: {
        instance: undefined
    }
}

const newAudio = async (CONFIG) => {
    try {
        await CONFIG.stream.song.pause()
        await CONFIG.audio.ctx.suspend();
        CONFIG.stream.song = new Audio(CONFIG.stream.path)
        CONFIG.stream.source = CONFIG.audio.ctx.createMediaElementSource(CONFIG.stream.song)
        CONFIG.stream.song.crossOrigin = 'anonymous'
        CONFIG.stream.song.addEventListener("canplay", async (event) => {
            await CONFIG.audio.ctx.resume();
            await CONFIG.stream.song.play()
            CONFIG.html.button.start.textContent = 'Stop Audio'
            return true
        });
        await CONFIG.stream.source.connect(CONFIG.audio.ctx.destination);
        await CONFIG.stream.source.connect(CONFIG.audio.processorNode);
    } catch (e) {
        CONFIG.html.button.start.textContent = 'Stop Audio'
        return true
    }
}

const drawOscilloscope = () => {
   CONFIG.application.instance.start();
}

const ctx = async (CONFIG) => {
    if( !CONFIG.audio.ctx ) {
        CONFIG.audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
        await CONFIG.audio.ctx.audioWorklet.addModule(new URL('./radio-processor.mjs', import.meta.url).pathname);
    }

    //CONFIG.audio.oscillatorNode = new OscillatorNode(CONFIG.audio.ctx);
    // Create an atomic state for synchronization between Worker and AudioWorklet.

    CONFIG.audio.processorNode = new AudioWorkletNode(CONFIG.audio.ctx, 'radio-processor', {
        processorOptions: {
            queue: globalThis["queue"],
            instance: globalThis["instance"]
        },
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        channelCount: 2,
        channelCountMode: "max",
        channelInterpretation: "speakers"
    });

    CONFIG.audio.processorNode.connect(CONFIG.audio.ctx.destination);

    CONFIG.audio.ctx.suspend();

//    CONFIG.audio.analyser =  CONFIG.audio.ctx.createAnalyser()
//    CONFIG.audio.master.gain = CONFIG.audio.ctx.createGain()

//    CONFIG.audio.waveform = new Float32Array(CONFIG.audio.analyser.frequencyBinCount)
//    await CONFIG.audio.analyser.getFloatTimeDomainData(CONFIG.audio.waveform)

    // TODO переключатель между радио и осцилятором
//    CONFIG.audio.master.gain.connect(CONFIG.audio.processorNode).connect(CONFIG.audio.analyser).connect(CONFIG.audio.ctx.destination);
    // CONFIG.audio.oscillatorNode.connect(CONFIG.audio.processorNode).connect(CONFIG.audio.analyser).connect(CONFIG.audio.ctx.destination);

//    CONFIG.audio.oscillatorNode.start();

    return CONFIG.audio.ctx
}

const init = (self) => {
    CONFIG.html.scope.canvas = self.this.querySelector('#gfx');
    CONFIG.html.button.start = self.this.querySelector('#start');

    CONFIG.html.button.radios.this = self.this.querySelectorAll('input[name="radio-selection"]');
    CONFIG.html.button.radios.length = CONFIG.html.button.radios.this.length;

    CONFIG.player.isPlaying = false;

    CONFIG.application.instance = new Application();
    let rc = CONFIG.application.instance.check();
    if ( rc ) {
        const wgerr = self.this.querySelector('#error');
        wgerr.style.display = 'none';
        const wgfx = CONFIG.html.scope.canvas;
        wgfx.style.display = 'block';
    } else {
        const wgerr = self.this.querySelector('#error');
        wgerr.style.display = 'block';
        const wgfx = CONFIG.html.scope.canvas;
        wgfx.style.display = 'none';
    }

    CONFIG.application.instance.setCanvas( CONFIG.html.scope.canvas );

    const canvas = CONFIG.application.instance.getCanvas();
    const scale = window.devicePixelRatio;

    canvas.width = window.innerWidth;
    canvas.height = canvas.width * 1 / 5;

    canvas.height = canvas.height * scale;
    canvas.width = canvas.width * scale;
}

export default async () => {
    return new Promise((resolve, reject) => {
        class wControl {
            constructor(self) {
                init(self)
                for (let i = 0, max = CONFIG.html.button.radios.length; i < max; i++) {
                    if (CONFIG.html.button.radios.this[i].checked === true) {
                        CONFIG.stream.path = CONFIG.html.button.radios.this[i].value
                    }
                }
                drawOscilloscope();
                CONFIG.stream.song = new Audio(CONFIG.stream.source);
                for (let i = 0, max = CONFIG.html.button.radios.length; i < max; i++) {
                    CONFIG.html.button.radios.this[i].addEventListener( "change", async (event) => {
                        if (CONFIG.player.isPlaying) {
                            await CONFIG.stream.song.pause();
                            CONFIG.html.button.start.textContent = "Start Audio";

                            CONFIG.player.isPlaying = false;
                            globalThis["isPlaybackInProgress"] = CONFIG.player.isPlaying;

                            CONFIG.stream.path = event.target.value;
                            if(CONFIG.audio.ctx) {
                                CONFIG.player.isPlaying = !CONFIG.player.isPlaying;
                                globalThis["isPlaybackInProgress"] = CONFIG.player.isPlaying;
                                await newAudio(CONFIG);
                            }
                        }
                    } )
                }
                CONFIG.html.button.start.addEventListener( "click", async (e) => {                                        
                    if (CONFIG.player.isPlaying) {
                        CONFIG.html.button.start.textContent = "Start Audio";                        
                        CONFIG.player.isPlaying = false;
                        globalThis["isPlaybackInProgress"] = CONFIG.player.isPlaying;
                        await CONFIG.stream.song.pause();
                        CONFIG.audio.ctx.suspend();
                    } else {
                        CONFIG.html.button.start.textContent = "Stop Audio";                        
                        CONFIG.player.isPlaying = true;
                        globalThis["isPlaybackInProgress"] = CONFIG.player.isPlaying;
                        await ctx(CONFIG);
                        await newAudio(CONFIG);
                    }                    
                } )
            }
        }
        resolve(wControl);
    })
}