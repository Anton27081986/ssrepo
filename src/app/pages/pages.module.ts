import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzCardModule} from 'ng-zorro-antd/card';
import {AuthModule} from '@auth/auth.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        RouterLink,
        NzButtonModule,
        NzIconModule,
        NzCardModule,
        AuthModule,
    ],
})
export class PagesModule {}
