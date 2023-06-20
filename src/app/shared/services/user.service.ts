import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl + '/user';

const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class UserService {
  
  constructor(private http: HttpClient) {
  }
  
  getUsers(): Observable<any> {
    return this.http.get(`${apiUrl}/all`, options);
  }
  
  getCurrentUser() {
    return this.http.get<any>(`${apiUrl}/current`, options);
  }
  
  updateUser(body: Object): Observable<any> {
    return this.http.put(`${apiUrl}/update`, body, options);
  }
  
  deleteUser(userId): Observable<any> {
    return this.http.delete(`${apiUrl}/delete/${userId}`, options);
  }
}
