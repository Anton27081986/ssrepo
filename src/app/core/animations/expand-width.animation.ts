import {
	animate,
	AUTO_STYLE,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { AnimationState, DURATION } from '@app/core/animations/animation';

export const expandWidth = trigger('expandWidth', [
	transition(AnimationState.Enter, [
		style({ width: '0%', margin: '0px' }),
		animate(
			`${DURATION}ms ease-out`,
			style({ width: '100%', margin: AUTO_STYLE })
		),
	]),
	transition(AnimationState.Enter, [
		style({ width: '100%', margin: AUTO_STYLE }),
		animate(
			`${DURATION}ms ease-out`,
			style({ width: '0%', margin: '0px' })
		),
	]),
]);
