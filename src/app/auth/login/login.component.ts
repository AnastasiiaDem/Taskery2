import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {AlertService} from '../../shared/services/alert.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {Select2OptionData} from 'ng-select2';
import {UserModel} from '../../shared/models/user.model';
import {TokenStorageService} from '../../shared/services/token.service';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';
import {TranslocoService} from '@ngneat/transloco';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  userList: UserModel[] = [];
  employeeData: Array<Select2OptionData> = [];
  private readonly unsubscribe: Subject<void> = new Subject();
  fieldTextType: boolean;
  faIcon;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private userService: UserService,
              private authenticationService: AuthService,
              private tokenStorage: TokenStorageService,
              private translocoService: TranslocoService,
              private spinner: NgxSpinnerService,
              private alertService: AlertService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.faIcon = faEye;

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = '/home';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(
        takeUntil(this.unsubscribe),
        first()
      )
      .subscribe(data => {
          if (data.role == 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveRefreshToken(data.refreshToken);
          this.tokenStorage.saveUser(data);
          this.submitted = false;
        },
        err => {
          this.toastr.error(this.translocoService.getActiveLang() == 'ua' ? err?.messageUa : err?.messageEn);
          this.loading = false;
        });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    this.faIcon = this.fieldTextType ? faEyeSlash : faEye;
  }
}
