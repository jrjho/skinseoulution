import { Injectable } from '@angular/core';
import { AnaylzeSkinResult, Procedure, DetectFaceResult } from '../models/apiCallResults';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  saveisLoggedIn(isLoggedIn: boolean) {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
    this.scheduleDeletion("isLoggedIn", 5 * 60 * 1000); // 5 minutes

  }

  saveImageData(imageData: any) {
    localStorage.setItem("imageData", JSON.stringify(imageData));
    this.scheduleDeletion("imageData", 5 * 60 * 1000); // 5 minutes

  }

  saveAnalyzeSkinResult(analyzeSkinResult: AnaylzeSkinResult) {
    localStorage.setItem("analyzeSkinResult", JSON.stringify(analyzeSkinResult));
    this.scheduleDeletion("analyzeSkinResult", 5 * 60 * 1000); // 5 minutes

  }

  saveProcedureList(procedureList: Procedure[]) {
    localStorage.setItem("procedureList", JSON.stringify(procedureList));
    this.scheduleDeletion("procedureList", 5 * 60 * 1000); // 5 minutes

  }

  saveUploadOrUpdateImageResult(uploadOrUpdateImage: any) {
    localStorage.setItem("uploadOrUpdateImage", JSON.stringify(uploadOrUpdateImage));
    this.scheduleDeletion("uploadOrUpdateImage", 5 * 60 * 1000); // 5 minutes

  }

  saveDetectFaceResult(detectResponse: DetectFaceResult) {
    localStorage.setItem("detectResponse", JSON.stringify(detectResponse));
    this.scheduleDeletion("detectResponse", 5 * 60 * 1000); // 5 minutes

  }

  //automatically delete data after specified duration
  scheduleDeletion(key: string, duration: number) {
    setTimeout(() => {
      localStorage.removeItem(key);
    }, duration);
  }

  saveData(isLoggedIn: boolean, imageData: any, analyzeSkinResult: AnaylzeSkinResult, procedureList: Procedure[], uploadOrUpdateImage: any, detectResponse: DetectFaceResult) {
    this.saveisLoggedIn(isLoggedIn);
    this.saveImageData(imageData);
    this.saveAnalyzeSkinResult(analyzeSkinResult);
    this.saveProcedureList(procedureList);
    this.saveUploadOrUpdateImageResult(uploadOrUpdateImage);
    this.saveDetectFaceResult(detectResponse);
  }

  clearData() {
    // Clear all stored data from localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("imageData");
    localStorage.removeItem("analyzeSkinResult");
    localStorage.removeItem("procedureList");
    localStorage.removeItem("uploadOrUpdateImage");
    localStorage.removeItem("detectResponse");
  }

}



