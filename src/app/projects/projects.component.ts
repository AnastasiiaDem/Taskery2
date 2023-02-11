import {AfterViewChecked, Component, ElementRef, OnInit} from '@angular/core';
import {ProjectModel} from '../shared/models/project.model';
import {ProjectsService} from '../shared/services/project.service';
import {StatusEnum} from '../shared/enums';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Select2OptionData} from 'ng-select2';
import {TaskService} from '../shared/services/task.service';
import * as $ from 'jquery';
import {finalize, Subject, takeUntil} from 'rxjs';
import {Role} from '../shared/models/user.model';
import {UserService} from '../shared/services/user.service';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {NgxSpinnerService} from 'ngx-spinner';
import {FocusMonitor} from '@angular/cdk/a11y';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, AfterViewChecked {
  projects: ProjectModel[] = [];
  currentProject: { description: string; projectName: string; status: StatusEnum; assignedUsers: [], createdAt: string};
  projectForm: FormGroup;
  statusData: Array<Select2OptionData> = [];
  tasksData: Array<Select2OptionData> = [];
  usersData: Array<{ id: string; text: string; }> = [];
  addProjectFlag: boolean;
  currentDate;
  private readonly unsubscribe: Subject<void> = new Subject();
  public dropdownSettings: IDropdownSettings = {};
  currentUser: { _id: number; firstName: string; lastName: string; email: string; password: string; role: Role; } = {
    _id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.ProjectManager
  };
  
  get f() {
    return this.projectForm.controls;
  }
  
  linkStyle(project) {
    if (project.status == StatusEnum.todo) {
      return {'background': '#EDF9FF'};
    }
    if (project.status == StatusEnum.inProgress) {
      return {'background': '#FFEFEA'};
    }
    if (project.status == StatusEnum.onReview) {
      return {'background': '#EAE8FF'};
    }
    if (project.status == StatusEnum.done) {
      return {'background': '#E8FBED'};
    }
  }
  
  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private taskService: TaskService,
              private projectService: ProjectsService,
              private userService: UserService,
              private elementRef: ElementRef,
              private datepipe: DatePipe,
              private _focusMonitor: FocusMonitor,
              private spinner: NgxSpinnerService) {
  }
  
  ngOnInit() {
    this.currentDate = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
    this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    this.statusData = [
      {id: StatusEnum.todo, text: StatusEnum.todo},
      {id: StatusEnum.inProgress, text: StatusEnum.inProgress},
      {id: StatusEnum.onReview, text: StatusEnum.onReview},
      {id: StatusEnum.done, text: StatusEnum.done}
    ];
    this.getCurrentUser();
    this.getAllProjects();
    this.getAllUsers();
    this.getAllTasks();
    this.projectForm = this.formBuilder.group({
      id: [''],
      projectName: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
      assignedUsers: [[], Validators.required],
      createdAt: [this.currentDate, Validators.required],
    });
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  
  ngAfterViewChecked() {
    this._focusMonitor.stopMonitoring(document.getElementById('mat-btn'));
  
    const dom: HTMLElement = this.elementRef.nativeElement;
    dom.querySelectorAll('.card-header').forEach(el => {
      if (el.innerHTML.includes(StatusEnum.todo)) {
        $(el).css({'color': 'rgb(57 197 255)'});
      }
      if (el.innerHTML.includes(StatusEnum.inProgress)) {
        $(el).css({'color': 'rgb(255 149 119)'});
      }
      if (el.innerHTML.includes(StatusEnum.onReview)) {
        $(el).css({'color': 'rgb(101 85 255)'});
      }
      if (el.innerHTML.includes(StatusEnum.done)) {
        $(el).css({'color': 'rgb(58 224 104)'});
      }
      $(el).css({'font-weight': '600'});
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  getAllProjects() {
    this.projectService.getProjects()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          res.projects.filter(p => {
            return (p.userId == this.currentUser._id || p.assignedUsers.find(u => u.id == this.currentUser._id));
          }).forEach(project => {
            this.projects.unshift({
              id: project._id,
              userId: project.userId,
              projectName: project.projectName,
              description: project.description,
              status: project.status,
              assignedUsers: project.assignedUsers,
              createdAt: project.createdAt
            });
          });
          
          this.projects.length = (this.projects.length == undefined) ? 0 : this.projects.length;
          this.currentProject = {
            projectName: '',
            description: '',
            status: StatusEnum.todo,
            assignedUsers: [],
            createdAt: this.currentDate
          };
        },
        err => {
          console.log(err);
        });
  }
  
  getAllTasks() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.tasksData = res.tasks.map(task => {
            return {
              id: task._id,
              text: task.title
            };
          });
          this.projects.length = (this.projects.length == undefined) ? 0 : this.projects.length;
          this.currentProject = {
            projectName: '',
            description: '',
            status: StatusEnum.todo,
            assignedUsers: [],
            createdAt: this.currentDate
          };
        },
        err => {
          console.log(err);
        });
  }
  
  getAllUsers() {
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
          this.usersData = users.filter(user => {
            return (user.role != Role.ProjectManager) && (user._id != this.currentUser._id);
          }).map((user, i) => {
            return {
              id: user._id,
              text: user.firstName + ' ' + user.lastName
            };
          });
        },
        err => {
          console.log(err);
        });
  }
  
  getCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
          this.currentUser = user;
        },
        err => {
          console.log(err);
        });
  }
  
  addProject(content, e) {
    e.preventDefault();
    this.projects.length = (this.projects.length == undefined) ? 0 : this.projects.length;
    let currentProject = {
      id: this.projects.length + 1,
      projectName: '',
      description: '',
      status: StatusEnum.todo,
      assignedUsers: [],
      createdAt: this.currentDate
    };
    this.projectForm.setValue(currentProject);
    this.addProjectFlag = true;
    this.modalService.open(content, {centered: true});
  }
  
  showUpdatedItem(project) {
    let updateItem = this.projects.find(this.findIndexToUpdate, project.id);
    let index = this.projects.indexOf(updateItem);
    this.projects[index] = project;
  }
  
  findIndexToUpdate(project) {
    return project.id === this;
  }
  
  onSubmit(modal) {
    if (!this.addProjectFlag) {
      this.projectService.updateProject(this.projectForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
            console.log(data.message);
            this.showUpdatedItem(this.projectForm.value);
          },
          err => {
            console.log(err);
          });
    } else {
      this.projectService.addProject(this.projectForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(p => {
            this.projects.unshift({
              id: p._id,
              userId: p.userId,
              description: p.description,
              projectName: p.projectName,
              status: p.status,
              assignedUsers: p.assignedUsers,
              createdAt: p.createdAt
            });
          },
          err => {
            console.log(err);
          });
    }
    modal.close();
  }
  
  updateProject(content, project) {
    this.addProjectFlag = false;
    this.projectForm.setValue({
      id: project.id || project._id,
      projectName: project.projectName,
      description: project.description,
      status: project.status,
      assignedUsers: project.assignedUsers,
      createdAt: project.createdAt
    });
    this.modalService.open(content, {centered: true});
  }
  
  deleteProject(modal) {
    this.projectService.deleteProject(this.projectForm.value.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
          this.projects = this.projects.filter(project => project.id !== this.projectForm.value.id);
          console.log(data.message);
          this.projects.length = (this.projects.length == undefined) ? 0 : this.projects.length;
          let currentProject = {
            id: this.projects.length + 1,
            projectName: '',
            description: '',
            status: StatusEnum.todo,
            assignedUsers: [],
            createdAt: this.currentDate
          };
          this.projectForm.setValue(currentProject);
          modal.close();
        },
        err => {
          console.log(err);
        });
  }
}
