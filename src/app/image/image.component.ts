import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html'
})

export class ImageComponent implements AfterViewInit {
    @ViewChild('image') image: ElementRef<HTMLImageElement> | undefined;
    @ViewChild('placeholder') placeholder: ElementRef<HTMLDivElement> | undefined;

    @Input() src: string = '';
    @Input() alt: string = '';
    @Input() className: string = '';

    ngAfterViewInit() {
        if (this.image) {
            this.image.nativeElement.onload = () => {
                this.onImageLoad();
            };
        } 
    }

    onImageLoad() {
        if (this.placeholder) {
            this.placeholder.nativeElement.style.display = 'none';
        }
        if (this.image) {
            this.image.nativeElement.style.opacity = '1';
        } 
    }
}