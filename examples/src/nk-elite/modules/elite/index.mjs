const init = (self) => {

}

export default async () => {
    return new Promise((resolve, reject) => {
        class wControl {
            constructor(self) {
                init(self)
            }
        }
        resolve(wControl)
    })
}