import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
})

export class ImageComponent implements AfterViewInit {
    @ViewChild('image') image: ElementRef<HTMLImageElement> | any;
    @ViewChild('placeholder') placeholder: ElementRef<HTMLDivElement> | any;

    @Input() src: string = '';
    @Input() alt: string = '';
    @Input() className: string = '';

    ngAfterViewInit() {
        this.image.nativeElement.onload = () => {
            this.onImageLoad();
        };
    }

    onImageLoad() {
        this.placeholder.nativeElement.style.display = 'none';
        this.image.nativeElement.style.opacity = 1;
    }
}