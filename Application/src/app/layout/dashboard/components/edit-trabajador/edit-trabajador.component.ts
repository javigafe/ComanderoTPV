import {Component, NgModule, OnInit} from '@angular/core';
import { HttpModule } from '@angular/http';
import { UserService } from './../../../../../app/shared/services/user.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-edit-trabajador',
  templateUrl: './edit-trabajador.component.html',
  styleUrls: ['./edit-trabajador.component.scss'],
  providers: [UserService, TranslateService]
})

@NgModule({
    imports: [
        HttpModule,
    ]
})

export class EditTrabajadorComponent implements OnInit {

    usuaris = [];
    usuarioActiu;
    nombre: string;
    dni: string;
    carec: number;
    loading: boolean;
    userProfieActiu;
    errorText: string;
    succes: string;

  constructor(private newUserService: UserService, private newTranslateService: TranslateService) { }

    ngOnInit() {
      this.loading = true;
      this.getClients();
      this.usuarioActiu = null;
      this.userProfieActiu = null;
  }

  getClients() {
      this.newUserService.getUsers().subscribe(
          (data) => (
              this.usuaris = data,
                  this.loading = false
          ),
          (error) => console.log(error),
          () => console.log()
      );
  }

  getDataUser() {
      this.userProfieActiu = null;
      this.loading = true;
      if (this.usuarioActiu !== null) {
          this.newUserService.getUserprofile((this.usuarioActiu.url.split('/', 5))[4]).subscribe(
              (data) => (
                  this.setDataUser(data)
              ),
              (error) => console.log(error),
              () => console.log()
          );
      } else {
          this.loading = false;
      }
  }

  setDataUser(data) {
      if (data.length === 0) {
          this.nombre = '';
          this.dni = '';
          this.carec = 1;
          const tempUserProfile = JSON.stringify({
              user: this.usuarioActiu.url,
              nom: 'admin',
              DNI: 'admin',
              carrec: 1
          });
          this.newUserService.postUserprofile(tempUserProfile).subscribe(
              (datos) => (
                  this.userProfieActiu = datos
              ),
              (error) => console.log(error),
              () => console.log('Add usuari correctament')
          );
      } else {
          this.userProfieActiu = data[0];
          this.nombre = data[0].nom;
          this.dni = data[0].DNI;
          this.carec = data[0].carrec;
      }
      this.loading = false;
  }

  editTrabajador() {
      const tempUserProfile = JSON.stringify({
          nom: this.nombre,
          DNI: this.dni,
          carrec: this.carec
      });
      this.newUserService.editUserprofile(((this.userProfieActiu.url.split('/', 5))[4]), tempUserProfile).subscribe(
          (data) => (
              console.log(data)
          ),
          (error) => this.errorText = (error),
          () => this.newTranslateService.get('editedcorrectly', {value: 'world'}).subscribe((res: string) => {
              this.succes = res;
          })
      );
  }

}
