import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { CategoriaService } from './../../../../../app/shared/services/categoria.service';
import { ConsumibleService } from './../../../../../app/shared/services/consumible.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-consumible',
  templateUrl: './add-consumible.component.html',
  styleUrls: ['./add-consumible.component.scss'],
  providers: [CategoriaService, ConsumibleService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class AddConsumibleComponent implements OnInit {
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


  constructor(private newCategoriaService: CategoriaService, private newConsumibleService: ConsumibleService, private newTranslateService: TranslateService) { }

  ngOnInit() {
      this.getCategorias();
      this.elaborat = false;
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

    addConsumible() {
        this.errorText = '';
        this.succes = '';
        // const tempConsumible = new ();
        // tempConsumible.append('nom', this.nom);
        // tempConsumible.append('preu', this.preu.toString());
        // tempConsumible.append('descripcio', this.descripcio);
        // tempConsumible.append('iva', this.iva.toString());
        // tempConsumible.append('foto', this.foto);
        // tempConsumible.append('actiu', 'true');
        // tempConsumible.append('idCategoria', localStorage.getItem('url') + '/categoria/' + this.categoria + '/');
        // tempConsumible.append('elaborat', 'false');
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
        this.newConsumibleService.postConsumible(tempConsumible).subscribe(
            (data) => (
                console.log(data),
                this.getCategorias()
            ),
            (error) => this.errorText = 'Error: ' + error,
            () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
                this.succes = res;
            })
        );
        this.cline();
    }

    getCategorias() {
        this.newCategoriaService.getCategorias().subscribe(
            (data) => this.categorias = data,
            (error) => this.errorText = 'Error: ' + error,
            () => console.log('OK Get Categorias')
        );
    }

}
