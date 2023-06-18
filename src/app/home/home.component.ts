import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize, Subject, takeUntil} from 'rxjs';
import {RoleEnum, StatusEnum} from '../shared/enums';
import {TaskService} from '../shared/services/task.service';
import {UserService} from '../shared/services/user.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {UserModel} from '../shared/models/user.model';
import {ProjectsService} from '../shared/services/project.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  
  private readonly unsubscribe: Subject<void> = new Subject();
  myTasks: { overdue: Array<any>, today: Array<any>, upcoming: Array<any> };
  currentUser: UserModel = {
    email: '',
    firstName: '',
    id: 0,
    lastName: '',
    password: '',
    role: RoleEnum.ProjectManager,
    sendAssignedEmail: false,
    sendTaskEmail: false,
    sendTaskOverdueEmail: false
  };
  currentDate;
  overdue;
  today;
  upcoming;
  allProjects = [];
  currentUserRole = 'ProjectManager';
  
  constructor(private spinner: NgxSpinnerService,
              public taskService: TaskService,
              public userService: UserService,
              private datepipe: DatePipe,
              public projectService: ProjectsService,
              private authenticationService: AuthService,
              private router: Router) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => {
        this.currentUser = {
          id: x['foundUser']._id,
          firstName: x['foundUser'].firstName,
          lastName: x['foundUser'].lastName,
          email: x['foundUser'].email,
          password: x['foundUser'].password,
          role: x['foundUser'].role,
          sendAssignedEmail: x['foundUser'].sendAssignedEmail,
          sendTaskEmail: x['foundUser'].sendTaskEmail,
          sendTaskOverdueEmail: x['foundUser'].sendTaskOverdueEmail
        };
      });
  }
  
  ngOnInit(): void {
    this.overdue = false;
    this.currentDate = new Date();
    this.getAllProjects();
    this.getAllTasks();
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  projectList() {
    this.spinner.show();
    document.getElementById('projectList').click();
    setTimeout(() => {
      this.spinner.hide();
    }, 950);
  }
  
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
  
  sortTasks(tasks) {
    tasks.sort((a, b) => {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    });
    return tasks;
  }
  
  getAllProjects() {
    this.spinner.show();
    this.projectService.getProjects()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {
          this.allProjects = [];
          res.projects.forEach(project => {
            this.allProjects.push(project);
          });
        },
        err => {
          console.log(err);
        });
  }
  
  getAllTasks() {
    this.spinner.show();
    this.taskService.getTasks()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {
          this.myTasks = {overdue: [], today: [], upcoming: []};
          res.tasks.filter(t => {
              return t.employeeId == this.currentUser.id && t.status !== StatusEnum.done && this.allProjects.find(p => p._id == t.projectId).status != StatusEnum.done
            })
            .forEach(task => {
              if (!!task && task.deadline < this.datepipe.transform(this.currentDate, 'YYYY-MM-dd')) {
                this.myTasks.overdue.push({
                  id: task._id,
                  title: task.title,
                  description: task.description,
                  status: task.status,
                  deadline: task.deadline,
                  employeeId: task.employeeId,
                  projectId: task.projectId,
                  projectName: this.allProjects.find(p => p._id == task.projectId).projectName
                });
              } else if (this.datepipe.transform(this.currentDate, 'YYYY-MM-dd') == task.deadline) {
                this.myTasks.today.push({
                  id: task._id,
                  title: task.title,
                  description: task.description,
                  status: task.status,
                  deadline: task.deadline,
                  employeeId: task.employeeId,
                  projectId: task.projectId,
                  projectName: this.allProjects.find(p => p._id == task.projectId).projectName
                });
              } else if (task.deadline > this.datepipe.transform(this.currentDate, 'YYYY-MM-dd')
                && task.deadline < this.datepipe.transform(`${new Date(this.currentDate).getFullYear()}-${new Date(this.currentDate).getMonth() + 1}-${new Date(this.currentDate).getDate() + 3}`, 'YYYY-MM-dd')) {
                this.myTasks.upcoming.push({
                  id: task._id,
                  title: task.title,
                  description: task.description,
                  status: task.status,
                  deadline: task.deadline,
                  employeeId: task.employeeId,
                  projectId: task.projectId,
                  projectName: this.allProjects.find(p => p._id == task.projectId).projectName
                });
              }
            });
        },
        err => {
          console.log(err);
        });
  }
  
  hide(type) {
    this[type] = !this[type];
  }
  
  goToList(projectId) {
    this.router.navigateByUrl('/board;paramKey=' + projectId);
  }
}
