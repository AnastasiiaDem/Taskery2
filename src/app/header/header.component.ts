import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
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
  styleUrls: ['./header.component.scss', '../app.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  messageText: string;
  message: any;
  url;
  currentUserData: UserModel = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.TeamMember,
    sendAssignedEmail: false,
    sendTaskEmail: false,
    sendTaskOverdueEmail: false
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
  }
  
  getCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
          this.currentUserData = user;
          this.url = this.router.url;
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
  }
  
  userSettings(content) {
    this.modalService.open(content, {centered: true});
  }
  
  goToUserSettings() {
    if (this.url != '/') {
      this.url = '/account';
      this.router.navigate(['/account']);
    } else {
      this.url = '/account';
      setTimeout(() => {
        this.router.navigate(['/account']);
        setTimeout(() => {
          document.getElementById('ngbDropdownMenu').classList.remove('show');
        }, 500);
      }, 910);
    }
  }
  
  goToNotifications() {
    if (this.url != '/') {
      this.url = '/notifications';
      this.router.navigate(['/notifications']);
    } else {
      this.url = '/notifications';
      setTimeout(() => {
        this.router.navigate(['/notifications']);
        setTimeout(() => {
          document.getElementById('ngbDropdownMenu').classList.remove('show');
        }, 500);
      }, 910);
    }
  }
  
  getUpdatedData() {
    this.getCurrentUser();
  }
  
  home() {
    this.router.navigate(['/']);
    setTimeout(() => {
      this.url = '/';
    }, 100);
  }
  
  projectList() {
    if (this.url != '/') {
      this.url = '/projects';
      this.router.navigate(['/projects']);
    } else {
      this.url = '/projects';
      setTimeout(() => {
        this.router.navigate(['/projects']);
      }, 910);
    }
  }
  
  report() {
    if (this.url != '/') {
      this.url = '/report';
      this.router.navigate(['/report']);
    } else {
      this.url = '/report';
      setTimeout(() => {
        this.router.navigate(['/report']);
      }, 950);
    }
  }
}
