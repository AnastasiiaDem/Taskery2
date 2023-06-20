import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../shared/services/alert.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {UserService} from '../shared/services/user.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';
import {faCheck, faEye, faEyeSlash, faPencil, faXmark} from '@fortawesome/free-solid-svg-icons';
import {RoleEnum} from '../shared/enums';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  messageText: string;
  message: any;
  userSettingsForm: FormGroup;
  loading = false;
  submitted = false;
  userList: UserModel[] = [];
  currentUser: { _id: string; firstName: string; lastName: string; email: string; password: string; role: RoleEnum; sendAssignedEmail: boolean; sendTaskEmail: boolean; sendTaskOverdueEmail: boolean; } = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: RoleEnum.ProjectManager,
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
              private spinner: NgxSpinnerService,
              private authenticationService: AuthService,
              private userService: UserService) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => {
        if (!!x) {
          this.currentUser = {
            _id: x['foundUser']._id,
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
  
  ngOnInit() {
    this.faIcon = faEye;
    this.pencilIcon = faPencil;
    this.checkIcon = faCheck;
    this.xIcon = faXmark;
    
    this.userSettingsForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
    });
  
    this.userSettingsForm.setValue(
      {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        password: this.currentUser.password
      });
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
      this.currentUser[field] = this.userSettingsForm.controls[field].value;
      this.spinner.show();
      this.userService.updateUser(this.currentUser)
        .pipe(
          finalize(() => this.spinner.hide()),
          takeUntil(this.unsubscribe)
        )
        .subscribe(res => {
            this.editStatus = false;
            this.fieldType = field;
            const input = document.getElementById(field);
            input['readOnly'] = true;
            input['disabled'] = true;
            this.submitted = false;
          },
          err => {
            console.log(err);
          });
    }
  }
  
  resetChanges(field) {
    this.userSettingsForm.controls[field].setValue(this.currentUser[field]);
    this.spinner.show();
    this.userService.updateUser(this.currentUser)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntil(this.unsubscribe)
      )
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
      this.spinner.show();
      this.userService.deleteUser(this.currentUser._id)
        .pipe(
          finalize(() => this.spinner.hide()),
          takeUntil(this.unsubscribe)
        )
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
