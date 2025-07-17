import { idName } from '@app/core/models/client-proposails/business-trips';

/**
 * Модель банера
 */
export interface IBannerDto {
	name: string;
	text: string | null;
	fileId: string;
	imageUrl: string;
	linkUrl: string | null;
	order: number;
	user: idName;
	createdAt: string;
	updatedAt: string;
	publicationStartDate: string;
	publicationEndDate: string | null;
	isActive: boolean;
}
