import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {ApiService} from '@app/shared/services/api/api.service';
import {map, Observable} from 'rxjs';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit {
    @ViewChild(NzCarouselComponent, {static: false}) myCarousel: NzCarouselComponent | undefined;
    public banners!: Observable<any>;

    constructor(private readonly apiService: ApiService) {}

    ngOnInit(): any {
        this.banners = this.apiService.getBanners().pipe(map(({banners}) => banners));
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
