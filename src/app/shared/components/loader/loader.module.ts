import { NgModule } from '@angular/core';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { IconModule } from '@app/shared/components/icon/icon.module';

@NgModule({
	declarations: [LoaderComponent],
	exports: [LoaderComponent],
	imports: [IconModule],
})
export class LoaderModule {}
