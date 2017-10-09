import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { CategoriaService } from './../../../../../app/shared/services/categoria.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-edit-categoria',
  templateUrl: './edit-categoria.component.html',
  styleUrls: ['./edit-categoria.component.scss'],
  providers: [CategoriaService, NgbModal, ConsumibleService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
        NgbModule.forRoot()
    ]
})

export class EditCategoriaComponent implements OnInit {

    nom: string;
    errorText: string;
    succes: string;
    categorias = [];
    categoriaTemp;
    categoriaPare;
    CategoriaEdita;
    visible: boolean;
    closeResult: string;
    categoriasEdit = [];
    CategoriaActual;
    categoriaPareOld;
    noBorrable: boolean;
    search: string;


    constructor(private newCategoriaService: CategoriaService, private modalService: NgbModal, private newConsumibleService: ConsumibleService, private newTranslateService: TranslateService) { }

    ngOnInit() {
        this.getCategorias();
        this.visible = false;
        this.CategoriaEdita = null;
    }

    cline() {
        this.nom = '';
        this.categoriaTemp = null;
    }

    getCategorias() {
        this.categoriasEdit = [];
        this.newCategoriaService.getCategorias().subscribe(
            (data) => (this.categorias = data),
            (error) => console.log(error),
            () => console.log()
        );

    }

    getCategoriasPare() {
        this.categoriasEdit = [];
        this.newCategoriaService.getCategorias().subscribe(
            (data) => (
                    this.categoriasEdit = data,
                    this.getCategoriasPosiblePare(this.CategoriaEdita)
            ),
            (error) => console.log(error),
            () => console.log()
        );

    }

    getCategoriasPosiblePare(categoriaEdita) {
        if (categoriaEdita !== null) {
            this.getIDsFills(categoriaEdita);
            this.deleteIDEdit(categoriaEdita.id);
            // this.categoriasEdit.push(categoriaEdita);
        }
        // for (const iter in data) {
        //     if ((data[iter].id !== categoriaEdita.id) ) {
        //         this.categoriasEdit.push(data[iter]);
        //     }
        // }
    }

    getIDsFills(categoriaEdita) {
        for (const i of categoriaEdita.idCategoriasFills) {
            this.deleteIDEdit(i);
            this.newCategoriaService.getCategoria(i).subscribe(
                (data) => (
                    this.getIDsFills(data)
                ),
                (error) => console.log(error),
                () => console.log()
            );

        }
    }

    getCategoriaPareURL(url: string) {
        if (url == null) {
            this.categoriaTemp = null;
            this.categoriaPareOld = null;
        }else {
            this.newCategoriaService.getCategoriaURL(url).subscribe(
                (data) => (
                    this.categoriaTemp = data.id,
                    this.categoriaPareOld = data
                ),
                (error) => this.errorText = 'Error: ' + error,
                () => console.log('OK Get Categoria')
            );
        }
    }

    deleteIDEdit(id: number) {
        let trobat = false;
        let cat = 0;
        while ( (this.categoriasEdit.length > cat) && (!(trobat)) ) {
            if (this.categoriasEdit[cat].id === id) {
                this.categoriasEdit.splice(cat, 1);
                trobat = true;
            }
            cat = cat + 1;
        }
    }

    getCategoriaEdit() {
        this.getCategoriasPare();
        this.errorText = '';
        this.succes = '';
        if (!(this.CategoriaEdita == null)) {
            this.visible = true;
            // this.newCategoriaService.getCategoria(this.CategoriaEdita.id).subscribe(
            //     (data) => (
            //         this.CategoriaActual = data,
            //         this.getCategoriaPareURL(data.idCategoriaPare),
            //         this.nom = data.nom
            this.CategoriaActual = this.CategoriaEdita;
            this.getCategoriaPareURL(this.CategoriaEdita.idCategoriaPare);
            this.nom = this.CategoriaEdita.nom;
            //     ),
            //     (error) => this.errorText = 'Error: ' + error,
            //     () => console.log('OK Get Categoria')
            // );
        } else {
            this.cline();
            this.categoriaTemp = null;
            this.categoriaPareOld = null;
            this.visible = false;
        }
    }

    chekConsumibles() {
        this.newConsumibleService.getConsumibles().subscribe(
            (data) => (
                this.teConsimibles(data, this.CategoriaEdita)
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Consumibles')
        );
    }

    teConsimibles(data, categoriaEdita) {
        let index = 0;
        this.noBorrable = false;
        while ((data.length > index) && (!this.noBorrable)) {
            if ((data[index].idCategoria === categoriaEdita.url) && (data[index].actiu)) {
                this.noBorrable = true;
            }
            index = index + 1;
        }
    }

    closeError() {
        this.noBorrable = false;
    }

    delete() {
        if (this.CategoriaEdita.idCategoriasFills.length === 0) {
            if (this.CategoriaEdita.idCategoriaPare !== null) {
                this.delteFill(this.CategoriaEdita, this.categoriaPareOld);
            }
            this.newCategoriaService.deleteCategoria(this.CategoriaEdita.id).subscribe(
                (data) => this.getCategorias(),
                (error) => this.errorText = 'Error: ' + error,
                () => this.newTranslateService.get('succes_delete', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
            );
        } else {
            this.newTranslateService.get('error_delete_category', {value: 'world'}).subscribe((res: string) => {
                this.errorText = res;
                console.error(res);
            });
        }
        this.cline();
        this.categoriaTemp = null;
        this.categoriaPareOld = null;
        this.CategoriaEdita.id = null;
        this.visible = false;
    }

    editCategoria() {
        this.errorText = '';
        this.succes = '';
        if (this.CategoriaActual.idCategoriaPare != null) {
            this.delteFill(this.CategoriaActual, this.categoriaPareOld);
        }
        this.getPareModificat(this.categoriaTemp);
    }

    getPareModificat(idPare) {
        if ((idPare == null) || (idPare === '')) {
            this.editCategoriaConPare(null);
        } else {
            this.newCategoriaService.getCategoria(idPare).subscribe(
                (data) => (
                    this.editCategoriaConPare(data)
                ),
                (error) => this.errorText = 'Error: ' + error,
                () => this.succes = 'OK Get Pare'
            );
        }
    }

    editCategoriaConPare(pare) {
        let tempCategoria;
        if (pare == null) {
            tempCategoria = JSON.stringify({
                nom: this.nom,
                idCategoriaPare: null,
                nivell: 1
            });
            this.editNivells(this.CategoriaActual.id, 1);
        } else {
            tempCategoria = JSON.stringify({
                nom: this.nom,
                idCategoriaPare: localStorage.getItem('url') + '/categoria/' + pare.id + '/',
                nivell: pare.nivell + 1
            });
            this.editNivells(this.CategoriaActual.id, (pare.nivell + 1));
            this.addFill(this.CategoriaActual, pare);
        }
        this.newCategoriaService.editarCategoria(this.CategoriaActual.id, tempCategoria).subscribe(
            (data) => console.log(data),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('editedcorrectly', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );

        this.visible = false;
        this.cline();
        this.getCategorias();
        this.getCategorias();
    }

    delteFill(fill, pare) {
        const fills = [];
        for (const index of pare.idCategoriasFills) {
            if (index !== fill.id) {
                fills.push(index);
            }
        }
        const tempJson = JSON.stringify({
            idCategoriasFills: fills
        });
        this.newCategoriaService.editarCategoria(pare.id, tempJson).subscribe(
            (data) => console.log(data),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('delete_child_father', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
    }

    addFill (fill, pare) {
        const fills = pare.idCategoriasFills;
        fills.push(fill.id);
        const tempJson = JSON.stringify({
            idCategoriasFills: fills
        });
        this.newCategoriaService.editarCategoria(pare.id, tempJson).subscribe(
            (data) => console.log(data),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
            this.succes = res;
            })
        );
    }

    editNivells(categoria, nivell) {
        const tempJson = JSON.stringify({
            nivell: nivell
        });
        this.newCategoriaService.editarCategoria(categoria, tempJson).subscribe(
            (data) => console.log(data),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('modified_level', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
        );
        this.newCategoriaService.getCategoria(categoria).subscribe(
            (data) => this.auxEditNivells(data, (nivell + 1)),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
    }

    auxEditNivells(data, nivell) {
        for (const index of data.idCategoriasFills) {
            this.editNivells(index, nivell);
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

    searchFun() {
        if (this.search === '') {
            this.getCategorias();
        } else {
            this.categoriasEdit = [];
            this.newCategoriaService.getSearch(this.search).subscribe(
                (data) => (this.categorias = data),
                (error) => this.errorText = 'Error: ' + error,
                () => console.log('OK Get Restaurants Search')
            );
        }
    }

    clineSerarch() {
        this.search = '';
        this.getCategorias();

    }


}
