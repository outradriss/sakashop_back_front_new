import { Component } from '@angular/core';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userData:any;
  constructor(private user: UserServiceService) {}

  ngOnInit() {
    this.user.currentUserData.subscribe(userData => (this.userData = userData));
  }

  changeData(event:any) {
    var msg = event.target.value;
    this.user.changeData(msg);
  }
  login(data:any) {
    this.user.changeData(data);
  }
}
