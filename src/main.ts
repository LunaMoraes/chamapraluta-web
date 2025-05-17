import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { tsParticles } from '@tsparticles/engine';



bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


  
