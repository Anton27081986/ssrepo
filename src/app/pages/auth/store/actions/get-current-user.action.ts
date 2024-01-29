import {createAction, props} from '@ngrx/store';
import {ActionTypes} from '@auth/store/action-types';
import {ICurrentUserInterface} from '@app/shared/types/current-user.interface';

export const getCurrentUserAction = createAction(ActionTypes.getCurrentUser);

export const getCurrentUserSuccessAction = createAction(
    ActionTypes.getCurrentUserSuccess,
    props<{currentUser: ICurrentUserInterface}>(),
);

export const getCurrentUserFailureAction = createAction(ActionTypes.getCurrentUserSuccess);
