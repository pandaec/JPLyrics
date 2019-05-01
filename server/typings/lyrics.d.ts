declare namespace lyrics {
    interface DBError {
        err: string
    }
    interface ILyrics {
        sid: string,
        title: string,
        artist: string,
        slyrics: string[]
    }

    interface WordToken {
        sf: string,
        rd?: string,
    }

    interface Word{
        tokens: WordToken[],
        bf?: string,
        pos?: string,
    }

    interface Lyrics{
        title: string,
        artist: string,
        slyrics:Word[][],
    }
}

export = lyrics