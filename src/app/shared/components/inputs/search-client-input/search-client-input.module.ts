import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { SearchClientInputComponent } from '@app/shared/components/inputs/search-client-input/search-client-input.component';

@NgModule({
	declarations: [SearchClientInputComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, IconModule, CaptionModule],
	exports: [SearchClientInputComponent],
})
export class SearchClientInputModule {}
