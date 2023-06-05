import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConnectToServerService {

  imageData = "";
  userInputtedInfo !: Boolean

  LOCAL_URL_DETECT = "http://localhost:8080/detect"
  LOCAL_URL_ANALYZE = "http://localhost:8080/analyze"
  LOCAL_URL_LOGIN = "http://localhost:8080/login"
  LOCAL_URL_UPLOAD = "http://localhost:8080/upload"
  LOCAL_URL_DELETE = "http://localhost:8080/delete"
  LOCAL_URL_CONTACT = "http://localhost:8080/contact"


  constructor(private httpClient: HttpClient) { }


  sendContactForm(name: string, userEmail: string, subject: string, content: string) {
    const formData = new FormData();
    formData.set("name", name);
    formData.set("userEmail", userEmail);
    formData.set("subject", subject);
    formData.set("content", content);
    
    return lastValueFrom(this.httpClient.post(this.LOCAL_URL_CONTACT, formData));
  }


  deleteAccount(hashedText: string) {
    hashedText = hashedText.substring(0, 32);
    const url = `${this.LOCAL_URL_DELETE}/${hashedText}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    // return lastValueFrom(this.httpClient.delete<any>(url, options));
    return lastValueFrom(this.httpClient.delete(this.LOCAL_URL_DELETE + "/" + hashedText));
  }

  checkForFace(image: Blob) {
    const formData = new FormData();
    formData.set("image", image);

    return lastValueFrom(this.httpClient.post(this.LOCAL_URL_DETECT, formData));
  }

  analyzeSkin(image: Blob, hashedText: string) {
    const formData = new FormData();
    formData.set("image", image);
    if (hashedText == "null") {
      return lastValueFrom(this.httpClient.post(this.LOCAL_URL_ANALYZE, formData));
    }
    else{
      formData.set("hashedText", hashedText);
      return lastValueFrom(this.httpClient.post(this.LOCAL_URL_ANALYZE, formData));
    }
  }

  login(hashedText: string) {
    console.log("hashedText is: ", hashedText);
    return lastValueFrom(this.httpClient.get(this.LOCAL_URL_LOGIN  + '/' + hashedText));
  }

  upload(image: Blob, key: string) {
    const formData = new FormData();
    formData.set("image", image);
    formData.set("key", key);
    return lastValueFrom(this.httpClient.post(this.LOCAL_URL_UPLOAD, formData));
  }

}
