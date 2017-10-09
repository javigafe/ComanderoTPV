import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { CategoriaService } from './../../../../../app/shared/services/categoria.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-edit-consumible',
  templateUrl: './edit-consumible.component.html',
  styleUrls: ['./edit-consumible.component.scss'],
  providers: [CategoriaService, ConsumibleService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot()
    ]
})

export class EditConsumibleComponent implements OnInit {

    nom: string;
    preu: number;
    descripcio: string;
    iva: number;
    foto;
    categoria;
    categorias = [];
    elaborat: boolean;
    errorText: string;
    succes: string;
    visible: boolean;
    consumibles = [];
    consumible;
    closeResult: string;
    search: string;


  constructor(private newCategoriaService: CategoriaService, private newConsumibleService: ConsumibleService, private modalService: NgbModal, private newTranslateService: TranslateService) { }

  ngOnInit() {
      this.getConsumibles();
      this.visible = false;
      this.consumible = null;
  }

    cline() {
        this.nom = '';
        this.preu = null;
        this.descripcio = '';
        this.iva = null;
        this.foto = null;
        this.categoria = null;
        this.categorias = [];
        this.elaborat = false;
        this.getCategorias();
    }

    getConsumibles() {
        this.consumibles = [];
        this.newConsumibleService.getConsumibles().subscribe(
            (data) => this.consumibles = data,
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Categorias')
        );
    }

    getConsumible() {
      this.errorText = '';
      this.succes = '';
      if (this.consumible !== null) {
          this.visible = true;
          this.nom = this.consumible.nom;
          this.preu = this.consumible.preu;
          this.descripcio = this.consumible.descripcio;
          this.iva = this.consumible.iva;
          this.foto = this.consumible.foto;
          this.getCategorias()
          // this.categoria = null;
          this.elaborat = this.consumible.elaborat;
      } else {
          this.visible = false;
      }
    }

    getCategorias() {
        this.newCategoriaService.getCategorias().subscribe(
            (data) => (
                this.categorias = data,
                this.selectCategoria(data)
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Categorias')
        );
    }

    selectCategoria(categorias) {
      let index = 0;
      let trobat = false
      while ((categorias.length > index) && (!trobat)) {
          if (categorias[index].url === this.consumible.idCategoria) {
              this.categoria = categorias[index].id;
              trobat = true;
          }
          index = index + 1;
      }
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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

    editConsumible() {
        this.errorText = '';
        this.succes = '';
        const tempConsumible = JSON.stringify({
            nom: this.nom,
            preu: this.preu,
            descripcio: this.descripcio,
            iva: this.iva,
            foto: null,
            actiu: true,
            idCategoria: localStorage.getItem('url') + '/categoria/' + this.categoria + '/',
            elaborat: this.elaborat,
        });
        this.newConsumibleService.editarConsumible(this.consumible.id, tempConsumible).subscribe(
            (data) => (
                console.log(data),
                this.getConsumibles()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('editedcorrectly', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
        this.cline();
        this.visible = false;
    }

    delete() {
        const tempConsumible = JSON.stringify({
            actiu: false,
        });
        this.newConsumibleService.editarConsumible(this.consumible.id, tempConsumible).subscribe(
            (data) => (
                console.log(data),
                this.getConsumibles()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_delete', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
        this.visible = false;
    }

    searchFun() {
        if (this.search === '') {
            this.getConsumibles();
        } else {
            this.newConsumibleService.getSearch(this.search).subscribe(
                (data) => (
                    this.consumibles = [],
                    this.consumibles = data
                ),
                (error) => this.errorText = 'Error: ' + error,
                () => console.log('OK Get Restaurants Search')
            );
        }
    }

    clineSerarch() {
        this.search = '';
        this.getConsumibles();
    }

}
