import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';

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
  
  constructor(private userService: UserService) {
  }
  
  ngOnInit() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
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
    this.userService.updateUser(this.currentUser)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(u => {
          console.log(u.body);
          console.log(u.message);
        },
        err => {
          console.log(err);
        });
  }
}
