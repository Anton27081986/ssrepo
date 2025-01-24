import { NgModule } from '@angular/core';
import { CompletedWorkActsComponent } from '@app/pages/completed-work-acts/completed-work-acts.component';
import { CompletedWorkActsRoutingModule } from '@app/pages/completed-work-acts/completed-work-acts-routing.module';
import { CompletedWorkActCardComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-card.component';
import { CompletedWorkActInfoComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-info/completed-work-act-info.component';
import { CompletedWorkActSpecificationsComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/completed-work-act-specifications.component';
import { SpecificationRowItemTrComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/specification-row-item-tr/specification-row-item-tr.component';
import { SpecificationModalComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/add-specification-modal/specification-modal.component';
import { CompletedWorkActEditComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-edit/completed-work-act-edit.component';

@NgModule({
	declarations: [
	],
	exports: [
		CompletedWorkActsComponent,
		CompletedWorkActCardComponent,
		CompletedWorkActInfoComponent,
		CompletedWorkActSpecificationsComponent,
		SpecificationRowItemTrComponent,
		SpecificationModalComponent,
		CompletedWorkActEditComponent,
	],
	imports: [
		CompletedWorkActsComponent,
		CompletedWorkActCardComponent,
		CompletedWorkActInfoComponent,
		CompletedWorkActSpecificationsComponent,
		SpecificationRowItemTrComponent,
		SpecificationModalComponent,
		CompletedWorkActEditComponent,
		CompletedWorkActsRoutingModule,
	],
})
export class CompletedWorkActsModule {}
