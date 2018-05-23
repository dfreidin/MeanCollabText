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

  joinSession(id: string) {
    this.socket.emit("connect-file", id);
  }

  getMessages() {
    return new Observable(observer => {
      this.socket = io();
      this.socket.on("full-text", data => {
        observer.next({message: "full-text", data: data});
      });
      this.socket.on("delta-update", data => {
        observer.next({message: "delta-update", data: data});
      });
      this.socket.on("problem", data => {
        observer.next({message: "problem", data: data});
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
