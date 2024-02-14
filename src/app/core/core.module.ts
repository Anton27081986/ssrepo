import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { CallPhoneService } from '@app/core/services/call-phone.service';
import { IconsService } from '@app/core/services/icons.service';

@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [IconsService, LocalStorageService, CallPhoneService],
})
export class CoreModule {
	public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error('CoreModule is already loaded. Import it in the AppModule only');
		}
	}
}
