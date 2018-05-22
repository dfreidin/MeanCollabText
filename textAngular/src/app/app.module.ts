import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditComponent } from './edit/edit.component';
import { IndexComponent } from './index/index.component';
import { SocketService } from './socket.service';
import { HttpService } from './http.service';

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    SocketService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
