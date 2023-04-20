import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject, takeUntil} from 'rxjs';
import {StatusEnum} from '../shared/enums';
import {TaskService} from '../shared/services/task.service';
import {UserService} from '../shared/services/user.service';
import {DatePipe} from '@angular/common';
import {TaskModel} from '../shared/models/task.model';
import {Router} from '@angular/router';
import {Role, UserModel} from '../shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  private readonly unsubscribe: Subject<void> = new Subject();
  myTasks: { overdue: Array<TaskModel>, today: Array<TaskModel>, upcoming: Array<TaskModel> };
  currentUser: UserModel = {
    email: '',
    firstName: '',
    id: 0,
    lastName: '',
    password: '',
    role: Role.ProjectManager,
    sendAssignedEmail: false,
    sendTaskEmail: false,
    sendTaskOverdueEmail: false
  };
  currentDate;
  overdue;
  today;
  upcoming;
  
  constructor(private spinner: NgxSpinnerService,
              public taskService: TaskService,
              public userService: UserService,
              private datepipe: DatePipe,
              private router: Router) {
    this.getCurrentUser();
  }
  
  ngOnInit(): void {
    this.overdue = false;
    this.currentDate = new Date();
    
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
  
  getCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
          this.currentUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
            sendAssignedEmail: user.sendAssignedEmail,
            sendTaskEmail: user.sendTaskEmail,
            sendTaskOverdueEmail: user.sendTaskOverdueEmail
          };
        },
        err => {
          console.log(err);
        });
  }
  
  sortTasks(tasks) {
    tasks.sort((a, b) => {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    });
    return tasks;
  }
  
  getAllTasks() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.myTasks = {overdue: [], today: [], upcoming: []};
          res.tasks.filter(t => t.employeeId == this.currentUser.id && t.status !== StatusEnum.done)
            .forEach(task => {
              if (!!task && task.deadline < this.datepipe.transform(this.currentDate, 'YYYY-MM-dd')) {
                this.myTasks.overdue.push({
                  id: task._id,
                  title: task.title,
                  description: task.description,
                  status: task.status,
                  deadline: task.deadline,
                  employeeId: task.employeeId,
                  projectId: task.projectId
                });
              } else if (this.datepipe.transform(this.currentDate, 'YYYY-MM-dd') == task.deadline) {
                this.myTasks.today.push({
                  id: task._id,
                  title: task.title,
                  description: task.description,
                  status: task.status,
                  deadline: task.deadline,
                  employeeId: task.employeeId,
                  projectId: task.projectId
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
                  projectId: task.projectId
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
