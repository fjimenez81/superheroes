import { Directive, HostListener, ElementRef } from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
	standalone: true,
	selector: '[appUppercase]'
})
export class UppercaseDirective {
	constructor(private el: ElementRef, private control: NgControl) {}

	@HostListener('input', ['$event']) onInputChange(): void {
		const uppercasedValue = this.el.nativeElement.value.toUpperCase();
		this.control.control?.setValue(uppercasedValue, { emitEvent: false });
	}
}
