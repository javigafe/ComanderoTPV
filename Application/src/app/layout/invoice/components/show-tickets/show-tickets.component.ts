import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from './../../../../../app/shared/services/client.service';
import { TiquetService } from './../../../../../app/shared/services/tiquet.service';
import { LiniaTiquetService } from './../../../../../app/shared/services/linia-tiquet.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import { LiniaTiquet } from './../../../../../app/shared/services/LiniaTiquet';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import { Tasas } from './../../../../../app/shared/services/Tasas';
import {TranslateService} from '@ngx-translate/core';



@Component({
  selector: 'app-show-tickets',
  templateUrl: './show-tickets.component.html',
  styleUrls: ['./show-tickets.component.scss'],
  providers: [ClientService, TiquetService, LiniaTiquetService, ConsumibleService, TaulaService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class ShowTicketsComponent implements OnInit {
  fecha: any;
  loadingClients: boolean;
  loadingBusqueda: boolean;
  loadingGetDataTiquet: number;
  loadingConsumibles: boolean;
  clients = [];
  searchClient: string;
  clientActiu;
  restaurant;
  nTiquet: number;
  hora: number;
  minus: number;
  tiquets = [];
  tiquetActiu;
  busquedas: number;
  clientActiuTiquet;
  totalImpostos: number;
  total: number;
  lineasTiquet;
  consumibles = [];
  ivas = [];
  taulaActiva: number;
  fechaTiquet: string;


  constructor(private newClientService: ClientService, private newTiquetService: TiquetService,
              private newLiniaTiquetService: LiniaTiquetService, private newConsumibleService: ConsumibleService,
              private newTaulaService: TaulaService, private newTranslateService: TranslateService) { }

  ngOnInit() {
      this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
      this.inici ();
      this.getCliets ();
      this.getConsumibles();
  }

  inici () {
      this.clientActiu = null;
      this.hora = null;
      this.minus = null;
      this.nTiquet = null;
      this.fecha = null;
      this.busquedas = 0;
      this.tiquetActiu = null;
      this.totalImpostos = 0;
      this.total = 0;
  }

  getCliets () {
      this.loadingClients = true;
      this.newClientService.getClients().subscribe(
          (data) => (
              this.clients = data,
              this.loadingClients = false
          ),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Clients')
      );
  }

    searchFun() {
        if (this.searchClient === '') {
            this.getCliets();
        } else {
            this.newClientService.getSearch(this.searchClient).subscribe(
                (data) => (
                    this.clients = [],
                        this.clients = data
                ),
                (error) => console.log('Error: ' + error),
                () => console.log('OK Get Clients Search')
            );
        }
    }

    clineSerarch() {
        this.searchClient = '';
        this.getCliets();
    }

    buscarTiquet() {
      this.tiquetActiu = null;
      this.loadingBusqueda = true;
      this.busquedas = this.busquedas + 1;

      // areglar horas
      if (this.hora > 23 || this.hora < 0) {
            if (this.hora > 23) {
                this.hora = 23;
            }
            if (this.hora < 0) {
                this.hora = 0;
            }
        }
      if ((this.minus !== null) && (this.hora === null)) {
            this.hora = 0;
        }
      if (this.minus > 59 || this.minus < 0) {
            if (this.minus > 59) {
                this.minus = 59;
            }
            if (this.minus < 0) {
                this.minus = 0;
            }
        }

        // reparacion de formato
        let idClient;
        if (this.clientActiu ===  null) {
            idClient = '';
        } else {
            idClient = this.clientActiu.id;
        }
        let numeroTiquet;
        if (this.nTiquet ===  null) {
            numeroTiquet = '';
        } else {
            numeroTiquet = this.nTiquet;
        }

        // reparacion formato fecha
        let fechaSearch = '';
        if ((this.fecha ===  '') || (this.fecha ===  null)) {
            if (this.minus === null) {
                if (this.hora === null) {
                    fechaSearch = '';
                } else {
                    fechaSearch = this.hora.toString() ;
                }
            } else {
                fechaSearch = this.hora + ':' + this.minus;
            }
        } else {
            let mes = this.fecha.month.toString();
            if (mes.length < 2) {
                mes = '0' + mes;
            }
            let dia = this.fecha.day.toString();
            if (dia.length < 2) {
                dia = '0' + dia;
            }
            const diafecha = this.fecha.year + '-' + mes + '-' + dia;
            if (this.minus === null) {
                if (this.hora === null) {
                    fechaSearch = diafecha;
                } else {
                    fechaSearch = diafecha + ' ' + this.hora ;
                }
            } else {
                fechaSearch = diafecha + ' ' + this.hora + ':' + this.minus;
            }
        }

        // send request
      this.newTiquetService.busquedaTiquet(numeroTiquet, fechaSearch, idClient, this.restaurant.id, 2).subscribe(
          (data) => (
                  this.newTiquetService.busquedaTiquet(numeroTiquet, fechaSearch, idClient, this.restaurant.id, 4).subscribe(
                      (datos) => (
                          this.tiquets = [],
                          this.tiquets = data.concat(datos),
                          this.tiquets.sort(
                              (n1, n2) => {
                              if (n1.numeroTiquet < n2.numeroTiquet) {
                                  return 1;
                              }

                              if (n1.numeroTiquet > n2.numeroTiquet) {
                                  return -1;
                              }

                              return 0;
                          }),
                          this.loadingBusqueda = false
                      ),
                      (error) => console.log('Error: ' + error),
                      () => console.log('OK Get tiquets Search')
                  )
          ),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get tiquets Search')
      );
    }

    getDataTiquet(tiquet) {
      if (tiquet != null) {
          this.tiquetActiu = tiquet;
      }
      this.loadingGetDataTiquet = 0;
      this.fechaTiquet = this.tiquetActiu.dataHora.substring(0, 10) + ', ' + this.tiquetActiu.dataHora.substring(11, 19);
      this.getLinesTiquet();
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

    getCliet() {
      this.clientActiuTiquet = null;
      if (this.tiquetActiu.idClient !== null) {
          let trobat = false;
          let index = 0;
          while ((this.clients.length > index) || (!trobat)) {
              if (this.clients[index].url === this.tiquetActiu.idClient) {
                  this.clientActiuTiquet = this.clients[index];
                  trobat = true;
              }
              index = index + 1;
          }
      }
      this.loadingGetDataTiquet = this.loadingGetDataTiquet + 1;
    }

    getLinesTiquet() {
        this.newLiniaTiquetService.getLiniasTiquet(this.tiquetActiu.id).subscribe(
            (data) => (
                this.addLineasTaula(data),
                this.getTaulaActiva(data)
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Lines')
        );
    }

    getTaulaActiva(data) {
      if (data !== null) {
          this.newTaulaService.getTaulaURL(data[0].idTaula).subscribe(
              (datos) => (
                  this.taulaActiva = datos.numTaula,
                      this.loadingGetDataTiquet = this.loadingGetDataTiquet + 1
              ),
              (error) => console.log('Error: ' + error),
              () => console.log('OK Get taula'));
      } else {
          this.taulaActiva = data;
          this.loadingGetDataTiquet = this.loadingGetDataTiquet + 1;
      }
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
        this.loadingGetDataTiquet = this.loadingGetDataTiquet + 1;
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
                    ${n_factura}: ${this.tiquetActiu.numeroTiquet}
                </div>
                <body onload="window.print();window.close()">${printContents}</body>
                <hr>
                <div align="center">
                    <p>${num_table}: ${this.taulaActiva}<br>
                    <br>${num_table}${num_table}: ${localStorage.getItem('usuario')}</p>
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
                    ${n_factura}: ${this.tiquetActiu.numeroTiquet}
                </div>
                <body onload="window.print();window.close()">${printContents}</body>
                <hr>
                <div align="center">
                    <p>${num_table}: ${this.taulaActiva}<br>
                    <br>${num_table}: ${localStorage.getItem('usuario')}</p>
                </div>
              </html>`
            );
        }

        popupWin.document.close();
    }


}
