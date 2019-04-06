// utf-8 reference
// http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
const jpUtils = {
    isKanji: function(ch){
        return (ch >= "\u4e00" && ch <= "\u9faf") || (ch >= "\u3400" && ch <= "\u4dbf");
    },

    isHiragana: function(ch){
        return (ch >= "\u3040" && ch <= "\u309f");
    },

    isKatakana: function(ch){
        return (ch >= "\u30a0" && ch <= "\u30ff");
    },

    hasHiragana: function(sentence){
        if(typeof sentence !== 'string'){
            console.error("invalid params: sentence must be string");
            return;
        }
        return sentence.split('').some(this.isHiragana);
    },

    hasKanji: function(sentence){
        if(typeof sentence !== 'string'){
            console.error("invalid params: sentence must be string");
            return;
        }
        return sentence.split('').some(this.isKanji);
    },

    toHiragana: function(sentence){
        if(typeof sentence !== 'string'){
            console.error("invalid params: sentence must be string");
            return;
        }
        
        const OFFSET = 96;
        let result = [];
        for(let c of sentence){
            if(this.isKatakana(c)){
                let charCode = c.charCodeAt(0);
                result.push(String.fromCharCode(charCode - OFFSET));
            }else{
                result.push(c);
            }
        }
        return result.join('');
    },

    toKatakana: function(sentence){
        if(typeof sentence !== 'string'){
            console.error("invalid params: sentence must be string");
            return;
        }
        
        const OFFSET = 96;
        let result = [];
        for(let c of sentence){
            if(this.isHiragana(c)){
                let charCode = c.charCodeAt(0);
                result.push(String.fromCharCode(charCode + OFFSET));
            }else{
                result.push(c);
            }
        }
        return result.join('');
    }
}

export default jpUtils;
