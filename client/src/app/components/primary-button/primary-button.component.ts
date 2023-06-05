import { Component, Input } from '@angular/core'

@Component({
  selector: 'primary-button',
  templateUrl: 'primary-button.component.html',
  styleUrls: ['primary-button.component.css'],
})
export class PrimaryButton {
  @Input()
  rootClassName: string = ''
  @Input()
  button: string = 'Button'
  @Input() 
  disabled = false;

  constructor() {}
}
