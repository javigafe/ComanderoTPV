/**
 * Created by javigafe on 25/07/17.
 */
import { LiniaTiquet } from './LiniaTiquet';

export class CuniaTaula {
    numTaula: number;
    idTaula: number;
    comensalsTaula: number;
    lineasTiket: LiniaTiquet[];

    constructor(numTaula: number, idTaula: number, comensalsTaula: number, lineasTiket: LiniaTiquet[]) {
        this.numTaula = numTaula;
        this.idTaula = idTaula;
        this.comensalsTaula = comensalsTaula;
        this.lineasTiket = lineasTiket;
    }
}
/**
 * Created by javigafe on 2/08/17.
 */
