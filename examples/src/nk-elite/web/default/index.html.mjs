export default () => {
return  `

<html-template>
    <slot name="nk-elite">
<!--
	<span id="controls">
		<span><input type="checkbox" id="resize">Resize canvas</span>
		<span><input type="checkbox" id="pointerLock" checked="">Lock/hide mouse pointer</span>
		<span><input type="button" onclick="globalThis['LSDLTest'].requestFullscreen(document.getElementById('pointerLock').checked,document.getElementById('resize').checked)" value="Fullscreen"></span>
	</span>
-->
<!--	<canvas id="canvas-nk-elite" oncontextmenu="event.preventDefault()" style="cursor: default;"></canvas> -->
    </slot>
</html-template>

`
}