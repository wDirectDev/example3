export default () => {
return  `

<javascript-template>
	import initWasmElite from "./nk-elite/modules/elite/bin/nk-elite.asm.js"
	globalThis["LEliteTG"] = {
		preRun:[],
		postRun:[],
		print:function(e){
			console.log("print: " + e);			
		},
		printErr:function(e){
			console.error("printErr: " + e);
		},
		canvas:function(){
			return document.getElementById("canvas");
		}(),
		setStatus:function(e){
			if ( e != "" ) console.debug("LEliteTG: " + e);
		},
		totalDependencies:0,
		monitorRunDependencies:function(e){
			this.totalDependencies=Math.max(this.totalDependencies,e);
			this.setStatus(e?"Preparing... ("+(this.totalDependencies-e)+"/"+this.totalDependencies+")":"All downloads complete.")
			this.setStatus("monitorRunDependencies [ " + e + " ]");
		}
	};
	globalThis["LEliteTG"].onRuntimeInitialized = function() { 
		globalThis["LEliteTG"].callMain("");
		globalThis["LEliteTG"].setStatus("onRuntimeInitialized");
	};
	globalThis["LEliteTG"].setStatus("Downloading...");
	initWasmElite(globalThis["LEliteTG"]).then( function (Module) {
		Module.setStatus("initWasmElite");
	});
</javascript-template>

`
}
