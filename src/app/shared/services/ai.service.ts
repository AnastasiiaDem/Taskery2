import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const apiUrl = 'http://localhost:2200/api';
const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class AIService {
  
  constructor(private http: HttpClient) {
  }
  
  getAIresponse(prompt): Observable<any> {
    return this.http.post(`${apiUrl}/ai`, {prompt: prompt}, options);
  }
}
