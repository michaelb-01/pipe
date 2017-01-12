import 'angular2-meteor-polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './imports/app/app.module';

function main() {
    const platform = platformBrowserDynamic();
    platform.bootstrapModule(AppModule);
}


if (document.readyState === 'complete') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}