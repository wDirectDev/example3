window.getDrawParams = () => {
    return {
        draw: [
            { 
                func: (x) => { 
                    return Math.sin( x ); 
                }, 
                coords: { 
                    x: { 
                        min: -2.0 * Math.PI, 
                        max: 2.0 * Math.PI
                    }, 
                    y: { 
                        min: -1.0, 
                        max: 1.0
                    }, 
                    axis: false,
                    color: [ 1.0, 0.0, 0.0, 1.0 ],
                },
                dpoints: false,
                dcolor: [ 1.0, 1.0, 1.0, 1.0 ],
            },
            { 
                func: (x) => { 
                    return Math.sin( x + 2 * Math.PI / 3 ); 
                }, 
                coords: { 
                    x: { 
                        min: -2.0 * Math.PI, 
                        max: 2.0 * Math.PI
                    }, 
                    y: { 
                        min: -1.0, 
                        max: 1.0
                    }, 
                    axis: false,
                    color: [ 0.0, 1.0, 0.0, 1.0 ],
                },
                dpoints: true,
                dcolor: [ 1.0, 0.0, 1.0, 1.0 ],
            },
            { 
                func: (x) => { 
                    return Math.sin( x + 3 * Math.PI / 3 ); 
                }, 
                coords: { 
                    x: { 
                        min: -2 * Math.PI, 
                        max: 2 * Math.PI
                    }, 
                    y: { 
                        min: -1.0, 
                        max: 1.0
                    }, 
                    axis: false,
                    color: [ 0.0, 0.0, 1.0, 1.0 ],
                },
                dpoints: false,
                dcolor: [ 0.0, 0.0, 1.0, 1.0 ],
            }
        ]
    };
};