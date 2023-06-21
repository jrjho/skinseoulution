import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material.module';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './pages/camera/camera.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { UploadComponent } from './pages/upload/upload.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DisplayresultsComponent } from './pages/displayresults/displayresults.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Home } from './pages/home/home.component';
import { Contact } from './pages/contact/contact.component';
import { Partners } from './pages/partners/partners.component';
import { MenuComponent } from './pages/menu/menu.component';




const routes = [
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./pages/home/home.module').then((m) => m.HomeModule),
  // },
  // {
  //   path: 'take-photo',
  //   loadChildren: () =>
  //     import('./pages/take-photo/take-photo.module').then(
  //       (m) => m.TakePhotoModule
  //     ),
  // },
  // {
  //   path: 'login',
  //   loadChildren: () =>
  //     import('./pages/login/login.module').then((m) => m.LoginModule),
  // },
  // {
  //   path: 'contact',
  //   loadChildren: () =>
  //     import('./pages/contact/contact.module').then((m) => m.ContactModule),
  // },
  // {
  //   path: 'partners',
  //   loadChildren: () =>
  //     import('./pages/partners/partners.module').then((m) => m.PartnersModule),
  // },
  {path:"", component: Home},
  {path:"contact", component: Contact},
  {path:"menu", component: MenuComponent},
  {path: "partners", component: Partners},
  {path: "camera", component: CameraComponent},
  {path: "upload", component: UploadComponent},
  {path: "displayresults/:hashedText", component: DisplayresultsComponent},
  // {path: "displayresults", component: DisplayresultsComponent},


]

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    UploadComponent,
    DisplayresultsComponent,
    Home,
    Contact,
    Partners,
    MenuComponent
    ],
  imports: [
    BrowserModule, 
    MaterialModule, 
    WebcamModule, 
    ComponentsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AlertModule.forRoot(),
    LottieModule.forRoot({ player: () => player}),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    RouterModule.forRoot(routes), 
    TooltipModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}), BrowserAnimationsModule, CarouselModule.forRoot(), ModalModule.forRoot(), TabsModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
