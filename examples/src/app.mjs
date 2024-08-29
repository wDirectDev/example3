import { wDApplication } from './renderer.mjs';
import { wDSound } from './sound.mjs';

try {
    globalThis["loadfile"] = function( nameoffile ) {
		try {
			const binary = new wDSound();
			return binary.loadSoundData( nameoffile );
		}
		catch( e ) 
		{
			console.log( "exception: " + e );
			throw( e );
		}	
    };
    globalThis["onApplicationInit"] = function() {
		try {
			const renderer = new wDApplication();

			renderer.check();
			const canvas = renderer.getCanvas();

			const devicePixelRatio = globalThis.devicePixelRatio;

			canvas.width = globalThis.innerWidth;

			/////////////////////////////////////////////////////////////////////////////////////////
			// canvas.width = Math.max( canvas.clientWidth * devicePixelRatio, _width );
			// canvas.height = Math.max( canvas.clientHeight * devicePixelRatio, height );
			/////////////////////////////////////////////////////////////////////////////////////////
			
			/////////////////////////////////////////////////////////////////////////////////////////
			// 4:3  &&  16:9  &&  26:9
			/////////////////////////////////////////////////////////////////////////////////////////
			// canvas.height = canvas.width * 3 / 4;  
			canvas.height = canvas.width * 9 / 54;  

			canvas.height = canvas.height * devicePixelRatio;
			canvas.width = canvas.width * devicePixelRatio;

			/////////////////////////////////////////////////////////////////////////////////////////
			// console.log("set width: " + canvas.width + "; set height: " + canvas.height);
			/////////////////////////////////////////////////////////////////////////////////////////

			globalThis["channels"] = 2;
			globalThis["holdChart"] = false;

			globalThis["isPlaybackInProgress"] = false;
			globalThis["goniometer"] = "goniometer-off";

			globalThis["renderType"] = "stereo";
            globalThis["inputType"] = "default"; //"audio"; // "osc"

			globalThis["kdX"] = 500;
			globalThis["kdY"] = 10;
			globalThis["zoomX"] = 100;
			globalThis["zoomY"] = 100;

			globalThis["holdBuffer"] = undefined;
			globalThis["renderBuffer"] = undefined;		

			globalThis["sampleRate"] = 44100;
			globalThis["volumeRate"] = 1.0;
			
			globalThis["nameoffile"] = "";

			return { ready: renderer.start() };
		} 
		catch( e ) 
		{
			console.log( "exception: " + e );
			throw( e );
		}
    };
    globalThis["startplayback"] = async function()
    {
		globalThis["isPlaybackInProgress"] = true;
		if (globalThis["audioCtx"] == undefined) {
			globalThis["audioCtx"] = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
		}
		await globalThis["audioCtx"].audioWorklet.addModule("./nk-radio/modules/radio/radio-processor.mjs");		 
		globalThis["audioCtx"].suspend();
		globalThis["audioElement"] = globalThis.document.getElementById("audiostream");
		if (globalThis["audioSrc"] == undefined) {
			globalThis["audioSrc"] = globalThis["audioCtx"].createMediaElementSource(globalThis["audioElement"]);
		}
		if (globalThis["audioSrc"]) {
			globalThis["audioSrc"].connect(globalThis["audioCtx"].destination);
		}	
		if (globalThis["audioWorklet"] == undefined) {
			globalThis["audioWorklet"] = new AudioWorkletNode(globalThis["audioCtx"], "radio-processor", {
				processorOptions: {
					queue: globalThis["queue"],
					instance: globalThis["instance"],
				},
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2],
				channelCount: 2,
				channelCountMode: "max",
				channelInterpretation: "speakers"
			});
			globalThis["audioWorklet"].connect(globalThis["audioCtx"].destination);
		}
		globalThis["audioSrc"].connect(globalThis["audioWorklet"]);
		globalThis["audioCtx"].resume();
		globalThis["audioElement"].play();
		
    }
    globalThis["stopplayback"] = async function() {
		globalThis["isPlaybackInProgress"] = false;

		globalThis["renderBuffer"] = undefined;
		globalThis["audioAnalyser"] = undefined;

		globalThis["audioElement"].pause();
    }
} 
catch( e ) 
{
	console.log( "exception: " + e );
	throw( e );
}