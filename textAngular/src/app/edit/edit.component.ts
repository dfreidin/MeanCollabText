import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { saveAs } from 'file-saver';
declare var diff_match_patch: any;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {
  edit_content: string;
  DMP: any;
  @ViewChild("editor") ta: ElementRef;
  textElement: any;

  constructor(private _socketService: SocketService) { }

  ngOnInit() {
    this.DMP = new diff_match_patch();
    this._socketService.getMessages().subscribe(data => {
      if(data['message'] == "full-text") {
        this.edit_content = data["data"];
      }
      else if(data["message"] == "delta-update") {
        let patch = data["data"]["patch"];
        let selected = [this.textElement.selectionStart, this.textElement.selectionEnd];  // store cursor position
        let diff_length = patch[0]["length2"] - patch[0]["length1"];
        let start = patch[0]["start2"] + patch[0]["diffs"][0][1].length;
        selected[0] = start < selected[0] ? selected[0] + diff_length : selected[0];  // attempt to compensate cursor position for the patch
        selected[1] = start < selected[1] ? selected[1] + diff_length : selected[1];
        this.edit_content = this.DMP.patch_apply(patch, this.edit_content)[0];  // apply the patch
        setTimeout(()=>this.textElement.setSelectionRange(selected[0], selected[1]), 0);  // put the cursor back
      }
    });
  }
  ngAfterViewInit() {
    this.textElement = this.ta.nativeElement;
  }

  sendText() {
    this._socketService.sendDelta({content: this.edit_content});
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
