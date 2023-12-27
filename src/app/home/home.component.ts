import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private titleService: Title
    ) { }

    @ViewChild('navShowPoint') navShowPoint: ElementRef<HTMLDivElement> | undefined
    @ViewChild('navStaticPoint') navStaticPoint: ElementRef<HTMLDivElement> | undefined
    @ViewChild('about') about: ElementRef<HTMLDivElement> | undefined

    isNavShow = false;
    isNavStatic = false;
    pageCoverBottom = 0;
    lastScrollTop = 0;
    isHeaderShow = false;

    ngOnInit(): void {
        this.titleService.setTitle(`Miles`);
    }

    ngAfterViewChecked(): void {
        setTimeout(() => {
            this.isHeaderShow = true;
        });
    }

    scrollTo(element: HTMLElement) {
        element.scrollIntoView({behavior: 'smooth'});
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event: any) {
        const scrollTop = this.document.documentElement.scrollTop;
        this.pageCoverBottom = scrollTop * -1;

        if (scrollTop > this.lastScrollTop) {
            if (this.isNavShow === false && scrollTop >= (this.navShowPoint?.nativeElement.offsetTop ?? 0)) {
                this.isNavShow = true;
            }

            if (this.isNavStatic === false && scrollTop >= (this.navStaticPoint?.nativeElement.offsetTop ?? 0)) {
                this.isNavStatic = true;
            }
            
        } else {
            if (this.isNavShow === true && scrollTop < (this.navShowPoint?.nativeElement.offsetTop ?? 0)) {
                this.isNavShow = false;
            }

            if (this.isNavStatic === true && scrollTop < (this.navStaticPoint?.nativeElement.offsetTop ?? 0)) {
                this.isNavStatic = false;
            }
        }
        this.lastScrollTop = scrollTop;
    }
}
