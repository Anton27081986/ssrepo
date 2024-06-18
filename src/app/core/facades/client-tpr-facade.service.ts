import { UntilDestroy } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientsTprFacadeService {}
