import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
	selector: 'app-full-layout',
	templateUrl: './full-layout.component.html',
	styleUrls: ['./full-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HeaderComponent, RouterOutlet, FooterComponent],
	standalone: true,
})
export class FullLayoutComponent {}
