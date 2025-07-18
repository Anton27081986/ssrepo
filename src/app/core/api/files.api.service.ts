import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { IFile } from '../models/files/file';

export enum FileBucketsEnum {
	'Baners',
	'UserAvatars',
	'Attachments',
}

@Injectable({
	providedIn: 'root',
})
export class FilesApiService {
	constructor(private readonly http: HttpClient) {}

	public uploadFile(bucketId: number, file: File): Observable<IFile> {
		const formData = new FormData();

		formData.append('file', file);

		return this.http.post<IFile>(
			`${environment.apiUrl}/api/files/fileStorage/${bucketId}/upload`,
			formData
		);
	}

	public deleteFile(id: string): Observable<IFile> {
		return this.http.delete<IFile>(
			`${environment.apiUrl}/api/files/fileStorage/${id}`
		);
	}
}
