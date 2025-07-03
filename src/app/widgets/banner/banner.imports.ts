import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { NgOptimizedImage } from '@angular/common';
import { CarouselComponent, ItemDirective, SafePipe } from "@front-library/components";

export const bannerImports = [
	CarouselComponent,
	ItemDirective,
	NgOptimizedImage,
	SafePipe,
	LoaderComponent,
];
