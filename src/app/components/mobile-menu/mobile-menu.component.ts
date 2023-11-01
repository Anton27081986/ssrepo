import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./mobile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent implements OnInit {
    private getScreenAvailWidth: any;

    ngOnInit() {
        this.getScreenAvailWidth = window.screen.availWidth;
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.getScreenAvailWidth = window.screen.availWidth;
    }
}
