// import { TableFilterPipe } from './table-filter.pipe';
// import { DataFilter } from '../data-preview/data-filter';
//
// xdescribe('TableFilterPipe', () => {
//
//   const data = [['Canada', 'Fish', '10'], ['England', 'Chips', '30']];
//   const pipe = new TableFilterPipe();
//   const emptyFilter: DataFilter = new DataFilter(null, null);
//   const filter1: DataFilter = new DataFilter(0, 'can');
//   const filter2: DataFilter = new DataFilter(1, 'ch');
//
//   it('returns data if no filter object provided', () => {
//     expect(pipe.transform(data, null)).toBe(data);
//   });
//
//   it('returns data if empty filter object provided', () => {
//     expect(pipe.transform(data, emptyFilter)).toBe(data);
//   });
//
//   it('filters first column when given column of 0', () => {
//     expect(pipe.transform(data, filter1)).toEqual([['Canada', 'Fish', '10']]);
//   });
//
//   it('filters second column when given column of 1', () => {
//     expect(pipe.transform(data, filter2)).toEqual([['England', 'Chips', '30']]);
//   });
// });
