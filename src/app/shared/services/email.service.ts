import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const apiUrl = 'http://localhost:1100/api';
const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class EmailService {
  
  constructor(private http: HttpClient) {
  }
  
  sendEmail(): Observable<any> {
    return this.http.get(`${apiUrl}/email`, options);
  }
}
