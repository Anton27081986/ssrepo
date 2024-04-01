import { Injectable } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AppIcons } from '@app/core/icons';

@Injectable({
	providedIn: 'root',
})
export class IconsService {
	public constructor(private readonly nzIconService: NzIconService) {
		this.registerIcons();
	}

	public registerIcons() {
		this.nzIconService.addIconLiteral('ss:exit', AppIcons.exit);
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
		this.nzIconService.addIconLiteral('ss:direction', AppIcons.direction);
		this.nzIconService.addIconLiteral('ss:bus', AppIcons.bus);
		this.nzIconService.addIconLiteral('ss:ok', AppIcons.ok);
		this.nzIconService.addIconLiteral('ss:warning', AppIcons.warning);
		this.nzIconService.addIconLiteral('ss:error', AppIcons.error);
		this.nzIconService.addIconLiteral('ss:calendar', AppIcons.calendar);
		this.nzIconService.addIconLiteral('ss:medalGold', AppIcons.medalGold);
		this.nzIconService.addIconLiteral('ss:medalSilver', AppIcons.medalSilver);
		this.nzIconService.addIconLiteral('ss:medalBronze', AppIcons.medalBronze);
		this.nzIconService.addIconLiteral('ss:like', AppIcons.like);
		this.nzIconService.addIconLiteral('ss:comment', AppIcons.comment);
		this.nzIconService.addIconLiteral('ss:plus', AppIcons.plus);
		this.nzIconService.addIconLiteral('ss:blocknote', AppIcons.blocknote);
		this.nzIconService.addIconLiteral('ss:medal', AppIcons.medal);
		this.nzIconService.addIconLiteral('ss:openOut', AppIcons.openOut);
		this.nzIconService.addIconLiteral('ss:onePeople', AppIcons.onePeople);
		this.nzIconService.addIconLiteral('ss:twoPeople', AppIcons.twoPeople);
		this.nzIconService.addIconLiteral('ss:attach', AppIcons.attach);
		this.nzIconService.addIconLiteral('ss:goldLike', AppIcons.goldLike);
		this.nzIconService.addIconLiteral('ss:silverLike', AppIcons.silverLike);
		this.nzIconService.addIconLiteral('ss:bronzeLike', AppIcons.bronzeLike);
		this.nzIconService.addIconLiteral('ss:delete', AppIcons.delete);
		this.nzIconService.addIconLiteral('ss:triangleBottom', AppIcons.triangleBottom);
		this.nzIconService.addIconLiteral('ss:triangleTop', AppIcons.triangleTop);
		this.nzIconService.addIconLiteral('ss:favorite', AppIcons.favorite);
		this.nzIconService.addIconLiteral('ss:call', AppIcons.call);
		this.nzIconService.addIconLiteral('ss:password', AppIcons.password);
		this.nzIconService.addIconLiteral('ss:profile', AppIcons.profile);
		this.nzIconService.addIconLiteral('ss:star', AppIcons.star);
		this.nzIconService.addIconLiteral('ss:sort', AppIcons.sort);
		this.nzIconService.addIconLiteral('ss:theme', AppIcons.theme);
		this.nzIconService.addIconLiteral('ss:closeFill', AppIcons.closeFill);
		this.nzIconService.addIconLiteral('ss:arrowRightH', AppIcons.arrowRightH);
		this.nzIconService.addIconLiteral('ss:oneConnect', AppIcons.oneConnect);
		this.nzIconService.addIconLiteral('ss:twoWayConnect', AppIcons.twoWayConnect);
	}
}
