import { Component, Input } from '@angular/core'

@Component({
  selector: 'stats-card',
  templateUrl: 'stats-card.component.html',
  styleUrls: ['stats-card.component.css'],
})
export class StatsCard {
  @Input()
  number: string = '10'
  @Input()
  image_src: string = '/assets/playground_assets/05.svg'
  @Input()
  description: string = 'Description'
  @Input()
  image_alt: string = 'image'
  constructor() {}
}
