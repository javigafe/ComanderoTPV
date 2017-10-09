import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import { HttpModule } from '@angular/http';
import { TaulaService } from './../../../../../app/shared/services/taula.service';
import { CategoriaService } from './../../../../../app/shared/services/categoria.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import { TiquetService } from './../../../../../app/shared/services/tiquet.service';
import { RestaurantService } from './../../../../../app/shared/services/restaurant.service';
import { LiniaTiquet } from './../../../../../app/shared/services/LiniaTiquet';
import { LiniaTiquetService } from './../../../../../app/shared/services/linia-tiquet.service';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-selector-taula',
  templateUrl: './selector-taula.component.html',
  styleUrls: ['./selector-taula.component.scss'],
  providers: [TaulaService, CategoriaService, ConsumibleService, TiquetService, RestaurantService, LiniaTiquetService, NgbModal]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot()
    ]
})

export class SelectorTaulaComponent implements OnInit {

    taula;
    taulesRestaurant = [];
    restaurant;
    taulaSelecionada: boolean;
    categorias = [];
    categoriasMostra = [];
    pilaCategoria = [];
    consumibles = [];
    consumiblesMostra = [];
    categoria: string;
    search: string;
    buscando: boolean;
    closeResult: string;
    loading: boolean;
    modalContetn;
    infoConsumibleData;
    listaConsumiblesPendets = [];
    totalLista;
    listaConsumiblesServer = [];
    loadingTaulas: boolean;
    loadingComanda: boolean;

    constructor(private modalService: NgbModal, private newTaulaService: TaulaService, private newCategoriaService: CategoriaService, private newConsumibleService: ConsumibleService, private newTiquetService: TiquetService, private newRestaurantService: RestaurantService, private newLiniaTiquetService: LiniaTiquetService) { }

  ngOnInit() {
      this.restaurant = JSON.parse(localStorage.getItem('restaurante'));
      this.getTaules();
      this.taulaSelecionada = false;
      this.buscando = false;
      this.loading = false;
      this.loadingComanda = false;
      this.listaConsumiblesPendets = [];
      this.listaConsumiblesServer = [];
  }

  getTaules() {
      this.loadingTaulas = true;
      this.taulesRestaurant = [];
      this.newTaulaService.getTaulasRestaurant(this.restaurant.id).subscribe(
          (data) => (
              this.taulesRestaurant = data,
              this.loadingTaulas = false
          ),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Taulas')
      );
  }

  seleccioTaula(taula, content) {
    this.loadingComanda = true;
    this.getCategorias();
    this.getConsumibles();
    this.taula = taula;
    if (taula.tiquetActiu === null) {
        this.open(content);
    } else {
        this.getConsumiblesLin();
        this.taulaSelecionada = true;
    }
  }

  clineTaula() {
      this.taula = null;
      this.taulaSelecionada = false;
  }

  activarTaula(comensals) {

      this.loading = true;
      // patch restaurant to sucio true
      const tempRest = JSON.stringify({
          brut: true
      });
      this.newRestaurantService.editarRestauranteBrut(this.restaurant.id, tempRest).subscribe(
          (data) => (
              this.restaurant = data,
              this.newTiquet(this.restaurant, comensals)
          ),
          (error) => this.recheckTaula(comensals),
          () => console.log('OK put brut true')
      );
  }

  recheckTaula(comensals) {
      this.newTaulaService.getTaula(this.taula.id).subscribe(
          (data) => (
              this.taula = data,
              this.checkRecheckTaula(data, comensals)
          ),
          (error) => this.recheckTaula(comensals),
          () => console.log('OK get tuala')
      );
  }

  checkRecheckTaula(taula, comensals) {
      if (taula.tiquetActiu == null) {
          this.activarTaula(comensals);
      } else {
          this.loading = false;
          this.taulaSelecionada = true;
          this.getListaConsumiblesPendets();
          this.closeModal();
      }
  }

  newTiquet(restaurant, comensals) {
      const tempTiquet = JSON.stringify({
          numeroTiquet: restaurant.nTiquets + 1 ,
          tipusPagament: 1,
          estat: 1,
          idClient: null,
          idRestaurant: restaurant.url
      });
      this.newTiquetService.postTiquet(tempTiquet).subscribe(
          (data) => (
                this.activarTaulaAction(comensals, restaurant, data)
          ),
          (error) => this.newTiquet(restaurant, comensals),
          () => console.log('OK Create new Tiquet')
      );
  }

  activarTaulaAction(comensals, restaurant, tiquet) {
      const tempTaula = JSON.stringify({
          comensals: comensals,
          tiquetActiu: tiquet.id,
      });
      this.newTaulaService.editarTaula(this.taula.id, tempTaula).subscribe(
          (data) => (
              this.taula = data,
              this.stopBlockRestaurant(restaurant)
          ),
          (error) => this.activarTaulaAction(comensals, restaurant, tiquet),
          () => console.log('OK edit Taula')
      );
  }

  stopBlockRestaurant(restaurant) {
      const tempRest = JSON.stringify({
          brut: false,
          nTiquets: restaurant.nTiquets + 1
      });
      this.newRestaurantService.editarRestaurante(restaurant.id, tempRest).subscribe(
          (data) => (
              this.loading = false,
              this.taulaSelecionada = true,
              this.getListaConsumiblesPendets(),
              this.closeModal()
          ),
          (error) => this.stopBlockRestaurant(restaurant),
          () => console.log('OK put brut false')
      );
  }

  getCategorias() {
      this.newCategoriaService.getCategorias().subscribe(
          (data) => (
              this.categorias = data,
              this.getCategoriasPare()
          ),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Categorias')
      );
  }

  getCategoriasPare() {
      this.consumiblesMostra = [];
      this.categoriasMostra = [];
      this.pilaCategoria = []; // cline stack
      this.categoria = '';
      for (const cat of this.categorias){
          if ( cat.nivell === 1 ) {
              this.categoriasMostra.push(cat);
          }
      }
  }

  seleccioCategoria(categoria) {
      this.categoriasMostra = [];
      if (categoria === null) {
          this.pilaCategoria.pop();
          if (this.pilaCategoria.length === 0) {
              this.getCategoriasPare();
          }else {
              this.getFills(this.pilaCategoria[this.pilaCategoria.length - 1]);
              this.getConsumiblesCat(this.pilaCategoria[this.pilaCategoria.length - 1]);
              this.categoria = this.pilaCategoria[this.pilaCategoria.length - 1].nom;
          }
      } else {
          this.pilaCategoria.push(categoria);
          this.categoria = categoria.nom;
          this.getFills(categoria);
          this.getConsumiblesCat(categoria);
      }
  }

  getFills(categoria) {
      this.categoriasMostra.push(null);
      if (categoria.idCategoriasFills !== null) {
          let index = 0;
          while ( categoria.idCategoriasFills.length > index) {
              this.addCategoriaMostra(categoria.idCategoriasFills[index]);
              index = index + 1;
          }
      }
  }

  addCategoriaMostra(idFill: number) {
      let cat = 0;
      let trobat = false;
      while ((this.categorias.length > cat) && (!trobat)) {
          if (this.categorias[cat].id === idFill) {
              this.categoriasMostra.push(this.categorias[cat]);
              trobat = true;
          }
          cat = cat + 1;
      }
  }

    getConsumiblesLin() {
        this.consumibles = [];
        this.newConsumibleService.getConsumibles().subscribe(
            (data) => (
                this.consumibles = data,
                    this.getListaConsumiblesPendets()
            ),
            (error) => console.log('Error: ' + error),
            () => console.log('OK Get Consumibles')
        );
    }

  getConsumibles() {
      this.consumibles = [];
      this.newConsumibleService.getConsumibles().subscribe(
          (data) => (
              this.consumibles = data
          ),
          (error) => console.log('Error: ' + error),
          () => console.log('OK Get Consumibles')
      );
  }

  getConsumiblesCat(categoria) {
      this.consumiblesMostra = [];
      for (const cons of this.consumibles){
          if (cons.idCategoria === categoria.url) {
              this.consumiblesMostra.push(cons);
          }
      }
  }

    searchFun() {
        if (this.search === '') {
            this.getConsumiblesCat(this.pilaCategoria[this.pilaCategoria.length - 1]);
            this.buscando = false;
        } else {
            this.buscando = true;
            this.newConsumibleService.getSearch(this.search).subscribe(
                (data) => (
                    this.consumiblesMostra = [],
                    this.consumiblesMostra = data
                ),
                (error) => console.log('Error: ' + error),
                () => console.log('OK Get Restaurants Search')
            );
        }
    }

    clineSerarch() {
        this.search = '';
        this.buscando = false;
        this.getConsumiblesCat(this.pilaCategoria[this.pilaCategoria.length - 1]);
    }

    getListaConsumiblesPendets() {
        // Get linias tiquet Server
        this.newLiniaTiquetService.getLiniaTiquetsTaula(this.taula.id, this.taula.tiquetActiu).subscribe(
            (data) => (
                this.addLinstaConsumiblesServer(data)
            ),
            (error) => this.getListaConsumiblesPendets(),
            () => console.log('OK Get lineasTiquet')
        );
        // Get linias tiquet local
        this.listaConsumiblesPendets = [];
        const nomLines = localStorage.getItem('url') + '-' + this.taula.tiquetActiu;
        this.listaConsumiblesPendets = JSON.parse(localStorage.getItem(nomLines));
        if (this.listaConsumiblesPendets === null) {
            this.listaConsumiblesPendets = [];
        }
        // calcul total
        this.calculTotalLista();
    }

    calculTotalLista() {
        let total = 0;
        // total local
        if (this.listaConsumiblesPendets !== null) {
            for (const linea of this.listaConsumiblesPendets){
                total = total + ((linea.preuActual * (( linea.ivaActual / 100 ) + 1 )) * linea.quantitat);
            }
        }
        // Total Server
        if (this.listaConsumiblesServer !== null) {
            for (const lineas of this.listaConsumiblesServer){
                total = total + ((lineas.preuActual * (( lineas.ivaActual / 100 ) + 1 )) * lineas.quantitat);
            }
        }
        this.totalLista = total.toFixed(2);
        this.loadingComanda = false;
    }

    addLinstaConsumiblesServer(lista) {
        this.listaConsumiblesServer = [];
        if (lista !== null) {
            for (const item of lista){
                // console.log(this.consumibles);
                let index = 0;
                let trobat = false;
                while ((index < this.consumibles.length) && (!trobat)) {
                    if (item.idConsumible === this.consumibles[index].url) {
                        trobat = true;
                        let tempNewLine: LiniaTiquet;
                        tempNewLine = new LiniaTiquet(
                            item.preuActual, item.quantitat , item.ivaActual, item.idConsumible, item.idTaula,
                            item.idTiquet, item.elaboracio,  this.consumibles[index].nom, item.id);
                        this.listaConsumiblesServer.push(tempNewLine);
                    }
                    index = index + 1;
                }
            }
        }
        this.calculTotalLista();
    }

        addConsumible(consumible) {
       this.getListaConsumiblesPendets();
       let index = 0;
       let trobat = false;
       if (this.listaConsumiblesPendets !== null) {
           console.log(this.listaConsumiblesPendets);
           while ((index < this.listaConsumiblesPendets.length) && (!trobat)) {
               if (this.listaConsumiblesPendets[index].idConsumible === consumible.url) {
                   this.listaConsumiblesPendets[index].quantitat = this.listaConsumiblesPendets[index].quantitat + 1;
                   trobat = true;
               }
               index = index + 1;
           }
       } else {
           this.listaConsumiblesPendets = [];
       }
       if (!trobat) {

           let tempNewTaula: LiniaTiquet;
           if (consumible.elaborat) {
               tempNewTaula = new LiniaTiquet(
                   consumible.preu, 1 , consumible.iva, consumible.url, this.taula.url,
                   (localStorage.getItem('url') + '/tiquet/' + this.taula.tiquetActiu + '/'), 2, consumible.nom, null);
           } else {
               tempNewTaula = new LiniaTiquet(
                   consumible.preu, 1 , consumible.iva, consumible.url, this.taula.url,
                   (localStorage.getItem('url') + '/tiquet/' + this.taula.tiquetActiu + '/'), 1, consumible.nom, null);
           }
           this.listaConsumiblesPendets.push(tempNewTaula);
       }
       const nomLines = localStorage.getItem('url') + '-' + this.taula.tiquetActiu;
       localStorage.setItem(nomLines, (JSON.stringify(this.listaConsumiblesPendets)));
       this.calculTotalLista();
    }

    moreQuantitat(linea) {
        this.getListaConsumiblesPendets();
        let index = 0;
        let trobat = false;
        while ((index < this.listaConsumiblesPendets.length) && (!trobat)) {
            if (this.listaConsumiblesPendets[index].idConsumible === linea.idConsumible) {
                this.listaConsumiblesPendets[index].quantitat = this.listaConsumiblesPendets[index].quantitat + 1;
                trobat = true;
            }
            index = index + 1;
        }
        const nomLines = localStorage.getItem('url') + '-' + this.taula.tiquetActiu;
        localStorage.setItem(nomLines, (JSON.stringify(this.listaConsumiblesPendets)));
        this.calculTotalLista();
    }

    lessQuantitat(linea) {
        this.getListaConsumiblesPendets();
        let index = 0;
        let trobat = false;
        while ((index < this.listaConsumiblesPendets.length) && (!trobat)) {
            if (this.listaConsumiblesPendets[index].idConsumible === linea.idConsumible) {
                this.listaConsumiblesPendets[index].quantitat = this.listaConsumiblesPendets[index].quantitat - 1;
                if (this.listaConsumiblesPendets[index].quantitat === 0) {
                    this.listaConsumiblesPendets.splice(index, 1);
                }
                trobat = true;
            }
            index = index + 1;
        }
        const nomLines = localStorage.getItem('url') + '-' + this.taula.tiquetActiu;
        localStorage.setItem(nomLines, (JSON.stringify(this.listaConsumiblesPendets)));
        this.calculTotalLista();
    }

    moreQuantitatServer(linea) {
        this.moreQuantitatServerFixed(linea, 1);
    }

    moreQuantitatServerFixed(linea, value) {
        let tempLinea;
        if (linea.elaboracio === 1) {
            tempLinea = JSON.stringify({
                quantitat: linea.quantitat + value
            });
        } else {
            tempLinea = JSON.stringify({
                quantitat: linea.quantitat + value,
                elaboracio: 2
            });
        }
        this.newLiniaTiquetService.editarLiniaTiquet(linea.idLinea, tempLinea).subscribe(
            (data) => this.getListaConsumiblesPendets(),
            (error) => console.log('Error: ' + error),
            () => console.log('Aumentada quantitat correctamenr')
        );
    }

    lessQuantitatServer(linea) {
        const totalQuantitat = linea.quantitat - 1;
        if (totalQuantitat !== 0) {
            const tempLinea = JSON.stringify({
                quantitat: totalQuantitat
            });
            this.newLiniaTiquetService.editarLiniaTiquet(linea.idLinea, tempLinea).subscribe(
                (data) => this.getListaConsumiblesPendets(),
                (error) => console.log('Error: ' + error),
                () => console.log('Reduida quantitat correctamenr')
            );
        } else {
            this.newLiniaTiquetService.deleteLiniaTiquet(linea.idLinea).subscribe(
                (data) => this.getListaConsumiblesPendets(),
                (error) => console.log('Error: ' + error),
                () => console.log('Eliminada linea correctamenr')
            );
        }
    }

    tramitarPendents() {
        let index = 0;
        while (index < this.listaConsumiblesPendets.length) {
            let indexServer = 0;
            let trobat = false;
            while (indexServer < this.listaConsumiblesServer.length) {
                if (this.listaConsumiblesPendets[index].idConsumible === this.listaConsumiblesServer[indexServer].idConsumible) {
                    this.moreQuantitatServerFixed(this.listaConsumiblesServer[indexServer], this.listaConsumiblesPendets[index].quantitat);
                    trobat = true;
                }
                indexServer = indexServer + 1;
            }
            if (!trobat) {
                this.sendLinea(this.listaConsumiblesPendets[index]);
            }
            index = index + 1;
        }
        this.listaConsumiblesPendets = [];
        const nomLines = localStorage.getItem('url') + '-' + this.taula.tiquetActiu;
        localStorage.setItem(nomLines, (JSON.stringify(this.listaConsumiblesPendets)));
        this.calculTotalLista();
    }

    sendLinea(linea) {
        const tempLinea = JSON.stringify({
            preuActual: linea.preuActual,
            quantitat: linea.quantitat,
            ivaActual: linea.ivaActual,
            idConsumible: linea.idConsumible,
            idTaula: linea.idTaula,
            idTiquet: linea.idTiquet,
            elaboracio: linea.elaboracio
        });
        this.newLiniaTiquetService.postLiniaTiquet(tempLinea).subscribe(
            (data) => this.getListaConsumiblesPendets(),
            (error) => this.sendLinea(linea),
            () => console.log('Linea Afegida')
        );
    }

    modalInfo(infoConsumible, consumible) {
        this.infoConsumibleData = consumible;
        // console.log(this.infoConsumibleData)
        this.modalService.open(this.modalService.open(infoConsumible)).result.then(
            (result) => { this.closeResult = `Closed with: ${result}`; },
            (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
        );
    }

    closeModal() {
        this.modalContetn.close('OK gen');
    }

    open(content) {
        this.modalContetn = this.modalService.open(this.modalContetn = this.modalService.open(content)).result.then(
            (result) => { this.closeResult = `Closed with: ${result}`; },
            (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

}
