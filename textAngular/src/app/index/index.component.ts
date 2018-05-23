import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  db_id: string;
  rejoin_id: string;

  constructor(
    private _httpService: HttpService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._httpService.rejoin().subscribe(data => {
      if(data["message"] == "Success") {
        this.rejoin_id = data["data"]["_id"];
      }
      else {
        this.rejoin_id = null;
      }
    });
  }

  newDocument() {
    this._httpService.newDocument().subscribe(data => {
      if(data["message"] == "Success") {
        this._router.navigate([`/edit/${data['data']._id}`]);
      }
      else {
        console.log(data);
      }
    });
  }

}
