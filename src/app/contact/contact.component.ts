import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {filter, first} from 'rxjs/operators';
import {UserService} from '../shared/services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AlertService} from '../shared/services/alert.service';
import {ContactService} from '../shared/services/contact.service';
import {RequestModel} from '../shared/models/request.model';
import {RoleEnum} from '../shared/enums';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', '../home/home.component.scss', '../header/header.component.scss', '../app.component.scss'],
})
export class ContactComponent implements OnInit {
  
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  url;
  currentUserData = {
    id: 0,
    _id: '0',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: RoleEnum.TeamMember,
    sendAssignedEmail: false,
    sendTaskEmail: false,
    sendTaskOverdueEmail: false
  };
  contactForm: FormGroup;
  submitted = false;
  loading = false;
  showHeader = true;
  
  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private userService: UserService,
              private alertService: AlertService,
              private contactService: ContactService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private authenticationService: AuthService) {
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.currentUser = x);
    if (this.authenticationService.currentUserValue) {
      this.showHeader = false;
    }
  }
  
  get f() {
    return this.contactForm.controls;
  }
  
  ngOnInit(): void {
    if (this.currentUser) {
      this.getCurrentUser();
    }
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
          this.url = event.url;
        }
      );
    
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required]],
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
          this.currentUserData = user;
          this.url = this.router.url;
          this.contactForm.setValue(
            {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              description: this.contactForm.value.description
            });
        },
        err => {
          console.log(err);
        });
  }
  
  contactUs() {
    this.url = '/contact';
    setTimeout(() => {
      this.router.navigate(['/contact']);
    }, 510);
  }
  
  getStarted() {
    this.spinner.show();
    this.router.navigate(['/register']);
    setTimeout(() => {
      this.spinner.hide();
    }, 950);
  }
  
  onSubmit() {
    this.submitted = true;
    
    this.alertService.clear();
    
    this.contactForm.setValue(
      {
        email: this.contactForm.value.email,
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        description: this.contactForm.value.description
      });
    
    if (this.contactForm.invalid) {
      return;
    }
    
    setTimeout(() => {
      let requestObject: RequestModel = {
        userId: this.currentUserData?._id,
        email: this.contactForm.value.email,
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        description: this.contactForm.value.description
      };
      
      this.loading = true;
      
      this.contactService.sendRequest(requestObject)
        .pipe(
          takeUntil(this.unsubscribe),
          first()
        )
        .subscribe(
          data => {
            this.submitted = false;
            this.contactForm.setValue(
              {
                email: this.currentUserData.email,
                firstName: this.currentUserData.firstName,
                lastName: this.currentUserData.lastName,
                description: ''
              });
            this.toastr.success('Request was sent successfully');
          },
          err => {
            this.toastr.error(err);
            this.loading = false;
          });
    }, 1000);
  }
}
