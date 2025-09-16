export interface IFile {
	id: string;
	fileName: string;
	bucketName: string | null;
	fileStorageName: string | null;
	size: number | null;
	contentType: string;
	directUrl: string | null;
	uploadAt: string;
}
