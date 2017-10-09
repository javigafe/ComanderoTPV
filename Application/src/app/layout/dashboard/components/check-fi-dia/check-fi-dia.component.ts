import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import { HttpModule } from '@angular/http';
import { LiniaTiquetService } from './../../../../../app/shared/services/linia-tiquet.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import { FiDiaService } from './../../../../../app/shared/services/fi-dia.service';
import { TiquetService } from './../../../../../app/shared/services/tiquet.service';
import { UserService } from './../../../../../app/shared/services/user.service';
import { GestionaService } from './../../../../../app/shared/services/gestiona.service';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import { LiniaTiquet } from './../../../../../app/shared/services/LiniaTiquet';
import { Tasas } from './../../../../../app/shared/services/Tasas';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-check-fi-dia',
  templateUrl: './check-fi-dia.component.html',
  styleUrls: ['./check-fi-dia.component.scss'],
  providers: [LiniaTiquetService, TranslateService, ConsumibleService, FiDiaService, TiquetService, UserService, GestionaService, RestaurantService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot(),
        DatePipe
    ]
})

export class CheckFiDiaComponent implements OnInit {

    fidiaActiu;
    fidias = [];
    fecha: any;
    nFinDia: number;
    loading: boolean;
    loadingRestaurnts: boolean;
    nuemrepBusquedas: number;
    loadingConsumibles: boolean;
    consumibles = [];

    totalEfectiu: number;
    totalVisa: number;
    totalTiquetsR: number;
    totalAltres: number;
    total: number;
    totalImpostos: number;
    restaurant;
    restaurants = [];
    tiquets = [];
    linesBrut = [];
    lines = [];
    ivas = [];


  constructor(private newLiniaTiquetService: LiniaTiquetService, private newTranslateService: TranslateService,
                private newConsumibleService: ConsumibleService, private newFiDiaService: FiDiaService,
                private newTiquetService: TiquetService, private newUserService: UserService,
                private newGestionaService: GestionaService, private newRestaurantService: RestaurantService) { }

  ngOnInit() {
      this.fidiaActiu = null;
      this.nuemrepBusquedas = 0;
      this.getConsumibles();
      this.nFinDia = null;
      this.fidiaActiu = null;
      this.fecha = null;
      this.getRestaurantUsuari();
      this.restaurant = null;
      this.linesBrut = [];
      this.setAllToZero();
  }

    setAllToZero() {
        this.totalEfectiu = 0;
        this.totalVisa = 0;
        this.totalTiquetsR = 0;
        this.totalAltres = 0;
        this.total = 0;
        this.totalImpostos = 0;
    }

    buscarFiDia() {
      this.fidias = [];
       if (this.restaurant == null) {
           this.nuemrepBusquedas = this.nuemrepBusquedas + 1;
       } else {
            this.fidiaActiu = null;
           this.loading = true;
           this.nuemrepBusquedas = this.nuemrepBusquedas + 1;
           let numerofinFia: string;
           if (this.nFinDia === null) {
               numerofinFia = '';
           } else {
               numerofinFia = this.nFinDia.toString();
           }
           let fechaFinDia: string;
           if (this.fecha !== null) {
               fechaFinDia = this.fecha.year + '-' + this.fecha.month + '-' + this.fecha.day;
               if (fechaFinDia === 'undefined-undefined-undefined') {
                   fechaFinDia = '';
                   this.fecha = null;
               } else {
                   fechaFinDia =  this.fecha.year;
                   if (this.fecha.month.length < 2) {
                       fechaFinDia = fechaFinDia + '-0' + this.fecha.month;
                   } else {
                       fechaFinDia = '-' + this.fecha.month;
                   }
                   if (this.fecha.day.length < 2) {
                       fechaFinDia = fechaFinDia + '-0' + this.fecha.day;
                   } else {
                       fechaFinDia = '-' + this.fecha.day;
                   }
               }
           } else {
               fechaFinDia = '';
           }
            console.log(numerofinFia, fechaFinDia);
           this.newFiDiaService.filterGetFiDia(numerofinFia, fechaFinDia).subscribe(
               (data) => (
                     this.filtreFiDia(data)
                       // this.fidias = data,
                       //  this.loading = false
               ),
               (error) => console.log('Error: ' + error),
               () => console.log('OK Get FiDias')
           );
        }
    }

    getConsumibles() {
        this.loadingConsumibles = true;
        this.newConsumibleService.getAllConsumibles().subscribe(
            (data) => (
                this.consumibles = data,
                    this.loadingConsumibles = false
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Consumibles')
        );
    }

    getRestaurantUsuari() {
        // get user id
        this.loadingRestaurnts = true;
        this.newUserService.getUsers().subscribe(
            (data) => this.getGestioURL(this.getUserURL(data)),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Users')
        );
    }

    getGestioURL(url) {
        this.newGestionaService.getGestionats().subscribe(
            (data) => this.getRestaurants(data, url),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Gestiona')
        );
    }

    getRestaurants(datos, url: string) {
        this.restaurants = [];
        for (const gestionat of datos){
            if (gestionat.idUsuari === url) {
                this.newRestaurantService.getRestaurantesURL(gestionat.idRestaurant).subscribe(
                    (data) => (
                        this.addRestaurant(data)
                    ),
                    (error) => console.log('Error: ' + error),
                    () => console.log('OK Get Restaurant')
                );
            }
        }
    }

    addRestaurant(data) {
        if (data.actiu === true) {
            this.restaurants.push(data);
            this.loadingRestaurnts = false;
        }
    }

    getUserURL(data): string {
        const usuari = localStorage.getItem('usuario');
        for (const user of data){
            if (user.username === usuari) {
                return user.url;
            }
        }
    }

    filtreFiDia(fidias) {
      // tendria que filtrar restaurante
      // for (let line of fidias) {
           // this.newTiquetService.
       // }
        this.fidias = fidias;
        this.loading = false;
    }

    loadFiDia() {
      // get tiquets
        if (this.fidiaActiu != null) {
            this.totalEfectiu = 0;
            this.totalVisa = 0;
            this.totalTiquetsR = 0;
            this.totalAltres = 0;
            this.newTiquetService.getTiquetsFiDia(this.fidiaActiu.id).subscribe(
                (data) => (
                    this.tiquets = data,
                        this.getLinesTiquets(0)
                ),
                (error) => console.log('Error: ' + error),
                () => console.log('OK Get Tiquets')
            );
        }
    }

    getLinesTiquets(realIndexIN) {
        if (this.tiquets.length === 0) {
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
                    ${num_fidia}: ${this.fidiaActiu.numeroFiDia}
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
                    ${num_fidia}: ${this.fidiaActiu.numeroFiDia}
                </div>
                <body onload="window.print();window.close()">${printContents}</body>
              </html>`
            );
        }

        popupWin.document.close();
    }

}
