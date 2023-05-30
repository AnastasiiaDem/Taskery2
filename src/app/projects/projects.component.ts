import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {ProjectModel} from '../shared/models/project.model';
import {ProjectsService} from '../shared/services/project.service';
import {RoleEnum, StatusEnum} from '../shared/enums';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Select2OptionData} from 'ng-select2';
import {TaskService} from '../shared/services/task.service';
import * as $ from 'jquery';
import {Subject, takeUntil} from 'rxjs';
import {UserService} from '../shared/services/user.service';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {NgxSpinnerService} from 'ngx-spinner';
import {FocusMonitor} from '@angular/cdk/a11y';
import {DatePipe} from '@angular/common';
import {EmailService} from '../shared/services/email.service';
import {ToastrService} from 'ngx-toastr';
import {QuillModules} from 'ngx-quill/lib/quill-editor.interfaces';
import 'quill-emoji/dist/quill-emoji.js';
import * as QuillNamespace from 'quill';
import ImageCompress from 'quill-image-compress';
import Emoji from 'quill-emoji';
import Mention from 'quill-mention';
import {AIService} from '../shared/services/ai.service';
import { TranslocoService } from '@ngneat/transloco';

let Quill: any = QuillNamespace;

Quill.register('modules/imageCompress', ImageCompress);

Quill.register('modules/emoji', Emoji);

Quill.register('modules/mention', Mention);


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss', '../board/board.component.scss'],
})
export class ProjectsComponent implements OnInit, AfterViewChecked, OnDestroy {
  projects: ProjectModel[] = [];
  currentProject: { description: string; projectName: string; status: StatusEnum; assignedUsers: [], createdAt: string, updatedAt: string, budget: number };
  projectForm: FormGroup;
  statusData: Array<Select2OptionData> = [];
  tasksData: Array<Select2OptionData> = [];
  usersData: Array<{ id: string; text: string; }> = [];
  addProjectFlag: boolean;
  currentDate;
  private readonly unsubscribe: Subject<void> = new Subject();
  public dropdownSettings: IDropdownSettings = {};
  currentUser: { _id: number; firstName: string; lastName: string; email: string; password: string; role: RoleEnum; } = {
    _id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: RoleEnum.ProjectManager
  };
  previewData;
  submitted = false;
  descriptionText = '';
  
  atValues = [];
  
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
  
  quillConfig: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{'color': []}, {'background': []}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        [{'align': []}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['code-block'],
        ['emoji'],
        ['clean'],
        ['link', 'image']
      ],
      
    },
    imageCompress: {
      maxWidth: 450
    },
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@'],
      source: (searchTerm, renderList, mentionChar) => {
        let values;
        
        if (mentionChar === '@') {
          values = this.atValues;
        }
        
        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
    'emoji-toolbar': false,
    'emoji-textarea': false,
    'emoji-shortname': false,
  };
  
  
  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private taskService: TaskService,
              private aiService: AIService,
              private projectService: ProjectsService,
              private userService: UserService,
              private elementRef: ElementRef,
              private datepipe: DatePipe,
              private toastr: ToastrService,
              private emailService: EmailService,
              private _focusMonitor: FocusMonitor,
              private translocoService: TranslocoService,
              private spinner: NgxSpinnerService) {
  }
  
  get f() {
    return this.projectForm.controls;
  }
  
  ngOnInit() {
    this.currentDate = new Date();
    
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
      updatedAt: [this.currentDate, Validators.required],
      budget: [0, Validators.required]
    });
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }
  
  ngAfterViewChecked() {
    const dom: HTMLElement = this.elementRef.nativeElement;
    dom.querySelectorAll('.status').forEach(el => {
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
    
    dom.querySelectorAll('.circle').forEach(el => {
      if (el.innerHTML.includes(StatusEnum.todo)) {
        $(el).css({'background': 'rgb(57 197 255)'});
      }
      if (el.innerHTML.includes(StatusEnum.inProgress)) {
        $(el).css({'background': 'rgb(255 149 119)'});
      }
      if (el.innerHTML.includes(StatusEnum.onReview)) {
        $(el).css({'background': 'rgb(101 85 255)'});
      }
      if (el.innerHTML.includes(StatusEnum.done)) {
        $(el).css({'background': 'rgb(58 224 104)'});
      }
    });
  
  
    const statusMap = {
      'To Do': 'Зробити',
      'In Progress': 'У Процесі',
      'On Review': 'На Перевірці',
      'Done': 'Виконано',
      'Зробити': 'To Do',
      'У Процесі': 'In Progress',
      'На Перевірці': 'On Review',
      'Виконано': 'Done'
    };
    
  
    dom.querySelectorAll('.status-text').forEach(el => {
      if (this.translocoService.getActiveLang() == 'ua') {
        el.innerHTML = el.innerHTML.replace(/To Do|In Progress|On Review|Done/g, matched => statusMap[matched]);
      } else {
        el.innerHTML = el.innerHTML.replace(/Зробити|У Процесі|На Перевірці|Виконано/g, matched => this.getKeyByValue(statusMap, matched));
      }
    });
  }
  
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
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
            this.projects.push({
              id: project._id,
              userId: project.userId,
              projectName: project.projectName,
              description: project.description,
              status: project.status,
              assignedUsers: project.assignedUsers,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
              budget: project.budget || 0
            });
          });
          this.sortProjects();
          this.projects.length = (this.projects.length == undefined) ? 0 : this.projects.length;
          this.currentProject = {
            projectName: '',
            description: '',
            status: StatusEnum.todo,
            assignedUsers: [],
            createdAt: this.currentDate,
            updatedAt: this.currentDate,
            budget: 0
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
            createdAt: this.currentDate,
            updatedAt: this.currentDate,
            budget: 0
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
            return (user.role != RoleEnum.ProjectManager) && (user._id != this.currentUser._id);
          }).map(user => {
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
      createdAt: this.currentDate,
      updatedAt: this.currentDate,
      budget: 0
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
    this.submitted = true;
    if (!this.addProjectFlag) {
      this.projectService.updateProject(this.projectForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
            this.projectForm.value.updatedAt = new Date();
            console.log(data.message);
            this.submitted = false;
            this.showUpdatedItem(this.projectForm.value);
            this.sortProjects();
          },
          err => {
            console.log(err);
          });
    } else {
      this.projectService.addProject(this.projectForm.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(p => {
            this.projects.push({
              id: p._id,
              userId: p.userId,
              description: p.description,
              projectName: p.projectName,
              status: p.status,
              assignedUsers: p.assignedUsers,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
              budget: p.budget || 0
            });
            this.sortProjects();
          },
          err => {
            console.log(err);
          });
    }
    
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
          this.projectForm.value.assignedUsers?.forEach(assigned => {
            let projectUser = users.find(u => u._id === assigned.id);
            if (projectUser.sendAssignedEmail) {
              this.email(projectUser._id, this.projectForm.value);
            }
          });
        },
        err => {
          console.log(err);
        });
    modal.close();
  }
  
  openModal(content, project) {
    this.addProjectFlag = false;
    this.projectForm.setValue({
      id: project.id || project._id,
      projectName: project.projectName,
      description: project.description,
      status: project.status,
      assignedUsers: project.assignedUsers,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      budget: project.budget || 0
    });
    let assignedList = '';
    
    project.assignedUsers.forEach(u => {
      assignedList += u.text + '<br>';
    });
    
    this.previewData = {
      projectName: project.projectName,
      description: project.description,
      status: project.status,
      assignedUsers: assignedList,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      budget: project.budget || 0
    };
    this.modalService.open(content, {centered: true});
  }
  
  updateProject(content, modal) {
    this.addProjectFlag = false;
    modal.close();
    this.modalService.open(content, {centered: true});
  }
  
  deleteProject(content, modal) {
    modal.close();
    this.modalService.open(content, {centered: true});
  }
  
  isDelete(action, modal) {
    if (action == 'confirm') {
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
              createdAt: this.currentDate,
              updatedAt: this.currentDate,
              budget: 0
            };
            this.projectForm.setValue(currentProject);
          },
          err => {
            console.log(err);
          });
      modal.close();
    } else {
      modal.close();
    }
  }
  
  email(userId, project) {
    this.emailService.sendEmail(userId, project, '', '', 'project')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(response => {
          console.log(response.message);
          // this.toastr.success(response.message);
        },
        error => {
          console.log(error);
          // this.toastr.error(error);
        });
  }
  
  sortProjects() {
    this.projects.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
  
  writeBriefAI() {
    if (this.projectForm.value.projectName != '') {
      this.spinner.show();
      this.aiService.getAIproject((this.translocoService.getActiveLang() == 'ua' ?
          'Напишіть загальний опис на початок проєкту, де є мета. Назва проєкту: '
          : 'Write a brief with a purpose for the start of the project. Project title: ') + this.projectForm.value.projectName)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(response => {
            this.projectForm.controls['description'].setValue(response.choices[0].message.content);
            this.spinner.hide();
          },
          error => {
            console.log(error);
            this.spinner.hide();
          });
    }
  }
  
  calcBudgetAI() {
    if (this.projectForm.value.projectName != '') {
      this.spinner.show();
        this.aiService.getAIbudget(
            this.translocoService.getActiveLang() == 'ua' ?
              ('ТВОЯ ВІДПОВІДЬ ПОВИННА МІСТИТИ ЛИШЕ ОДНЕ ЧИСЛО БЕЗ ТЕКСТУ. Яка мінімальна вартість проекту на місяць в доларах, включно із заробітною платою та технічними витратами, обов`язково враховуючи кількість працівників (де зарплата одного приблизно 1500 доларів), також орієнтуватись на назву та опис проєкту? де кількості працівників: ' + this.projectForm.value.assignedUsers.length + ';\nназва проєкту: ' + this.projectForm.value.projectName + ';\nопис: ' + this.descriptionText)
              : ('YOUR RESPOND HAVE TO CONTAIN ONLY ONE NUMBER WITHOUT TEXT. What is the minimum cost of the project per month, including salaries and technical expenses, based on the number of employees, project name and description? where number of employees: ' + this.projectForm.value.assignedUsers.length + ';\nproject name: ' + this.projectForm.value.projectName + ';\nDescription: ' + this.descriptionText)
          )
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(response => {
              this.projectForm.controls['budget'].setValue(parseInt(response.choices[0].message.content.replace(/[^0-9]/g, '')));
              this.spinner.hide();
            },
            error => {
              console.log(error);
              this.spinner.hide();
            });
    }
  }
  
  budgetChanged(event) {
    this.projectForm.value.budget = parseInt(this.projectForm.value.budget.replace(/[^0-9]/g, ''));
  }
  
  contentChanged(event) {
    this.projectForm.value.description = event.html;
    this.descriptionText = event.text;
  }
}
