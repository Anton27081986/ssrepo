import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';

@NgModule({
	declarations: [FooterComponent],
	imports: [CommonModule, RouterLink, NzLayoutModule, IconModule, TextModule],
	exports: [FooterComponent],
})
export class FooterModule {}
