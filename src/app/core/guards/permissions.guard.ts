import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionsGuard implements CanActivate {
	public constructor(private readonly router: Router) {}

	public canActivate() {
		const ClientContact: boolean = true;

		if (ClientContact) {
			return true;
		}

		this.router.navigate(['not-permission']);

		return false;
	}
}
