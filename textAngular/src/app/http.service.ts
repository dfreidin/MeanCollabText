import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  newDocument() {
    return this._http.post("/api/new", {});
  }

  rejoin() {
    return this._http.get("/api/rejoin");
  }

  check(id: string) {
    return this._http.get(`/api/check/${id}`);
  }
}
