import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
    AddCategoriaComponent,
    EditCategoriaComponent,
    AddConsumibleComponent,
    EditConsumibleComponent,
    DoFiDiaComponent,
    CheckFiDiaComponent,
    AddClientsComponent,
    EditClientsComponent,
    AddTrabajadorComponent,
    EditTrabajadorComponent,
    EditRestaurantComponent,
    AddRestaurantComponent,
    AddTaulaComponent,
    EditTaulaComponent,
} from './components';
import { StatModule } from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeTableComponent } from './components/change-table/change-table.component';


@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        StatModule,
        FormsModule,
        NgbModule.forRoot(),
        TranslateModule
    ],
    declarations: [
        DashboardComponent,
        AddCategoriaComponent,
        EditCategoriaComponent,
        AddConsumibleComponent,
        EditConsumibleComponent,
        DoFiDiaComponent,
        CheckFiDiaComponent,
        AddClientsComponent,
        EditClientsComponent,
        AddTrabajadorComponent,
        EditTrabajadorComponent,
        EditRestaurantComponent,
        AddRestaurantComponent,
        AddTaulaComponent,
        EditTaulaComponent,
        ChangeTableComponent
    ]
})
export class DashboardModule { }
