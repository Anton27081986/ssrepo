import {IBackendErrorsInterface} from '@app/shared/types/backend-errors.interface';
import {ICurrentUserInterface} from '@app/shared/types/current-user.interface';

export interface IAuthStateInterface {
    isSubmitting: boolean;
    currentUser: ICurrentUserInterface | null;
    isLoggedIn: boolean | null;
    validationErrors: IBackendErrorsInterface | null;
    isLoading: boolean;
}
