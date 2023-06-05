import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { StatsCard } from './stats-card/stats-card.component'
import { FeatureCard } from './feature-card/feature-card.component'
import { LinkIconButton } from './link-icon-button/link-icon-button.component'
import { HeaderContainer } from './header-container/header-container.component'
import { PrimaryButton } from './primary-button/primary-button.component'
import { StoreBanner } from './store-banner/store-banner.component'
import { SecondaryButton } from './secondary-button/secondary-button.component'
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ReactiveFormsModule } from '@angular/forms'
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';


@NgModule({
  declarations: [
    StatsCard,
    FeatureCard,
    LinkIconButton,
    HeaderContainer,
    PrimaryButton,
    StoreBanner,
    SecondaryButton,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LottieModule.forRoot({ player: () => player}),PopoverModule.forRoot()
  ],
  exports: [
    StatsCard,
    FeatureCard,
    LinkIconButton,
    HeaderContainer,
    PrimaryButton,
    StoreBanner,
    SecondaryButton,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
