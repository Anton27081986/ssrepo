import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from '@app/pages/profile/profile.component';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {SettingsComponent} from './settings/settings.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {MyMenuComponent} from './my-menu/my-menu.component';
import {ManagerComponent} from './manager/manager.component';
import {OrderWidgetsComponent} from './order-widgets/order-widgets.component';
import {NotificationsComponent} from './notifications/notifications.component';

@NgModule({
    declarations: [
        ProfileComponent,
        SettingsComponent,
        ChangePasswordComponent,
        MyMenuComponent,
        ManagerComponent,
        OrderWidgetsComponent,
        NotificationsComponent,
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
    ],
})
export class ProfileModule {}
