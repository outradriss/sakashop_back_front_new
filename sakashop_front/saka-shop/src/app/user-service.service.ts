import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private userDataSource = new BehaviorSubject({email : '', password : ''});
  currentUserData = this.userDataSource.asObservable();
  constructor() { }
  changeData(newUserData:any) {
    this.userDataSource.next(newUserData)
  }
}
