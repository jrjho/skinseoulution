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
  // pics: string[] = [];
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
    console.log("snapButtonClicked");
  }

  snapshot(webcamImg: WebcamImage) {
    // share this blob with the upload form
    this.connectSvc.imageData = webcamImg.imageAsDataUrl;
    if(this.connectSvc.imageData)
      this.buttonIsDisabled = false;

    console.log("URL: ",this.connectSvc.imageData);
    // this.pics.push(this.camSvc.imageData);
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

  // proceedWithoutDetails(){
  //   this.connectSvc.userInputtedInfo = false;
  //   this.form.reset();
  //   this.router.navigate(['/displayresults']);
  // }

  proceed(){
    console.log("in proceed");
    this.connectSvc.imageData = this.slides[this.activeSlideIndex].image;
    // this.router.navigate(['/displayresults']);
    this.router.navigate(['/displayresults', 'null']);
  }

  private createForm():FormGroup{
    return this.form = this.fb.group({
      email : this.fb.control<string>('', [Validators.required,Validators.email]),
      password: this.fb.control<string>('', [Validators.required,Validators.minLength(4)]),
      // yearOfBirth: this.fb.control<string>('', [
      //   Validators.required, 
      //   Validators.pattern('^[0-9]{4}$'), // Checks if the input is a 4-digit number
      //   Validators.min(1900), // Checks if the input is greater than or equal to 1900
      //   Validators.max((new Date()).getFullYear()) // Checks if the input is less than or equal to the current year
      // ]),
    })
  }

  
}



//working 1
// implements OnInit {

//   trigger: Subject<any> = new Subject();
//   webcamImage!: WebcamImage;
//   nextWebcam: Subject<any> = new Subject();
//   sysImage = ''

//   constructor(private router:Router, private camSvc:CameraService){}

//   ngOnInit() { }

//   getSnapshot(): void {
//     console.log("hello")
//     this.trigger.next(void 0);
//   }

//   captureImg(webcamImage: WebcamImage): void {
//     this.webcamImage = webcamImage;
//     this.sysImage = webcamImage!.imageAsDataUrl;
//     console.info('got webcam image', this.sysImage);
//   }

//   get invokeObservable(): Observable<any> {
//     return this.trigger.asObservable();
//   }
  
//   get nextWebcamObservable(): Observable<any> {
//     return this.nextWebcam.asObservable();
//   }
// }

//implements AfterViewInit {
//   @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

//   ngAfterViewInit(): void {
//     this.initializeCamera();
//   }

//   async initializeCamera(): Promise<void> {
//     try {
//       const mediaDevices: MediaDeviceInfo[] = await WebcamUtil.getAvailableVideoInputs();
//       if (mediaDevices && mediaDevices.length > 0) {
//         const videoSource = mediaDevices[0].deviceId;
//         const constraints: MediaStreamConstraints = {
//           video: { deviceId: videoSource }
//         };
//         const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints);
//         this.videoElement.nativeElement.srcObject = stream;
//       } else {
//         console.error('No media devices found.');
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   }
// }


//working 2
// implements OnInit {
//   @ViewChild('videoElement') videoElement!: ElementRef;

//   constructor() { }

//   ngOnInit(): void {
//     this.setupWebcam();
//   }

//   private setupWebcam(): void {
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then(stream => {
//         const video = this.videoElement.nativeElement;
//         video.srcObject = stream;
//       })
//       .catch(error => console.error('Error accessing webcam:', error));
//   }
// }



