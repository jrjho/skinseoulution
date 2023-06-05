import { Component, Input } from '@angular/core'

@Component({
  selector: 'feature-card',
  templateUrl: 'feature-card.component.html',
  styleUrls: ['feature-card.component.css'],
})
export class FeatureCard {
  @Input()
  rootClassName: string = ''
  @Input()
  card_title: string = 'Title'
  @Input()
  text: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.'
  @Input()
  image_src: string = '/assets/playground_assets/01.svg'
  @Input()
  image_alt: string = 'image'
  constructor() {}
}
