import {ChangeDetectorRef, Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.scss'],
  providers: [RestaurantService, NgbModal, TaulaService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot()
    ]
})

export class EditRestaurantComponent implements OnInit {

    restaurantes = [];
    nom: string;
    direccio: string;
    telefon: number;
    nif: string;
    errorText: string;
    succes: string;
    idRestaurantActiu: number;
    visible: boolean;
    closeResult: string;
    url: string;
    noBorrable: boolean;
    search: string;

    constructor(private newRestaurantService: RestaurantService, private modalService: NgbModal, private newTaulaService: TaulaService, private newTranslateService: TranslateService) { }

    ngOnInit() {
        this.getRestaurants();
        this.visible = false;
        this.idRestaurantActiu = null;
    }

    getRestaurants() {
        this.newRestaurantService.getRestaurantes().subscribe(
            (data) => (
                this.restaurantes = [],
                this.restaurantes = data
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Restaurants')
        );
    }

    cline() {
        this.nom = '';
        this.direccio = '';
        this.telefon = null;
        this.nif = '';
    }

    getRestaurant() {
        this.errorText = '';
        this.succes = '';
        if (this.idRestaurantActiu !== null) {
            if (!(this.idRestaurantActiu.toString() === '')) {
                this.visible = true;
                this.newRestaurantService.getRestaurante(this.idRestaurantActiu).subscribe(
                    (data) => (
                        this.nom = data.nom,
                            this.direccio = data.direccio,
                            this.telefon = data.telefon,
                            this.nif = data.NIF,
                            this.url = data.url
                    ),
                    (error) => this.errorText = 'Error: ' + error,
                    () => console.log('OK Get Restaurants')
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

    delete() {
        this.newRestaurantService.deleteRestaurante(this.idRestaurantActiu).subscribe(
            (data) => (
                console.log(data),
                this.getRestaurants()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_delete', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
        this.cline();
        this.idRestaurantActiu = null;
        this.visible = false;
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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

    editRestaurant() {
        this.errorText = '';
        this.succes = '';
        const tempRestaurant = JSON.stringify({
            nom: this.nom,
            direccio: this.direccio,
            telefon: this.telefon,
            NIF: this.nif,
        });
        this.newRestaurantService.editarRestaurante( this.idRestaurantActiu, tempRestaurant).subscribe(
            (data) => (
                console.log(data),
                this.getRestaurants()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('editedcorrectly', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
        this.cline();
        this.idRestaurantActiu = null;
        this.visible = false;
    }

    checkTaulas() {
        this.newTaulaService.getTaulas().subscribe(
            (data) => (
                this.teTaulas(data, this.url)
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Taulas')
        );
    }

    teTaulas(data, url: string) {
        let index = 0;
        this.noBorrable = false;
        while ((data.length > index) && (!this.noBorrable)) {
            if (data[index].idRestaurant === url) {
                this.noBorrable = true;
            }
            index = index + 1;
        }
    }

    closeError() {
        this.noBorrable = false;
    }

    searchFun() {
        if (this.search === '') {
            this.getRestaurants();
        } else {
            this.newRestaurantService.getSearch(this.search).subscribe(
                (data) => (
                    this.restaurantes = [],
                    this.restaurantes = data
                ),
                (error) => this.errorText = 'Error: ' + error,
                () => console.log('OK Get Restaurants Search')
            );
        }
    }

    clineSerarch() {
        this.search = '';
        this.getRestaurants();
    }

}
