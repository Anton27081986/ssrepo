import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-context-filter-menu-dropdown',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: 'manager-tmz-filter.component.html',
	styleUrls: ['manager-tmz-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerTmzFilterComponent {}
