import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TaskModel} from '../models/task.model';

const apiUrl = 'http://localhost:3000/api';

const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class TaskService {
  
  constructor(private http: HttpClient) {
  }
  
  getTasks(): Observable<any> {
    return this.http.get(`${apiUrl}/tasks`, options);
  }
  
  addTask(body: TaskModel): Observable<any> {
    return this.http.post(`${apiUrl}/task/create`, body, options);
  }
  
  deleteTask(taskId: number): Observable<any> {
    const url = `${apiUrl}/task/delete/${taskId}`;
    return this.http.delete(url, options);
  }
  
  updateTask(body: TaskModel): Observable<any> {
    const url = `${apiUrl}/task/update/${body.id}`;
    return this.http.put(url, body, options);
  }
}
