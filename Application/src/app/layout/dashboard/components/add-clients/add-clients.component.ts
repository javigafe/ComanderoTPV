import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { ClientService } from './../../../../../app/shared/services/client.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.scss'],
  providers: [ClientService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule
    ]
})

export class AddClientsComponent implements OnInit {

    nom: string;
    direccio: string;
    dni_nif: string;
    errorText: string;
    succes: string;

  constructor(private newClientService: ClientService, private newTranslateService: TranslateService) { }

  ngOnInit() {
  }

  cline() {
      this.nom = '';
      this.direccio = '';
      this.dni_nif = '';
  }

  addClient() {
      this.errorText = '';
      this.succes = '';
      const tempClient = JSON.stringify({
          nom: this.nom,
          direccio: this.direccio,
          NIF_DNI: this.dni_nif,
      });
      this.newClientService.postClient(tempClient).subscribe(
          (data) => console.log(data),
          (error) => this.errorText = 'Error: ' + error,
          () => this.newTranslateService.get('succes_add', {value: 'world'}).subscribe((res: string) => {
              this.succes = res;
          })
      );
      this.cline();
  }

}
