import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {BoardComponent} from './board/board.component';
import {HomeComponent} from './home/home.component';
import {ProjectsComponent} from './projects/projects.component';
import {TaskService} from './shared/services/task.service';
import {UserService} from './shared/services/user.service';
import {ProjectsService} from './shared/services/project.service';
import {AlertService} from './shared/services/alert.service';
import {AuthService} from './shared/services/auth.service';
import {ErrorInterceptor} from './shared/services/error.interceptor';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {KanbanModule} from '@syncfusion/ej2-angular-kanban';
import {ReportComponent} from './report/report.component';
import {AccumulationChartModule} from '@syncfusion/ej2-angular-charts';
import {AccordionModule} from '@syncfusion/ej2-angular-navigations';
import {NgSelect2Module} from 'ng-select2';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {HeaderComponent} from './header/header.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BoardComponent,
    HomeComponent,
    ProjectsComponent,
    ReportComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    KanbanModule,
    NgSelect2Module,
    NgbModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    AccumulationChartModule,
    AccordionModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule
  ],
  providers: [HttpClientModule, TaskService, UserService, ProjectsService, AlertService, AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
