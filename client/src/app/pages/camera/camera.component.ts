import { ElementRef, TemplateRef } from '@angular/core';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamComponent, WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subscription, Subject, Observable } from 'rxjs';
// import { Title, Meta } from '@angular/platform-browser'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DisplayresultsComponent } from '../displayresults/displayresults.component';
import { ConnectToServerService } from 'src/app/services/connect-to-server.service';



@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnDestroy, AfterViewInit
{
  // for webcam
  @ViewChild(WebcamComponent) webcam!: WebcamComponent;
  width = 600;
  height = 600;
  sub$!: Subscription;
  trigger = new Subject<void>;
 
  //for displaying images taken
  slides: { image: string; index: number }[] = [];
  activeSlideIndex = 0;
  slideNum=0;


  modalRef?: BsModalRef;
  buttonIsDisabled = true;
  form!:FormGroup;

  constructor(private fb:FormBuilder, private router: Router, private connectSvc: ConnectToServerService, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.webcam.trigger = this.trigger;
    this.sub$ = this.webcam.imageCapture.subscribe(
      this.snapshot.bind(this)
    )
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  snapButtonClicked() {
    this.trigger.next();
  }

  snapshot(webcamImg: WebcamImage) {
    // share this blob with the upload form
    this.connectSvc.imageData = webcamImg.imageAsDataUrl;
    if(this.connectSvc.imageData)
      this.buttonIsDisabled = false;

    this.slides.push({image: this.connectSvc.imageData, index: this.slideNum});
    this.slideNum++;
  }

  upload(){
    this.connectSvc.imageData = this.slides[this.activeSlideIndex].image;
    this.router.navigate(['/upload']);
  }

  nextSlide() {
    if (this.activeSlideIndex >= this.slides.length - 1) this.activeSlideIndex = 0;
    else this.activeSlideIndex++;
  }

  previousSlide() {
    if (this.activeSlideIndex <= 0) this.activeSlideIndex = this.slides.length - 1;
    else this.activeSlideIndex--;
  }


  proceed(){
    this.connectSvc.imageData = this.slides[this.activeSlideIndex].image;
    this.router.navigate(['/displayresults', 'null']);
  }

  private createForm():FormGroup{
    return this.form = this.fb.group({
      email : this.fb.control<string>('', [Validators.required,Validators.email]),
      password: this.fb.control<string>('', [Validators.required,Validators.minLength(4)]),
    })
  }

  
}


