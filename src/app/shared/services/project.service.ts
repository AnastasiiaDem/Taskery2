import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProjectModel} from '../models/project.model';

const apiUrl = 'http://localhost:1100/api';
const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class ProjectsService {
  
  constructor(private http: HttpClient) {
  }
  
  getProjects(): Observable<any> {
    return this.http.get(`${apiUrl}/projects`, options);
  }
  
  addProject(body: ProjectModel): Observable<any> {
    return this.http.post(`${apiUrl}/project/create`, body, options);
  }
  
  deleteProject(projectId: number): Observable<any> {
    const url = `${apiUrl}/project/delete/${projectId}`;
    return this.http.delete(url, options);
  }
  
  updateProject(body: ProjectModel): Observable<any> {
    const url = `${apiUrl}/project/update/${body.id}`;
    return this.http.put(url, body, options);
  }
}
