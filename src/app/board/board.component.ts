import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TaskService} from 'src/app/shared/services/task.service';
import {RoleEnum, StatusEnum} from 'src/app/shared/enums';
import {CardSettingsModel, KanbanComponent, SortSettingsModel} from '@syncfusion/ej2-angular-kanban';
import {Select2OptionData} from 'ng-select2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from 'src/app/shared/services/user.service';
import * as $ from 'jquery';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ProjectsService} from '../shared/services/project.service';
import {ProjectModel} from '../shared/models/project.model';
import {faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import {DatePipe} from '@angular/common';
import {FocusMonitor} from '@angular/cdk/a11y';
import {NgxSpinnerService} from 'ngx-spinner';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {Query} from '@syncfusion/ej2-data';
import {EmailService} from '../shared/services/email.service';
import {QuillModules} from 'ngx-quill/lib/quill-editor.interfaces';
import 'quill-emoji/dist/quill-emoji.js';
import * as QuillNamespace from 'quill';
import ImageCompress from 'quill-image-compress';
import Emoji from 'quill-emoji';
import Mention from 'quill-mention';
import {AIService} from '../shared/services/ai.service';
import {TranslocoService} from '@ngneat/transloco';
import {AuthService} from '../shared/services/auth.service';

let Quill: any = QuillNamespace;

Quill.register('modules/imageCompress', ImageCompress);

Quill.register('modules/emoji', Emoji);

Quill.register('modules/mention', Mention);


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('kanban') kanban: KanbanComponent;

  taskForm: FormGroup;
  tasks = [];
  tasksList = [];
  cardSettings: CardSettingsModel = {
    contentField: 'description',
    headerField: 'id'
  };
  sortSettings: SortSettingsModel = {};
  addTaskFlag: boolean;
  statusData: Array<Select2OptionData> = [];
  employeeData: Array<Select2OptionData> = [];
  usersData: Array<{ id: string; text: string; }> = [];
  selectedProjectId: number;
  firstUserId: string = '';
  filterStatus = false;
  public dropdownSettings: IDropdownSettings = {};
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUserData = {
    _id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: RoleEnum.ProjectManager
  };
  currentProject: ProjectModel;
  calendarIcon;
  currentDate;
  AllIssues = false;
  selectedUser;
  dateFilterValue;
  dateFilterData;
  isFrom: boolean;
  isTo: boolean;
  date1Value;
  date2Value;
  searchText;
  overdue;
  initialStatus;
  previewData;
  submitted = false;

  aiResponse: any;
  aiData: any = '';

  atValues = [];

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
          for (var i = 0; i < values.length; i++)
            if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
  };

  constructor(private formBuilder: FormBuilder,
              public taskService: TaskService,
              private modalService: NgbModal,
              private userService: UserService,
              private aiService: AIService,
              private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private datepipe: DatePipe,
              private emailService: EmailService,
              private _focusMonitor: FocusMonitor,
              private spinner: NgxSpinnerService,
              private translocoService: TranslocoService,
              private authenticationService: AuthService,
              private elementRef: ElementRef) {
    this.route.params
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(param => {
        this.selectedProjectId = param['paramKey'];
      });

    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => {
        if (!!x) {
          this.currentUserData = x['foundUser'];
          this.getAllTasks();
        }
      });
  }

  get f() {
    return this.taskForm.controls;
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
      el.innerHTML = el.innerHTML.replace('items', '');
    });

    dom.querySelectorAll('.e-header-text').forEach(el => {
      $(el).css({'color': '#4D4B54'});
      $(el).css({'font-size': '12px'});
      $(el).css({'font-weight': '800'});
    });

    dom.querySelectorAll('.e-header-cells').forEach(el => {
      $(el).css({'background-color': '#F4F5F7'});
    });

    dom.querySelectorAll('.e-content-cells').forEach(el => {
      $(el).css({'background-color': '#F4F5F7'});
    });

    const monthShortMap = {
      'Jan': 'Січ',
      'Feb': 'Лют',
      'Mar': 'Бер',
      'Apr': 'Квіт',
      'May': 'Трав',
      'Jun': 'Черв',
      'Jul': 'Лип',
      'Aug': 'Серп',
      'Sep': 'Вер',
      'Oct': 'Жовт',
      'Nov': 'Лист',
      'Dec': 'Груд',
      'Січ': 'Jan',
      'Лют': 'Feb',
      'Бер': 'Mar',
      'Квіт': 'Apr',
      'Трав': 'May',
      'Черв': 'Jun',
      'Лип': 'Jul',
      'Серп': 'Aug',
      'Вер': 'Sep',
      'Жовт': 'Oct',
      'Лист': 'Nov',
      'Груд': 'Dec'
    };

    dom.querySelectorAll('.card-deadline').forEach(el => {
      if (this.translocoService.getActiveLang() == 'ua') {
        el.innerHTML = el.innerHTML.replace(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/g, matched => monthShortMap[matched]);
      } else {
        el.innerHTML = el.innerHTML.replace(/Січ|Лют|Бер|Квіт|Трав|Черв|Лип|Серп|Вер|Жовт|Лист|Груд/g, matched => this.getKeyByValue(monthShortMap, matched));
      }
    });
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  getHeaderStyle(title) {
    return title.toUpperCase();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getCurrentProject() {
    this.projectsService.getCurrentProject(this.selectedProjectId)
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(project => {
          this.currentProject = project;
          this.getAllUsers();
          setTimeout(() => {
            this.tasks = this.tasksList.filter(task => {
              if (this.currentUserData.role == 'ProjectManager') {
                return task.projectId == this.selectedProjectId;
              } else {
                return task.projectId == this.selectedProjectId && task.employeeId == this.currentUserData._id;
              }
            });
          }, 100);
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
          setTimeout(() => {
            this.kanban.render();

          }, 500);
        },
        err => {
          console.log(err);
        });
  }

  getAllUsers() {
    this.userService.getUsers()
      .pipe(
        takeUntil(this.unsubscribe)
      )
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

          this.atValues = [];
          users.filter(u => u._id != this.currentUserData._id || !!this.employeeData.find(usr => usr.id == u._id)).forEach(user => {
            this.atValues.push({
              id: user._id,
              value: user.firstName + ' ' + user.lastName,
              link: 'https://mail.google.com/mail/u/' + this.currentUserData.email + '/?view=cm&to=' + user.email
            });
          });
          this.firstUserId = this.employeeData[0].id;
        },
        err => {
          console.log(err);
        });
  }

  dropStart(event) {
    this.initialStatus = event.data[0].status;
  }

  drop(event) {
    this.taskService.updateTask(event.data[0])
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(data => {
          this.currentProject.updatedAt = new Date().toString();
          this.projectsService.updateProject(this.currentProject)
            .pipe(
              takeUntil(this.unsubscribe)
            )
            .subscribe(res => {
                console.log(res.message);
              },
              err => {
                console.log(err);
              });
          this.userService.getUsers()
            .pipe(
              takeUntil(this.unsubscribe)
            )
            .subscribe(users => {
                let taskUser = users.find(u => u._id === event.data[0].employeeId);
                if (taskUser.sendTaskOverdueEmail) {
                  this.email(taskUser._id, this.currentProject, event.data[0], 'taskUpdate');
                }
              },
              err => {
                console.log(err);
              });
          console.log(data.message);
        },
        err => {
          console.log(err);
        });
  }

  openModal(content, task) {
    this.addTaskFlag = false;
    this.taskForm.setValue({
      id: task.data.id,
      title: task.data.title,
      description: task.data.description,
      status: task.data.status,
      deadline: task.data.deadline,
      employeeId: task.data.employeeId,
      projectId: task.data.projectId
    });
    this.previewData = {
      title: task.data.title,
      description: task.data.description,
      status: task.data.status,
      deadline: task.data.deadline,
      employee: this.employeeData.find(e => e.id == task.data.employeeId).text
    };
    this.modalService.open(content, {centered: true});
  }

  updateTask(content, modal) {
    this.addTaskFlag = false;
    modal.close();
    this.modalService.open(content, {centered: true});
  }

  onSubmit(modal) {
    this.submitted = true;

    if (!this.addTaskFlag) {
      this.taskService.updateTask(this.taskForm.value)
        .pipe(
          takeUntil(this.unsubscribe)
        )
        .subscribe(data => {
            console.log(data.message);
            this.kanban.updateCard(this.taskForm.value);
            this.kanban.render();
            this.currentProject.updatedAt = new Date().toString();
            this.submitted = false;
            this.projectsService.updateProject(this.currentProject)
              .pipe(
                takeUntil(this.unsubscribe)
              )
              .subscribe(res => {
                  console.log(res.message);
                },
                err => {
                  console.log(err);
                });
            this.userService.getUsers()
              .pipe(
                takeUntil(this.unsubscribe)
              )
              .subscribe(users => {
                  let taskUser = users.find(u => u._id === this.taskForm.value.employeeId);
                  if (taskUser.sendTaskOverdueEmail) {
                    this.email(taskUser._id, this.currentProject, this.taskForm.value, 'taskUpdate');
                  }

                  setTimeout(() => {
                    let parentHTML = document.querySelectorAll('[data-id="' + this.taskForm.value.id + '"]');
                    let descriptionHTML = parentHTML[0].getElementsByClassName('mention');
                    if (!!descriptionHTML.length) {
                      let mentionId = descriptionHTML[0]['dataset'].id;

                      let mentionedUser = users.find(u => u._id === mentionId);
                      if (mentionedUser.sendTaskOverdueEmail) {
                        this.email(mentionedUser._id, this.currentProject, this.taskForm.value, 'mention');
                      }
                    }
                  }, 1000);
                },
                err => {
                  console.log(err);
                });
          },
          err => {
            console.log(err);
          });
      this.kanban.closeDialog();
    } else {
      this.taskService.addTask(this.taskForm.value)
        .pipe(
          finalize(() => this.spinner.hide()),
          takeUntil(this.unsubscribe)
        )
        .subscribe(task => {
            this.currentProject.updatedAt = new Date().toString();
            this.projectsService.updateProject(this.currentProject)
              .pipe(
                takeUntil(this.unsubscribe)
              )
              .subscribe(res => {
                  console.log(res.message);
                },
                err => {
                  console.log(err);
                });
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
            this.submitted = false;
            this.kanban.render();
            this.userService.getUsers()
              .pipe(
                takeUntil(this.unsubscribe)
              )
              .subscribe(users => {
                  let taskUser = users.find(u => u._id === this.taskForm.value.employeeId);
                  if (taskUser.sendTaskEmail && this.taskForm.value.status == 'To Do') {
                    this.email(taskUser._id, this.currentProject, this.taskForm.value, 'task');
                  }

                  setTimeout(() => {
                    let parentHTML = document.querySelectorAll('[data-id="' + this.taskForm.value.id + '"]');
                    let descriptionHTML = parentHTML[0].getElementsByClassName('mention');
                    let mentionId = descriptionHTML[0]['dataset'].id;

                    let mentionedUser = users.find(u => u._id === mentionId);
                    if (mentionedUser.sendTaskOverdueEmail) {
                      this.email(mentionedUser._id, this.currentProject, this.taskForm.value, 'mention');
                    }
                  }, 500);
                },
                err => {
                  console.log(err);
                });
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

  deleteTask(content, modal) {
    modal.close();
    this.modalService.open(content, {centered: true});
  }

  isDelete(action, modal) {
    if (action == 'confirm') {
      this.taskService.deleteTask(this.taskForm.value.id)
        .pipe(
          takeUntil(this.unsubscribe)
        )
        .subscribe(data => {
            this.currentProject.updatedAt = new Date().toString();
            this.projectsService.updateProject(this.currentProject)
              .pipe(
                takeUntil(this.unsubscribe)
              )
              .subscribe(res => {
                  console.log(res.message);
                },
                err => {
                  console.log(err);
                });
            console.log(data.message);
            this.tasks.filter(task => task.id !== this.taskForm.value.id);
            this.kanban.deleteCard(this.taskForm.value);
          },
          err => {
            console.log(err);
          });
      modal.close();
    } else {
      modal.close();
    }
  }

  showIssues() {
    this.AllIssues = !this.AllIssues;
    this.tasks = [];
    this.tasksList = [];
    this.getAllTasks();
    setTimeout(() => {
      this.tasks = this.tasksList.filter(task => {
        if (this.AllIssues == true) {
          return task.projectId == this.selectedProjectId;
        } else {
          return task.projectId == this.selectedProjectId && task.employeeId == this.currentUserData._id;
        }
      });
    }, 500);
  }

  overdueDateStyle(task) {
    this.currentDate = this.datepipe.transform(new Date(), 'YYYY-MM-dd');

    this.overdue = task.deadline < this.currentDate;

    if (this.overdue && task.status != StatusEnum.done) {
      return {'color': '#DF2134'};
    } else {
      return {'color': '#9E9FA1'};
    }
  }

  filterMenu() {
    this.filterStatus = !this.filterStatus;
    this.userService.getUsers()
      .pipe(
        takeUntil(this.unsubscribe)
      )
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
    this.dateFilterValue = e;
    this.date1Value = null;
    this.date2Value = null;
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
    this.filter(e, 'dateFilter');
  }

  dateCompare() {
    if (!!this.dateFilterValue) {
      let filterQuery: Query = new Query();
      if (!!this.date1Value && !!this.date2Value) {
        filterQuery = new Query().where('deadline', 'greaterthanorequal', this.date1Value);
        filterQuery = filterQuery.where('deadline', 'lessthanorequal', this.date2Value);
      } else if (!!this.date2Value) {
        if (this.dateFilterValue == 'equal') {
          filterQuery = new Query().where('deadline', 'equal', this.date2Value);
        } else if (this.dateFilterValue == 'before') {
          filterQuery = new Query().where('deadline', 'lessthanorequal', this.date2Value);
        }
      } else if (!!this.date1Value) {
        filterQuery = new Query().where('deadline', 'greaterthanorequal', this.date1Value);
      }
      this.kanban.query = filterQuery;
    }
  }

  filter(e, type) {
    if (type == 'employee' && !this.searchText && !this.dateFilterValue && !this.date1Value && !this.date2Value) {
      this.selectUser(e);
    } else if (type == 'search' && !this.selectedUser && !this.dateFilterValue && !this.date1Value && !this.date2Value) {
      this.search(e);
    } else if (type == 'date' && !this.searchText && !this.selectedUser) {
      this.dateCompare();
    } else {
      if ((type == 'employee' || type == 'search') && !this.dateFilterValue && !this.date1Value && !this.date2Value) {
        let filterQuery: Query = new Query();

        if (type == 'employee' && !!e) {
          filterQuery = filterQuery.where('employeeId', 'equal', e);
        } else if (!!this.selectedUser) {
          filterQuery = filterQuery.where('employeeId', 'equal', this.selectedUser);
        }

        if (!!this.searchText) {
          filterQuery = filterQuery.search(this.searchText, ['title'], 'contains', true);
        }
        this.kanban.query = filterQuery;

      } else {

        let filterQuery: Query = new Query();

        if (type == 'employee' && !!e) {
          filterQuery = filterQuery.where('employeeId', 'equal', e);
        } else if (!!this.selectedUser) {
          filterQuery = filterQuery.where('employeeId', 'equal', this.selectedUser);
        }

        if (!!this.searchText) {
          filterQuery = filterQuery.search(this.searchText, ['title'], 'contains', true);
        }

        if (!!this.dateFilterValue) {
          // this.date1Value = null;
          // this.date2Value = null;
          if (this.dateFilterValue == 'between') {
            this.isFrom = false;
            this.isTo = false;
          } else if (this.dateFilterValue == 'before' || this.dateFilterValue == 'equal') {
            this.isFrom = true;
            this.isTo = false;
            this.date1Value = null;
          } else if (this.dateFilterValue == 'after') {
            this.isFrom = false;
            this.isTo = true;
            this.date2Value = null;
          } else {
            this.isFrom = true;
            this.isTo = true;
            this.date1Value = null;
            this.date2Value = null;
          }

          if (!!this.date1Value && !!this.date2Value) {
            filterQuery = filterQuery.where('deadline', 'greaterthanorequal', this.date1Value);
            filterQuery = filterQuery.where('deadline', 'lessthanorequal', this.date2Value);
          } else if (!!this.date2Value) {
            if (this.dateFilterValue == 'equal') {
              filterQuery = filterQuery.where('deadline', 'equal', this.date2Value);
            } else if (this.dateFilterValue == 'before') {
              filterQuery = filterQuery.where('deadline', 'lessthanorequal', this.date2Value);
            }
          } else if (!!this.date1Value) {
            filterQuery = filterQuery.where('deadline', 'greaterthanorequal', this.date1Value);
          }
        }
        this.kanban.query = filterQuery;
      }
    }
  }

  email(userId, project, task, type) {
    this.emailService.sendEmail(userId, project, task, '', type)
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(response => {
          console.log(response.message);
          // this.toastr.success(response.message);
        },
        error => {
          console.log(error);
          // this.toastr.error(error);
        });
  }

  sort(type) {
    if (type == 'oldest') {
      this.sortSettings = {
        sortBy: 'Custom',
        field: 'deadline',
        direction: 'Ascending'
      };
    } else if (type == 'newest') {
      this.sortSettings = {
        sortBy: 'Custom',
        field: 'deadline',
        direction: 'Descending'
      };
    } else {
      this.sortSettings = {
        sortBy: 'DataSourceOrder'
      };
    }
  }

  writeBriefAI() {
    if (this.taskForm.value.title != '') {
      this.aiService.getAItask(this.translocoService.getActiveLang() == 'ua' ?
          'Напишіть загальний опис на задачу, де є мета. Назва задачі: ' + this.taskForm.value.title + '. для проєкту: ' + this.currentProject?.projectName
          : 'Write a brief with a purpose for the task. Task title: ' + this.taskForm.value.title + 'for the project: ' + this.currentProject?.projectName)
        .pipe(
          takeUntil(this.unsubscribe)
        )
        .subscribe(response => {
            this.taskForm.controls['description'].setValue(response.choices[0].message.content);
          },
          error => {
            console.log(error);
          });
    }
  }

  findEmployeeName(data) {
    return this.currentProject.assignedUsers.find(employee => employee.id == data.employeeId)?.text;
  }
}
