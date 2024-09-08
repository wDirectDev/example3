import initFreeQueue from "../../../free-queue/free-queue.asm.js"
import FreeQueue from "../../../free-queue/free-queue.js";
import Application from "./oscilloscope/index.mjs";

const newAudio = async (CONFIG) => {
    try {
//        await CONFIG.stream.song.pause()
	if ( CONFIG.audio.init == false ) {
		CONFIG.audio.init = true;
	        CONFIG.stream.song = new Audio(CONFIG.stream.path);
	        CONFIG.stream.source = CONFIG.audio.ctx.createMediaElementSource(CONFIG.stream.song);
	        CONFIG.stream.song.crossOrigin = 'anonymous';
	        CONFIG.stream.song.addEventListener("canplay", async (event) => {
	            await CONFIG.audio.ctx.resume();
	            await CONFIG.stream.song.play();
	            CONFIG.html.button.start.textContent = 'Stop Audio';
	            return true;
	        });
	        await CONFIG.stream.source.connect(CONFIG.audio.ctx.destination);
        	await CONFIG.stream.source.connect(CONFIG.audio.node);
		CONFIG.audio.init = false;
	}
    } catch (e) {
        CONFIG.html.button.start.textContent = 'Stop Audio';
        return true;
    }
}

const ctx = async (CONFIG) => {
    if( CONFIG.audio.ctx == undefined || CONFIG.audio.ctx == null ) {
        CONFIG.audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
        await CONFIG.audio.ctx.audioWorklet.addModule(new URL('./radio-processor.mjs', import.meta.url).pathname);
    }

    //CONFIG.audio.oscillatorNode = new OscillatorNode(CONFIG.audio.ctx);
    // Create an atomic state for synchronization between Worker and AudioWorklet.

    CONFIG.audio.node = new AudioWorkletNode(CONFIG.audio.ctx, 'radio-processor', {
        processorOptions: {
            pointer: CONFIG.queue.pointer,
            instance: CONFIG.queue.instance
        },
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        channelCount: 2,
        channelCountMode: "max",
        channelInterpretation: "speakers"
    });

    CONFIG.audio.node.connect(CONFIG.audio.ctx.destination);

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

const freeQueueInit = ( CONFIG ) => {

    globalThis["LFreeQueue"] = {
        setStatus:function(e){
            if ( e != "" ) console.log("LFreeQueue: " + e);
        }
    };

    globalThis["LFreeQueue"].onRuntimeInitialized = function() 
    { 
        ///////////////////////////////////////////////////////////////////////////////////////
        // FreeQueue initialization
        ///////////////////////////////////////////////////////////////////////////////////////
        globalThis["LFreeQueue"].callMain("");

        const GetFreeQueueThreads = globalThis["LFreeQueue"].cwrap('GetFreeQueueThreads','number',[ '' ]);
        const GetFreeQueuePointers = globalThis["LFreeQueue"].cwrap('GetFreeQueuePointers','number',[ 'number', 'string' ]);
        const PrintQueueInfo = globalThis["LFreeQueue"].cwrap('PrintQueueInfo','',[ 'number' ]);
        const CreateFreeQueue = globalThis["LFreeQueue"].cwrap('CreateFreeQueue','number',[ 'number', 'number' ]);
        const PrintQueueAddresses = globalThis["LFreeQueue"].cwrap('PrintQueueAddresses','',[ 'number' ]);

        CONFIG.queue.pointer = GetFreeQueueThreads();
        const bufferLengthPtr = GetFreeQueuePointers( CONFIG.queue.pointer, "buffer_length" );
        const channelCountPtr = GetFreeQueuePointers( CONFIG.queue.pointer, "channel_count" );
        const statePtr = GetFreeQueuePointers( CONFIG.queue.pointer, "state" );
        const channelDataPtr = GetFreeQueuePointers( CONFIG.queue.pointer, "channel_data" );

        const pointers = new Object();
        pointers.memory = globalThis["LFreeQueue"].HEAPU8;
        pointers.bufferLengthPointer = bufferLengthPtr;
        pointers.channelCountPointer = channelCountPtr;
        pointers.statePointer = statePtr;
        pointers.channelDataPointer = channelDataPtr;

        CONFIG.queue.instance = FreeQueue.fromPointers( pointers );
        if ( CONFIG.queue.instance != undefined ) CONFIG.queue.instance.printAvailableReadAndWrite();
    }

    initFreeQueue( globalThis["LFreeQueue"] ).then( ( module ) => {		
        module.setStatus("initWasmFreeQueue completed...");
    });

}

const componentInit = ( self, CONFIG ) =>
{
    freeQueueInit(CONFIG);

    CONFIG.html.scope.canvas = self.this.shadowRoot.querySelector("#gfx")
    CONFIG.html.button.start = self.this.shadowRoot.querySelector("#start");

    let wgerr = self.this.shadowRoot.querySelector("#error");
    let wgfx =  CONFIG.html.scope.canvas;

    CONFIG.html.button.radios.this = self.this.shadowRoot.querySelectorAll("input[name='radio-selection']");
    CONFIG.html.button.radios.length = CONFIG.html.button.radios.this.length;

    CONFIG.player.isPlaying = false;

    CONFIG.application.instance = new Application(CONFIG);
    const available = CONFIG.application.instance.check();
    if ( available ) {
        wgerr.style.display = 'none';
        wgfx.style.display = 'block';
    } else {
        wgerr.style.display = 'block';
        wgfx.style.display = 'none';
    }

    CONFIG.application.instance.setCanvas( CONFIG.html.scope.canvas );
    const canvas = CONFIG.application.instance.getCanvas();

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // TODO: canvas resize
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    const scale = window.devicePixelRatio;

    canvas.width = window.innerWidth;
    canvas.height = canvas.width * 3 / 14;

    canvas.height = canvas.height * scale;
    canvas.width = canvas.width * scale;
}

export default async () => {
    return new Promise((resolve, reject) => {
        class wControl {
            /////////////////////////////////////////////////////////////////////////////////////////////
            // component
            /////////////////////////////////////////////////////////////////////////////////////////////
            constructor( self ) 
            {
                componentInit( self, this.CONFIG );

		const CONFIG = this.CONFIG;

                for (let i = 0, max = CONFIG.html.button.radios.length; i < max; i++) {
                    if ( CONFIG.html.button.radios.this[i].checked === true) {
                         CONFIG.stream.path = CONFIG.html.button.radios.this[i].value;
                    }
                }

                for (let i = 0, max = CONFIG.html.button.radios.length; i < max; i++) {
                    CONFIG.html.button.radios.this[i].addEventListener( "change", async (e) => {
                        if (CONFIG.player.isPlaying) {
                            CONFIG.player.isPlaying = false;
                            await CONFIG.stream.song.pause();
                            await CONFIG.audio.ctx.suspend();
                            CONFIG.audio.node.disconnect();
                            CONFIG.stream.song = undefined;
                            CONFIG.audio.ctx = undefined;
                            CONFIG.audio.node = undefined;
                            CONFIG.queue.instance._reset();
                            CONFIG.html.button.start.textContent = "Start Audio";
                            CONFIG.stream.path = e.target.value;
                            if(CONFIG.audio.ctx != undefined && CONFIG.audio.ctx != null) {
                                CONFIG.player.isPlaying = !CONFIG.player.isPlaying;
                                await newAudio(CONFIG);
                            } else {
                                CONFIG.player.isPlaying = !CONFIG.player.isPlaying;
                                await ctx(CONFIG);
                                await newAudio(CONFIG);
                            }
                        } else {
                            CONFIG.stream.path = event.target.value;				
			            }
                    } );
                }

                CONFIG.html.button.start.addEventListener( "click", async (e) => {
                    if (CONFIG.player.isPlaying) {
                        CONFIG.player.isPlaying = false;
                        await CONFIG.stream.song.pause();
                        await CONFIG.audio.ctx.suspend();
                        CONFIG.audio.node.disconnect();
                        CONFIG.stream.song = undefined;
                        CONFIG.audio.ctx = undefined;
                        CONFIG.audio.node = undefined;
                        CONFIG.queue.instance._reset();
                        CONFIG.html.button.start.textContent = "Start Audio";
                    } else {
                        CONFIG.html.button.start.textContent = "Stop Audio";                        
                        CONFIG.player.isPlaying = true;
                        await ctx(CONFIG);
                        await newAudio(CONFIG);
                    }                    
                });

                CONFIG.application.instance.start();
            }

            CONFIG = {
                audio: {
                    ctx: undefined,
                    node: undefined,
                    init: false
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
                    isPlaying: false
                },
                stream: {
                    song: undefined,
                    source: undefined,
                    path: undefined,
                },
                web: {
                    crossOrigin: 'anonymous'
                },
                queue: {
                    instance: undefined,
                    pointer: undefined
		},
                application: {
                    instance: undefined,
                    channels: 2,
                    goniometer: "goniometer-off",
                    holdChart: "holdchart-off",
                    inputType: "default", // "audio"; // "osc"
                    renderType: "stereo",
                    kdX: 500,
                    kdY: 10,
                    zoomX: 100,
                    zoomY: 100,
                    holdBuffer: undefined,
                    renderBuffer: undefined,
                    sampleRate: 44100,
                    volumeRate: 1.0,
                    nameOfFile: "",
                    frameOffset: 0
                }
            };
        }

        resolve(wControl);
    })
}
