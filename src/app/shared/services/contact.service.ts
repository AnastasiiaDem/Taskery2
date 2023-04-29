import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const apiUrl = 'http://localhost:2200/api';
const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class ContactService {
  
  constructor(private http: HttpClient) {
  }
  
  sendRequest(body: Object): Observable<any> {
    return this.http.post(`${apiUrl}/contact`, body, options);
  }
  
  sendRespond(body: Object): Observable<any> {
    return this.http.post(`${apiUrl}/respond`, body, options);
  }
  
  getAllRequests(): Observable<any> {
    return this.http.get(`${apiUrl}/getRequests`, options);
  }
  
  deleteRequest(reqId: string): Observable<any> {
    const url = `${apiUrl}/request/delete/${reqId}`;
    return this.http.delete(url, options);
  }
}
