import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss',  '../home/home.component.scss', '../header/header.component.scss', '../app.component.scss'],
})
export class MainComponent implements OnInit {

  constructor(private router: Router,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
  }

  redirect() {
    this.spinner.show();
    document.getElementById('projectList').click();
    setTimeout(() => {
      this.spinner.hide();
    }, 950);
  }

  getStarted() {
    this.spinner.show();
    this.router.navigate(['/home']);
    setTimeout(() => {
      this.spinner.hide();
    }, 950);
  }

  contacts() {

  }
}
