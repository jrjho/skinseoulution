import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectToServerService } from 'src/app/services/connect-to-server.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{
  imageData = "";
  blob!: Blob;
  

  constructor(private router: Router, private fb: FormBuilder,
    private camerasvc: ConnectToServerService){

  }
  ngOnInit(): void {
    if(!this.camerasvc.imageData){
      this.router.navigate(['/']);
      return;
    }

    this.imageData = this.camerasvc.imageData;
    this.blob = this.dataURItoBlob(this.imageData);
  }

  dataURItoBlob(dataURI: String){
    var byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(';')[0];
    var ar = new ArrayBuffer(byteString.length);
    var ai = new Uint8Array(ar);
    for (var i=0; i <byteString.length; i++){
      ai[i] = byteString.charCodeAt(i);
    }
    return new Blob([ar], {type: mimeString});
  }
}
