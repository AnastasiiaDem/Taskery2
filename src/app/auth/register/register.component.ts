import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {UserService} from '../../shared/services/user.service';
import {AlertService} from '../../shared/services/alert.service';
import {Role, UserModel} from 'src/app/shared/models/user.model';
import {Subject, takeUntil} from 'rxjs';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  userList: UserModel[] = [];
  private readonly unsubscribe: Subject<void> = new Subject();
  selectedVal: string;
  fieldTextType: boolean;
  faIcon;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private authenticationService: AuthService,
              private userService: UserService,
              private alertService: AlertService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.faIcon = faEye;

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
      agree: ['', Validators.required],
      role: ['', Validators.required]
    });
    this.selectedVal = 'TeamMember';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    this.registerForm.setValue(
      {
        agree: this.registerForm.value.agree,
        email: this.registerForm.value.email,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        password: this.registerForm.value.password,
        role: (this.selectedVal == 'TeamMember' || this.selectedVal == '') ? Role.TeamMember : Role.ProjectManager
      });

    if (this.registerForm.invalid) {
      return;
    }

    setTimeout(() => {
      this.userService.getUsers()
        .pipe(
          takeUntil(this.unsubscribe)
        )
        .subscribe(users => {
          this.userList = users;
        });

      let userObject: UserModel = {
        id: this.userList.length ? Math.max(...this.userList.map(x => x.id)) + 1 : 1,
        email: this.registerForm.value.email,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role,
        sendAssignedEmail: false,
        sendTaskEmail: false,
        sendTaskOverdueEmail: false
      };

      this.loading = true;

      this.userService.addUser(userObject)
        .pipe(
          takeUntil(this.unsubscribe),
          first()
        )
        .subscribe(
          data => {
            this.toastr.success('Registration successful');
            this.router.navigate(['/login']);
          },
          err => {
            this.toastr.error(err);
            this.loading = false;
          });
    }, 1000);
  }

  onValChange(value: any) {
    this.selectedVal = value;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    this.faIcon = this.fieldTextType ? faEyeSlash : faEye;
  }
}
