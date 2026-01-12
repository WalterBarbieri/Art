import {Directive, ElementRef, HostListener, OnInit, AfterViewInit} from '@angular/core';

@Directive({
    selector: '[appTextareaAutoresize]',
    standalone: true
})
export class TextareaAutoresizeDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.resize(), 0);
  }

  @HostListener('input')
  onInput(): void {
    this.resize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resize();
  }

  private resize(): void {
    this.elementRef.nativeElement.style.height = '0';
    this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.scrollHeight + 'px';
  }
}
