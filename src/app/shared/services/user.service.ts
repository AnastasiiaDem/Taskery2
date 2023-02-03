import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

const apiUrl = 'http://localhost:1100/api';
const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class UserService {
  
  constructor(private http: HttpClient) {
  }
  
  getUsers(): Observable<any> {
    return this.http.get(`${apiUrl}/users`, options);
  }
  
  getCurrentUser() {
    return this.http.get<any>(`${apiUrl}/currentUser`, options);
  }
  
  addUser(body: Object): Observable<any> {
    return this.http.post(`${apiUrl}/register`, body, options);
  }
  
  deleteUser(userId: number): Observable<any> {
    const url = `${apiUrl}/${userId}`;
    return this.http.delete(url, options);
  }
}
