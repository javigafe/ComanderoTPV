import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-taula',
  templateUrl: './add-taula.component.html',
  styleUrls: ['./add-taula.component.scss'],
  providers: [RestaurantService, TaulaService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class AddTaulaComponent implements OnInit {

    numTaula: number;
    restaurant: number;
    errorText: string;
    succes: string;
    restaurants = [];

  constructor(private newRestaurantService: RestaurantService, private newTaulaService: TaulaService, private newTranslateService: TranslateService) { }

  ngOnInit() {
      this.getRestaurants();
  }

  cline() {
      this.numTaula = null;
      this.restaurant = null;
  }

    getRestaurants() {
        this.newRestaurantService.getRestaurantes().subscribe(
            (data) => this.flitreRestaurnts(data),
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Restaurants')
        );
    }

    flitreRestaurnts(data) {
      for (const rest of data){
          if (rest.actiu === true) {
              this.restaurants.push(rest);
          }
      }
    }

    addTaula() {
        this.errorText = '';
        this.succes = '';
        const tempTaula = JSON.stringify({
            comensals: 0,
            numTaula: this.numTaula,
            tiquetActiu: null,
            actiu: true,
            idRestaurant: localStorage.getItem('url') + '/restaurant/' + this.restaurant + '/'
        });
        this.newTaulaService.postTaula(tempTaula).subscribe(
            (data) => console.log(data),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
        this.cline();
    }

}
