import {AbstractControl} from "@angular/forms";

export const charactersValidator = (control: AbstractControl): {[key: string]: any} | null  => {
	const specials = /[!@#$%^&*(),.?":{}|<>]/;
	const hasEspecial = specials.test(control.value);
	return hasEspecial ? { specials: true } : null;
}


