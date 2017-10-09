/**
 * Created by javigafe on 25/07/17.
 */
export class Tasas {
   iva: number;
   base: number;
   cuota: number;
   total: number;


    constructor(iva: number, base: number, cuota: number, total: number) {
        this.iva = iva;
        this.base = base;
        this.cuota = cuota;
        this.total = total;
    }
}
