import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { ClientService } from './../../../../../app/shared/services/client.service';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-edit-clients',
    templateUrl: './edit-clients.component.html',
    styleUrls: ['./edit-clients.component.scss'],
    providers: [ClientService, NgbModal, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot()
    ]
})

export class EditClientsComponent implements OnInit {

    nom: string;
    direccio: string;
    dni_nif: string;
    errorText: string;
    succes: string;
    closeResult: string;
    visible: boolean;
    clients = [];
    idClinetActiu: number;
    search: string;

    constructor(private newClientService: ClientService, private modalService: NgbModal, private newTranslateService: TranslateService) { }

    ngOnInit() {
        this.getClients();
        this.visible = false;
        this.idClinetActiu = null;
    }

    cline() {
        this.nom = '';
        this.direccio = '';
        this.dni_nif = '';
    }

    getClients() {
        this.newClientService.getClients().subscribe(
            (data) => (
                this.clients = [],
                this.clients = data
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Restaurants')
        );
    }

    getClient() {
        this.errorText = '';
        this.succes = '';
        if (this.idClinetActiu !== null) {
            if (!(this.idClinetActiu.toString() === '')) {
                this.visible = true;
                this.newClientService.getClient(this.idClinetActiu).subscribe(
                    (data) => (
                        this.nom = data.nom,
                            this.direccio = data.direccio,
                            this.dni_nif = data.NIF_DNI
                    ),
                    (error) => this.errorText = 'Error: ' + error,
                    () => console.log('OK Get Client')
                );
            } else {
                this.cline();
                this.visible = false;
            }
        } else {
            this.cline();
            this.visible = false;
        }
    }

    editClient() {
        this.errorText = '';
        this.succes = '';
        const tempClient = JSON.stringify({
            nom: this.nom,
            direccio: this.direccio,
            NIF_DNI: this.dni_nif,
        });
        this.newClientService.editarClient(this.idClinetActiu, tempClient).subscribe(
            (data) => (
                console.log(data),
                this.getClients()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
        this.cline();
        this.idClinetActiu = null;
        this.visible = false;
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }


    delete() {
        this.newClientService.deleteClient(this.idClinetActiu).subscribe(
            (data) => (
                console.log(data),
                this.getClients()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_delete', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
        this.cline();
        this.idClinetActiu = null;
        this.visible = false;
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    searchFun() {
        if (this.search === '') {
            this.getClients();
        } else {
            this.newClientService.getSearch(this.search).subscribe(
                (data) => (
                    this.clients = [],
                    this.clients = data
                ),
                (error) => this.errorText = 'Error: ' + error,
                () => console.log('OK Get Restaurants Search')
            );
        }
    }

    clineSerarch() {
        this.search = '';
        this.getClients();
    }


}
