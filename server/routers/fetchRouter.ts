import express from 'express';
import asyncErrorHandle from "../middlewares/asyncErrorHandle";
import Fetcher from '../fetcher';
import * as rp from 'request-promise';

const router = express.Router();

router.get('/search/:keyword', asyncErrorHandle(async (req, res, next) => {
    let sr = await Fetcher.JLyrics.getSearchResult(req.params.keyword, 2);
    res.json(sr);
}));

router.get('/lyrics', asyncErrorHandle(async (req, res, next) => {
    console.log(req.query.path)
    if (req.query.aid === undefined || req.query.lid === undefined) {
        console.log(`req query keyword missing`);
        res.status(400)
            .send('Invalid request');
        return;
    };

    let r = await Fetcher.JLyrics.getLyrics(req.query.aid, req.query.lid);
    res.json(r);
}));

export default router;