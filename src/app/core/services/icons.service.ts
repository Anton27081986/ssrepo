import { Injectable } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AppIcons } from '@app/core/icons';

@Injectable({
	providedIn: 'root',
})
export class IconsService {
	public constructor(private readonly nzIconService: NzIconService) {}

	public registerIcons() {
		debugger;
		this.nzIconService.addIconLiteral('ss:exit', AppIcons.exit);
		this.nzIconService.addIconLiteral('ss:arrowRight', AppIcons.arrowRight);
		this.nzIconService.addIconLiteral('ss:arrowRight', AppIcons.arrowRight);
		this.nzIconService.addIconLiteral('ss:settings', AppIcons.settings);
		this.nzIconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
		this.nzIconService.addIconLiteral('ss:enter', AppIcons.enter);
		this.nzIconService.addIconLiteral('ss:search', AppIcons.iconSearch);
		this.nzIconService.addIconLiteral('ss:remind', AppIcons.iconRemind);
		this.nzIconService.addIconLiteral('ss:burger', AppIcons.iconBurger);
		this.nzIconService.addIconLiteral('ss:moon', AppIcons.iconMoon);
		this.nzIconService.addIconLiteral('ss:sun', AppIcons.iconSun);
		this.nzIconService.addIconLiteral('ss:logo', AppIcons.iconLogoHeader);
		this.nzIconService.addIconLiteral('ss:logofooter', AppIcons.iconLogoFooter);
		this.nzIconService.addIconLiteral('ss:close', AppIcons.iconClose);
		this.nzIconService.addIconLiteral('ss:closeLight', AppIcons.iconCloseLight);
		this.nzIconService.addIconLiteral('ss:phone', AppIcons.phone);
		this.nzIconService.addIconLiteral('ss:mail', AppIcons.mail);
	}
}
