/**
 * Created by javigafe on 25/07/17.
 */
export class LiniaTiquet {
    preuActual: number;
    quantitat: number;
    ivaActual: number;
    idConsumible: string;
    idTaula: string;
    idTiquet: string;
    elaboracio: number;
    nomConsumible: string;
    idLinea: number;


    constructor(preuActual: number, quantitat: number, ivaActual: number, idConsumible: string, idTaula: string, idTiquet: string, elaboracio: number, nomConsumible: string, idLinea: number) {
        this.preuActual = preuActual;
        this.quantitat = quantitat;
        this.ivaActual = ivaActual;
        this.idConsumible = idConsumible;
        this.idTaula = idTaula;
        this.idTiquet = idTiquet;
        this.elaboracio = elaboracio;
        this.nomConsumible = nomConsumible;
        this.idLinea = idLinea;
    }
}
