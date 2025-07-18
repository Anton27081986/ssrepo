import {
	animate,
	AnimationTriggerMetadata,
	AUTO_STYLE,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import {
	AnimationState,
	AnimationTransition,
} from '@app/core/animations/animation';

export const collapseHeight: AnimationTriggerMetadata = trigger(
	'collapseHeight',
	[
		state(
			AnimationState.False,
			style({ height: '0px', visibility: 'hidden' })
		),
		state(
			AnimationState.True,
			style({ height: AUTO_STYLE, visibility: AUTO_STYLE })
		),
		transition(AnimationTransition.False, [
			animate(
				'300ms 0ms cubic-bezier(.17,.67,.83,.67)',
				style({ height: AUTO_STYLE })
			),
			animate(
				'5ms cubic-bezier(.17,.67,.83,.67)',
				style({ visibility: AUTO_STYLE })
			),
		]),
		transition('true => false', [
			animate(
				'50ms cubic-bezier(.17,.67,.83,.67)',
				style({ visibility: 'hidden' })
			),
			animate(
				'300ms 0ms cubic-bezier(.17,.67,.83,.67)',
				style({ height: '0' })
			),
		]),
	]
);
