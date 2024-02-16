import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';

@Injectable({
	providedIn: 'root',
})
export class CallPhoneService {
	public constructor(public apiService: ApiService) {}

	// TODO: change any to model type
	public toggleCallForUser(user: any) {
		// Пользователь не звонит, даём ему возможность позвонить
		if (!user.isCalling && user.linkToCall) {
			this.apiService.callByIpPhone(user.linkToCall).subscribe({
				next: () => {
					user.isCalling = true;
				},
				error: (error: unknown) => {
					console.error('Ошибка при звонке пользователя:', error);
				},
			});
		} else if (user.isCalling) {
			this.apiService.resetCallByIpPhone().subscribe({
				next: () => {
					user.isCalling = false;
				},
				error: (error: unknown) => {
					console.error('Ошибка при сбросе звонка пользователя:', error);
				},
			});
		}
	}
}
