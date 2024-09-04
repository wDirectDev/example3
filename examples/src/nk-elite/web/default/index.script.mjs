export default () => {
return  `

<javascript-template>
	import initWasmElite from "./nk-elite/modules/elite/build/nk-elite.asm.js"
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
			let e = document.getElementById("canvas");
			e.addEventListener("webglcontextlost", function(e){
				alert("WebGL context lost. You will need to reload the page.");
				e.preventDefault();
			})
			return e;
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
