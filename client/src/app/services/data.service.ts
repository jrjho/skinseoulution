import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  private dataSubject = new BehaviorSubject<string[]>([]);
  public data$ = this.dataSubject.asObservable();

  updateData(data: string[]): void {
    this.dataSubject.next(data);
  }
}
