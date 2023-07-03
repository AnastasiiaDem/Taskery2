import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  sendAssignedEmail: boolean;
  sendTaskEmail: boolean;
  sendTaskOverdueEmail: boolean;

  constructor(private userService: UserService,
              private authenticationService: AuthService,
              private spinner: NgxSpinnerService) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => {
        if (!!x) {
          this.currentUser = x['foundUser'];
          this.sendAssignedEmail = x['foundUser'].sendAssignedEmail;
          this.sendTaskEmail = x['foundUser'].sendTaskEmail;
          this.sendTaskOverdueEmail = x['foundUser'].sendTaskOverdueEmail;
        }
      });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  toggleNotification(e, field) {
    this.currentUser[field] = e.checked;

    this.userService.updateUser(this.currentUser)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(u => {
          console.log(u.message);
        },
        err => {
          console.log(err);
        });
  }
}
