import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-kitchen',
    templateUrl: './kitchen.component.html',
    styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {
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
