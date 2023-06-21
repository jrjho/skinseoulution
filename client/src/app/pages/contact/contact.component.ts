import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser'
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AnimationOptions } from 'ngx-lottie';
import { from } from 'rxjs';
import { ConnectToServerService } from 'src/app/services/connect-to-server.service';


@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
  styleUrls: ['contact.component.css'],
})
export class Contact implements OnInit{
  @ViewChild('loadingTemplate') loadingTemplate!: TemplateRef<any>;

  form!: FormGroup;
  emailSentStatus!: string;
  lottie!: AnimationOptions;
  modalRef?: BsModalRef;

  ngOnInit(): void {
    this.form = this.createForm();
    this.lottie = {
      path: '/assets/playground_assets/sending_email.json',
    }
  }
  constructor(private title: Title, private meta: Meta, private sanitizer: DomSanitizer,private fb: FormBuilder, private connectSvc:ConnectToServerService, private modalSvc: BsModalService) {
    this.title.setTitle('Contact - project')
    this.meta.addTags([
      {
        property: 'og:title',
        content: 'Contact - project',
      },
    ])
  }

  async submitContactForm(){
    if (this.modalRef) {
      this.modalRef.hide(); 
    }
    this.modalRef = this.modalSvc.show(this.loadingTemplate);

    const name = this.form.get('name')?.value;
    const userEmail = this.form.get('userEmail')?.value;
    const subject = this.form.get('subject')?.value;
    const content = this.form.get('content')?.value;
    await this.connectSvc.sendContactForm(name, userEmail, subject, content)
    .then((result) => {
      const fromServer = result as { emailSentStatus: any };
        this.emailSentStatus = fromServer.emailSentStatus;
        if(this.emailSentStatus == "Success"){
          this.form.reset();
          if (this.modalRef) {
            this.modalRef.hide(); 
          }
        }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  private createForm(): FormGroup {
    return this.form = this.fb.group({
      userEmail: this.fb.control<string>('', [Validators.required, Validators.email]),
      name: this.fb.control<string>('', [Validators.required, Validators.minLength(1)]),
      subject: this.fb.control<string>('', [Validators.required, Validators.minLength(1)]),
      content: this.fb.control<string>('', [Validators.required, Validators.minLength(1)]),
    })
  }

  getUrl(){
  return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.790159252997!2d103.8517626761759!3d1.3007713986868878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19baf7e8741b%3A0x37dd87f9c32fb980!2s271%20Queen%20St%2C%20Singapore%20180271!5e0!3m2!1sen!2sjp!4v1684571403912!5m2!1sen!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  );
}
}
