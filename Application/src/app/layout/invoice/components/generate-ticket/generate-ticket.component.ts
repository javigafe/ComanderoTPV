import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import { HttpModule } from '@angular/http';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import { LiniaTiquetService } from './../../../../../app/shared/services/linia-tiquet.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import { LiniaTiquet } from './../../../../../app/shared/services/LiniaTiquet';
import { Tasas } from './../../../../../app/shared/services/Tasas';
import { TiquetService } from './../../../../../app/shared/services/tiquet.service';
import { ClientService } from './../../../../../app/shared/services/client.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-generate-ticket',
  templateUrl: './generate-ticket.component.html',
  styleUrls: ['./generate-ticket.component.scss'],
  providers: [TaulaService, LiniaTiquetService, ConsumibleService, TiquetService, ClientService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot(),
        DatePipe
    ]
})

export class GenerateTicketComponent implements OnInit {

    loadingTaulas: boolean;
    loadingFactura: boolean;
    loadingConsumibles: boolean;
    loadingTiquet: boolean;
    loadingClinets: boolean;
    taulas = [];
    taulaActiva;
    restaurant;
    consumibles = [];
    lineasTiquet = [];
    total: number;
    totalImpostos: number;
    ivas = [];
    tiquet;
    ClinetActiu;
    clients = [];
    searchClient;
    fechaTemp;
    tipusPagament: number;

    constructor(private newTaulaService: TaulaService, private newLiniaTiquetService: LiniaTiquetService,
                private newConsumibleService: ConsumibleService, private newTiquetService: TiquetService,
                private newClientService: ClientService, private newTranslateService: TranslateService) { }

    ngOnInit() {
      this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
      this.taulaActiva = null;
      this.tipusPagament = 1;
      this.getTaulas();
      this.getConsumibles();
      this.ClinetActiu = null;
  }

  getConsumibles() {
      this.loadingConsumibles = true;
      this.newConsumibleService.getConsumibles().subscribe(
          (data) => (
              this.consumibles = data,
              this.loadingConsumibles = false
          ),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Consumibles')
      );
  }

  getTaulas() {
      this.loadingTaulas = true;
      this.taulas = [];
      this.newTaulaService.getTaulasRestaurant(this.restaurant.id).subscribe(
          (data) => this.clineTaulas(data),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Taulas')
      );
  }

  clineTaulas(taulas) {
      for (const taula of taulas) {
          if (taula.tiquetActiu !== null) {
              this.taulas.push(taula);
          }
      }
      this.loadingTaulas = false;
  }

  seleccioTaula(taula) {
      this.taulaActiva = taula;
      this.fechaTemp = Date.now();
      this.getFactura();
      this.getTiquet();
      this.getClinets();
  }

    getClinets() {
        this.loadingClinets = true;
        this.newClientService.getClients().subscribe(
            (data) => (
                this.clients = data,
                    this.loadingClinets = false
            ),
            (error) => console.log('Error: ', error),
            () => console.log('OK Get Clients')
        );
    }

  getTiquet() {
      this.loadingTiquet = true;
      this.newTiquetService.getTiquet(this.taulaActiva.tiquetActiu).subscribe(
          (data) => (
              this.tiquet = data,
              this.loadingTiquet = false
          ),
          (error) => console.log('Error: ', error),
          () => console.log('OK Get Tiquet')
      );
  }

  getFactura() {
      this.loadingFactura = true;
      this.newLiniaTiquetService.getLiniaTiquetsTaula(this.taulaActiva.id, this.taulaActiva.tiquetActiu).subscribe(
          (data) => (
              this.addLineasTaula(data)
          ),
          (error) => console.log('Error: ', error),
          () => console.log('OK Get lineasTiquet')
      );
  }

  addLineasTaula(lineas) {
      this.lineasTiquet = [];
      for (const line of lineas){
          let index = 0;
          let trobat = false;
          while (index < this.consumibles.length) {
              if ((line.idConsumible === (localStorage.getItem('url') + '/consumible/' + this.consumibles[index].id + '/?format=json')) && (!trobat)) {
                  const lineaTemp: LiniaTiquet = new LiniaTiquet(line.preuActual, line.quantitat, line.ivaActual,
                      line.idConsumible, line.idTaula, line.idTiquet, line.elaboracio, this.consumibles[index].nom, line.id );
                  this.lineasTiquet.push(lineaTemp);
                  trobat = true;
              }
              index = index + 1;
          }
      }
      this.calcularTotalandGetIVA();
  }

  calcularTotalandGetIVA() {
      this.total = 0;
      this.totalImpostos = 0;
      this.ivas = [];
      for (const line of this.lineasTiquet){
          const totalLine = (line.quantitat * (line.preuActual * ((line.ivaActual / 100) + 1)));
          this.total =  this.total + totalLine;
          this.totalImpostos = this.totalImpostos + ((totalLine) - (line.preuActual * line.quantitat));
          let trobat = false;
          let index = 0;
          while (index < this.ivas.length) {
              if (this.ivas[index].iva === line.ivaActual) {
                  this.ivas[index].base = this.ivas[index].base + (line.preuActual * line.quantitat);
                  this.ivas[index].cuota = this.ivas[index].cuota + ((totalLine) - (line.preuActual * line.quantitat));
                  this.ivas[index].total = this.ivas[index].total + totalLine;
                  trobat = true;
              }
              index = index + 1;
          }
          if (!trobat) {
              const ivaTemp: Tasas = new Tasas(line.ivaActual,
                  (line.preuActual * line.quantitat), ((totalLine) - (line.preuActual * line.quantitat)), totalLine);
              this.ivas.push(ivaTemp);
          }
      }
      this.loadingFactura = false;
  }

  findClient() {
      this.newClientService.getSearch(this.searchClient).subscribe(
          (data) => (
              this.clients = data
          ),
          (error) => console.log('Error: ', error),
          () => console.log('OK Get Clients')
      );
  }

  clineFind() {
      this.searchClient = '';
      this.newClientService.getClients().subscribe(
          (data) => (
              this.clients = data
          ),
          (error) => console.log('Error: ', error),
          () => console.log('OK Get Clients')
      );
  }

  pagat() {
      const setdate = moment();
      // Edit Tiquet
      let temptiquet;
      if (this.ClinetActiu !== null) {
          temptiquet = JSON.stringify({
              tipusPagament: this.tipusPagament,
              dataHora: setdate.format('YYYY-MM-DDThh:mm:ss') + 'Z',
              idClient: this.ClinetActiu.url,
              estat: 2
          });
      } else {
          temptiquet = JSON.stringify({
              tipusPagament: this.tipusPagament,
              dataHora: setdate.format('YYYY-MM-DDThh:mm:ss') + 'Z',
              estat: 2
          });
      }

      this.newTiquetService.editarTiquet(this.tiquet.id, temptiquet).subscribe(
          (data) => (
             console.log(data)
          ),
          (error) => console.log('Error: ', error),
          () => console.log('OK edit Tiquet')
      );

      // Edit Taula
      const tempTaula = JSON.stringify({
          tiquetActiu: null
      });
      this.newTaulaService.editarTaula(this.taulaActiva.id, tempTaula).subscribe(
          (data) => (
              this.taulaActiva = null,
              this.getTaulas()
          ),
          (error) => console.log('Error: ', error),
          () => console.log('OK edit Taula')
      );
  }

    print(): void {
        // get translations
        let tel, n_factura, num_comensals, aten, num_ticket, nif, num_table;
        this.newTranslateService.get('tel', {value: 'world'}).subscribe((res: string) => {
            tel = res;
        });
        this.newTranslateService.get('n_factura', {value: 'world'}).subscribe((res: string) => {
            n_factura = res;
        });
        this.newTranslateService.get('num_comensals', {value: 'world'}).subscribe((res: string) => {
            num_comensals = res;
        });
        this.newTranslateService.get('aten', {value: 'world'}).subscribe((res: string) => {
            aten = res;
        });
        this.newTranslateService.get('num_ticket', {value: 'world'}).subscribe((res: string) => {
            num_ticket = res;
        });
        this.newTranslateService.get('nif', {value: 'world'}).subscribe((res: string) => {
            nif = res;
        });
        this.newTranslateService.get('num_table', {value: 'world'}).subscribe((res: string) => {
            num_table = res;
        });

        // do tiket
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        if (this.restaurant.logo === null) {
            popupWin.document.write(`
              <html>
                <head>
                </style>
                  <title>Print tab</title>
                  <style>
                  th{
                    text-align: left;
                  }
                  th {
                    text-align: left;
                  }
                  .anchoFull{
                        width: 100%;
                    }
                    
                    .ancho25{
                        width: 25%;
                        text-align: right;
                    }
                    
                    .anchoQuantitat {
                        width: 2ch;
                        text-align: right;
                    }
                    
                    .buttonMargin {
                        margin-bottom: 1ch;
                    }
                    
                    .totalPosition {
                        margin-right: 2ch;
                    }
                  </style>
                </head>
                <div align="center">
                    <h1>${this.restaurant.nom}</h1>
                    <p>${this.restaurant.direccio}<br>${nif}: ${this.restaurant.NIF}<br>${tel}: ${this.restaurant.telefon}</p>
                    ${n_factura}: ${this.tiquet.numeroTiquet}
                </div>
                <body onload="window.print();window.close()">${printContents}</body>
                <hr>
                <div align="center">
                    <p>${num_table}: ${this.taulaActiva.numTaula}<br>${num_comensals}: ${this.taulaActiva.comensals}
                    <br>${aten}: ${localStorage.getItem('usuario')}</p>
                </div>
              </html>`
            );
        } else {
            popupWin.document.write(`
              <html>
                <head>
                </style>
                  <title>Print tab</title>
                  <style>
                  th{
                    text-align: left;
                  }
                  th {
                    text-align: left;
                  }
                  .anchoFull{
                        width: 100%;
                    }
                    
                    .ancho25{
                        width: 25%;
                        text-align: right;
                    }
                    
                    .anchoQuantitat {
                        width: 2ch;
                        text-align: right;
                    }
                    
                    .buttonMargin {
                        margin-bottom: 1ch;
                    }
                    
                    .totalPosition {
                        margin-right: 2ch;
                    }
                    .responsiveImg {
                        width: 100%;
                        height: auto;
                    }
                  </style>
                </head>
                <div align="center">
                    <img src="${this.restaurant.logo}" class="responsiveImg center-block" alt="">
                    <h3>${this.restaurant.nom}</h3>
                    <p>${this.restaurant.direccio}<br>${nif}: ${this.restaurant.NIF}<br>${tel}: ${this.restaurant.telefon}</p>
                    ${n_factura}: ${this.tiquet.numeroTiquet}
                </div>
                <body onload="window.print();window.close()">${printContents}</body>
                <hr>
                <div align="center">
                    <p>${num_table}: ${this.taulaActiva.numTaula}<br>${num_comensals}: ${this.taulaActiva.comensals}
                    <br>${aten}: ${localStorage.getItem('usuario')}</p>
                </div>
              </html>`
            );
        }

        popupWin.document.close();
    }

}
