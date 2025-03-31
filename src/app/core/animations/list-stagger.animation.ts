import {
	animateChild,
	query,
	stagger,
	transition,
	trigger,
} from '@angular/animations';
import {
	AnimationState,
	AnimationTransition,
} from '@app/core/animations/animation';

export const listStagger = trigger('listStagger', [
	transition(`${AnimationState.Enter}, ${AnimationTransition.Any}`, [
		query(AnimationState.Enter, [stagger(50, [animateChild()])], {
			optional: true,
		}),
	]),
]);
