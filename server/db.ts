import { Pool, QueryResult, Query } from 'pg';
import { DBError, ILyrics } from "./typings/lyrics";


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
        const res = await this.query('SELECT * FROM lyrics WHERE title LIKE $1 ORDER BY sid DESC', [`%${title}%`]);
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

}