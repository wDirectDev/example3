export default () => {
return  `

<css-template>

.game-newkind__form {
    max-width: 100%;
    padding-left: 0px;
    margin-left: 0px;
    font-family: 'Roboto', sans-serif;
}

:host {
    margin-bottom: 16px;
    box-shadow: 0px 0.47vw 0.94vw 0px #88919d4d;
    box-sizing: border-box;
    padding: 16px 12px;
}

.game-newkind {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.game-newkind__canvas {
    cursor: default;
    width: 800px;
    height: 600px;
}

.game-newkind__btn {
    width: 10em;
    border-radius: 0.8em;
    background: var(--Gosblue, #0D4CD3);
    color: var(--White, #FFF);
    text-align: center;
    font-family: 'Lato', sans-serif;
    font-size: 1.0em;
    font-style: normal;
    font-weight: 400;
    line-height: 2em;
    align-self: center;
    cursor: pointer;
    border: none;
    align-self: flex-start;
}

</css-template>

`
}