import {
	animate,
	AnimationStateMetadata,
	AnimationTransitionMetadata,
	state,
	style,
	transition,
} from '@angular/animations';

export interface AnimationOptions {
	duration?: number;
	delay?: number;
	easeForward?: string;
	easeBackward?: string;
}

export function baseTwoStepAnimation(
	{ duration, delay, easeBackward, easeForward }: AnimationOptions,
	forwardStateStyles: Record<string, string>,
	backwardStateStyles: Record<string, string>,
): Array<AnimationStateMetadata | AnimationTransitionMetadata> {
	return [
		state('0', style(forwardStateStyles)),
		state('1', style(backwardStateStyles)),
		transition('0 => 1', animate('{{ duration }}ms {{ delay }}ms {{ easeOnIn }}'), {
			params: {
				duration,
				delay,
				easeOnIn: easeForward,
			},
		}),
		transition('1 => 0', animate('{{ duration }}ms {{ delay }}ms {{ easeOnOut }}'), {
			params: {
				duration,
				delay,
				easeOnOut: easeBackward,
			},
		}),
	];
}
