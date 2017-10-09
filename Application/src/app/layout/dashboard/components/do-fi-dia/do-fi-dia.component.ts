import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import { HttpModule } from '@angular/http';
import { LiniaTiquetService } from './../../../../../app/shared/services/linia-tiquet.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import { LiniaTiquet } from './../../../../../app/shared/services/LiniaTiquet';
import { Tasas } from './../../../../../app/shared/services/Tasas';
import { TiquetService } from './../../../../../app/shared/services/tiquet.service';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import { FiDiaService } from './../../../../../app/shared/services/fi-dia.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-do-fi-dia',
  templateUrl: './do-fi-dia.component.html',
  styleUrls: ['./do-fi-dia.component.scss'],
  providers: [RestaurantService, LiniaTiquetService, ConsumibleService, TiquetService, FiDiaService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot(),
        DatePipe
    ]
})


export class DoFiDiaComponent implements OnInit {

    loadingRestaurant: boolean;
    loadingTiquets: boolean;
    loadingConsumibles: boolean;
    loadingLines: boolean;
    loadingFiDia: boolean;
    loadingClose: boolean;
    consumibles = [];
    restaurant;
    tiquets = [];
    linesBrut = [];
    lines = [];
    total: number;
    totalImpostos: number;
    ivas = [];
    fechaTemp: number;
    fiFiDia: Boolean;
    totalEfectiu: number;
    totalVisa: number;
    totalTiquetsR: number;
    totalAltres: number;

    constructor(private newRestaurantService: RestaurantService, private newLiniaTiquetService: LiniaTiquetService,
                private newConsumibleService: ConsumibleService, private newTiquetService: TiquetService,
                private newFiDiaService: FiDiaService, private newTranslateService: TranslateService) { }


    ngOnInit() {
        this.fiFiDia = false;
        this.loadingFiDia = true;
        this.getConsumibles();
        this.linesBrut = [];
        this.fechaTemp = Date.now();
        this.loadingClose = false;
    }

    getConsumibles() {
        this.loadingConsumibles = true;
        this.newConsumibleService.getAllConsumibles().subscribe(
            (data) => (
                this.consumibles = data,
                    this.loadingConsumibles = false,
                    this.getRestaurant()
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Consumibles')
        );
    }

    getRestaurant() {
        this.loadingRestaurant = true;
        this.loadingTiquets = true;
        this.loadingLines = true;
        this.newRestaurantService.getRestaurante(JSON.parse(localStorage.getItem('restaurante')).id).subscribe(
            (data) => (
                this.restaurant = data,
                    this.loadingRestaurant = false,
                    this.getTiquetsPendents()
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Restaurant')
        );
    }

    getTiquetsPendents() {
        this.totalEfectiu = 0;
        this.totalVisa = 0;
        this.totalTiquetsR = 0;
        this.totalAltres = 0;
        this.newTiquetService.getTiquetsPendents(this.restaurant.id).subscribe(
            (data) => (
                this.loadingTiquets = false,
                    this.tiquets = data,
                    this.getLinesTiquets(0)
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Tiquets Pendents')
        );
    }

    getLinesTiquets(realIndexIN) {
        if (this.tiquets.length === 0) {
            this.loadingLines = false;
            this.loadingFiDia = false;
            this.totalImpostos = 0;
            this.total = 0;
        } else {
            const realIndex = realIndexIN;
            if ( realIndex < this.tiquets.length) {
                this.newLiniaTiquetService.getLiniasTiquet(this.tiquets[realIndex].id).subscribe(
                    (data) => (
                        this.getLinesTiquets(realIndex + 1),
                            this.linesBrut.push(data),
                            this.sumaTipusPagament (this.tiquets[realIndex], data ),
                            this.procesarLines(realIndex + 1, this.tiquets)
                    ),
                    (error) => console.log('Error: ' + error),
                    () => console.log('OK Get Lines Tiquet')
                );
            }
        }
    }

    procesarLines(index: number, tiquet) {
        if (index ===  tiquet.length) {
            this.lines = [];
            for (const list of this.linesBrut){
                for (const line of list){
                    // recoremos todas las lienas
                    let trobat = false;
                    let indice = 0;
                    if ( this.lines.length !== 0) {
                        while ((indice < this.lines.length) && (!trobat)) {
                            if ((line.idConsumible === this.lines[indice].idConsumible) && (line.preuActual === this.lines[indice].preuActual) && (line.ivaActual === this.lines[indice].ivaActual)) {
                                this.lines[indice].quantitat = this.lines[indice].quantitat + line.quantitat;
                                trobat = true;
                            }
                            indice = indice + 1;
                        }
                    }
                    if (!trobat) {
                        const nomConsumible = this.getNomConsumible(line.idConsumible);
                        const lineaTemp: LiniaTiquet = new LiniaTiquet(line.preuActual, line.quantitat, line.ivaActual,
                            line.idConsumible, line.idTaula, line.idTiquet, line.elaboracio, nomConsumible, line.id );
                        this.lines.push(lineaTemp);
                    }
                }
            }
            this.loadingLines = false;
            this.calcularTotalandGetIVA();
        }
    }

    sumaTipusPagament (tiquet, lines) {
        for ( const line of lines ) {
            const tempTotal = ( line.quantitat * (line.preuActual * ( (line.ivaActual / 100) + 1 ) ) );
            if (tiquet.tipusPagament === 1) {
                this.totalEfectiu = this.totalEfectiu + tempTotal;
            } else if (tiquet.tipusPagament === 2) {
                this.totalVisa = this.totalVisa + tempTotal;
            } else if (tiquet.tipusPagament === 3) {
                this.totalTiquetsR = this.totalTiquetsR + tempTotal;
            } else if (tiquet.tipusPagament === 4) {
                this.totalAltres = this.totalAltres + tempTotal;
            }
        }
    }

    getNomConsumible (id: string): string {
        let index = 0;
        let trobat = false;
        let nom;
        while ((index < this.consumibles.length) && (!trobat)) {
            if ((localStorage.getItem('url') + '/consumible/' + this.consumibles[index].id + '/?format=json') === id) {
                nom = this.consumibles[index].nom;
                trobat = true;
            }
            index = index + 1;
        }
        return nom;
    }

    calcularTotalandGetIVA() {
        this.total = 0;
        this.totalImpostos = 0;
        this.ivas = [];
        for (const line of this.lines){
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
        this.loadingFiDia = false;
    }

    print(): void {
        // get translations
        let tel, n_factura, num_comensals, aten, num_fidia, nif, num_table;
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
        this.newTranslateService.get('num_fidia', {value: 'world'}).subscribe((res: string) => {
            num_fidia = res;
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
                    ${num_fidia}: ${this.restaurant.nFiDia + 1}
                </div>
                <body onload="window.print();window.close()">${printContents}</body>
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
                    ${num_fidia}: ${this.restaurant.nFiDia + 1}
                </div>
                <body onload="window.print();window.close()">${printContents}</body>
              </html>`
            );
        }

        popupWin.document.close();
    }

    closeFiDia() {
        this.loadingClose = true;
        if (this.tiquets.length !== 0) {
            this.newRestaurantService.getRestaurante(JSON.parse(localStorage.getItem('restaurante')).id).subscribe(
                (data) => (
                    this.restaurant = data,
                        this.updatenFiDiaTiquet(data),
                        this.newFiDia()
                ),
                (error) => console.log('Error: ' + error),
                () => console.log('OK Get Restaurant')
            );
        } else {
            this.fiCloseFiDia(0);
        }
    }

    updatenFiDiaTiquet(restaurant) {
        const tempRestaurant = JSON.stringify({
            nFiDia: (restaurant.nFiDia + 1),
        });
        this.newRestaurantService.editarRestaurante(restaurant.id, tempRestaurant).subscribe(
            (data) => (
                console.log(data)
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK edit Restaurant')
        );
    }

    newFiDia() {
        const tempFiDia = JSON.stringify({
            numeroFiDia: this.restaurant.nFiDia,
            nivell:  this.restaurant.nivellFill,
            total: this.total,
            totalImpostos: this.totalImpostos
        });
        console.log(tempFiDia);
        this.newFiDiaService.postFiDia(tempFiDia).subscribe(
            (data) => (
                this.empaqutaTiquets(data)
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Create FiDia')
        );
    }

    empaqutaTiquets(fiDias) {
        const tempTiquet = JSON.stringify({
            estat: 4,
            idFidia: fiDias.url,
        });
        let index = 0;
        for (const tiquet of this.tiquets) {
            index = index + 1;
            this.newTiquetService.editarTiquet(tiquet.id, tempTiquet).subscribe(
                (data) => (
                    this.fiCloseFiDia(index)
                ),
                (error) => console.log('Error: ' + error),
                () => console.log('OK Edit tiquet')
            );
        }
    }

    fiCloseFiDia(index) {
        if (index === this.tiquets.length) {
            this.loadingClose = false;
            this.fiFiDia = true;
        }
    }

}
