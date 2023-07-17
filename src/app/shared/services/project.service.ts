import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProjectModel} from '../models/project.model';
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl + '/project';

const options = {
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
};

@Injectable()
export class ProjectsService {

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<any> {
    return this.http.get(`${apiUrl}/all`, options);
  }

  getCurrentProject(projectId: number): Observable<any> {
    return this.http.get(`${apiUrl}/current/${projectId}`, options);
  }

  addProject(body: ProjectModel): Observable<any> {
    return this.http.post(`${apiUrl}/create`, body, options);
  }

  deleteProject(projectId: number): Observable<any> {
    const url = `${apiUrl}/delete/${projectId}`;
    return this.http.delete(url, options);
  }

  updateProject(body): Observable<any> {
    const url = `${apiUrl}/update/${body.id || body._id}`;
    return this.http.put(url, body, options);
  }
}
