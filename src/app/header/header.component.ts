import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';
import {ToastrService} from 'ngx-toastr';
import {UserModel} from '../shared/models/user.model';
import {NavigationStart, Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {UserService} from '../shared/services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {filter} from 'rxjs/operators';
import {RoleEnum} from '../shared/enums';
import {TranslocoService} from '@ngneat/transloco';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../app.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  private readonly unsubscribe: Subject<void> = new Subject();
  messageText: string;
  message: any;
  url = '/home';
  currentUser: UserModel = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: RoleEnum.TeamMember,
    sendAssignedEmail: false,
    sendTaskEmail: false,
    sendTaskOverdueEmail: false
  };
  currentLanguage = 'en';


  constructor(private alertService: AlertService,
              private toastr: ToastrService,
              private router: Router,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private authenticationService: AuthService,
              private translocoService: TranslocoService,
              private userService: UserService,
              private spinner: NgxSpinnerService) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => {
        if (!!x) {
          this.currentUser = {
            id: x['foundUser']._id,
            firstName: x['foundUser'].firstName,
            lastName: x['foundUser'].lastName,
            email: x['foundUser'].email,
            password: x['foundUser'].password,
            role: x['foundUser'].role,
            sendAssignedEmail: x['foundUser'].sendAssignedEmail,
            sendTaskEmail: x['foundUser'].sendTaskEmail,
            sendTaskOverdueEmail: x['foundUser'].sendTaskOverdueEmail
          };
        }
      });
  }

  get getAbbr() {
    return this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0);
  }

  ngOnInit() {
    this.currentLanguage = this.translocoService.getActiveLang();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
          this.url = event.url;
        }
      );
  }

  logout() {
    this.spinner.show();
    this.authenticationService.logout()
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.spinner.hide())
      )
      .subscribe(sub => {
          this.router.navigate(['/']);
        },
        err => {
          console.log(err);
        });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  goToUserSettings() {
    if (this.url != '/home') {
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
    if (this.url != '/home') {
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
    this.userService.getCurrentUser()
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(user => {
          this.currentUser = user;
          this.url = this.router.url;
        },
        err => {
          console.log(err);
        });
  }

  home() {
    this.router.navigate(['/home']);
    setTimeout(() => {
      this.url = '/home';
    }, 100);
  }

  projectList() {
    if (this.url != '/home') {
      this.url = '/projects';
      this.router.navigate(['/projects']);
    } else {
      this.url = '/projects';
      setTimeout(() => {
        this.router.navigate(['/projects']);
      }, 510);
    }
  }

  report() {
    if (this.url != '/home') {
      this.url = '/report';
      this.router.navigate(['/report']);
    } else {
      this.url = '/report';
      setTimeout(() => {
        this.router.navigate(['/report']);
      }, 550);
    }
  }

  scheduler() {
    if (this.url != '/home') {
      this.url = '/scheduler';
      this.router.navigate(['/scheduler']);
    } else {
      this.url = '/scheduler';
      setTimeout(() => {
        this.router.navigate(['/scheduler']);
      }, 550);
    }
  }

  contactUs() {
    if (this.url != '/home') {
      this.url = '/contact';
      this.router.navigate(['/contact']);
    } else {
      this.url = '/contact';
      setTimeout(() => {
        this.router.navigate(['/contact']);
      }, 550);
    }
  }

  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    this.currentLanguage = lang;
  }
}
