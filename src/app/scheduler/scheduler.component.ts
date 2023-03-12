import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {jqxSchedulerComponent} from 'jqwidgets-ng/jqxscheduler';
import {Subject, takeUntil} from 'rxjs';
import {TaskService} from '../shared/services/task.service';
import {UserService} from '../shared/services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Select2OptionData} from 'ng-select2';
import {ProjectsService} from '../shared/services/project.service';
import {Role} from '../shared/models/user.model';
import {ColorPalette} from '../shared/enums';
import {TaskModel} from '../shared/models/task.model';
import {DatePipe} from '@angular/common';
import {EmailService} from '../shared/services/email.service';


@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('schedulerReference', {static: false}) scheduler: jqxSchedulerComponent;
  private readonly unsubscribe: Subject<void> = new Subject();
  
  source: any;
  tasks: any[] = [];
  tasksList: any[] = [];
  users: any[] = [];
  resources: any;
  dataAdapter: any;
  usersList = [];
  projects = [];
  previewData = {
    title: '',
    description: '',
    status: '',
    deadline: '',
    employee: '',
    projectName: ''
  };
  selectedProject = null;
  AllIssues = true;
  projectsData: Array<Select2OptionData> = [];
  currentUser: { _id: number; firstName: string; lastName: string; email: string; password: string; role: Role; } = {
    _id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.ProjectManager
  };
  date: any = new jqx.date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  appointmentDataFields =
    {
      id: 'id',
      description: 'description',
      subject: 'title',
      resourceId: 'projectName',
      employeeId: 'employeeId',
      projectId: 'projectId',
      employee: 'employee',
      status: 'status',
      from: 'start',
      to: 'end',
      readOnly: 'readOnly',
      allDay: 'allDay',
      resizable: 'resizable',
      draggable: 'draggable',
      style: 'style',
      color: 'color',
      background: 'background',
      borderColor: 'borderColor'
    };
  views: any[] =
    [
      // {type: 'dayView', timeRuler: {hidden: false}},
      // {type: 'weekView', timeRuler: {hidden: false}},
      // {type: 'agendaView', timeRuler: {hidden: false}},
      {type: 'monthView', timeRuler: {hidden: false}},
    ];
  
  ready = () => {
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
        this.usersList = [];
        users.forEach((user, i) => {
          this.usersList.push({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          });
        });
      });
    this.getCurrentUser();
    this.getAllProjects();
    this.getAllTasks();
  };
  
  constructor(public taskService: TaskService,
              public userService: UserService,
              private projectService: ProjectsService,
              private modalService: NgbModal,
              private elementRef: ElementRef,
              private projectsService: ProjectsService,
              private emailService: EmailService,
              private datepipe: DatePipe) {
  }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit() {

  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  taskDoubleClick(content, event) {
    let taskEmployeeId = this.tasks.find(t => t.id == event.args.appointment.originalData.id).employeeId;
    this.previewData = {
      title: event.args.appointment.originalData.title,
      description: event.args.appointment.originalData.description,
      status: event.args.appointment.originalData.status,
      deadline: event.args.appointment.originalData.start,
      employee: this.usersList.find(u => u.id == taskEmployeeId).firstName + ' ' +
        '' + this.usersList.find(u => u.id == taskEmployeeId).lastName,
      projectName: event.args.appointment.originalData.projectName
    };
    this.modalService.open(content, {centered: true});
  }
  
  getCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
          this.currentUser = user;
          this.AllIssues = (this.currentUser.role == Role.ProjectManager);
        },
        err => {
          console.log(err);
        });
  }
  
  getAllTasks() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.tasks = [];
          res.tasks.forEach(task => {
            if (this.projectsData.find(p => p.id == task.projectId)) {
              this.tasks.push({
                id: task._id,
                title: task.title,
                description: task.description,
                projectId: task.projectId,
                employeeId: task.employeeId,
                projectName: this.projectsData.find(p => p.id == task.projectId).text,
                employee: this.usersList.find(u => u.id == task.employeeId).firstName + ' ' +
                  '' + this.usersList.find(u => u.id == task.employeeId).lastName,
                status: task.status,
                start: task.deadline,
                end: task.deadline,
                readOnly: true,
                allDay: true,
                resizable: false,
                draggable: true,
                style: ColorPalette[this.projectsData.findIndex(p => p.id == task.projectId)],
                color: ColorPalette[this.projectsData.findIndex(p => p.id == task.projectId)],
                background: ColorPalette[this.projectsData.findIndex(p => p.id == task.projectId)],
                borderColor: ColorPalette[this.projectsData.findIndex(p => p.id == task.projectId)]
              });
            }
          });
          
          this.source = {
            dataType: 'array',
            dataFields: [
              {name: 'id', type: 'string'},
              {name: 'description', type: 'string'},
              {name: 'title', type: 'string'},
              {name: 'status', type: 'string'},
              {name: 'employee', type: 'string'},
              {name: 'projectName', type: 'string'},
              {name: 'projectId', type: 'string'},
              {name: 'employeeId', type: 'string'},
              {name: 'start', type: 'string'},
              {name: 'end', type: 'string'},
              {name: 'readOnly', type: 'boolean'},
              {name: 'allDay', type: 'boolean'},
              {name: 'resizable', type: 'boolean'},
              {name: 'draggable', type: 'boolean'},
              {name: 'style', type: 'string'},
              {name: 'color', type: 'string'},
              {name: 'background', type: 'string'},
              {name: 'borderColor', type: 'string'},
            ],
            id: 'id',
            localData: this.tasks
          };
          this.resources = {
            // colorScheme: 'scheme02',
            dataField: 'projectName',
            source: new jqx.dataAdapter(this.source)
          };
          this.dataAdapter = new jqx.dataAdapter(this.source);
          this.scheduler.source(this.dataAdapter);
          this.scheduler.resources(this.resources);
            this.filter(this.selectedProject);
        },
        err => {
          console.log(err);
        });
  }
  
  getAllProjects() {
    this.projectService.getProjects()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.projectsData = [];
          this.projects = [];
          res.projects.filter(p => {
            return (p.userId == this.currentUser._id || p.assignedUsers.find(u => u.id == this.currentUser._id));
          }).forEach(project => {
            this.projects.push(project);
            this.projectsData.push({
              id: project._id,
              text: project.projectName
            });
          });
          // this.selectedProject = this.projectsData[0].id;
        },
        err => {
          console.log(err);
        });
  }
  
  filter(event) {
    this.selectedProject = event;
    if (event !== null) {
      this.scheduler.beginAppointmentsUpdate();
      this.tasks.forEach(task => {
        this.scheduler.setAppointmentProperty(task.id, 'hidden', true);
      });
      this.scheduler.endAppointmentsUpdate();
      this.scheduler.beginAppointmentsUpdate();
      if (this.AllIssues == true) {
        this.tasks.filter(task => task.projectId == event)
          .forEach(task => {
            this.scheduler.setAppointmentProperty(task.id, 'hidden', false);
          });
      } else {
        this.tasks.filter(task => task.projectId == event && task.employeeId == this.currentUser._id)
          .forEach(task => {
            this.scheduler.setAppointmentProperty(task.id, 'hidden', false);
          });
      }
      this.scheduler.endAppointmentsUpdate();
    }
    
    if (event == null) {
      this.scheduler.beginAppointmentsUpdate();
      this.tasks.forEach(task => {
        this.scheduler.setAppointmentProperty(task.id, 'hidden', true);
      });
      this.scheduler.endAppointmentsUpdate();
      this.scheduler.beginAppointmentsUpdate();
      if (this.AllIssues == true) {
        this.tasks.forEach(task => {
            this.scheduler.setAppointmentProperty(task.id, 'hidden', false);
          });
      } else {
        this.tasks.filter(task => task.employeeId == this.currentUser._id)
          .forEach(task => {
            this.scheduler.setAppointmentProperty(task.id, 'hidden', false);
          });
      }
      this.scheduler.endAppointmentsUpdate();
    }
  }
  
  dateChanged(event) {
    let updatedTask: TaskModel = {
      id: event.args.appointment.originalData.id,
      title: event.args.appointment.originalData.title,
      deadline: this.datepipe.transform(event.args.appointment.originalData.start, 'YYYY-MM-dd'),
      description: event.args.appointment.originalData.description,
      employeeId: this.tasks.find(t => t.id == event.args.appointment.originalData.id).employeeId,
      projectId: this.tasks.find(t => t.id == event.args.appointment.originalData.id).projectId,
      status: event.args.appointment.originalData.status
    };
    let currentProject = this.projects.find(p => p._id == updatedTask.projectId);
    this.taskService.updateTask(updatedTask).pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
          currentProject.updatedAt = new Date().toString();
          this.projectsService.updateProject(currentProject)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {
                console.log(res.message);
              },
              err => {
                console.log(err);
              });
          this.userService.getUsers()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(users => {
                let taskUser = users.find(u => u._id === updatedTask.employeeId);
                if (taskUser.sendTaskOverdueEmail) {
                  this.email(taskUser._id, currentProject, updatedTask, 'taskUpdate');
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
  
  email(userId, project, task, type) {
    this.emailService.sendEmail(userId, project, task, '', type)
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
  
  showIssues(selectedProject) {
    this.AllIssues = !this.AllIssues;
    this.filter(selectedProject);
  }
}
