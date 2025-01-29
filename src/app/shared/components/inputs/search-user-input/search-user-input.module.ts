import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { SearchUserInputComponent } from '@app/shared/components/inputs/search-user-input/search-user-input.component';

@NgModule({
	declarations: [SearchUserInputComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, IconModule, CaptionModule],
	exports: [SearchUserInputComponent],
})
export class SearchUserInputModule {}
