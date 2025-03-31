import { AnimationTriggerMetadata, trigger } from '@angular/animations';
import { baseTwoStepAnimation } from '@app/core/animations/base-two-step.animation';

export const rotateAnimation: AnimationTriggerMetadata = trigger(
	'rotate',
	baseTwoStepAnimation(
		{
			duration: 200,
			delay: 0,
			easeForward: 'ease-in',
			easeBackward: 'ease-out',
		},
		{ 'transform-origin': 'center', transform: 'none' },
		{
			'transform-origin': 'center',
			transform: 'rotate3d(0, 0, 1, 180deg)',
		},
	),
);
