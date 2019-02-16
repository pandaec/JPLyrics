import express from 'express';
import { DB } from "../db";
import asyncErrorHandle from "../middlewares/asyncErrorHandle";
import { DBError, ILyrics } from "../typings/lyrics";
import { QueryResult } from 'pg';
import * as kuromoji from 'kuromoji';

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
                slyrics: sr.slyrics.slice(0, 5),
            };
        })
        res.json(result);

    } catch (err) {
        console.log(err);
        res.send('lyrics not found');
    }
})));

router.get('/:sid', (asyncErrorHandle(async (req, res, next) => {
    let song: ILyrics = await db.selectBySongId(req.params.sid);

    const tokenizer = await getTokenizer();
    const result = {
        title: song.title,
        artist: song.artist,
        slyrics: song.slyrics.map(line => tokenizeLine(tokenizer, line)),
    };

    res.json(result);

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

    const result: QueryResult | DBError = await db.insertLyrics(lyricsObj);
    res.json((<QueryResult>result).rows[0]);
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

function tokenizeLine(tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>, line: string) {
    let path = tokenizer.tokenize(line);
    return path.map(w => {
        return {
            'sf': w.surface_form,
            'rd': w.reading,
        }
    });
}

export default router;