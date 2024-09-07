export default () => {
return  `

<html-template>
    <slot name="nk-elite">
        <div class="game-newkind">
            <form class="game-newkind__form">
                <span><input type="checkbox" id="hideMenu">Hide menu</span>
<!--	        <span><input type="checkbox" id="othe" checked=""></span>  -->
            </form>
            <canvas id="nk-elitecanvas" oncontextmenu="event.preventDefault()" style="cursor: default;"></canvas>
        </div>
    </slot>
</html-template>

`
}

