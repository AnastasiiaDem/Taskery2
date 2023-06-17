import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const apiUrl = 'http://127.0.0.1:3000/api/ai';

const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class AIService {
  
  constructor(private http: HttpClient) {
  }
  
  getAIproject(prompt): Observable<any> {
    return this.http.post(`${apiUrl}/project`, {prompt: prompt}, options);
  }
  
  getAIbudget(prompt): Observable<any> {
    return this.http.post(`${apiUrl}/budget`, {prompt: prompt}, options);
  }
  
  getAItask(prompt): Observable<any> {
    return this.http.post(`${apiUrl}/task`, {prompt: prompt}, options);
  }
}
