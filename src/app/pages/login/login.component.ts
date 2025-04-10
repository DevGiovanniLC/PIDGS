import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  imports: [IonicModule], // <== IMPORTANTE,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  goBack() {
    window.history.back();
  }

}
