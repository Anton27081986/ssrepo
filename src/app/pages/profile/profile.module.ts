import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from '@app/pages/profile/profile.component';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        FormsModule,
        ProfileRoutingModule,
        NzIconModule,
        NzRadioModule,
        NzInputNumberModule,
        NzTabsModule,
    ],
})
export class ProfileModule {}
