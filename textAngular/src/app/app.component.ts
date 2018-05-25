import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  theme = "light";
  
  setDark() {
    this.theme = "dark";
  }

  setBlue() {
    this.theme = "blue";
  }

  setLight() {
    this.theme = "light";
  }
}
