import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';

@Component({
    selector: 'app-my-menu',
    templateUrl: './my-menu.component.html',
    styleUrls: ['./my-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMenuComponent implements OnInit {
    myMenuForm!: FormGroup;

    constructor(
        private readonly iconService: NzIconService,
        private readonly formBuilder: FormBuilder,
    ) {
        this.iconService.addIconLiteral('ss:search', AppIcons.iconSearch);
        this.iconService.addIconLiteral('ss:favorite', AppIcons.star);

        this.iconService.addIconLiteral('ss:closeFill', AppIcons.closeFill);
        this.iconService.addIconLiteral('ss:arrowRightH', AppIcons.arrowRightH);

        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
    }

    ngOnInit() {
        this.myMenuForm = this.formBuilder.group({
            login: [
                '',
                [
                    Validators.required,
                    // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                ],
            ],
            password: ['', Validators.required],
        });
    }

    onSubmit() {}
}
