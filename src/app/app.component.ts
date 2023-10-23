import {Component} from '@angular/core';
import {environment} from '@environments/environment';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    isCollapsed = false;
    title!: string;

    constructor(private readonly titleService: Title) {
        this.titleService.setTitle(`${environment.applicationTitle} - ${environment.tabTitle}`);
    }
}
