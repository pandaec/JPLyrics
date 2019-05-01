// utf-8 reference
// http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
const jpUtils = {
    hiraganaRegex: /[\u3040-\u309f]/,
    katakanaRegex: /[\u30a0-\u30ff]/,
    kanaRegex: /[\u3040-\u309f\u30a0-\u30ff]/,
    kanjiRegex: /[\u4e00-\u9faf\u3400-\u4dbf\u3005]/,
    japRegex: /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf\u3005]/,
    specialCharEngRegex: /[A-Za-z\][,!@#$%^&*() \]\u3000-\u3004\u3006-\u303f\uff00-\uff65\uffa0-\uffef]/,
    hasHiragana: function(sentence : string){
        return sentence.match(this.hiraganaRegex) !== null;
    },

    hasKatakana: function(sentence : string){
        return sentence.match(this.katakanaRegex) !== null;
    },

    hasKana: function(sentence: string){
        return sentence.match(this.kanaRegex) !== null;        
    },

    hasKanji: function(sentence : string){
        return sentence.match(this.kanjiRegex) !== null;
    },

    hasSpecialCharOrEng: function(sentence : string){
        return sentence.match(this.specialCharEngRegex) !== null;
    },

    hasJapanese: function(sentence : string){
        return sentence.match(this.japRegex) !== null;
    },

    toHiragana: function(sentence : string){
        
        const OFFSET = 96;
        let result = [];
        for(let c of sentence){
            if(this.hasKatakana(c)){
                let charCode = c.charCodeAt(0);
                result.push(String.fromCharCode(charCode - OFFSET));
            }else{
                result.push(c);
            }
        }
        return result.join('');
    },

    toKatakana: function(sentence : string){
        if(typeof sentence !== 'string'){
            console.error("invalid params: sentence must be string");
            return;
        }
        
        const OFFSET = 96;
        let result = [];
        for(let c of sentence){
            if(this.hasHiragana(c)){
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
