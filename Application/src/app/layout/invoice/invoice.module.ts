import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { PageHeaderModule } from './../../shared';
import { GenerateTicketComponent } from './components/generate-ticket/generate-ticket.component';
import { ShowTicketsComponent } from './components/show-tickets/show-tickets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        InvoiceRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TranslateModule
    ],
    declarations: [InvoiceComponent, GenerateTicketComponent, ShowTicketsComponent]
})
export class InvoiceModule { }
