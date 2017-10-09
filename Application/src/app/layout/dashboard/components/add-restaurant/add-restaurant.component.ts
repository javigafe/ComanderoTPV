import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss'],
  providers: [RestaurantService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class AddRestaurantComponent implements OnInit {

    nom: string;
    direccio: string;
    telefon: number;
    nTiquets: number;
    nif: string;
    errorText: string;
    succes: string;

    constructor(private newRestaurantService: RestaurantService, private newTranslateService: TranslateService) { }

    ngOnInit() {
    }

    cline() {
        this.nom = '';
        this.direccio = '';
        this.telefon = null;
        this.nTiquets = null;
        this.nif = '';
    }

    addRestaurant() {
        this.errorText = '';
        this.succes = '';
        const tempRestaurant = JSON.stringify({
            nom: this.nom,
            direccio: this.direccio,
            telefon: this.telefon,
            nTiquets: this.nTiquets,
            nFiDia: 0,
            NIF: this.nif,
            brut: false,
            logo: null
        });
        this.newRestaurantService.postRestaurante(tempRestaurant).subscribe(
            (data) => console.log(data),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
        this.cline();
    }

}
