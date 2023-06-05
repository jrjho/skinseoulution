import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-partners',
  templateUrl: 'partners.component.html',
  styleUrls: ['partners.component.css'],
})
export class Partners {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Partners - project')
    this.meta.addTags([
      {
        property: 'og:title',
        content: 'Partners - project',
      },
    ])
  }
}
