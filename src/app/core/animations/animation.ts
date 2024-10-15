import { AnimationReferenceMetadata } from '@angular/animations';

export enum AnimationState {
	Enter = ':enter',
	Leave = ':leave',
	True = 'true',
	False = 'false',
}

export enum AnimationTransition {
	Enter = 'void => *',
	Leave = '* => void',
	True = 'true => false',
	False = 'false => true',
	Any = '* => *',
}

export type AnimationType<T extends Record<string, string>, U> = {
	[K in keyof T as Exclude<Uncapitalize<K & string>, U>]: AnimationReferenceMetadata;
};

export const DURATION = 500 as const;
