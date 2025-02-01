import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LockService {

  constructor() { }

  private locked: boolean = false;

  setLocked(isLocked: boolean): void {
    this.locked = isLocked;
  }

  isLocked(): boolean {
    return this.locked;
  }
}
