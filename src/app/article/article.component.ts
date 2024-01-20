import { AppService } from './../app.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as showdown from 'showdown';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit, OnDestroy {

    @Input() display: DisplayType | string = DisplayType.Full;
    @Input() articleCategory: string | undefined;

    private _articleFileName: string | undefined;
    @Input() set articleFileName(value: string) {
        this._articleFileName = value;
        const article: any = this.appService.articleList[this.articleCategory ?? '']?.find((x: any) => x.name === this.articleFileName);
        if (article) {
            this.content = article.content;
        } else {
            this.isLoading = true;
            this.appService.getArticle(this.articleCategory ?? '', `${this.articleFileName}`)
                .then(result => {
                    this.content = result?.body ?? '';
                    this.isLoading = false;
                })
                .catch(_ => {
                    this.isLoading = false;
                })
        }
    }
    get articleFileName(): string | undefined {
        return this._articleFileName;
    }
    private _content: string = '';
    @Input() set content(value: string) {
        this._content = value;
        this.loadTitle();
        this.loadTag();
        this.loadDate();
        this.loadDesc();
        this.loadPreviewImage();
        if (this.display === DisplayType.Preview) {
            this.preview();
        } else {
            this.converMarkDown();
        }
    }
    get content(): string {
        return this._content;
    }

    converter = new showdown.Converter({
        simplifiedAutoLink: true,
        tables: true,
        openLinksInNewWindow: true,
        smoothLivePreview: true
    });

    isLoading: boolean = false;
    title: string = '';
    underlineTitle: string = '';
    previewWordLimit = 120;
    previewImage: { alt: string, src: string, title: string } = { alt: '', src: '', title: '' };
    date: Date | undefined;
    tags: string[] = [];
    desc: string = '';
    htmlContent: SafeHtml | undefined;

    history = window.history;

    observables: Array<Subscription> = [];

    constructor(
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private titleService: Title,
        private appService: AppService
    ) { }

    ngOnInit(): void {
        this.observables.push(this.route.params.subscribe(params => {
            if (!this.articleCategory) {
                this.articleCategory = params['articleCategory'];
            }
            if (params['articleFileName']) {
                if (!this.display) {
                    this.display = DisplayType.Full;
                }
                if (!this.articleFileName) {
                    this.articleFileName = params['articleFileName'];
                }
            }
        }));
    }

    ngOnDestroy(): void {
        this.observables.forEach(obs => obs.unsubscribe());
    }

    loadTitle(): void {
        const titleRegex = /#\s*(.*)/;
        const titleRegexResult = titleRegex.exec(this._content);
        if (titleRegexResult) {
            this.title = titleRegexResult[1] ?? titleRegexResult[2];
            this.underlineTitle = this.title.replace(/\s/g, '_');
            this._content = this._content.replace(titleRegex, '');
            if (this.display === DisplayType.Full) {
                this.titleService.setTitle(`${this.title} - Miles`);
            }
        }
    }

    loadTag(): void {
        const tagLineRegex = /^(?:``[^`]*``\s*)+$/m;
        const tagLineResult = tagLineRegex.exec(this._content)?.[0] ?? '';

        if (tagLineResult) {
            this._content = this._content.replace(tagLineRegex, '');
            const tagRegex = /``([^`]*)``/g;
            let tagResult: RegExpExecArray | null;
            const tags: string[] = [];

            while ((tagResult = tagRegex.exec(tagLineResult)) !== null) {
                tags.push(tagResult[1]);
            }

            this.tags = tags;
        }
    }

    loadDesc(): void {
        const descRegex = /^desc:\s?(.*)\r*\n*/m;
        const descRegexResult = descRegex.exec(this._content);
        if (descRegexResult) {
            this.desc = descRegexResult[1];
            this._content = this._content.replace(descRegex, '');
        }
    }

    loadDate(): void {
        const dateRegex = /(?:^date:\s*((?!0000)\d{4})[\/-](?:([1-9]|0[1-9]|1[0-2])[\/-]([1-9]|0[1-9]|1\d|2\d|3[0-1])\s*$))/m;
        const dateRegexResult = dateRegex.exec(this._content);
        if (dateRegexResult) {
            this.date = new Date(`${dateRegexResult[0].replace('date:', '').trim()}`);
            this._content = this._content.replace(dateRegex, '');
        }
    }

    loadPreviewImage(): void {
        const imageRegex = /!\[(.*)\]\((.*?)\s*(?:"(.*[^"])")?\s*\)/;
        const imageRegexResult = imageRegex.exec(this._content);
        if (imageRegexResult) {
            this.previewImage = {
                alt: imageRegexResult[1],
                src: imageRegexResult[2] ?? '',
                title: imageRegexResult[3] ?? ''
            };
            this._content = this._content.replace(imageRegex, '');
        }
    }

    preview(): void {

        this._content = `${this._content.substring(0, this.previewWordLimit)}...`;
    }

    converMarkDown(): void {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.converter.makeHtml(this._content));
    }

}

enum DisplayType {
    Full = 'Full',
    Preview = 'Preview'
}
