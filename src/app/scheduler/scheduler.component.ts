import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {jqxSchedulerComponent} from 'jqwidgets-ng/jqxscheduler';
import {Subject, takeUntil} from 'rxjs';
import {TaskService} from '../shared/services/task.service';
import {UserService} from '../shared/services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Select2OptionData} from 'ng-select2';
import {ProjectsService} from '../shared/services/project.service';
import {Role} from '../shared/models/user.model';


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
  resources: any;
  dataAdapter: any;
  usersList = [];
  previewData = {
    title: '',
    description: '',
    status: '',
    deadline: '',
    employee: ''
  };
  selectedProject = null;
  projectsData: Array<Select2OptionData> = [];
  filterStatus = false;
  currentUser: { _id: number; firstName: string; lastName: string; email: string; password: string; role: Role; } = {
    _id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.ProjectManager
  };
  date: any = new jqx.date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  appointmentDataFields: any =
    {
      id: 'id',
      description: 'description',
      subject: 'title',
      resourceId: 'employee',
      employeeId: 'employeeId',
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
      // { type: 'dayView', timeRuler: { hidden: false } },
      // { type: 'weekView', timeRuler: { hidden: false } },
      // {type: 'agendaView', timeRuler: {hidden: false}},
      {type: 'monthView', timeRuler: {hidden: false}},
    ];
  
  ready = () => {
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
        users.forEach((user, i) => {
          this.usersList.push({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          });
        });
      });
    
    this.getAllTasks();
    this.getCurrentUser();
    this.getAllProjects();
  };
  
  constructor(public taskService: TaskService,
              public userService: UserService,
              private projectService: ProjectsService,
              private modalService: NgbModal) {
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
    this.previewData = {
      title: event.args.appointment.originalData.title,
      description: event.args.appointment.originalData.description,
      status: event.args.appointment.originalData.status,
      deadline: event.args.appointment.originalData.start,
      employee: event.args.appointment.originalData.employee
    };
    this.modalService.open(content, {centered: true});
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
          this.userService.getUsers()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(users => {
                res.tasks.forEach(task => {
                  this.tasks.push({
                    id: task._id,
                    title: task.title,
                    description: task.description,
                    projectId: task.projectId,
                    employee: users.find(u => u._id == task.employeeId).firstName + ' ' + users.find(u => u._id == task.employeeId).lastName,
                    employeeId: users.find(u => u._id == task.employeeId)._id,
                    status: task.status,
                    start: task.deadline,
                    end: task.deadline,
                    readOnly: true,
                    allDay: true,
                    resizable: false,
                    draggable: false,
                  });
                });
                this.source = {
                  dataType: 'array',
                  dataFields: [
                    {name: 'id', type: 'string'},
                    {name: 'description', type: 'string'},
                    {name: 'title', type: 'string'},
                    {name: 'status', type: 'string'},
                    {name: 'employee', type: 'string'},
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
                  colorScheme: 'scheme05',
                  dataField: 'employee',
                  source: new jqx.dataAdapter(this.source)
                };
                this.dataAdapter = new jqx.dataAdapter(this.source);
    
                this.scheduler.source(this.dataAdapter);
                this.scheduler.resources(this.resources);
              },
              err => {
                console.log(err);
              });
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
          res.projects.filter(p => {
            return (p.userId == this.currentUser._id || p.assignedUsers.find(u => u.id == this.currentUser._id));
          }).forEach(project => {
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
    this.filterStatus = !this.filterStatus;
    if (this.filterStatus && event !== null) {
      this.scheduler.beginAppointmentsUpdate();
      this.tasks.forEach(task => {
        this.scheduler.setAppointmentProperty(task.id, 'hidden', true);
      });
      this.scheduler.endAppointmentsUpdate();
      this.scheduler.beginAppointmentsUpdate();
      this.tasks.filter(task => task.projectId == event)
        .forEach(task => {
          this.scheduler.setAppointmentProperty(task.id, 'hidden', false);
        });
      this.scheduler.endAppointmentsUpdate();
    }
    
    if (event == null) {
      this.scheduler.beginAppointmentsUpdate();
      this.tasks.forEach(task => {
        this.scheduler.setAppointmentProperty(task.id, 'hidden', true);
      });
      this.scheduler.endAppointmentsUpdate();
      this.scheduler.beginAppointmentsUpdate();
      this.tasks.forEach(task => {
          this.scheduler.setAppointmentProperty(task.id, 'hidden', false);
        });
      this.scheduler.endAppointmentsUpdate();
    }
  }
}
