export default () => {

return `

<css-template>
.audio-newkind__form {
  max-width: 100%;
  padding-left: 0px;
  margin-left: 0px;
  font-family: 'Roboto', sans-serif;
}

.audio-newkind__radio + label:hover {
  cursor: pointer;
}

:host {
    margin-bottom: 16px;
    box-shadow: 0px 0.47vw 0.94vw 0px #88919d4d;
    box-sizing: border-box;
    padding: 16px 12px;
}

.audio-newkind__radio {
  display: none;
}

.audio-newkind__radio + label span {
  border: 2px solid #fff;
  border-radius: 80%;
  font-size: 1.0em;
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 4px 8px 8px 8px;
  padding: 2px;
  text-align: center;
  vertical-align: middle;
}

.audio-newkind__radio:checked + label span {
  background: #7694f4;
}

.audio-newkind {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.audio-newkind__title {
  margin-bottom: 0.5rem;
  font-family: 'Oleo Script', cursive;
  font-size: 1.0em;
  text-align: center;
}

.audio-newkind__btn {
    width: 8em;
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

.audio-newkind__canvas {
    cursor: default;
    width: 1024px;
    display: none;
}

.audio-newkind__error {
    text-align: center;
    width: 100%;
    color: red;
    display: none;
}

.audio-newkind__btn:hover {
    cursor: pointer;
}

</css-template>

`
}
