import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UploadService {

  constructor(private http: Http) { }

  postFiles(files) {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('uploadFile[]', files[i]);
    }
    const headers = new Headers();
    const options = new RequestOptions({ headers: headers });
    return this.http.post('/api/upload', formData, options)
      .map(res => res.json());
  }
}
