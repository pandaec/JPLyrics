declare namespace lyrics{
    interface DBError{
        err: string
    }
    interface ILyrics{
        sid: string,
        title: string,
        artist: string,
        slyrics: string[]
    }
}

export = lyrics