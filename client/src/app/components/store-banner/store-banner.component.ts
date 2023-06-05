import { Component, Input } from '@angular/core'

@Component({
  selector: 'store-banner',
  templateUrl: 'store-banner.component.html',
  styleUrls: ['store-banner.component.css'],
})
export class StoreBanner {
  @Input()
  image_src: string = '/assets/playground_assets/app-store-badge-200h.png'
  @Input()
  image_alt1: string = 'image'
  @Input()
  image_src1: string = '/assets/playground_assets/google-play-badge-200h.png'
  @Input()
  image_alt: string = 'image'
  constructor() {}
}
