import { TableFilterPipe } from './table-filter.pipe';
import { DataFilter } from '../data-preview/data-filter';

fdescribe('TableFilterPipe', () => {

  const data = [{Country: 'Canada', Food: 'Fish', Amount: '10'}, {Country: 'England', Food: 'Chips', Amount: '30'}];
  const pipe = new TableFilterPipe();
  const emptyFilter: DataFilter = new DataFilter(null, null);
  const filter1: DataFilter = new DataFilter('Country', 'can');
  const filter2: DataFilter = new DataFilter('Food', 'ch');

  it('returns data if no filter object provided', () => {
    expect(pipe.transform(data, null)).toBe(data);
  });

  it('returns data if empty filter object provided', () => {
    expect(pipe.transform(data, emptyFilter)).toBe(data);
  });

  it('filters first column when given column of Country', () => {
    expect(pipe.transform(data, filter1)).toEqual([{Country: 'Canada', Food: 'Fish', Amount: '10'}]);
  });

  it('filters second column when given column of Food', () => {
    expect(pipe.transform(data, filter2)).toEqual([{Country: 'England', Food: 'Chips', Amount: '30'}]);
  });
});
