import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const apiUrl = 'https://taskery2.vercel.app/api';

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
    return this.http.get<any>(`${apiUrl}/user/current`, options);
  }
  
  updateUser(body: Object): Observable<any> {
    return this.http.put(`${apiUrl}/user/update`, body, options);
  }
  
  addUser(body: Object): Observable<any> {
    return this.http.post(`${apiUrl}/register`, body, options);
  }
  
  deleteUser(userId): Observable<any> {
    return this.http.delete(`${apiUrl}/user/delete/${userId}`, options);
  }
}
