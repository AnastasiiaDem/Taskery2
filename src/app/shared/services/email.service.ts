import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const apiUrl = 'http://127.0.0.1:3000/api';

const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class EmailService {
  
  constructor(private http: HttpClient) {
  }
  
  sendEmail(userId, project, task, report, content): Observable<any> {
    return this.http.post(`${apiUrl}/email`, {
      userId: userId,
      project: project,
      task: task,
      report: report,
      content: content
    }, options);
  }
}
