import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() { }

  sendDelta(data) {
    this.socket.emit("delta-submit", data);
  }

  getMessages() {
    return new Observable(observer => {
      this.socket = io();
      this.socket.on("full-text", data => {
        console.log(data);
        observer.next({message: "full-text", data: data});
      });
      this.socket.on("delta-update", data => {
        console.log(data);
        observer.next({message: "delta-update", data: data});
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
