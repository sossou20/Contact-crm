import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

/** Focuses the host element once the view is ready. */
@Directive({ selector: '[appAutofocus]' })
export class AutofocusDirective implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    this.el.nativeElement.focus();
  }
}