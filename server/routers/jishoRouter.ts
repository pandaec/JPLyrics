import express from 'express';
import asyncErrorHandle from "../middlewares/asyncErrorHandle";
import * as rp from 'request-promise';

const router = express.Router();

router.get('/', asyncErrorHandle(async (req, res, next) => {
    if (req.query.keyword === undefined) {
        console.log(`req query keyword missing`);
        res.status(400)
            .send('Invalid request');
        return;
    };

    const resultStr = await rp.get(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(req.query.keyword)}`);
    const result = JSON.parse(resultStr);

    if(result.meta && result.meta.status !== 200){
        console.log(`request failed`);
        res.status(400)
            .send('Invalid request');
        return;
    }

    res.json(result.data);
}));

export default router;