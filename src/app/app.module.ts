import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ArticleComponent } from './article/article.component';
import { HomeComponent } from './home/home.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { RouterModule, Routes, provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router'
import { ImageComponent } from './image/image.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: ':articleCategory/:articleFileName',
        component: ArticleComponent
    }
];

@NgModule({
    declarations: [
        AppComponent,
        ArticleComponent,
        HomeComponent,
        ArticleListComponent,
        ImageComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        InfiniteScrollModule
    ],
    providers: [
        provideRouter(
            routes,
            withViewTransitions(),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        )
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
