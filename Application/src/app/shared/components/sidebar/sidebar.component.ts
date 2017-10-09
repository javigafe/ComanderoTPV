import {Component, NgModule, OnInit, } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { GestionaService } from './../../services/gestiona.service' ;
import { UserService } from './../../services/user.service' ;
import { RestaurantService } from './../../services/restaurant.service' ;
import { AuthenticationService } from './../../services/authentication.service' ;
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [NgbModal, GestionaService, UserService, RestaurantService, TranslateService, AuthenticationService]
})

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        NgbModule.forRoot()
    ]
})

export class SidebarComponent implements OnInit {


    usuario: String;
    closeResult: string;
    restaurants = [];
    RestaurantActiu;
    nomRestaurant: String;

    isActive = false;
    showMenu = '';

    constructor(
        private translate: TranslateService,
        public router: Router,
        private modalService: NgbModal,
        private newGestionaService: GestionaService,
        private newUserService: UserService,
        private newRestaurantService: RestaurantService,
        private newTranslateService: TranslateService,
        private newAuthenticationService: AuthenticationService
    ) {
        this.usuario = localStorage.getItem('usuario');
    }

    ngOnInit() {
        this.RestaurantActiu = null;
        this.getRestaurantUsuari();
        this.getNomRestaurante();
    }

    onLoggedout() {
        this.newAuthenticationService.logout().subscribe(
            (data) => (
                localStorage.removeItem('isLoggedin'),
                    localStorage.removeItem('url'),
                    localStorage.removeItem('token'),
                    localStorage.removeItem('usuario'),
                    localStorage.removeItem('restaurante')
            ),
            (error) => console.log(error),
            () => console.log('OK Logout')
        );
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    getRestaurantUsuari() {
        // get user id
        this.newUserService.getUsers().subscribe(
            (data) => this.getGestioURL(this.getUserURL(data)),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Users')
        );
    }

    getUserURL(data): string {
        const usuari = localStorage.getItem('usuario');
        for (const user of data){
            if (user.username === usuari) {
                return user.url;
            }
        }
    }

    getGestioURL(url) {
        this.newGestionaService.getGestionats().subscribe(
            (data) => this.getRestaurants(data, url),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Gestiona')
        );
    }

    getRestaurants(datos, url: string) {
        this.restaurants = [];
        for (const gestionat of datos){
            if (gestionat.idUsuari === url) {
                this.newRestaurantService.getRestaurantesURL(gestionat.idRestaurant).subscribe(
                    (data) => (
                        this.addRestaurant(data)
                    ),
                    (error) => console.log('Error: ' + error),
                    () => console.log('OK Get Restaurant')
                );
            }
        }
    }

    addRestaurant(data) {
        if (data.actiu === true) {
            this.restaurants.push(data);
        }
    }

    selecioRestaurant() {
        if (this.RestaurantActiu !== null) {
            localStorage.setItem('restaurante', JSON.stringify(this.RestaurantActiu));
            //this.getNomRestaurante();
            location.reload();
        }
    }

    getNomRestaurante() {
        const rest = JSON.parse(localStorage.getItem('restaurante'));
        if (rest === null) {
            this.newTranslateService.get('restaurant', {value: 'world'}).subscribe((res: string) => {
                this.nomRestaurant = res;
            });
        } else {
            this.nomRestaurant = rest.nom;
        }
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    open(content) {
        this.modalService.open(content, {backdrop  : 'static'}).result.then((result) => {
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
