import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
    restaurant;
    restaurantBuit;
    taulaActiva;

    ngOnInit() {
        this.getRestaurant();
    }

    getRestaurant() {
        this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
        if (this.restaurant === null) {
            this.restaurantBuit = true;
        } else {
            this.restaurantBuit = false;
        }
    }

    public setTaula(taula) {
        this.taulaActiva = taula;
    }
}
