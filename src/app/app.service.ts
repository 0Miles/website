import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { assetsList } from '../assets-list'

@Injectable({
    providedIn: 'root'
})

export class AppService {

    articleList: any = {};
    lastArticleIndex: any = {};
    articleFileNameList: any = {};
    noMore: any = {};
    isLoading = false;

    constructor(
        private http: HttpClient
    ) { }

    async loadArticles(count: number, category: string): Promise<void> {
        if (!this.noMore[category] && !this.isLoading) {
            this.isLoading = true;
            
            if (typeof this.lastArticleIndex[category] === 'undefined') {
                this.lastArticleIndex[category] = 0;
            }
            const currentLastArticleIndex = this.lastArticleIndex[category];

            const results = await Promise.allSettled(this.getArticles(category, currentLastArticleIndex, count));
            for (const [index, result] of results.entries()) {
                if (result.status === 'fulfilled') {
                    if (!this.articleList[category]) {
                        this.articleList[category] = [];
                    }
                    this.articleList[category].push(
                        {
                            name: this.articleFileNameList[category][currentLastArticleIndex + index],
                            content: result.value?.body ?? ''
                        }
                    );
                }
            }
            this.lastArticleIndex[category] = currentLastArticleIndex + count + 1;
            this.isLoading = false;
        }
    }

    getArticles(category:string, startIndex: number, count: number): Array<Promise<HttpResponse<string>>> {
        const promises = [];

        if (!this.articleFileNameList[category]) {
            this.articleFileNameList[category] = assetsList.filter(x => x.startsWith(`articles/${category}`)).map(x => x.replace(`articles/${category}/`, '').replace(/\.\w+$/, ''));
        }
        for (let i = 0; i <= count; i++) {
            const index = startIndex + i;
            console.log(index)
            if (this.articleFileNameList[category][index]) {
                promises.push(this.getArticle(category, this.articleFileNameList[category][index]));
            } else {
                this.noMore[category] = true;
                break;
            }
        }
        return promises;
    }

    getArticle(category:string, filename: string): Promise<HttpResponse<string>> {
        return this.get(`assets/articles/${category}/${filename}.md`);
    }

    get(url: string, params?: HttpParams | { [param: string]: string | string[] }, headers?: HttpHeaders): Promise<HttpResponse<string>> {
        return firstValueFrom(this.http.get(url, {
            headers,
            params,
            observe: 'response',
            responseType: 'text',
        }));
    }
}
