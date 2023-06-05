import { Injectable } from '@angular/core';
import { ConnectToServerService } from './connect-to-server.service';
import { AnaylzeSkinResult, DetectFaceResult, Procedure } from '../models/apiCallResults';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { CacheService } from './cache.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn: boolean = false;
  hashedText!: string;
  imageData: any;
  analyzeSkin?: AnaylzeSkinResult | null;
  procedureList!: Procedure[];
  result?: string | null;
  faceResults?: DetectFaceResult | null;

  constructor(private connectSvc: ConnectToServerService, private router: Router, private cacheSvc : CacheService) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      this.isLoggedIn = true;
      this.analyzeSkin = JSON.parse(localStorage.getItem("analyzeSkinResult") || '{}');
      this.procedureList = JSON.parse(localStorage.getItem("procedureList") || '{}');
      this.result = localStorage.getItem("uploadOrUpdateImage");
      this.faceResults = JSON.parse(localStorage.getItem("detectResponse") || '{}');
      this.imageData = JSON.parse(localStorage.getItem("imageData") || '{}');
    }
  }

  doublehash(input1: string, input2: string) {
    const secondHash = CryptoJS.SHA1(input2).toString();
    const toAppend = secondHash.substring(0, 8);
    return input1 + toAppend;
  }

  hashText(e: string, p: string): string {
    const text = e + p;
    console.log(text);
    const hashedText = CryptoJS.MD5(text).toString();
    console.log(hashedText);
    return hashedText;
  }

  async login(e: string, p: string) {
    try {
      await this.performLogin(e, p);
    } catch (error) {
      console.log("Error during login:", error);
    }
  }

  async performLogin(e: string, p: string) {
    const hashedText = this.hashText(e, p);

    try {
      const response = await this.connectSvc.login(hashedText);
      const result = response as { image: any, toreturn: AnaylzeSkinResult, procedureList: { procedures: Procedure[] }, uploadOrUpdateImage: any, detectResponse: DetectFaceResult };

      this.isLoggedIn = true;
      // this.saveisLoggedIn();
      this.imageData = result.image.image;
      // this.saveImageData(result.image.image);
      this.analyzeSkin = result.toreturn;
      // this.saveAnalyzeSkinResult(result.toreturn);
      this.procedureList = result.procedureList.procedures;
      // this.saveProcedureList(result.procedureList.procedures);
      this.result = result.uploadOrUpdateImage
      // this.saveUploadOrUpdateImageResult(result.uploadOrUpdateImage);
      this.faceResults = result.detectResponse;
      // this.saveDetectFaceResult(result.detectResponse);

      this.cacheSvc.saveData(this.isLoggedIn, this.imageData, this.analyzeSkin, this.procedureList, this.result, this.faceResults);

    } catch (error) {
      console.log("Error during login:", error);
    }
  }

  // saveisLoggedIn() {
  //   localStorage.setItem("isLoggedIn", this.isLoggedIn.toString());
  //   this.scheduleDeletion("isLoggedIn", 5 * 60 * 1000); // 5 minutes

  // }

  // saveImageData(imageData: any) {
  //   localStorage.setItem("imageData", JSON.stringify(imageData));
  //   this.scheduleDeletion("imageData", 5 * 60 * 1000); // 5 minutes

  // }

  // saveAnalyzeSkinResult(analyzeSkinResult: AnaylzeSkinResult) {
  //   localStorage.setItem("analyzeSkinResult", JSON.stringify(analyzeSkinResult));
  //   this.scheduleDeletion("analyzeSkinResult", 5 * 60 * 1000); // 5 minutes

  // }

  // saveProcedureList(procedureList: Procedure[]) {
  //   localStorage.setItem("procedureList", JSON.stringify(procedureList));
  //   this.scheduleDeletion("procedureList", 5 * 60 * 1000); // 5 minutes

  // }

  // saveUploadOrUpdateImageResult(uploadOrUpdateImage: any) {
  //   localStorage.setItem("uploadOrUpdateImage", JSON.stringify(uploadOrUpdateImage));
  //   this.scheduleDeletion("uploadOrUpdateImage", 5 * 60 * 1000); // 5 minutes

  // }

  // saveDetectFaceResult(detectResponse: DetectFaceResult) {
  //   localStorage.setItem("detectResponse", JSON.stringify(detectResponse));
  //   this.scheduleDeletion("detectResponse", 5 * 60 * 1000); // 5 minutes

  // }

  // //automatically delete data after specified duration
  // scheduleDeletion(key: string, duration: number) {
  //   setTimeout(() => {
  //     localStorage.removeItem(key);
  //   }, duration);
  // }

  clearData() {
    // Clear all stored data from localStorage
    this.cacheSvc.clearData();
    this.imageData = '';
    this.analyzeSkin = null;
    this.procedureList = [];
    this.result = null;
    this.faceResults = null;
    this.isLoggedIn = false;
  }


}
