import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';

@NgModule({
	declarations: [SearchInputComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, IconModule, CaptionModule],
	exports: [SearchInputComponent],
})
export class SearchInputModule {}
