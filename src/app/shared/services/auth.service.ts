import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserModel} from '../models/user.model';
import {TokenStorageService} from './token.service';
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl + '/auth';

const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable({providedIn: 'root'})
export class AuthService {
  
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;
  
  constructor(private http: HttpClient,
              private tokenStorageService: TokenStorageService) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }
  
  register(body: Object): Observable<any> {
    return this.http.post(`${apiUrl}/register`, body, options);
  }
  
  login(email, password) {
    return this.http.post<any>(`${apiUrl}/login`, {email, password}, options)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
  
  logout() {
    return this.http.get<any>(`${apiUrl}/logout`, options)
      .pipe(map(data => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.tokenStorageService.signOut();
        return data;
      }));
  }
  
  refreshToken(token: string) {
    return this.http.post(`${apiUrl}/refresh`, {
      refreshToken: token
    }, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
}
