import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
	declarations: [FooterComponent],
	imports: [CommonModule, RouterLink, NzLayoutModule],
	exports: [FooterComponent],
})
export class FooterModule {}
