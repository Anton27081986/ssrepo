import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-samples-page',
  templateUrl: './samples-page.component.html',
  styleUrls: ['./samples-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamplesPageComponent {

}
