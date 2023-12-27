import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

    loadQuantity = 5;
    category = 'works';

    constructor(
        public appService: AppService
    ) { }

    getArticleList() {
        return this.appService.articleList[this.category] ?? [];
    }

    ngOnInit(): void {
    }

    onScrollDown(): void {
        this.appService.loadArticles(this.loadQuantity, this.category);
    }
}
