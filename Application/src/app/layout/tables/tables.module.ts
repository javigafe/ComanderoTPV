import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { TablesComponent } from './tables.component';
import { TablesRoutingModule } from './tables-routing.module';
import { PageHeaderModule } from './../../shared';
import {
    SelectorTaulaComponent
} from './components';
import { StatModule } from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        TablesRoutingModule,
        PageHeaderModule,
        StatModule,
        FormsModule,
        NgbModule.forRoot(),
        TranslateModule
    ],
    declarations: [
        TablesComponent,
        SelectorTaulaComponent
    ]
})
export class TablesModule {}
