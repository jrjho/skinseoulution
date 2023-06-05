import { Component, Input } from '@angular/core'

@Component({
  selector: 'link-icon-button',
  templateUrl: 'link-icon-button.component.html',
  styleUrls: ['link-icon-button.component.css'],
})
export class LinkIconButton {
  @Input()
  text: string = 'Button'
  constructor() {}
}
