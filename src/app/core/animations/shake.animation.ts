import { animate, query, style, transition, trigger } from '@angular/animations';

const shakeAnimation = [
	style({ transform: 'rotate(0)' }),
	animate('0.1s', style({ transform: 'rotate(0.5deg)' })),
	animate('0.1s', style({ transform: 'rotate(-0.5deg)' })),
	animate('0.1s', style({ transform: 'rotate(0.5deg)' })),
	animate('0.1s', style({ transform: 'rotate(0)' })),
];

export const queryShake = [
	trigger('queryShake', [
		transition('* => *', [query('.mat-row', shakeAnimation, { optional: true })]),
	]),
];
