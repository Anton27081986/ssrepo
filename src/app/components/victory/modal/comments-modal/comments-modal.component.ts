import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-comments-modal',
    templateUrl: './comments-modal.component.html',
    styleUrls: ['./comments-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsModalComponent {}
