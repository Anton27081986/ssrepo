import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-result-item',
    templateUrl: './result-item.component.html',
    styleUrls: ['./result-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent {
    @Input() user: any;

    constructor(private readonly apiService: ApiService) {}

    // TODO : move to service
    toggleCallForUser() {
        // Пользователь не звонит, даём ему возможность позвонить
        if (!this.user.isCalling && this.user.linkToCall) {
            this.apiService.callByIpPhone(this.user.linkToCall).subscribe({
                next: () => {
                    this.user.isCalling = true;
                },
                error: (error: unknown) => {
                    console.error('Ошибка при звонке пользователя:', error);
                },
            });
        } else if (this.user.isCalling) {
            this.apiService.resetCallByIpPhone().subscribe({
                next: () => {
                    this.user.isCalling = false;
                },
                error: (error: unknown) => {
                    console.error('Ошибка при сбросе звонка пользователя:', error);
                },
            });
        }
    }
}
