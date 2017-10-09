import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
    restaurant;
    restaurantBuit;
    menu: number;

    ngOnInit() {
        this.getRestaurant();
        this.menu = 0;
    }

    getRestaurant() {
        this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
        if (this.restaurant === null) {
            this.restaurantBuit = true;
        } else {
            this.restaurantBuit = false;
        }
    }

    changeMenu(numMenu: number) {
        this.menu = numMenu;
    }
}
