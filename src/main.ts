import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// `bootstrapApplication` es la función que inicializa la aplicación Angular.
// Le pasamos el componente raíz (AppComponent) y la configuración de la app (appConfig).
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
