import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable, Subject, takeUntil} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterRouteChange = false;
  private readonly unsubscribe: Subject<void> = new Subject();
  
  constructor(private router: Router) {
    this.router.events
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          if (this.keepAfterRouteChange) {
            this.keepAfterRouteChange = false;
          } else {
            this.clear();
          }
        }
      });
  }
  
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }
  
  success(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({type: 'success', text: message});
  }
  
  error(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({type: 'error', text: message});
  }
  
  clear() {
    this.subject.next(null);
  }
}
