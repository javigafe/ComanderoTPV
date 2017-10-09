import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-edit-taula',
  templateUrl: './edit-taula.component.html',
  styleUrls: ['./edit-taula.component.scss'],
  providers: [RestaurantService, TaulaService, NgbModal, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot()
    ]
})

export class EditTaulaComponent implements OnInit {

    numTaula: number;
    comensals: number;
    restaurant;
    errorText: string;
    succes: string;
    restaurants = [];
    visible: boolean;
    closeResult: string;
    taulas = [];
    taula;
    taulasvisibles: boolean;

    constructor(private newRestaurantService: RestaurantService, private newTaulaService: TaulaService, private modalService: NgbModal, private newTranslateService: TranslateService) { }

    ngOnInit() {
        this.visible = false;
        this.taulasvisibles = false;
        this.getRestaurants();
        this.taula = null;
        this.restaurant = null;
    }

    getTaulas() {
        this.taula = null;
        if (this.restaurant !== null) {
            this.visible = false;
            this.taulas = [];
            this.taulasvisibles = true;
            this.newTaulaService.getTaulasRestaurant(this.restaurant.id).subscribe(
                (data) => this.taulas = data,
                (error) => this.errorText = 'Error: ' + error,
                () => console.log('OK Get Taulas')
            );
        } else {
            this.taulasvisibles = false;
            this.visible = false;
        }
    }

    getRestaurants() {
        this.newRestaurantService.getRestaurantes().subscribe(
            (data) => this.restaurants = data,
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Restaurants')
        );
    }

    getTaula() {
        if (this.taula !== null) {
            this.visible = true;
            this.comensals = this.taula.comensals;
            this.numTaula = this.taula.numTaula;
        } else {
            this.visible = false;
        }

    }

    editTaula() {
        this.errorText = '';
        this.succes = '';
        const tempTaula = JSON.stringify({
            comensals: this.comensals,
            numTaula: this.numTaula,
            idRestaurant: localStorage.getItem('url') + '/restaurant/' + this.restaurant.id + '/'
        });
        this.newTaulaService.editarTaula(this.taula.id, tempTaula).subscribe(
            (data) => this.getTaulas(),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('editedcorrectly', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
        this.visible = false;
        this.taulasvisibles = false;
        this.cline();
    }

    cline() {
        this.taulas = [];
        this.numTaula = null;
        this.comensals = null;
        this.restaurant = null;
        this.taula = null;
    }

    delete() {
        const tempTaula = JSON.stringify({
            actiu: false,
        });
        this.newTaulaService.editarTaula(this.taula.id, tempTaula).subscribe(
            (data) => this.getTaulas(),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_delete', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
        this.cline();
        this.visible = false;
        this.taulasvisibles = false;
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

}
