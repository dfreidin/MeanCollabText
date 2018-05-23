import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
declare var diff_match_patch: any;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {
  edit_content: string;
  reference: string;
  DMP: any;
  @ViewChild("editor") ta: ElementRef;
  @ViewChild("idstr") idstr: ElementRef;
  textElement: any;
  db_id: string;

  constructor(
    private _socketService: SocketService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.DMP = new diff_match_patch();
    this._route.params.subscribe(params => {
      this.db_id = params.id;
      this._socketService.getMessages().subscribe(data => {
        if(data['message'] == "full-text") {
          this.reference = data["data"];
          this.edit_content = this.reference;
        }
        else if(data["message"] == "delta-update") {
          let patch = data["data"]["patch"];
          let selected = [this.textElement.selectionStart, this.textElement.selectionEnd];  // store cursor position
          let diff_length = patch[0]["length2"] - patch[0]["length1"];
          let start = patch[0]["start2"] + patch[0]["diffs"][0][1].length;
          selected[0] = start < selected[0] ? selected[0] + diff_length : selected[0];  // attempt to compensate cursor position for the patch
          selected[1] = start < selected[1] ? selected[1] + diff_length : selected[1];
          this.edit_content = this.DMP.patch_apply(patch, this.edit_content)[0];  // apply the patch
          this.reference = this.edit_content;
          setTimeout(()=>this.textElement.setSelectionRange(selected[0], selected[1]), 0);  // put the cursor back
        }
      });
      this._socketService.joinSession(this.db_id);
    });
  }
  ngAfterViewInit() {
    this.textElement = this.ta.nativeElement;
  }

  sendText() {
    let diff = this.DMP.diff_main(this.reference, this.edit_content);
    this.reference = this.edit_content;
    let patch = this.DMP.patch_make(diff);
    this._socketService.sendDelta({id: this.db_id, patch: patch});
  }
  copyID() {
    this.idstr.nativeElement.select();
    document.execCommand("copy");
    setTimeout(()=>this.idstr.nativeElement.selectionEnd=this.idstr.nativeElement.selectionStart, 1);
  }
  copyToClipboard() {
    let selected = [this.textElement.selectionStart, this.textElement.selectionEnd];
    this.textElement.select();
    document.execCommand("copy");
    setTimeout(()=>this.textElement.setSelectionRange(selected[0], selected[1]), 0);
  }
  saveFile() {
    var blob = new Blob([this.edit_content.replace(/\n/g, "\r\n")], {type: "text/plain;charset=utf-8"});
    saveAs(blob);
  }

}
