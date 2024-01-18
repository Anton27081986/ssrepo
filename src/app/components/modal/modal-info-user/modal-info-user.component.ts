import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-modal-info-user',
    templateUrl: './modal-info-user.component.html',
    styleUrls: ['./modal-info-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInfoUserComponent {}
