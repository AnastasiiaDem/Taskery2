import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';

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
              private spinner: NgxSpinnerService) {
  }
  
  ngOnInit() {
    this.spinner.show();
    this.userService.getCurrentUser()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(u => {
          this.currentUser = u;
          this.sendAssignedEmail = u.sendAssignedEmail;
          this.sendTaskEmail = u.sendTaskEmail;
          this.sendTaskOverdueEmail = u.sendTaskOverdueEmail;
        },
        err => {
          console.log(err);
        });
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  toggleNotification(e, field) {
    this.currentUser[field] = e.checked;
    this.spinner.show();
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
