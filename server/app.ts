import express, { NextFunction, Request, Response } from 'express';
import lyricsRouter from './routers/lyricsRouter';
import jishoRouter from './routers/jishoRouter';
import fetchRouter from './routers/fetchRouter';

import cors from "./middlewares/cors";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/api/lyrics', lyricsRouter);
app.use('/api/jisho', jishoRouter);
app.use('/api/fetch', fetchRouter);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`listening on port ${port}`));