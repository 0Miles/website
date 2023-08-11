import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ArticleComponent } from './article/article.component';
import { HomeComponent } from './home/home.component';
import { ArticleListComponent } from './article-list/article-list.component';

@NgModule({
    declarations: [
        AppComponent,
        ArticleComponent,
        HomeComponent,
        ArticleListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        InfiniteScrollModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
