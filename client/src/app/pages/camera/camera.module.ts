// import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core'
// import { RouterModule } from '@angular/router'
// import { CommonModule } from '@angular/common'

// import { ComponentsModule } from '../../components/components.module'
// import { CameraComponent } from './camera.component'
// import { WebcamModule } from 'ngx-webcam'
// import { MaterialModule } from 'src/app/material.module'
// import { AppModule } from 'src/app/app.module'
// import { ServiceWorkerModule } from '@angular/service-worker'

// const routes = [
//   {
//     path: '',
//     component: CameraComponent,
//   },
// ]

// @NgModule({
//   declarations: [CameraComponent],
//   imports: [CommonModule, ComponentsModule,WebcamModule, MaterialModule,RouterModule.forChild(routes),
  
//     ServiceWorkerModule.register('ngsw-worker.js', {
//       enabled: !isDevMode(),
//       // Register the ServiceWorker as soon as the application is stable
//       // or after 30 seconds (whichever comes first).
//       registrationStrategy: 'registerWhenStable:30000'})
//   ],
//   exports: [CameraComponent],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class CameraModule {}
