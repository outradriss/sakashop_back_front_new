import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caisseFilter',
  standalone:false
})
export class CaisseFilterPipe implements PipeTransform {
  transform(sales: any[], searchText: string): any[] {
    if (!searchText) return sales;
    const lowerSearch = searchText.toLowerCase();
    return sales.filter(sale => sale.caisseName?.toLowerCase().includes(lowerSearch));
  }
}
