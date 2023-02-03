import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';
import {ToastrService} from 'ngx-toastr';
import {Role, UserModel} from '../shared/models/user.model';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {UserService} from '../shared/services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../app.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  private subscription: Subscription;
  currentUser: UserModel;
  messageText: string;
  message: any;
  currentUserData: UserModel = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.TeamMember
  };
  
  constructor(private alertService: AlertService,
              private toastr: ToastrService,
              private router: Router,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private authenticationService: AuthService,
              private userService: UserService) {
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.currentUser = x);
  }
  
  ngOnInit() {
    this.getCurrentUser();
    this.subscription = this.alertService.getAlert()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(message => {
        switch (message && message.type) {
          case 'success':
            message.cssClass = 'alert alert-success';
            this.toastr.success(message.text);
            break;
          case 'error':
            message.cssClass = 'alert alert-danger';
            this.messageText = typeof (message.text) == 'string' ? message.text : message.text.error.message;
            this.toastr.error(this.messageText);
            break;
        }
        this.message = message;
      });
  }
  
  getCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
          this.currentUserData = user;
        },
        err => {
          console.log(err);
        });
  }
  
  logout() {
    this.authenticationService.logout().subscribe(sub => {
      this.router.navigate(['/login']);
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.subscription.unsubscribe();
  }
  
  userSettings(content) {
    this.modalService.open(content, {centered: true});
  }
}
