import {Component, NgModule, OnInit, } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UserService } from './../../../app/shared/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [UserService]
})

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot(),
        HttpModule,
    ]
})

export class DashboardComponent implements OnInit {
    hideNum = 0;
    adbancedURL: string;
    restaurant;
    restaurantBuit;
    cargo: number;
    loading: boolean;

    constructor(private translate: TranslateService, private newUserService: UserService) { };

    ngOnInit () {
        this.loading = true;
        this.adbancedURL = localStorage.getItem('url') + '/admin/';
        this.getRestaurant();
        this.userPermitions();
    }

    getRestaurant() {
        this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
        if (this.restaurant === null) {
            this.restaurantBuit = true;
        } else {
            this.restaurantBuit = false;
        }
    }

    changeHideNum(numero: number) {
        this.hideNum = numero;
    };

    userPermitions() {
        this.newUserService.getUser(localStorage.getItem('usuario')).subscribe(
            (data) => this.newUserService.getUserprofile((data[0].url.split('/', 5))[4]).subscribe(
                (datos) => (
                    this.asignarcarec(datos)
                ),
                (error) => console.log(error),
                () => console.log()
            ),
            (error) => console.log(error),
            () => console.log()
        );
    }

    asignarcarec (cargo) {
        if (cargo.length === 0) {
            this.cargo = 1;
        } else {
            this.cargo = cargo[0].carrec;
        }
        this.loading = false;
    }
}
