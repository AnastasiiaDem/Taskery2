import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../shared/services/alert.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {UserService} from '../shared/services/user.service';
import {Subject, takeUntil} from 'rxjs';
import {Role, UserModel} from '../shared/models/user.model';
import {faCheck, faEye, faEyeSlash, faPencil, faXmark} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  messageText: string;
  message: any;
  userSettingsForm: FormGroup;
  loading = false;
  submitted = false;
  userList: UserModel[] = [];
  selectedVal: string;
  currentUserData: { _id: string; firstName: string; lastName: string; email: string; password: string; role: Role; sendAssignedEmail: boolean; sendTaskEmail: boolean; sendTaskOverdueEmail: boolean;} = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.ProjectManager,
    sendAssignedEmail: false,
    sendTaskEmail: false,
    sendTaskOverdueEmail: false
  };
  fieldTextType: boolean;
  editStatus: boolean = false;
  faIcon;
  editIcon;
  pencilIcon;
  checkIcon;
  xIcon;
  fieldType = '';

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
    this.faIcon = faEye;
    this.pencilIcon = faPencil;
    this.checkIcon = faCheck;
    this.xIcon = faXmark;

    this.getCurrentUser();
    this.userSettingsForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
          this.currentUserData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
            sendAssignedEmail: user.sendAssignedEmail,
            sendTaskEmail: user.sendTaskEmail,
            sendTaskOverdueEmail: user.sendTaskOverdueEmail
          };
          this.userSettingsForm.setValue(
            {
              firstName: this.currentUserData.firstName,
              lastName: this.currentUserData.lastName,
              email: this.currentUserData.email,
              password: this.currentUserData.password
            });
        },
        err => {
          console.log(err);
        });
  }

  onSubmit() {
    this.alertService.clear();
    if (this.userSettingsForm.invalid) {
      return;
    }
  }

  get f() {
    return this.userSettingsForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    this.faIcon = this.fieldTextType ? faEyeSlash : faEye;
  }

  editField(field) {
    this.editStatus = true;
    this.fieldType = field;
    const input = document.getElementById(field);
    input['readOnly'] = false;
    input['disabled'] = false;
  }

  updateField(field) {
    this.submitted = true;
    if (!this.userSettingsForm.controls[field].errors) {
      this.currentUserData[field] = this.userSettingsForm.controls[field].value;
      this.userService.updateUser(this.currentUserData)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {
            this.editStatus = false;
            this.fieldType = field;
            const input = document.getElementById(field);
            input['readOnly'] = true;
            input['disabled'] = true;
          },
          err => {
            console.log(err);
          });
    }
  }

  resetChanges(field) {
    this.userSettingsForm.controls[field].setValue(this.currentUserData[field]);
    this.userService.updateUser(this.currentUserData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          this.editStatus = false;
          this.fieldType = field;
          const input = document.getElementById(field);
          input['readOnly'] = true;
          input['disabled'] = true;
        },
        err => {
          console.log(err);
        });
  }

  deleteUser(content) {
    this.modalService.open(content, {centered: true});
  }

  isDelete(action, modal) {
    if (action == 'confirm') {
      this.userService.deleteUser(this.currentUserData._id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(response => {
            console.log(response);
            this.authenticationService.logout().subscribe(sub => {
              this.router.navigate(['/']);
            });
          },
          err => {
            console.log(err);
          });
      modal.close();
    } else {
      modal.close();
    }
  }
}
