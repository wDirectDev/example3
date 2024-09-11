export default () => {
return  `

<html-template>
    <slot name="nk-elite">
        <div class="game-newkind">
            <form class="game-newkind__form">
                <span><input type="checkbox" id="showGameConsole" checked>Show console</span>
                <span><input type="checkbox" id="showScreenName">Show greetings</span>
            </form>
            <button class="game-newkind__btn" id="showAndApply">Apply and Show</button>
            <canvas class="game-newkind__canvas" id="nk-elitecanvas" oncontextmenu="event.preventDefault()"></canvas>
        </div>
    </slot>
</html-template>

`
}

