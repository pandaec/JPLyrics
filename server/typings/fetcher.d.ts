declare namespace fetcher{
    interface ISearchResult {
        aid: string,
        lid: string,
        name: string,
        artist: string,
        content: string,
        page: number
    }
}

export = fetcher