
import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild, enableProdMode } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AnimationOptions } from 'ngx-lottie';
import { CacheService } from 'src/app/services/cache.service';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'header-container',
  templateUrl: 'header-container.component.html',
  styleUrls: ['header-container.component.css'],
})
export class HeaderContainer implements OnInit {
  @ViewChild('loginTemplate') userInputTemplate!: TemplateRef<any>;
  @ViewChild('errorTemplate') errorTemplate!: TemplateRef<any>;
  @ViewChild('loadingTemplate') loadingTemplate!: TemplateRef<any>;
  @ViewChild('logoutTemplate') logoutTemplate!: TemplateRef<any>;


  @Input()
  rootClassName: string = ''
  @Input()
  contact: string = 'Contact'
  @Input()
  about: string = 'About'
  @Input()
  Image_alt: string = 'image'
  @Input()
  partners: string = 'Partners'
  @Input()
  menu: string = 'Menu'
  @Input()
  login: string = 'Login'
  @Input()
  logoutButton: string = 'Logout'
  @Input()
  myResults: string = 'Result'
  @Input()
  Image_src: string = '/assets/playground_assets/logo-no-background.svg'

  form!: FormGroup;
  modalRef?: BsModalRef;
  errorMessage!: string;
  lottie!: AnimationOptions;
  errorImage = 'https://i.postimg.cc/PJb2RGVs/404-not-found.png';
  logoutImage = "https://i.postimg.cc/sxf72dW5/98a92a3165e4949e714f4900f2c5a5cdf768c699e5a7e7f0904e43e12392515f.jpg"


  constructor(private fb: FormBuilder, private modalSvc: BsModalService, private loginSvc: LoginService, private router: Router) { this.isLoggedIn();}

  ngOnInit(): void {
    this.lottie = {
      path: '/assets/playground_assets/circle_loading.json',
    }
    this.isLoggedIn();
  }

  async proceedToLogin() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    //for some reasons, if is nedded to hide the modal below. not needed for other parts of the code.
    if (this.modalRef) {
      this.modalRef.hide(); 
    }

    this.modalRef = this.modalSvc.show(this.loadingTemplate);

    try {
      const hashedText = this.loginSvc.hashText(this.form.get('email')?.value, this.form.get('password')?.value);
      console.log("before login: " + hashedText)
      const dataToHash = "thisisarandomtextforextrasecurity";
      const doubleHash = this.loginSvc.doublehash(hashedText, dataToHash);
      this.loginSvc.hashedText = doubleHash;
      console.log("before login service hashtext: " + this.loginSvc.hashedText)


      await this.loginSvc.login(email, password);
      if (this.loginSvc.isLoggedIn) {
        this.form.reset();
        this.modalRef.hide();
        console.log("after login: " + hashedText)
        console.log("after login service hashtext: " + this.loginSvc.hashedText)
        //"fake" refresh so that data will be properly displayed if user logins in displayresults page
        //skiplocation will exclude this from browser history so that if back button is pressed, it will not go back to the home page.
        await this.router.navigateByUrl('/', { skipLocationChange: true });
        this.router.navigate(['/displayresults', doubleHash]);

      } else {
        this.errorMessage = "Account not found";
        this.modalRef.hide(); // Hide the loading modal
        this.modalRef = this.modalSvc.show(this.errorTemplate);
        this.router.navigate(['/']);
      }
    } catch (error) {
      this.errorMessage = "Account not found";
      console.log("Error during login:", error);
      this.modalRef.hide();
      this.modalRef = this.modalSvc.show(this.errorTemplate);
      this.router.navigate(['/']);
    }
  }


  private createForm(): FormGroup {
    return this.form = this.fb.group({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(4)]),
    })
  }

  loadLoginModal() {
    this.form = this.createForm();
    this.modalRef = this.modalSvc.show(this.userInputTemplate)
  }

  logout() {
    this.loginSvc.isLoggedIn = false;
    this.modalRef = this.modalSvc.show(this.logoutTemplate);
    this.loginSvc.clearData();
    this.router.navigate(['/']);
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  public isLoggedIn(): boolean {
    return this.loginSvc.isLoggedIn;
  }




}





