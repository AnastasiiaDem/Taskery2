import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Role, UserModel} from '../shared/models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserService} from '../shared/services/user.service';
import {TaskModel} from '../shared/models/task.model';
import {TaskService} from '../shared/services/task.service';
import {ContactService} from '../shared/services/contact.service';
import {Select2OptionData} from 'ng-select2';
import {RequestModel} from '../shared/models/request.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {first} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  
  private readonly unsubscribe: Subject<void> = new Subject();
  myTasks: { overdue: Array<TaskModel>, today: Array<TaskModel>, upcoming: Array<TaskModel> };
  currentUser: UserModel = {
    email: '',
    firstName: '',
    id: 0,
    lastName: '',
    password: '',
    role: Role.ProjectManager,
    sendAssignedEmail: false,
    sendTaskEmail: false,
    sendTaskOverdueEmail: false
  };
  allRequests;
  numberOfUsers = 0;
  users = [];
  searchData: Array<Select2OptionData> = [{id: '0', text: 'id'}, {id: '1', text: 'name'}, {id: '3', text: 'email'}];
  searchBy = '1';
  respondData: RequestModel;
  submitted = false;
  respondMsg = '';
  
  constructor(private spinner: NgxSpinnerService,
              public taskService: TaskService,
              public userService: UserService,
              private toastr: ToastrService,
              public modalService: NgbModal,
              public contactService: ContactService) {
    this.getCurrentUser();
  }
  
  ngOnInit(): void {
    this.getRequests();
    this.getAllUsers();
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
  
  getCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
          this.currentUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
            sendAssignedEmail: user.sendAssignedEmail,
            sendTaskEmail: user.sendTaskEmail,
            sendTaskOverdueEmail: user.sendTaskOverdueEmail
          };
        },
        err => {
          console.log(err);
        });
  }
  
  getAllUsers() {
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
          this.numberOfUsers = users.length;
          this.users = users;
        },
        err => {
          console.log(err);
        });
  }
  
  getRequests() {
    this.contactService.getAllRequests()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(requests => {
          this.allRequests = requests;
        },
        err => {
          console.log(err);
        });
  }
  
  searchUser() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    table = document.getElementById('myTable');
    tr = table.getElementsByTagName('tr');
    
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[this.searchBy.replace(/,/g, '')];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }
  
  respond(id, content) {
    this.respondData = this.allRequests.filter(r => r._id == id)[0];
    this.modalService.open(content, {centered: true});
  }
  
  onSubmit(data, modal, task) {
    this.submitted = true;
    if (this.respondMsg != '') {
      if (task == 'respond') {
        this.contactService.sendRespond({
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            description: data.description,
            respond: this.respondMsg
          })
          .pipe(
            takeUntil(this.unsubscribe)
          )
          .subscribe(res => {
              this.submitted = false;
              this.deleteRequest(data, modal);
              this.toastr.success('Respond was sent successfully');
            },
            err => {
              this.toastr.error(err);
            });
      } else {
        this.deleteRequest(data, modal);
      }
    }
  }
  
  deleteRequest(data, modal) {
    this.contactService.deleteRequest(data._id)
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(data => {
          this.submitted = false;
          this.allRequests = this.allRequests.filter(req => req._id !== data._id);
          this.toastr.success('Request was deleted');
          modal.close();
        },
        err => {
          this.toastr.error(err);
        });
  }
}
