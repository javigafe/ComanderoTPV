import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import { HttpModule } from '@angular/http';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import { LiniaTiquetService } from './../../../../../app/shared/services/linia-tiquet.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-table',
  templateUrl: './change-table.component.html',
  styleUrls: ['./change-table.component.scss'],
  providers: [TaulaService, LiniaTiquetService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class ChangeTableComponent implements OnInit {

    taulesRestaurant1 = [];
    taulesRestaurant2 = [];
    restaurant;
    loading: boolean;
    taula1;
    taula2;
    errorText: string;
    succes: string;

  constructor(private newTaulaService: TaulaService, private newLiniaTiquetService: LiniaTiquetService, private newTranslateService: TranslateService) { }

  ngOnInit() {
      this.taula1 = null;
      this.taula2 = null;
      this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
      this.getTaules();
      this.newTranslateService.get('back', {value: 'world'}).subscribe((res: string) => {
          console.log(res);
          // => 'hello world'
      });
  }

    getTaules() {
        this.loading = true;
        this.newTaulaService.getTaulasRestaurant(this.restaurant.id).subscribe(
            (data) => (
                this.filtreTaulas(data)
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Taulas')
        );
    }

    filtreTaulas(taulas) {
        this.taulesRestaurant1 = [];
        this.taulesRestaurant2 = [];
        for (const taula of taulas)
        {
            if (taula.tiquetActiu !== null) {
                this.taulesRestaurant1.push(taula);
            } else {
                this.taulesRestaurant2.push(taula);
            }
        }
        this.loading = false;
    }

    doCambioMesa() {
      if ((this.taula1 === null) || (this.taula1 === null)) {
          this.newTranslateService.get('need_select_2_mesas', {value: 'world'}).subscribe((res: string) => {
              this.errorText = res;
          });
      }else {
          const tempTable = JSON.stringify({
              tiquetActiu: this.taula1.tiquetActiu,
              comensals: this.taula1.comensals
          });
          this.newLiniaTiquetService.getLiniasTiquet(this.taula1.tiquetActiu).subscribe(
              (data) => this.reasingTableLine(data),
              (error) => this.errorText = 'Error: ' + error,
              () => console.log('OK Get linias')
          );
          this.newTaulaService.editarTaula(this.taula2.id, tempTable).subscribe(
              (data) => console.log(data),
              (error) => this.errorText = 'Error: ' + error,
              () => this.newTranslateService.get('num_mesa_edit_ok', {value: 'world'}).subscribe((res: string) => {
                  this.succes = res;
              })
          );
          const tempTable2 = JSON.stringify({
              tiquetActiu: null
          });
          this.newTaulaService.editarTaula(this.taula1.id, tempTable2).subscribe(
              (data) => console.log(data),
              (error) => this.errorText = 'Error: ' + error,
              () => this.newTranslateService.get('mesa_ok_edit', {value: 'world'}).subscribe((res: string) => {
                  this.succes = res;
              })
          );
      }
    }

  reasingTableLine(lines) {
      for (const line of lines){
          const tempLine = JSON.stringify({
              idTaula: this.taula2.url,
          });
          this.newLiniaTiquetService.editarLiniaTiquet(line.id, tempLine).subscribe(
              (data) => console.log(data),
              (error) => this.errorText = 'Error: ' + error,
              () => this.newTranslateService.get('line_edited', {value: 'world'}).subscribe((res: string) => {
                  this.succes = res;
              })
          );
      }
  }
}
