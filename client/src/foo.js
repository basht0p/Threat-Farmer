function generatePassword(passLength, unambiguousCharset=false) {

    if(unambiguousCharset){
        var charset = ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@$%<^>*-=+?._()&").split('')
    } else {
        var charset = ("abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@$%<^>*=+?_&").split('')
    }
    
    let retVal = "";
    const getRandomIntInclusive = (min, max, len) => {
        const randomBuffer = new Uint32Array(len);
        
        window.crypto.getRandomValues(randomBuffer);
    
        let randomIntArray = [];
        for ( let i = 0; i < len; i++ ) {
            min = Math.ceil(min);
            max = Math.floor(max);
            randomIntArray.push(Math.floor((randomBuffer[i] / (0xffffffff + 1)) * (max - min + 1)) + min)
        }
        return randomIntArray
    }
    let indexSeed = getRandomIntInclusive(0, (charset.length - 1), passLength)
    for ( let i = 0; i < passLength; i++ ) {
        retVal = retVal + charset[indexSeed[i]]
    }
    return retVal;
}