import * as cheerio from 'cheerio';
import * as rp from 'request-promise';
import * as requestPromise from 'request-promise';
import * as he from 'he';
import {RequestPromise} from 'request-promise';
import {ISearchResult} from "./typings/fetcher";

const JLyrics = {
    async getSearchResult(searchStr: string, pageLimit = 3): Promise<ISearchResult[]> {
        searchStr = encodeURIComponent(searchStr);

        try {
            const $ = await rp.get(JLyrics.getOption(searchStr, 0));

            let result = $('#mnb>.bdy')
                .map((i: number, el: CheerioElement) => JLyrics.extractSearchResult($, el, 1))
                .get();

            // if more than one page
            const pageCount: number = $('#pager a').length;
            if (pageCount > 0) {
                const pageRequests = this.getPageRequest(searchStr, pageLimit, pageCount);
                const requestResults = await Promise.all(pageRequests);

                const r2 = requestResults.map(($, pageNum) => {
                    return $('#mnb>.bdy')
                        .map((i: number, el: CheerioElement) => JLyrics.extractSearchResult($, el, pageNum + 2))
                        .get();
                })

                result = result.concat(...r2);
            }
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    async getLyrics(aid: string, lid: string): Promise<string[]> {
        const lyricsUri = `http://j-lyric.net/artist/${aid}/${lid}.html`;
        const options = {
            uri: lyricsUri,
            transform: (body: string) => cheerio.load(body)
        };
        try {
            const $ = await rp.get(options);
            const lyricsSelector = $('#Lyric');

            if (lyricsSelector == null) return;

            let result : string[] = lyricsSelector.html().split('<br>').map(he.decode);
            if(result.length > 0){
                if(result[result.length - 1].trim() === ''){
                    result.pop();
                }
            }
            return result;
        } catch (error) {
            console.log(error);
        }
    },


    getOption: function (searchStr: string, pageNum: number): requestPromise.Options {
        return {
            uri: `http://search.j-lyric.net/index.php?p=${pageNum + 1}&ex=on&ct=2&ca=2&cl=2&kt=${searchStr}`,
            transform: (body: string) => cheerio.load(body)
        };
    },

    getPageRequest: function (searchStr: string, pageCount: number, pageLimit: number): RequestPromise[] {
        const c = Math.min(pageCount, pageLimit);
        let pageRequests = [];
        for (let i = 1; i < c; i++) {
            pageRequests.push(rp.get(JLyrics.getOption(searchStr, i)));
        }
        return pageRequests;
    },

    extractSearchResult($: any, el: CheerioElement, pageNum: number): ISearchResult {
        const link = $(el).find('.mid a').attr('href');
        const m = link.match(/j-lyric.net\/artist\/(a.+)\/(l.+).html/);
        const aid = m[1];
        const lid = m[2];

        return {
            aid: aid,
            lid: lid,
            name: $(el).find('.mid a').text(),
            artist: $(el).find('.sml').eq(0).text().replace(/歌：/, ''),
            content: $(el).find('.sml').eq(1).text().replace(/歌詞：/, ''),
            page: pageNum,
        };
    },

}

export default {JLyrics};
// async function main() {
//     let r = await JLyrics.getSearchResult('青空', 2);
//     console.log(r);
//     let y = await JLyrics.getLyrics('http://j-lyric.net/artist/a05a84b/l03d422.html');
//     console.log(y);
//     return r;
// }

// main();


