import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
	templateUrl: './front-library-layout.component.html',
	styleUrls: ['./front-library-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HeaderComponent, RouterOutlet],
	standalone: true,
})
export class FrontLibraryLayoutComponent {}
