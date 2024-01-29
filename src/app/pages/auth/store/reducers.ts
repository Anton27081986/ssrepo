import {Action, createReducer, on} from '@ngrx/store';
import {
    getCurrentUserAction,
    getCurrentUserFailureAction,
    getCurrentUserSuccessAction,
} from '@auth/store/actions/get-current-user.action';
import {IAuthStateInterface} from '@auth/types/auth-state.interface';

const initialState: IAuthStateInterface = {
    isSubmitting: false,
    isLoading: false,
    currentUser: null,
    validationErrors: null,
    isLoggedIn: null,
};

const authReducer = createReducer(
    initialState,
    on(
        getCurrentUserAction,
        (state): IAuthStateInterface => ({
            ...state,
            isLoading: true,
        }),
    ),
    on(
        getCurrentUserSuccessAction,
        (state, action): IAuthStateInterface => ({
            ...state,
            isLoading: false,
            isLoggedIn: true,
            currentUser: action.currentUser,
        }),
    ),
    on(
        getCurrentUserFailureAction,
        (state): IAuthStateInterface => ({
            ...state,
            isLoading: false,
            isLoggedIn: false,
            currentUser: null,
        }),
    ),
);

export function reducers(state: IAuthStateInterface, action: Action) {
    return authReducer(state, action);
}
