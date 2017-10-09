import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { CategoriaService } from './../../../../../app/shared/services/categoria.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-categoria',
  templateUrl: './add-categoria.component.html',
  styleUrls: ['./add-categoria.component.scss'],
  providers: [CategoriaService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
    ]
})

export class AddCategoriaComponent implements OnInit {

    nom: string;
    errorText: string;
    succes: string;
    categorias = [];
    categoriaTemp;
    categoriaPare;


    constructor(private newCategoriaService: CategoriaService,   private newTranslateService: TranslateService) { }

    ngOnInit() {
        this.getCategorias();
    }

    cline() {
        this.nom = '';
        this.categoriaTemp = null;
    }

    getCategorias() {
        this.newCategoriaService.getCategorias().subscribe(
            (data) => this.categorias = data,
            (error) => console.log(error),
            () => console.log()
        );
    }

    getCategoriaPare(id: number, nom: string) {
        this.newCategoriaService.getCategoria(id).subscribe(
            (data) => (
                this.addCatergoriaWPare(data, nom)
            ),
            (error) => console.log(error),
            () => console.log('OK GET Pare')
        );
    }

    addCategoria() {
        this.errorText = '';
        this.succes = '';
        if ((this.categoriaTemp == null) || (this.categoriaTemp === '')) {
            const tempClient = JSON.stringify({
                nom: this.nom,
                nivell: 1,
                idCategoriasFills: [],
            });

            this.newCategoriaService.postCategoria(tempClient).subscribe(
                (data) => (
                    console.log(data),
                    this.cline(),
                    this.getCategorias()
                ),
                (error) => this.errorText = 'Error: ' + error,
                () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
                    this.succes = res;
                })
            );

        } else {
            this.getCategoriaPare(this.categoriaTemp, this.nom);
        }
    }

    addCatergoriaWPare(datas, nom: string) {
        this.categoriaPare = datas;
        const nivellFill = (datas.nivell + 1);
         const tempClient = JSON.stringify({
            nom: nom,
            nivell:  nivellFill,
            idCategoriasFills: [],
            idCategoriaPare: localStorage.getItem('url') + '/categoria/' + this.categoriaTemp + '/',
        });
        this.newCategoriaService.postCategoria(tempClient).subscribe(
            (data) => (
                console.log(data),
                this.addFilltoPare(data.id)
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
    }

    addFilltoPare(idFill: number) {
        const arrayFills = this.categoriaPare.idCategoriasFills;
        arrayFills.push(idFill);
        const tempCategoria = JSON.stringify({
            idCategoriasFills: arrayFills
        });
        this.newCategoriaService.editarCategoria(this.categoriaPare.id, tempCategoria).subscribe(
            (data) => (
                console.log(data),
                this.cline(),
                this.getCategorias()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_child_add', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
    }
}
