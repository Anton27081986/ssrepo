import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { CallPhoneService } from '@app/core/services/call-phone.service';

@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [LocalStorageService, CallPhoneService],
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error(
				'CoreModule is already loaded. Import it in the AppModule only',
			);
		}
	}
}
