import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {filter} from 'rxjs/operators';
import {UserService} from '../shared/services/user.service';
import {RoleEnum} from '../shared/enums';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss', '../home/home.component.scss', '../header/header.component.scss', '../app.component.scss'],
})
export class InitialComponent implements OnInit {
  
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  url;
  currentUserData: UserModel = {
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
  
  
  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private userService: UserService,
              private translocoService: TranslocoService,
              private authenticationService: AuthService) {
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.currentUser = x);
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }
  
  ngOnInit(): void {
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
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  contactUs() {
    // if (this.url != '') {
    //   this.url = '/contact';
    //   this.router.navigate(['/contact']);
    // } else {
    this.url = '/contact';
    setTimeout(() => {
      this.router.navigate(['/contact']);
    }, 510);
    // }
  }
  
  getStarted() {
    this.spinner.show();
    this.router.navigate(['/register']);
    setTimeout(() => {
      this.spinner.hide();
    }, 950);
  }
  
  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    this.currentLanguage = lang;
  }
}
