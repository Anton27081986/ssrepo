import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {AppIcons} from '@app/common/icons';

@Component({
    selector: 'app-birthday',
    templateUrl: './birthday.component.html',
    styleUrls: ['./birthday.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayComponent {
    @ViewChild(NzCarouselComponent, {static: false}) myCarousel: NzCarouselComponent | undefined;

    date = null;

    constructor(private readonly iconService: NzIconService) {
        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
        this.iconService.addIconLiteral('ss:calendar', AppIcons.calendar);
        this.iconService.addIconLiteral('ss:medalGold', AppIcons.medalGold);
        this.iconService.addIconLiteral('ss:medalSilver', AppIcons.medalSilver);
        this.iconService.addIconLiteral('ss:medalBronze', AppIcons.medalBronze);
        this.iconService.addIconLiteral('ss:like', AppIcons.like);
        this.iconService.addIconLiteral('ss:comment', AppIcons.comment);
        this.iconService.addIconLiteral('ss:plus', AppIcons.plus);
        this.iconService.addIconLiteral('ss:blocknote', AppIcons.blocknote);
    }

    onChange(result: Date): void {
        console.log('onChange: ', result);
    }

    next() {
        // @ts-ignore
        this.myCarousel.next();
    }

    prev() {
        // @ts-ignore
        this.myCarousel.pre();
    }
}
