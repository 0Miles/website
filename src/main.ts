import '@master/css';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

(window as any)['__zone_symbol__PASSIVE_EVENTS'] = ['scroll'];

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
