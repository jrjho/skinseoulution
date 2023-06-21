import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConnectToServerService } from 'src/app/services/connect-to-server.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class Home implements OnInit, AfterViewInit {

  @ViewChild('userInputTemplate') userInputTemplate!: TemplateRef<any>;
  @ViewChild('deleteAccountTemplate') deleteAccountTemplate!: TemplateRef<any>;
  @ViewChild('deleteSuccessTemplate') deleteSuccessTemplate!: TemplateRef<any>;
  @ViewChild('deleteFailedTemplate') deleteFailedTemplate!: TemplateRef<any>;


  selectedFile!: File;
  form!: FormGroup;
  modalRef?: BsModalRef;
  hashedText: string = '';
  yearOfBirth: string = '';
  deleteAccountImage: string = "https://i.postimg.cc/cHW7s6f6/E-74r-AIWYAYt-N6-G.jpg"
  deleteSuccessImage: string = "https://i.postimg.cc/8z5Gp2vS/c36923fc3fcc6d4002e54406a91f254f.jpg"
  deleteFailedImage: string = "https://i.postimg.cc/bJRV2JXF/well-we-tried-6fdbe4a4f0.jpg"



  rawn8vf: string = ' '
  constructor(private title: Title, private meta: Meta, private router: Router, private connectSvc: ConnectToServerService, private loginSvc: LoginService, private fb: FormBuilder, private modalSvc: BsModalService) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  ngAfterViewInit(): void {
    this.form = this.createForm();
    this.hashedText = this.loginSvc.hashedText;
  }

  public isLoggedIn(): boolean {
    return this.loginSvc.isLoggedIn;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = ['jpg', 'jpeg', 'png'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      // 2MB in bytes to meet API requirements
      const maxSize = 2 * 1024 * 1024;

      if (validExtensions.includes(fileExt)) {
        if (file.size > maxSize) {
          this.router.navigate(['/']);
          alert('File size should be no larger than 2MB.');
        } else {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.connectSvc.imageData = e.target.result;
            // this.form = this.createForm();
            // this.router.navigate(['/displayresults']);
            this.openModalForm();

          };
          reader.readAsDataURL(file);
        }
      } else {
        this.router.navigate(['/']); // navigates to home page
        alert('Invalid file type, only these file types are allowed: ' + validExtensions.join(', '));
      }
    }
  }

  deleteAccount() {
    this.modalRef = this.modalSvc.show(this.deleteAccountTemplate)
  }

  async proceedToDelete() {

    await this.connectSvc.deleteAccount(this.loginSvc.hashedText)
      .then((response) => {
        const result = response as { deleteResponse: any };
        if (result.deleteResponse == "Success") {
          this.loginSvc.isLoggedIn = false;
          this.loginSvc.clearData();
          this.router.navigate(['/']);
          this.modalRef = this.modalSvc.show(this.deleteSuccessTemplate);
        }
        if (response == "Failed") {
          this.loginSvc.isLoggedIn = false;
          this.router.navigate(['/']);
          this.modalRef = this.modalSvc.show(this.deleteFailedTemplate);
        }
      })

      .catch((error) => {

      });
  }

  private createForm(): FormGroup {
    return this.form = this.fb.group({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(4)]),
    })
  }

  openModalForm() {
    this.modalRef = this.modalSvc.show(this.userInputTemplate)
  }

  onCloseClick(): void {
    alert('Select yes or no below');
  }

  proceedWithoutDetails() {
    this.router.navigate(['/displayresults', 'null']);

  }

  proceedWithDetails() {
    const hashedText = this.loginSvc.hashText(this.form.get('email')?.value, this.form.get('password')?.value);
    const dataToHash = "thisisarandomtextforextrasecurity";
    const doubleHash = this.loginSvc.doublehash(hashedText, dataToHash);
    this.hashedText = doubleHash;
    this.router.navigate(['/displayresults', doubleHash]);
  }

}
