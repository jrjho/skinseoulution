import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import { AnaylzeSkinResult, DetectFaceResult, Procedure } from 'src/app/models/apiCallResults';
import { ConnectToServerService } from 'src/app/services/connect-to-server.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-displayresults',
  templateUrl: './displayresults.component.html',
  styleUrls: ['./displayresults.component.css']
})
export class DisplayresultsComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate!: TemplateRef<any>;

  lottie!: AnimationOptions;
  loading: boolean = false;
  imageData = "";
  blob!: Blob;
  faceResults?: DetectFaceResult;
  analyzeSkin?: AnaylzeSkinResult;
  procedureList!: Procedure[];
  result?: string;
  hashedText: string = '';
  imageNoProblems: boolean = false;
  errorMessage!: string;
  modalRef?: BsModalRef;
  param$!: Subscription


  detectErrorImage: string = "https://i.postimg.cc/P562Z0v4/IMG-E54-B8-BACB391-1.jpg";



  constructor(private router: Router, private connectSvc: ConnectToServerService, private modalSvc: BsModalService, private loginSvc: LoginService, private activatedRoute: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {
    this.faceResults = undefined;
    this.analyzeSkin = undefined;
    this.result = undefined;
  }

  ngOnInit(): void {

    this.param$ = this.activatedRoute.params.subscribe(
      async (params) => {
        this.hashedText = params['hashedText'];

        // this.yearOfBirth = this.hashedText.substring(40, 44);
        // console.log("this.bundleId: ",this.yearOfBirth);
      });

    if (!this.loginSvc.isLoggedIn) {
      this.lottie = {
        path: '/assets/playground_assets/loading-unicorn.json',
      }
      if (!this.connectSvc.imageData) {
        alert('Image data not found');
        this.router.navigate(['/']);
        return;
      }
      else {
        this.imageData = this.connectSvc.imageData;
        this.blob = this.dataURItoBlob(this.imageData);
        // this.form = this.createForm();

        if (this.hashedText == "null") {
          console.log("this.hashedText is null");
          this.proceedWithoutDetails();
        }
        else {
          this.proceedWithDetails();
        }
      }
    }
    else {
      this.imageData = this.loginSvc.imageData;
      // this.analyzeSkin = this.loginSvc.analyzeSkin;
      this.analyzeSkin = this.loginSvc.analyzeSkin !== null ? this.loginSvc.analyzeSkin : undefined;
      console.log("this.analyzeSkin: ", this.analyzeSkin);
      this.procedureList = this.loginSvc.procedureList;
      // this.result = this.loginSvc.result;
      this.result = this.loginSvc.result !== null ? this.loginSvc.result : undefined;
      console.log("this.result: ", this.result);
      // this.faceResults = this.loginSvc.faceResults;
      this.faceResults = this.loginSvc.faceResults !== null ? this.loginSvc.faceResults : undefined;
      console.log("this.faceResults: ", this.faceResults);
    }

  }

  ngAfterViewInit(): void {

    

    if (!this.loginSvc.isLoggedIn) {
      this.lottie = {
        path: '/assets/playground_assets/loading-unicorn.json',
      }
    }
  }

  dataURItoBlob(dataURI: String) {
    var byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(';')[0];
    var ar = new ArrayBuffer(byteString.length);
    var ai = new Uint8Array(ar);
    for (var i = 0; i < byteString.length; i++) {
      ai[i] = byteString.charCodeAt(i);
    }
    return new Blob([ar], { type: mimeString });
  }

  onCloseClick(): void {
    alert('Select yes or no below');
  }

  async proceedWithoutDetails() {
    await this.callDetectApi(this.hashedText);

  }

  async proceedWithDetails() {
    this.hashedText = this.hashedText.substring(0, 32);
    await this.callDetectApi(this.hashedText);
  }

  async callDetectApi(hashedText: String) {
    //call detectface api
    await this.connectSvc.checkForFace(this.blob)
      .then((result) => {
        this.faceResults = result as DetectFaceResult;
        //if image meets the condition, analyze it and create/update user
        this.callAnalyzeAPI(hashedText);
      })
      .catch((error) => {
        this.errorMessage = error.error.message;
        this.modalRef = this.modalSvc.show(this.errorTemplate);
      });
  }

  async callAnalyzeAPI(hashedText: String) {
    //call analyzeskin api
    await this.connectSvc.analyzeSkin(this.blob, this.hashedText)
      .then((response) => {
        const result = response as { toreturn: AnaylzeSkinResult, procedureList: { procedures: Procedure[] }, uploadOrUpdateImage: any };
        this.analyzeSkin = result.toreturn;
        this.procedureList = result.procedureList.procedures;
        this.result = result.uploadOrUpdateImage
        this.imageNoProblems = true;
      })

      .catch((error) => {
        this.errorMessage = error.error.message;
        this.modalRef = this.modalSvc.show(this.errorTemplate);
      });
  }

  backToHome() {
    this.router.navigate(['/']);
  }


  public isLoggedIn(): boolean {
    return this.loginSvc.isLoggedIn;
  }

}
