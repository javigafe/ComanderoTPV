import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import { HttpModule } from '@angular/http';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import { LiniaTiquetService } from './../../../../../app/shared/services/linia-tiquet.service';
import { LiniaTiquet } from './../../../../../app/shared/services/LiniaTiquet';
import { CuniaTaula } from './../../../../../app/shared/services/CuniaTaula';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';


@Component({
  selector: 'app-taulas-kitchen',
  templateUrl: './taulas-kitchen.component.html',
  styleUrls: ['./taulas-kitchen.component.scss'],
  providers: [TaulaService, LiniaTiquetService, ConsumibleService]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class TaulasKitchenComponent implements OnInit {

    restaurant;
    talasCuina = [];
    loading: boolean;
    numTaulas: number;
    consumibles = [];

  constructor(private newConsumibleService: ConsumibleService, private newTaulaService: TaulaService, private newLiniaTiquetService: LiniaTiquetService) { }

  ngOnInit() {
      this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
      this.loading = false;
      this.getConsumibles();
  }

  getConsumibles() {
      this.loading = true;
      this.consumibles = [];
      this.newConsumibleService.getConsumibles().subscribe(
          (data) => (
              this.consumibles = data,
              this.getComandesCuina()
          ),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Consumibles')
      );
  }

  getComandesCuina() {
      this.loading = true;
      this.newTaulaService.getTaulasRestaurant(this.restaurant.id).subscribe(
          (data) => this.addTaulasCuina(data),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Taulas')
      );
  }

  addTaulasCuina(taulas) {
      this.talasCuina = [];
      this.numTaulas = 0;
      for (const taula of taulas) {
          if (taula.tiquetActiu !== null) {
              this.numTaulas = this.numTaulas + 1;
              let cuina: CuniaTaula;
              cuina = new CuniaTaula(taula.numTaula, taula.id, taula.comensals, []);
              this.newLiniaTiquetService.getLiniaTiquetsTaula(taula.id, taula.tiquetActiu).subscribe(
                  (data) => (
                      this.addLineasTaula(data, cuina)
                  ),
                  (error) => console.log('Error: ', error),
                  () => console.log('OK Get lineasTiquet')
              );
          }
      }
      if (this.numTaulas === 0) {
          this.loading = false;
      }
  }

  addLineasTaula(lineas, cuina) {
      const tempArreyLines = [];
      for (const line of lineas) {
        if (line.elaboracio !== 1) {
            let index = 0;
            let trobat = false;
            let nom: string;
            while ((this.consumibles.length > index) && (!trobat)) {
                if ((localStorage.getItem('url') + '/consumible/' + this.consumibles[index].id + '/?format=json') === line.idConsumible) {
                    nom = this.consumibles[index].nom;
                    trobat = true;
                }
                index = index + 1;
            }
            const lineaTemp: LiniaTiquet = new LiniaTiquet(line.preuActual, line.quantitat, line.ivaActual,
                line.idConsumible, line.idTaula, line.idTiquet, line.elaboracio, nom, line.id );
            tempArreyLines.push(lineaTemp);
        }
      }
      if (tempArreyLines.length !== 0) {
          cuina.lineasTiket = tempArreyLines;
          this.talasCuina.push(cuina);
      }
      this.numTaulas = this.numTaulas - 1;
      if (this.numTaulas === 0) {
          this.talasCuina.sort((n1, n2) => {
                  if (n1.numTaula > n2.numTaula) {
                      return 1;
                  }

                  if (n1.numTaula < n2.numTaula) {
                      return -1;
                  }

                  return 0;
              }
          );
          this.loading = false;
      }
  }

  porcesElebaoracio(tualaCuina, lineaTaula) {
      // do in local
      let trobat = false;
      let index = 0;
      let vElaboracio: number;
      while ((this.talasCuina.length > index) && (!trobat)) {
          if (this.talasCuina[index].idTaula === tualaCuina.idTaula) {
              let index2 = 0;
              while ((this.talasCuina[index].lineasTiket.length > index2) && (!trobat)) {
                  if (this.talasCuina[index].lineasTiket[index2].idLinea === lineaTaula.idLinea ) {
                      vElaboracio = this.talasCuina[index].lineasTiket[index2].elaboracio + 1;
                      this.talasCuina[index].lineasTiket[index2].elaboracio = vElaboracio;
                      if (vElaboracio === 5) {
                          vElaboracio = 2;
                          this.talasCuina[index].lineasTiket[index2].elaboracio = vElaboracio;
                      }
                      trobat = true;
                  }
                  index2 = index2 + 1;
              }
          }
          index = index + 1;
      }

      // do at server
      const tempLinea = JSON.stringify({
          elaboracio: vElaboracio
      });
      this.newLiniaTiquetService.editarLiniaTiquet(lineaTaula.idLinea, tempLinea).subscribe(
          (data) => console.log(data),
          (error) => console.log('Error: ' + error),
          () => console.log('Editada elaboracio')
      );
  }

}
