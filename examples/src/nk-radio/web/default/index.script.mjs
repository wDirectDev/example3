export default () => {
return `

<javascript-template>
	import initWasmFreeQueue from "./free-queue/free-queue.asm.js"
	import FreeQueue from "./free-queue/free-queue.js"
	globalThis["LFreeQueue"] = {
		setStatus:function(e){
			if ( e != "" ) console.log("LFreeQueue: " + e);
		}
	};
	globalThis["LFreeQueue"].onRuntimeInitialized = function() { 
		globalThis["queue"] = undefined;
		globalThis["instance"] = undefined;
		///////////////////////////////////////////////////////////////////////////////////////
		// FreeQueue initialization
		///////////////////////////////////////////////////////////////////////////////////////
		globalThis["LFreeQueue"].callMain("");
		const GetFreeQueueThreads = globalThis["LFreeQueue"].cwrap('GetFreeQueueThreads','number',[ '' ]);
		const GetFreeQueuePointers = globalThis["LFreeQueue"].cwrap('GetFreeQueuePointers','number',[ 'number', 'string' ]);
		const PrintQueueInfo = globalThis["LFreeQueue"].cwrap('PrintQueueInfo','',[ 'number' ]);
		const CreateFreeQueue = globalThis["LFreeQueue"].cwrap('CreateFreeQueue','number',[ 'number', 'number' ]);
		const PrintQueueAddresses = globalThis["LFreeQueue"].cwrap('PrintQueueAddresses','',[ 'number' ]);
		globalThis["instance"] = GetFreeQueueThreads();
		const bufferLengthPtr = GetFreeQueuePointers( globalThis["instance"], "buffer_length" );
		const channelCountPtr = GetFreeQueuePointers( globalThis["instance"], "channel_count" );
		const statePtr = GetFreeQueuePointers( globalThis["instance"], "state" );
		const channelDataPtr = GetFreeQueuePointers( globalThis["instance"], "channel_data" );
		const pointers = new Object();
		pointers.memory = globalThis["LFreeQueue"].HEAPU8;
		pointers.bufferLengthPointer = bufferLengthPtr;
		pointers.channelCountPointer = channelCountPtr;
		pointers.statePointer = statePtr;
		pointers.channelDataPointer = channelDataPtr;
		globalThis["queue"] = FreeQueue.fromPointers( pointers );
		if ( globalThis["queue"] != undefined ) globalThis["queue"].printAvailableReadAndWrite();
		globalThis["LFreeQueue"].setStatus("onRuntimeInitialized");
	};
	initWasmFreeQueue(globalThis["LFreeQueue"]).then( ( Module ) => {
                Module.setStatus("initWasmFreeQueue");
	});		
</javascript-template>

`
}