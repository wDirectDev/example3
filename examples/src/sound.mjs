export class wDSound
{
    constructor() 
    {
    }  
    destroy() 
    {
    }
    concatenate(a, b) { // a, b TypedArray of same type
        let c = new (a.constructor)(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    }
    async loadSoundData( url ) 
    {
        let response = await fetch(
            new URL( url, window.location.href ).toString()
        );
/*
        let a = new ArrayBuffer();
    
        let total = 0;
        for await (const chunk of response.body) {
            total += chunk.length;
            a = concatenate( a, chunk );
            console.log("chunk: " + chunk.length);
        }
        // Do something with the total
        console.log("total: " + total);
    
        return a;
*/
        return await response.arrayBuffer();
    }
};
