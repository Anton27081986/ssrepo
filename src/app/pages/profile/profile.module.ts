import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from '@app/pages/profile/profile.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ComponentsModule } from '@app/components/components.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FrendlyAccountsComponent } from '@app/pages/profile/frendly-accounts/frendly-accounts.component';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { SettingsComponent } from './settings/settings.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyMenuComponent } from './my-menu/my-menu.component';
import { OrderWidgetsComponent } from './order-widgets/order-widgets.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { CardModule } from '../../shared/components/card/card.module';
import { ButtonModule } from '../../shared/components/buttons/button/button-module';

@NgModule({
	declarations: [
		ProfileComponent,
		SettingsComponent,
		ChangePasswordComponent,
		MyMenuComponent,
		FrendlyAccountsComponent,
		OrderWidgetsComponent,
		NotificationsComponent,
		RecoveryPasswordComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ProfileRoutingModule,
		NzIconModule,
		NzRadioModule,
		NzInputNumberModule,
		NzTabsModule,
		NzSwitchModule,
		NzFormModule,
		NzInputModule,
		NzCardModule,
		NzButtonModule,
		ComponentsModule,
		CardModule,
		ButtonModule,
		NzModalModule,
		NzSelectModule,
		HeadlineModule,
	],
})
export class ProfileModule {}
