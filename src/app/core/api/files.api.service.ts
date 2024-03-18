import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
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
	public constructor(private readonly http: HttpClient) {}

	public uploadFile(bucketId: number, file: File): Observable<IFile> {
		const formData = new FormData();

		formData.append('file', file);

		return this.http.post<IFile>(
			`${environment.apiUrl}/api/files/fileStorage/${bucketId}/upload`,
			formData,
		);
	}

	public deleteFile(id: string): Observable<unknown> {
		return this.http.delete<unknown>(`${environment.apiUrl}/api/files/fileStorage/${id}`);
	}
}
