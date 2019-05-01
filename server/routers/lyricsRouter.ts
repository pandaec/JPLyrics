import express from 'express';
import { DB } from "../db";
import asyncErrorHandle from "../middlewares/asyncErrorHandle";
import { DBError, ILyrics, Lyrics, Word } from "../typings/lyrics";
import { QueryResult } from 'pg';
import * as kuromoji from 'kuromoji';
import jpUtils from "../logic/jpUtils";

const router = express.Router();
const db = DB.getInstance();

router.get('/search', (asyncErrorHandle(async (req, res, next) => {
    try {
        let searchResults: ILyrics[];
        if (req.query.q) {
            searchResults = await db.selectByTitle(req.query.q);
        } else {
            searchResults = await db.selectAll();
        }

        const result = searchResults.map(sr => {
            return {
                sid: sr.sid,
                title: sr.title,
                artist: sr.artist,
                slyrics: sr.slyrics.filter(s => s.length > 0).slice(0, 3),
            };
        })
        res.json(result);

    } catch (err) {
        console.log(err);
        res.send('lyrics not found');
    }
})));

router.get('/:sid', (asyncErrorHandle(async (req, res, next) => {
    try {
        let song: Lyrics = await db.fetchLyricsObject(req.params.sid);

        res.json(song);
    } catch (e) {
        switch (e) {
            case "Result not found":
                // for old result that doesn't already have word tokens generated
                let lyricsObj: ILyrics;
                try {
                    lyricsObj = await db.selectBySongId(req.params.sid);
                } catch (ex) {
                    // lyrics info not exist
                    console.error(ex);
                    res.status(404).send("lyrics not found");
                    return;
                }

                // insert lyrics tokens (other table)
                const tokenizer = await getTokenizer();
                const lyricsTokens: Word[][] = lyricsObj.slyrics.map(line => tokenizeLine(tokenizer, line));

                await db.insertLyricsWordTokens(req.params.sid, lyricsTokens);

                let song: Lyrics = await db.fetchLyricsObject(req.params.sid);
                res.json(song);

                break;

            default:
                console.error(e);
                res.status(500);
                break;
        }

    }
})));

router.post('/', asyncErrorHandle(async (req, res, next) => {
    const lyricsObj: ILyrics = req.body;

    if (typeof lyricsObj.artist !== 'string' ||
        typeof lyricsObj.title !== 'string' ||
        !Array.isArray(lyricsObj.slyrics)) {
        res.status(400)
            .send('Invalid request');
        return;
    }

    // check if song already exists
    try {
        let searchResult: ILyrics[] = await db.selectByExactTitle(lyricsObj.title);
        if (searchResult.length > 0) {
            res.json({
                'err': 'song_duplicate',
                'sid': searchResult[0].sid
            });
            return;
        }

        // insert lyrics info (lyrics table)
        const result: QueryResult = await db.insertLyrics(lyricsObj);
        const sid: string = (<QueryResult>result).rows[0].sid;

        // insert lyrics tokens (other table)
        const tokenizer = await getTokenizer();
        const lyricsTokens: Word[][] = lyricsObj.slyrics.map(line => tokenizeLine(tokenizer, line));

        await db.insertLyricsWordTokens(sid, lyricsTokens);
        res.json({ "sid": sid });

    } catch (err) {
        console.error(err);
        res.status(500);
    }

}));

async function getTokenizer(): Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> {
    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' })
            .build((err, tokenizer) => {
                if (err) return reject(err);

                return resolve(tokenizer);
            });
    });
}

function tokenizeLine(tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>, line: string): any[] {
    let path = tokenizer.tokenize(line);
    let result: any[] = [];
    for (let word of path) {
        if (!jpUtils.hasJapanese(word.surface_form)) {
            // non-japanese character
            // result.push(word.surface_form);
            result.push({
                tokens: [{
                    sf: word.surface_form,
                }]
            });
        }
        else {
            let r = [];
            const hasKana = jpUtils.hasKana(word.surface_form);
            const hasKanji = jpUtils.hasKanji(word.surface_form);
            if (hasKana && hasKanji) {
                // mixed
                r = tokenizeKanji(word);
            } else if (hasKana) {
                // only kana
                r.push({
                    sf: word.surface_form,
                });
            } else if (hasKanji) {
                // only kanji
                r.push({
                    sf: word.surface_form,
                    rd: word.reading,
                });
            } else {
                console.error("unexpected non-japanese input", word.surface_form);
            }

            result.push({
                tokens: r,
                pos: word.pos,
                bf: word.basic_form,
            });
        }
    }
    return result;
}

function tokenizeKanji(word: kuromoji.IpadicFeatures) {
    if (!word.reading) return [word.surface_form, ''];

    let hirakata = word.surface_form
        .split(jpUtils.kanjiRegex)
        .filter(s => s !== "");
    let customRegex = `(.*)`;
    for (let token of hirakata) {
        customRegex += jpUtils.toHiragana(token) + `(.*)`;
    }
    const kanjiTokens = jpUtils
        .toHiragana(word.surface_form)
        .match(customRegex)
        .filter(s => s !== "")
        .slice(1);
    const readingTokens = jpUtils
        .toHiragana(word.reading)
        .match(customRegex)
        .filter(s => s !== "")
        .slice(1);

    let r = [];

    if (word.surface_form.indexOf(kanjiTokens[0]) < word.surface_form.indexOf(hirakata[0])) {
        for (let i = 0; i < kanjiTokens.length; i++) {
            r.push({
                sf: kanjiTokens[i],
                rd: jpUtils.toKatakana(readingTokens[i])
            });
            if (hirakata[i]) {
                r.push({
                    sf: hirakata[i]
                });
            }
        }
    } else {
        for (let i = 0; i < hirakata.length; i++) {
            r.push({
                sf: hirakata[i]
            });
            if (kanjiTokens[i]) {
                r.push({
                    sf: kanjiTokens[i],
                    rd: jpUtils.toKatakana(readingTokens[i])
                });
            }
        }
    }
    return r;
}

export default router;