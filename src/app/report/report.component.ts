import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {ChartConfiguration, ChartData} from 'chart.js';
import {TaskService} from '../shared/services/task.service';
import {Subject, takeUntil} from 'rxjs';
import {ProjectModel} from '../shared/models/project.model';
import {TaskModel} from '../shared/models/task.model';
import {ProjectsService} from '../shared/services/project.service';
import {StatusEnum} from '../shared/enums';
import {ChartComponent} from '@syncfusion/ej2-angular-charts';
import * as $ from 'jquery';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewChecked {

  @ViewChild('chart') chartObj: ChartComponent;
  
  public pieChartOptions: ChartConfiguration<'pie', number[], string | string[]>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  
  public pieChartData: Array<ChartData<'pie', number[], string | string[]>> = [{
    labels: [],
    datasets: [{
      data: []
    }]
  }];
  
  pieData: Object[] = [];
  
  public pieChartPlugins = [DatalabelsPlugin];
  
  public chartClicked({event, active}: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  
  public chartHovered({event, active}: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  
  private readonly unsubscribe: Subject<void> = new Subject();
  
  projects: ProjectModel[];
  tasks: TaskModel[];
  reportData: TaskModel[][] = [[]];
  legendSettings;
  isProjects: boolean = false;
  
  constructor(public taskService: TaskService,
              public projectService: ProjectsService,
              private elementRef: ElementRef) {
  }
  
  ngOnInit(): void {
    this.legendSettings = {
      visible: false
    };
    this.taskService.getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.tasks = res.tasks;
          this.projectService.getProjects()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {
                this.projects = res.projects.filter(project => this.tasks.find(task => task.projectId == project.id));
                this.isProjects = !!this.projects.length;
                this.projects.forEach((project, idx) => {
                  this.reportData[idx] = this.tasks.filter(task => task.projectId == project.id);
                  this.pieData[idx] = [
                    {
                      text: 'To Do',
                      x: 'To Do',
                      y: this.reportData[idx].filter(task => task.status == StatusEnum.todo).length
                    },
                    {
                      text: 'In Progress',
                      x: 'In Progress',
                      y: this.reportData[idx].filter(task => task.status == StatusEnum.inProgress).length
                    },
                    {
                      text: 'On Review',
                      x: 'On Review',
                      y: this.reportData[idx].filter(task => task.status == StatusEnum.onReview).length
                    },
                    {text: 'Done', x: 'Done', y: this.reportData[idx].filter(task => task.status == StatusEnum.done).length}
                  ];
                });
              },
              err => {
                console.log(err);
              });
        },
        err => {
          console.log(err);
        });
  }
  
  ngAfterViewChecked() {
    const dom: HTMLElement = this.elementRef.nativeElement;
    
    this.projects?.forEach((project, idx) => {
      dom.querySelectorAll('#chart-container_datalabel_Series_0_text_' + idx).forEach(el => {
        $(el).css({'font-weight': '600'});
      });
    });
  }
  
  export() {
    this.chartObj.print();
  }
}
