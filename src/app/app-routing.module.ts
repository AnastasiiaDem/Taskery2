import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardComponent} from './board/board.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './shared/services/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ReportComponent } from './report/report.component';
import {Role} from './shared/models/user.model';

const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent, data: { animation: 'login' }},
    {path: 'register', component: RegisterComponent, data: { animation: 'register' }},
    {path: 'board', component: BoardComponent, data: { animation: 'board' }},
    {path: 'projects', component: ProjectsComponent, data: { animation: 'projects' }},
    {path: 'report', component: ReportComponent, canActivate: [AuthGuard], data: { animation: 'report' }}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
