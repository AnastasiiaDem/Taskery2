import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss', '../home/home.component.scss', '../header/header.component.scss', '../app.component.scss'],
})
export class InitialComponent implements OnInit {
  
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  
  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthService) {
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.currentUser = x);
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }
  
  ngOnInit(): void {
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  redirect() {
    this.spinner.show();
    document.getElementById('projectList').click();
    setTimeout(() => {
      this.spinner.hide();
    }, 950);
  }
  
  getStarted() {
    this.spinner.show();
    this.router.navigate(['/register']);
    setTimeout(() => {
      this.spinner.hide();
    }, 950);
  }
}
