import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[scrollToAnchor]',
})
export class ScrollToAnchorDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault()

    const targetId = this.el.nativeElement.getAttribute('href').substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const offset = 85
      const targetPosition = targetElement.offsetTop - offset

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }
  }
}
