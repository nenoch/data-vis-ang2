import { Pipe, PipeTransform } from '@angular/core';
import { DataFilter } from '../data-preview/data-filter';

@Pipe({
  name: 'tableFilter',
  pure: false
})
export class TableFilterPipe implements PipeTransform {

  transform(items: any[], filter: DataFilter): any {
    if (!items || this.filterEmpty(filter)) {
      return items;
    }
    return items.filter(item => this.arraryFilter(item, filter));
  }

  private arraryFilter(array: any[], filter: DataFilter) {
     return array[`${filter.column}`].toLowerCase().includes(filter.filterString.toLowerCase());
  }

  private filterEmpty(filter: DataFilter) {
    if (!filter) { return true };
    if ((!filter.column && filter.column !== 0) || !filter.filterString) { return true };
    return false;
  }
}
