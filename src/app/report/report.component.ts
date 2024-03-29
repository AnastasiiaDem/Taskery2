import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TaskService} from '../shared/services/task.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ProjectModel} from '../shared/models/project.model';
import {TaskModel} from '../shared/models/task.model';
import {ProjectsService} from '../shared/services/project.service';
import {RoleEnum, StatusEnum} from '../shared/enums';
import {BaseChartDirective} from 'ng2-charts';
import {ApexChart} from 'ng-apexcharts';
import {ApexFill, ApexStroke} from 'ng-apexcharts/lib/model/apex-types';
import {printDiv} from './print-div';
import {NgxSpinnerService} from 'ngx-spinner';
import {EmailService} from '../shared/services/email.service';
import {AlertService} from '../shared/services/alert.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../shared/services/user.service';
import {DatePipe} from '@angular/common';
import {TranslocoService} from '@ngneat/transloco';
import { AuthService } from '../shared/services/auth.service';


export type barChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  labels: any;
  colors: any[];
  grid: ApexGrid;
};

export type pieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  labels: any;
  colors: any[];
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
};

export let project;
export let colorValue;
colorValue;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @ViewChild(BaseChartDirective) pieChart: BaseChartDirective;
  @ViewChild(BaseChartDirective) barChart: BaseChartDirective;

  private readonly unsubscribe: Subject<void> = new Subject();
  public barChartOptions: Array<Partial<barChartOptions>> = [];
  public pieChartOptions: Array<Partial<pieChartOptions>> = [];
  isProjects: boolean = false;
  reportData: TaskModel[][] = [[]];
  projects: ProjectModel[];
  tasks: TaskModel[] = [];
  pieData = [];
  legendSettings;
  exportStatus;
  currentDate = new Date();
  loading = false;
  currentUser: { _id: number; firstName: string; lastName: string; email: string; password: string; role: RoleEnum; } = {
    _id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: RoleEnum.ProjectManager
  };
  report: { numberOfTasks: number; overdueTasks: number; status: string; projectStart: string; } = {
    numberOfTasks: 0,
    overdueTasks: 0,
    status: '',
    projectStart: ''
  };

  constructor(public taskService: TaskService,
              public projectService: ProjectsService,
              private emailService: EmailService,
              private alertService: AlertService,
              private toastr: ToastrService,
              private datepipe: DatePipe,
              private elementRef: ElementRef,
              private userService: UserService,
              private translocoService: TranslocoService,
              private authenticationService: AuthService,
              private spinner: NgxSpinnerService) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => {
        if (!!x) {
          this.currentUser = {
            _id: x['foundUser']._id,
            firstName: x['foundUser'].firstName,
            lastName: x['foundUser'].lastName,
            email: x['foundUser'].email,
            password: x['foundUser'].password,
            role: x['foundUser'].role
          };
        }
      });
  }

  ngOnInit(): void {
    this.taskAndProjectData();
  }

  ngAfterViewChecked() {
    const dom: HTMLElement = this.elementRef.nativeElement;

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


    dom.querySelectorAll('.apexcharts-legend-text').forEach(el => {
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  tasksNumber(p) {
    this.report.numberOfTasks = this.tasks.filter(t => t.projectId == p.id).length;
    return this.report.numberOfTasks;
  }

  overdueTasksNumber(p) {
    this.currentDate = new Date();
    this.report.overdueTasks = this.tasks.filter(t => (t.projectId == p.id && t.deadline < this.datepipe.transform(this.currentDate, 'YYYY-MM-dd') && t.status != StatusEnum.done)).length;
    return this.report.overdueTasks;
  }

  statusEllipse(p) {
    if (p.status == StatusEnum.todo) {
      return 'Ellipse6';
    }
    if (p.status == StatusEnum.inProgress) {
      return 'Ellipse5';
    }
    if (p.status == StatusEnum.onReview) {
      return 'Ellipse3';
    }
    if (p.status == StatusEnum.done) {
      return 'Ellipse4';
    }
  }

  taskAndProjectData() {
    this.spinner.show();
    this.taskService.getTasks()
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {
          res.tasks.forEach(t => {
            this.tasks.push({
              id: t._id,
              title: t.title,
              description: t.description,
              status: t.status,
              deadline: t.deadline,
              employeeId: t.employeeId,
              projectId: t.projectId
            });
          });
          this.projectService.getProjects()
            .pipe(
              takeUntil(this.unsubscribe)
            )
            .subscribe(res => {
                let projectsList = [];
                res.projects.filter(p => {
                  return (p.userId == this.currentUser._id || p.assignedUsers.find(u => u.id == this.currentUser._id));
                }).forEach((p, i) => {
                  projectsList.push({
                    id: p._id,
                    userId: p.userId,
                    projectName: p.projectName,
                    description: p.description,
                    status: p.status,
                    assignedUsers: p.assignedUsers,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    budget: p.budget
                  });
                });
                this.projects = projectsList.filter(project => this.tasks.find(task => task.projectId == project.id));
                this.isProjects = !!this.projects.length;
                this.initChartData();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1000);
              },
              err => {
                console.log(err);
              });
        },
        err => {
          console.log(err);
          this.spinner.hide()
        });
  }

  initChartData() {
    this.projects.forEach((project, idx) => {
      this.pieChartOptions.push({
        series: [],
        colors: [
          'rgba(57,196,254,0.4)',
          'rgba(253,148,119,0.4)',
          'rgba(101,85,254,0.4)',
          'rgba(58,223,104,0.4)'
        ],
        stroke: {
          show: false
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: [
              'rgb(57,196,254)',
              'rgb(253,148,119)',
              'rgb(101,85,254)',
              'rgb(58,223,104)'
            ]
          },
          dropShadow: {
            enabled: false,
          }
        },
        chart: {
          width: '100%',
          height: '300px',
          type: 'donut',
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            export: {
              csv: {
                filename: `all_tasks_distribution`,
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString();
                }
              },
              svg: {
                filename: `all_tasks_distribution`,
              },
              png: {
                filename: `all_tasks_distribution`,
              }
            },
          },
        },
        labels: ['To Do', 'In Progress', 'On Review', 'Done'],
        title: {
          align: 'left',
          text: this.translocoService.getActiveLang() == 'ua' ? 'Статус завдань %' : 'Task Status %',
          offsetY: -5,
          style: {
            fontSize: '20px',
            fontFamily: 'Source Sans Pro, sans-serif',
            fontWeight: 700,
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
        },
      });

      this.barChartOptions.push({
        series: [],
        colors: [
          'rgba(57,196,254,0.4)',
          'rgba(253,148,119,0.4)',
          'rgba(101,85,254,0.4)',
          'rgba(58,223,104,0.4)'
        ],
        grid: {
          show: false,
          xaxis: {
            lines: {
              show: false
            }
          },
          padding: {
            top: 3,
            bottom: 45,
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: [
              'rgb(57,196,254)',
              'rgb(253,148,119)',
              'rgb(101,85,254)',
              'rgb(58,223,104)'
            ]
          },
          dropShadow: {
            enabled: false,
          }
        },
        chart: {
          type: 'bar',
          stacked: true,
          width: '100%',
          height: '350px',
          stackType: '100%',
          offsetY: -21,
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            export: {
              csv: {
                filename: `_each_employee_tasks_distribution`,
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString();
                }
              },
              svg: {
                filename: `each_employee_tasks_distribution`,
              },
              png: {
                filename: `each_employee_tasks_distribution`,
              }
            },
            autoSelected: 'zoom'
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        stroke: {
          width: 0,
          colors: ['#fff']
        },
        title: {
          text: this.translocoService.getActiveLang() == 'ua' ? 'Статус завдань працівників %' : 'Employees Task Status %',
          offsetY: 16,
          style: {
            fontSize: '20px',
            fontFamily: 'Source Sans Pro, sans-serif',
            fontWeight: 700,
          }
        },
        xaxis: {
          categories: [],
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: undefined
          },
          axisTicks: {
            show: false
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
          offsetY: 15
        }
      });

      this.barChartOptions[idx].series.push(
        {
          name: 'To Do',
          data: []
        },
        {
          name: 'In Progress',
          data: []
        },
        {
          name: 'On Review',
          data: []
        },
        {
          name: 'Done',
          data: []
        });

      Object.keys(StatusEnum).forEach(statusName => {
        let userData = this.tasks.filter(task => task.status == StatusEnum[statusName] && task.projectId == project.id);

        let count = [];

        project.assignedUsers.forEach(assignedUser => {
          count.push({
            value: userData.filter(u => u.employeeId == assignedUser.id).length,
            user: assignedUser.text
          });
        });

        count.forEach(c => {
          this.barChartOptions[idx].series.find(s => s.name === StatusEnum[statusName]).data.push(c.value);
        });
      });


      project.assignedUsers.forEach(user => {
        this.barChartOptions[idx].xaxis.categories.push(user.text);
      });


      this.reportData[idx] = this.tasks.filter(task => task.projectId == project.id);
      this.pieData = [
        {
          name: 'To Do',
          value: this.reportData[idx].filter(task => task.status == StatusEnum.todo).length
        },
        {
          name: 'In Progress',
          value: this.reportData[idx].filter(task => task.status == StatusEnum.inProgress).length
        },
        {
          name: 'On Review',
          value: this.reportData[idx].filter(task => task.status == StatusEnum.onReview).length
        },
        {
          name: 'Done',
          value: this.reportData[idx].filter(task => task.status == StatusEnum.done).length
        }
      ];

      this.pieChartOptions[idx].series = [];
      this.pieData.forEach(data => {
        this.pieChartOptions[idx].series.push(data.value);
      });


      this.chart?.chart.update();
    });
  }

  export(p) {
    project = p;
    if (project.status === StatusEnum.todo) {
      colorValue = 'rgb(57 197 255)';
    }
    if (project.status === StatusEnum.inProgress) {
      colorValue = 'rgb(255 149 119)';
    }
    if (project.status === StatusEnum.onReview) {
      colorValue = 'rgb(101 85 255)';
    }
    if (project.status === StatusEnum.done) {
      colorValue = 'rgb(58 224 104)';
    }

    this.barChartOptions.forEach(bar => {
      bar.chart.toolbar.show = false;
      bar.colors = [
        'rgba(57,196,254,0.5)',
        'rgba(253,148,119,0.6)',
        'rgba(101,85,254,0.5)',
        'rgba(58,223,104,0.5)'
      ];
      bar.title.style.fontSize = '14px';
    });

    this.pieChartOptions.forEach(pie => {
      pie.chart.toolbar.show = false;
      pie.colors = [
        'rgba(57,196,254,0.5)',
        'rgba(253,148,119,0.6)',
        'rgba(101,85,254,0.5)',
        'rgba(58,223,104,0.5)'
      ];
      pie.title.style.fontSize = '14px';
    });

    this.chart?.chart.update();

    setTimeout(() => {
      this.exportStatus = true;
    }, 1900);

    setTimeout(() => {
      printDiv(`printBody_${p.id}`);
      this.barChartOptions.forEach(bar => {
        bar.chart.toolbar.show = true;
        bar.colors = [
          'rgba(57,196,254,0.5)',
          'rgba(253,148,119,0.6)',
          'rgba(101,85,254,0.5)',
          'rgba(58,223,104,0.5)'
        ];
        bar.title.style.fontSize = '20px';
      });
      this.pieChartOptions.forEach(pie => {
        pie.chart.toolbar.show = true;
        pie.colors = [
          'rgba(57,196,254,0.5)',
          'rgba(253,148,119,0.6)',
          'rgba(101,85,254,0.5)',
          'rgba(58,223,104,0.5)'
        ];
        pie.title.style.fontSize = '20px';
      });
      this.chart?.chart.update();
      this.exportStatus = false;
    }, 2000);
  }

  email(project) {
    this.report.status = project.status;
    this.report.projectStart = this.datepipe.transform(project.createdAt, 'YYYY-MM-dd');
    this.emailService.sendEmail(this.currentUser._id, project, '', this.report, 'report')
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(response => {
          this.toastr.success(this.translocoService.getActiveLang() == 'ua' ? response.message.messageUa : response.message.messageEn);
        },
        error => {
          this.toastr.error(error);
        });
  }
}
