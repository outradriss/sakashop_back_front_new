import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import localeArMa from '@angular/common/locales/ar-MA';
import { registerLocaleData } from '@angular/common'; // Importez registerLocaleData
registerLocaleData(localeArMa);
platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
  
