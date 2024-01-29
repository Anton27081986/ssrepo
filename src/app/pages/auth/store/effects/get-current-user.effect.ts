import {Injectable} from '@angular/core';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

import {ICurrentUserInterface} from '@app/shared/types/current-user.interface';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
    getCurrentUserAction,
    getCurrentUserFailureAction,
    getCurrentUserSuccessAction,
} from '@auth/store/actions/get-current-user.action';
import {UserService} from '@auth/services/user.service';

@Injectable()
export class GetCurrentUserEffect {
    getCurrentUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getCurrentUserAction),
            switchMap(() => {
                return this.authService.getProfile().pipe(
                    map((currentUser: ICurrentUserInterface) => {
                        return getCurrentUserSuccessAction({currentUser});
                    }),

                    catchError(() => {
                        return of(getCurrentUserFailureAction());
                    }),
                );
            }),
        ),
    );

    constructor(
        private readonly actions$: Actions,
        private readonly authService: UserService,
    ) {}
}
