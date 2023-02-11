import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TaskModel} from 'src/app/shared/models/task.model';
import {TaskService} from 'src/app/shared/services/task.service';
import {StatusEnum} from 'src/app/shared/enums';
import {CardSettingsModel, KanbanComponent} from '@syncfusion/ej2-angular-kanban';
import {Select2OptionData} from 'ng-select2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from 'src/app/shared/services/user.service';
import * as $ from 'jquery';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Role} from '../shared/models/user.model';
import {ProjectsService} from '../shared/services/project.service';
import {ProjectModel} from '../shared/models/project.model';
import {faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import {DatePipe} from '@angular/common';
import {FocusMonitor} from '@angular/cdk/a11y';
import {NgxSpinnerService} from 'ngx-spinner';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {Query} from '@syncfusion/ej2-data';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewChecked, OnDestroy {
  
  @ViewChild('kanban') kanban: KanbanComponent;
  
  taskForm: FormGroup;
  tasks: TaskModel[] = [];
  tasksList: TaskModel[] = [];
  cardSettings: CardSettingsModel = {
    contentField: 'description',
    headerField: 'id'
  };
  addTaskFlag: boolean;
  statusData: Array<Select2OptionData> = [];
  employeeData: Array<Select2OptionData> = [];
  usersData: Array<{ id: string; text: string; }> = [];
  selectedProjectId: number;
  firstUserId: string = '';
  setBackground = false;
  filterStatus = false;
  public dropdownSettings: IDropdownSettings = {};
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: { _id: number; firstName: string; lastName: string; email: string; password: string; role: Role; } = {
    _id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.ProjectManager
  };
  currentProject: ProjectModel;
  calendarIcon;
  currentDate;
  onlyMyIssues = false;
  overdue: boolean = false;
  selectedUser;
  dateFilterValue;
  dateFilterData;
  isFrom: boolean;
  isTo: boolean;
  date1Value;
  date2Value;
  searchText;
  
  
  get f() {
    return this.taskForm.controls;
  }
  
  constructor(private formBuilder: FormBuilder,
              public taskService: TaskService,
              private modalService: NgbModal,
              private userService: UserService,
              private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private datepipe: DatePipe,
              private _focusMonitor: FocusMonitor,
              private spinner: NgxSpinnerService,
              private elementRef: ElementRef) {
    this.route.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(param => {
        this.selectedProjectId = param['paramKey'];
      });
  }
  
  ngOnInit() {
    this.dateFilterData = [
      {id: 'equal', text: 'equal'},
      {id: 'between', text: 'between'},
      {id: 'before', text: 'before'},
      {id: 'after', text: 'after'}
    ];
  
    this.selectedUser = null;
    this.dateFilterValue = null;
    this.searchText = null;
    this.isFrom = true;
    this.isTo = true;
    this.date1Value = '';
    this.date2Value = '';
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.currentDate = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
    
    this.calendarIcon = faCalendarDays;
    this.statusData = [
      {id: StatusEnum.todo, text: StatusEnum.todo},
      {id: StatusEnum.inProgress, text: StatusEnum.inProgress},
      {id: StatusEnum.onReview, text: StatusEnum.onReview},
      {id: StatusEnum.done, text: StatusEnum.done}
    ];
    this.getCurrentProject();
    this.taskForm = this.formBuilder.group({
      id: [''],
      employeeId: ['', Validators.required],
      projectId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', {required: false}],
      status: ['', Validators.required],
      deadline: [this.currentDate, [Validators.required]],
    });
  }
  
  ngAfterViewChecked() {
    this._focusMonitor.stopMonitoring(document.getElementById('mat-btn'));
    
    const dom: HTMLElement = this.elementRef.nativeElement;
    dom.querySelectorAll('.e-item-count').forEach(el => {
      el.innerHTML = el.innerHTML.replace('items', 'tasks');
    });
    
    dom.querySelectorAll('.e-header-text').forEach(el => {
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
    
    dom.querySelectorAll('.e-header-cells').forEach(el => {
      if (el.innerHTML.includes(StatusEnum.todo)) {
        $(el).css({'background-color': '#EDF9FF'});
      }
      if (el.innerHTML.includes(StatusEnum.inProgress)) {
        $(el).css({'background-color': '#FFEFEA'});
      }
      if (el.innerHTML.includes(StatusEnum.onReview)) {
        $(el).css({'background-color': '#EAE8FF'});
      }
      if (el.innerHTML.includes(StatusEnum.done)) {
        $(el).css({'background-color': '#E8FBED'});
      }
    });
    
    dom.querySelectorAll('.e-content-cells').forEach(el => {
      $(el).css({'background-color': '#F4F5F7'});
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  getCurrentProject() {
    this.projectsService.getCurrentProject(this.selectedProjectId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(project => {
          this.currentProject = project;
          this.getCurrentUser();
          this.getAllUsers();
          this.getAllTasks();
          setTimeout(() => {
            this.tasks = this.tasksList.filter(task => {
              return task.projectId == this.selectedProjectId;
            });
          }, 100);
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
  
  getAllTasks() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.tasksList = [];
          this.tasks = [];
          res.tasks.forEach(task => {
            this.tasksList.push({
              id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              deadline: task.deadline,
              employeeId: task.employeeId,
              projectId: task.projectId
            });
          });
          
          let currentTask = {
            id: Math.floor(Math.random() * 100),
            employeeId: this.firstUserId,
            projectId: this.selectedProjectId,
            title: '',
            description: '',
            status: StatusEnum.todo,
            deadline: this.currentDate
          };
          this.taskForm.setValue(currentTask);
        },
        err => {
          console.log(err);
        });
  }
  
  getAllUsers() {
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
          this.currentProject.assignedUsers?.forEach(u => {
            users.forEach(user => {
              if (user._id == u.id) {
                this.employeeData.push({
                  id: user._id,
                  text: user.firstName + ' ' + user.lastName
                });
              }
            });
          });
          this.firstUserId = this.employeeData[0].id;
        },
        err => {
          console.log(err);
        });
  }
  
  drop(event) {
    this.taskService.updateTask(event.data[0])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
          console.log(data.message);
        },
        err => {
          console.log(err);
        });
  }
  
  openModal(content, task) {
    this.addTaskFlag = false;
    this.taskForm.setValue(task.data);
    this.modalService.open(content, {centered: true});
  }
  
  onSubmit(modal) {
    if (!this.addTaskFlag) {
      this.taskService.updateTask(this.taskForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
            console.log(data.message);
            this.kanban.updateCard(this.taskForm.value);
          },
          err => {
            console.log(err);
          });
      this.kanban.closeDialog();
    } else {
      this.taskService.addTask(this.taskForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(task => {
            let newTask = {
              id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              deadline: task.deadline,
              employeeId: task.employeeId,
              projectId: task.projectId
            };
            this.tasks.push(newTask);
            this.kanban.render();
          },
          err => {
            console.log(err);
          });
    }
    modal.close();
  }
  
  addTask(content) {
    let currentTask = {
      id: Math.floor(Math.random() * 100),
      title: '',
      description: '',
      status: StatusEnum.todo,
      deadline: this.currentDate,
      employeeId: this.firstUserId,
      projectId: this.selectedProjectId
    };
    this.taskForm.setValue(currentTask);
    this.addTaskFlag = true;
    this.modalService.open(content, {centered: true});
  }
  
  deleteTask(modal) {
    this.taskService.deleteTask(this.taskForm.value.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
          console.log(data.message);
          this.tasks.filter(task => task.id !== this.taskForm.value.id);
          this.kanban.deleteCard(this.taskForm.value);
        },
        err => {
          console.log(err);
        });
    modal.close();
  }
  
  findMyIssues() {
    this.onlyMyIssues = !this.onlyMyIssues;
    this.tasks = [];
    this.tasksList = [];
    this.getAllTasks();
    setTimeout(() => {
      this.tasks = this.tasksList.filter(task => {
        if (this.onlyMyIssues == true) {
          return task.projectId == this.selectedProjectId && task.employeeId == this.currentUser._id;
        } else {
          return task.projectId == this.selectedProjectId;
        }
      });
    }, 100);
  }
  
  overdueDateStyle(task) {
    this.overdue = this.datepipe.transform(task.deadline, 'YYYY-MM-dd') < this.currentDate;
    if (this.overdue && task.status != StatusEnum.done) {
      return {'color': 'rgb(221 4 38 / 70%)'};
    } else {
      return {'color': '#66666666'};
    }
  }
  
  filterMenu() {
    this.filterStatus = !this.filterStatus;
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
          this.usersData = [];
          this.currentProject.assignedUsers?.forEach(u => {
            users.forEach(user => {
              if (user._id == u.id) {
                this.usersData.push({
                  id: user._id,
                  text: user.firstName + ' ' + user.lastName
                });
              }
            });
          });
        },
        err => {
          console.log(err);
        });
  }
  
  selectUser(e) {
    let filterQuery: Query = new Query();
    if (!!e) {
      filterQuery = new Query().where('employeeId', 'equal', e);
    }
    this.kanban.query = filterQuery;
  }
  
  search(e) {
    let searchValue: string = (<HTMLInputElement>e.target).value;
    let searchQuery: Query = new Query();
    if (searchValue !== '') {
      searchQuery = new Query().search(searchValue, ['title'], 'contains', true);
    }
    this.kanban.query = searchQuery;
  }
  
  dateFilter(e) {
    if (!!e) {
      if (e == 'between') {
        this.isFrom = false;
        this.isTo = false;
      } else if (e == 'before' || e == 'equal') {
        this.isFrom = true;
        this.isTo = false;
        this.date1Value = null;
      } else if (e == 'after') {
        this.isFrom = false;
        this.isTo = true;
        this.date2Value = null;
      } else {
        this.isFrom = true;
        this.isTo = true;
        this.date1Value = null;
        this.date2Value = null;
      }
    }
  }
  
  dateCompare() {
    if (!!this.dateFilterValue) {
      let filterQuery: Query = new Query();
      if (!!this.date1Value && !!this.date2Value) {
        filterQuery = new Query().where('deadline', 'before', this.date1Value).where('deadline', 'after', this.date2Value);
      } else if (!!this.date2Value) {
        if (this.dateFilterValue == 'equal') {
          filterQuery = new Query().where('deadline', this.dateFilterValue, this.date2Value);
        } else if (this.dateFilterValue == 'before') {
          filterQuery = new Query().where('deadline', this.dateFilterValue, this.date2Value);
        }
      } else if (!!this.date1Value) {
          filterQuery = new Query().where('deadline', this.dateFilterValue, this.date1Value);
      }
      this.kanban.query = filterQuery;
    }
  }
  
  
  filter(e, type) {
    // let filterQuery: Query = new Query();
    if(type == 'employee' && !this.searchText && !this.dateFilterValue && !this.date1Value && !this.date2Value) {
      this.selectUser(e);
    } else if(type == 'search' && !this.selectedUser && !this.dateFilterValue && !this.date1Value && !this.date2Value) {
      this.search(e);
    } else if(type == 'date' && !this.searchText && !this.selectedUser) {
      this.dateCompare();
    }
    // else if(type == 'employee' && !!this.searchText && !this.dateFilterValue && !this.date1Value && !this.date2Value) {
    //   if (!!e) {
    //     filterQuery = new Query().where('employeeId', 'equal', e);
    //   }
    //   let searchValue: string = (<HTMLInputElement>e.target).value;
    //
    //   if (searchValue !== '') {
    //     filterQuery = filterQuery.search(searchValue, ['title'], 'contains', true);
    //   }
    // }
    // else if(type == 'search' && !this.selectedUser && !this.dateFilterValue && !this.date1Value && !this.date2Value) {
    //   this.search(e);
    // } else if(type == 'date' && !this.searchText && !this.selectedUser) {
    //   this.dateCompare();
    // }
    
    // this.kanban.query = filterQuery;
  }
}
