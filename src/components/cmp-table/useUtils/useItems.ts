import { SortType } from './../types/cmp-table';
import { Header, Item, ViewOptions } from '../types/cmp-table';

export default function useItems() {
  const getItemValue = function (column: string, item: Item) {
    if (column.includes('.')) {
      const keys = column.split('.');
      const { length } = keys;

      let content;
      let i = 0;

      while (i < length) {
        if (i === 0) {
          content = item[keys[0]];
        } else if (content && typeof content === 'object') {
          content = content[keys[i]];
        } else {
          content = '';
          break;
        }
        i += 1;
      }
      return content ?? '';
    }
    return item[column] ?? '';
  };

  const sortItemsFunc = function (field: string, sortType: SortType, a: Item, b: Item) {
    const valA = generateColumnContent(field, a);
    const valB = generateColumnContent(field, b);
    if (sortType === 'asc') {
      return valA > valB ? 1 : -1;
    } else if (sortType === 'desc') {
      return valB > valA ? 1 : -1;
    }
    return 0;
  };

  const generateColumnContent = function (column: string, item: Item) {
    const content = getItemValue(column, item);
    return Array.isArray(content) ? content.join(',') : content;
  };

  const getColStyle = (header: Header): string | undefined => {
    const width = header.width ?? null;
    if (width) return `width: ${width}px; min-width: ${width}px;`;
    return undefined;
  };

  const getColSortStyle = (header: Header, options: ViewOptions): string => {
    if (header.sortable) return options.orderBy[header.field] || 'none';
    return 'none';
  };

  const getPagedItems = (items: Array<Item>, options: ViewOptions) => {
    return items.slice(
      (options.page - 1) * options.rowsPerPage,
      options.page * options.rowsPerPage,
    );
  };

  const getItemsForRender = (items: Array<Item>, options: ViewOptions) => {
    let result = items;
    let sortKeys = Object.keys(options.orderBy);
    if (sortKeys.length > 0)
      result = result.sort((a, b) =>
        sortItemsFunc(sortKeys[0], options.orderBy[sortKeys[0]], a, b),
      );
    return getPagedItems(result, options);
  };

  return {
    generateColumnContent,
    getColStyle,
    getColSortStyle,
    getPagedItems,
    getItemsForRender,
  };
}
