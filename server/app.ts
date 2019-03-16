const result = require('dotenv').config();
if(result.error){
    throw result.error;
}

import express, { NextFunction, Request, Response } from 'express';
import lyricsRouter from './routers/lyricsRouter';
import jishoRouter from './routers/jishoRouter';
import fetchRouter from './routers/fetchRouter';

import cors from "./middlewares/cors";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('dist'));
app.use(cors);

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: `${__dirname}/dist`});
});

app.use('/api/lyrics', lyricsRouter);
app.use('/api/jisho', jishoRouter);
app.use('/api/fetch', fetchRouter);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`listening on port ${port}`));