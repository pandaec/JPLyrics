import { Pool, QueryResult, Query } from 'pg';
import { DBError, ILyrics, WordToken, Word, Lyrics } from "./typings/lyrics";


export class DB {
    private static db: DB;
    private static config = {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    };
    private pool: Pool;


    private constructor() {
        this.pool = new Pool(DB.config);
    }

    public static getInstance(): DB {
        if (this.db == null) {
            this.db = new DB();
        }
        return this.db;
    }

    public async query(text: string, params?: any[]): Promise<QueryResult | DBError> {
        const client = await this.pool.connect();
        try {
            const start = Date.now();
            const res = await client.query(text, params);
            const duration = Date.now() - start;
            console.log(`executed query ${text}, ${duration}ms`);
            return res;
        } catch (err) {
            console.log(err.stack);
            return { err: 'query failed' };
        } finally {
            client.release();
        }
    }

    public async selectAll(): Promise<ILyrics[]> {
        const res = await this.query('SELECT * FROM lyrics ORDER BY sid DESC');
        if ((<DBError>res).err) {
            throw <DBError>res;
        }

        return (<QueryResult>res).rows;
    }

    public async selectByTitle(title: string): Promise<ILyrics[]> {
        const res = await this.query('SELECT * FROM lyrics WHERE lower(title) LIKE lower($1) ORDER BY sid DESC', [`%${title}%`]);
        if ((<DBError>res).err) {
            throw <DBError>res;
        }

        return (<QueryResult>res).rows;
    }

    public async selectByExactTitle(title: string): Promise<ILyrics[]> {
        const res = await this.query('SELECT * FROM lyrics WHERE title=$1', [title]);
        if ((<DBError>res).err) {
            throw <DBError>res;
        }
        return (<QueryResult>res).rows;
    }

    public async selectBySongId(songId: string): Promise<ILyrics> {
        const res = await this.query('SELECT * FROM lyrics WHERE sid=$1', [`${songId}`]);
        if ((<DBError>res).err) {
            throw <DBError>res;
        }

        if((<QueryResult>res).rows.length === 0){
            throw "Lyrics not found";
        }

        return (<QueryResult>res).rows[0];
    }

    public async insertLyrics(lyrics: ILyrics): Promise<QueryResult> {
        const text = 'INSERT INTO lyrics (title, artist, slyrics) VALUES ($1, $2, $3) RETURNING sid';
        const params = [lyrics.title, lyrics.artist, lyrics.slyrics];
        const res = await this.query(text, params);

        if ((<DBError>res).err) {
            throw <DBError>res;
        }

        return (<QueryResult>res);
    }

    public async insertLyricsWordTokens(sid: string, lyricsTokens:Word[][]) {
        for (let i = 0; i < lyricsTokens.length; i++) {
            const line_res = await this.query('INSERT INTO line (ord, sid) VALUES ($1, $2) RETURNING line_id;', [i, sid]);
            if ((<DBError>line_res).err) {
                throw <DBError>line_res;
            }

            let line_id = (<QueryResult>line_res).rows[0].line_id;
            for (let j = 0; j < lyricsTokens[i].length; j++) {
                let word = lyricsTokens[i][j];
                const word_res = await this.query('INSERT INTO word (ord, basic_form, pos, line_id) VALUES ($1, $2, $3, $4) RETURNING word_id;', [j, word.bf, word.pos, line_id]);
                if ((<DBError>word_res).err) {
                    throw <DBError>word_res;
                }

                let word_id = (<QueryResult>word_res).rows[0].word_id;
                for (let k = 0; k < lyricsTokens[i][j]['tokens'].length; k++) {
                    let token = lyricsTokens[i][j]['tokens'][k];
                    const wt_res = await this.query('INSERT INTO word_token (ord, sf, rd, word_id) VALUES ($1, $2, $3, $4) RETURNING wt_id;', [k, token.sf, token.rd, word_id]);
                    if ((<DBError>wt_res).err) {
                        throw <DBError>wt_res;
                    }
                    let wt_id = (<QueryResult>wt_res).rows[0].wt_id;
                }

            }
        }
    }

    public async fetchLyricsObject(sid: string): Promise<Lyrics> {
        const res = await this.query(`
            SELECT lyrics.title, lyrics.artist, line.line_id, line.ord AS line_order, word.word_id, word.basic_form, word.pos,word_token.sf, word_token.rd
            FROM word_token
            LEFT JOIN word on word_token.word_id = word.word_id
            LEFT JOIN line ON line.line_id = word.line_id
            LEFT JOIN lyrics on lyrics.sid = line.sid
            WHERE lyrics.sid = $1
            ORDER BY line.ord ASC, word.ord ASC, word_token.ord ASC;
        `, [sid]);

        if ((<DBError>res).err) {
            throw <DBError>res;
        }

        let result = (<QueryResult>res).rows;
        let lines: { [key: string]: Word[] } = {};
        let last_word_id = 0;

        if (result.length === 0) {
            throw "Result not found";
        }

        for (let r of result) {
            if (!lines[r.line_order]) {
                lines[r.line_order] = [];
            }
            let word_token: WordToken = { sf: r.sf };
            if (r.rd !== null) {
                word_token['rd'] = r.rd;
            }

            if (r.word_id !== last_word_id) {
                last_word_id = r.word_id;
                let word_obj: Word = {
                    tokens: [
                        word_token
                    ]
                };
                if (r.basic_form !== null) {
                    word_obj.pos = r.pos;
                    word_obj.bf = r.basic_form;
                }

                lines[r.line_order].push(word_obj);
            } else {
                let lineSize = lines[r.line_order].length;
                lines[r.line_order][lineSize - 1]['tokens'].push(word_token);
            }
        }

        let line_order = Object.keys(lines).sort((a: string, b: string) => { return parseInt(a, 10) - parseInt(b, 10); });
        // let slyrics = line_order.map((k: string) => {
        //     return lines[k];
        // });

        // map lyrics by order and add empty array if order is not in sequence
        let slyrics: Word[][] = [];
        for(let i=0;i<line_order.length; i++){
            let a = parseInt(line_order[i], 10);
            if(slyrics.length >= 2 && a - parseInt(line_order[i-1], 10) !== 1){
                slyrics.push([]);
            }
            slyrics.push(lines[a]);
        }

        let lyrics_object: Lyrics = {
            title: result[0].title,
            artist: result[0].artist,
            slyrics: slyrics,
        };

        return lyrics_object;
    }
}