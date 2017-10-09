import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitchenRoutingModule } from './kitchen-routing.module';
import { KitchenComponent } from './kitchen.component';
import { PageHeaderModule } from './../../shared';
import { TaulasKitchenComponent } from './components/taulas-kitchen/taulas-kitchen.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        KitchenRoutingModule,
        PageHeaderModule,
        TranslateModule
    ],
    declarations: [KitchenComponent, TaulasKitchenComponent]
})
export class KitchenModule { }
