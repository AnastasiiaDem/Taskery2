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

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewChecked, OnDestroy {
  
  @ViewChild('kanban') kanban: KanbanComponent;
  
  taskForm: FormGroup;
  tasks: TaskModel[] = [];
  cardSettings: CardSettingsModel = {
    contentField: 'description',
    headerField: 'id'
  };
  addTaskFlag: boolean;
  statusData: Array<Select2OptionData> = [];
  employeeData: Array<Select2OptionData> = [];
  selectedProjectId: number;
  firstUserId: string = '';
  setBackground = false;
  
  private readonly unsubscribe: Subject<void> = new Subject();
  
  get f() {
    return this.taskForm.controls;
  }
  
  constructor(private formBuilder: FormBuilder,
              public taskService: TaskService,
              private modalService: NgbModal,
              private userService: UserService,
              private route: ActivatedRoute,
              private elementRef: ElementRef) {
    this.route.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(param => {
        this.selectedProjectId = param['paramKey'];
      });
  }
  
  ngOnInit() {
    this.statusData = [
      {id: StatusEnum.todo, text: StatusEnum.todo},
      {id: StatusEnum.inProgress, text: StatusEnum.inProgress},
      {id: StatusEnum.onReview, text: StatusEnum.onReview},
      {id: StatusEnum.done, text: StatusEnum.done}
    ];
    this.getAllUsers();
    this.getAllTasks();
    this.taskForm = this.formBuilder.group({
      id: [''],
      employeeId: ['', Validators.required],
      projectId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', {required: false}],
      status: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
    });
  }
  
  ngAfterViewChecked() {
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
  
  getAllTasks() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.tasks = [];
          res.tasks.filter(task => (task.projectId == this.selectedProjectId)).forEach(task => {
            this.tasks.push({
              id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              duration: task.duration,
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
            duration: 0
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
          this.employeeData = users.filter(user => user.role != Role.ProjectManager).map(user => {
            return {
              id: user._id,
              text: user.firstName + ' ' + user.lastName
            };
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
            this.tasks.push({
              id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              duration: task.duration,
              employeeId: task.employeeId,
              projectId: task.projectId
            });
          this.kanban.addCard(task);
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
      duration: 0,
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
}
