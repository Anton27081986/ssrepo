import {
	animate,
	animation,
	keyframes,
	style,
	transition,
	trigger,
	useAnimation,
} from '@angular/animations';
import {
	AnimationState,
	AnimationTransition,
	AnimationType,
	DURATION,
} from '@app/core/animations/animation';

enum Animation {
	Fade = 'fade',
	FadeIn = 'fadeIn',
	FadeOut = 'fadeOut',
	FadeInUp = 'fadeInUp',
	FadeInDown = 'fadeInDown',
	FadeInRight = 'fadeInRight',
	FadeInLeft = 'fadeInLeft',
}

export const fadeAnimations: AnimationType<typeof Animation, 'fade'> = {
	[Animation.FadeIn]: animation([
		style({ opacity: 0 }),
		animate(DURATION, keyframes([style({ opacity: 0 }), style({ opacity: 1 })])),
	]),
	[Animation.FadeOut]: animation([
		style({ opacity: 1 }),
		animate(DURATION, keyframes([style({ opacity: 1 }), style({ opacity: 0 })])),
	]),
	[Animation.FadeInUp]: animation([
		style({ opacity: 0 }),
		animate(
			DURATION,
			keyframes([
				style({ opacity: 0, transform: 'translate(0px, 50px)' }),
				style({ opacity: 1, transform: 'translate(0px, 0px)' }),
			]),
		),
	]),
	[Animation.FadeInDown]: animation([
		style({ opacity: 0 }),
		animate(
			DURATION,
			keyframes([
				style({ opacity: 0, transform: 'translate(0px, -50px)' }),
				style({ opacity: 1, transform: 'translate(0px, 0px)' }),
			]),
		),
	]),
	[Animation.FadeInRight]: animation([
		style({ opacity: 0 }),
		animate(
			DURATION,
			keyframes([
				style({ opacity: 0, transform: 'translate(25px, 0px)' }),
				style({ opacity: 1, transform: 'translate(0px, 0px)' }),
			]),
		),
	]),
	[Animation.FadeInLeft]: animation([
		style({ opacity: 0 }),
		animate(
			DURATION,
			keyframes([
				style({ opacity: 0, transform: 'translate(-25px, 0px)' }),
				style({ opacity: 1, transform: 'translate(0px, 0px)' }),
			]),
		),
	]),
};

export const fade = trigger(Animation.Fade, [
	transition(AnimationState.Enter, [useAnimation(fadeAnimations.fadeIn)]),
	transition(AnimationState.Leave, [useAnimation(fadeAnimations.fadeOut)]),
]);

export const fadeIn = trigger(Animation.FadeIn, [
	transition(
		`${AnimationState.Enter}, ${AnimationTransition.Any}`,
		useAnimation(fadeAnimations.fadeIn),
	),
]);

export const fadeOut = trigger(Animation.FadeOut, [
	transition(AnimationState.Leave, useAnimation(fadeAnimations.fadeOut)),
]);

export const fadeInUp = trigger(Animation.FadeInUp, [
	transition(AnimationState.Enter, useAnimation(fadeAnimations.fadeInUp)),
]);

export const fadeInDown = trigger(Animation.FadeInDown, [
	transition(AnimationState.Enter, useAnimation(fadeAnimations.fadeInDown)),
]);

export const fadeInRight = trigger(Animation.FadeInRight, [
	transition(AnimationState.Enter, useAnimation(fadeAnimations.fadeInRight)),
]);

export const fadeInLeft = trigger(Animation.FadeInLeft, [
	transition(AnimationState.Enter, useAnimation(fadeAnimations.fadeInLeft)),
]);
