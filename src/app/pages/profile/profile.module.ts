import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from '@app/pages/profile/profile.component';
import {NzIconModule} from 'ng-zorro-antd/icon';

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, ProfileRoutingModule, NzIconModule],
})
export class ProfileModule {}
