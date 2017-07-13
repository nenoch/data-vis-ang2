import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UploadService {

  constructor(private http: Http) { }

  public postFiles(files: any) {
    const formData: FormData = this.createFormData(files);

    const headers = new Headers();
    const options = new RequestOptions({ headers: headers });

    return this.http.post('/api/upload', formData, options)
      .map(res => res.json());
  }

  private createFormData(files: any): FormData {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('uploadFile[]', files[i]);
    }
    return formData;
  }
}
