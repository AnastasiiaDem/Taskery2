import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {AlertService} from './shared/services/alert.service';
import {ToastrService} from 'ngx-toastr';
import {UserModel} from './shared/models/user.model';
import {Router} from '@angular/router';
import {AuthService} from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  
  messageText: string;
  message: any;
  currentUser: UserModel;
  url;
  lang = 'en';
  private readonly unsubscribe: Subject<void> = new Subject();
  
  constructor(private alertService: AlertService,
              private toastr: ToastrService,
              private router: Router,
              private authenticationService: AuthService) {
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.currentUser = x);
  }
  
  ngOnInit() {
    this.url = this.router.url;
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
