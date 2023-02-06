import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskService} from '../shared/services/task.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ProjectModel} from '../shared/models/project.model';
import {TaskModel} from '../shared/models/task.model';
import {ProjectsService} from '../shared/services/project.service';
import {StatusEnum} from '../shared/enums';
import {BaseChartDirective} from 'ng2-charts';
import {ApexChart} from 'ng-apexcharts';
import {ApexFill, ApexStroke} from 'ng-apexcharts/lib/model/apex-types';
import {printDiv} from './print-div';
import {NgxSpinnerService} from 'ngx-spinner';

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
};

export let chosenProject;


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  
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
  
  
  constructor(public taskService: TaskService,
              public projectService: ProjectsService,
              private spinner: NgxSpinnerService) {
  }
  
  ngOnInit(): void {
    this.spinner.show();
    this.taskAndProjectData();
  }
  
  taskAndProjectData() {
    this.taskService.getTasks()
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.spinner.hide();
          },
            );
        }),
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
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {
                let projectsList = [];
                res.projects.forEach((p, i) => {
                  projectsList.push({
                    id: p._id,
                    userId: p.userId,
                    projectName: p.projectName,
                    description: p.description,
                    status: p.status,
                    assignedUsers: p.assignedUsers
                  });
                });
                this.projects = projectsList.filter(project => this.tasks.find(task => task.projectId == project.id));
                this.isProjects = !!this.projects.length;
                this.initChartData();
              },
              err => {
                console.log(err);
              });
        },
        err => {
          console.log(err);
        });
  }
  
  initChartData() {
    this.projects.forEach((project, idx) => {
      this.pieChartOptions.push({
        series: [],
        colors: [
          'rgba(57,196,254,0.5)',
          'rgba(253,148,119,0.6)',
          'rgba(101,85,254,0.5)',
          'rgba(58,223,104,0.5)'
        ],
        stroke: {
          show: false
        },
        chart: {
          width: '100%',
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
          text: 'Distribution Of All Tasks By Status',
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
          'rgba(57,196,254,0.5)',
          'rgba(253,148,119,0.6)',
          'rgba(101,85,254,0.5)',
          'rgba(58,223,104,0.5)'
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
        chart: {
          type: 'bar',
          stacked: true,
          width: '100%',
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
          text: 'Distribution Of Tasks Of Each Employee According To Status',
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
  
  export(name) {
    chosenProject = name;
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
      printDiv('printBody');
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
  
  email(name) {
    // chosenProject = name;
    // window.print();
  }
}
