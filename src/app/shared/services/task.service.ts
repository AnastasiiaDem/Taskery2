import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TaskModel} from '../models/task.model';
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl + '/task';

const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  getTasks(): Observable<any> {
    return this.http.get(`${apiUrl}/all`, options);
  }

  addTask(body: TaskModel): Observable<any> {
    return this.http.post(`${apiUrl}/create`, body, options);
  }

  deleteTask(taskId: number): Observable<any> {
    const url = `${apiUrl}/delete/${taskId}`;
    return this.http.delete(url, options);
  }

  updateTask(body: TaskModel): Observable<any> {
    const url = `${apiUrl}/update/${body.id}`;
    return this.http.put(url, body, options);
  }
}
