
import {NgModule} from '@angular/core';
import {LazyLoadDirective} from './lazyLoadDirective';

@NgModule({
    declarations: [LazyLoadDirective],
    exports:[LazyLoadDirective]
   })
   export class LazyLoadModule{}