import { Header, Item, ViewOptions } from '../types/cmp-table';
import { computed, Ref } from 'vue';
import { valueOrDefault } from './useUtils';

export default function useBaseItems(
  viewOptions: Ref<ViewOptions>,
  headers: Ref<Header[]>
) {
  const viewOptionsComputed = computed((): ViewOptions => {
    return viewOptions.value;
  });

  const headersComputed = computed((): Header[] => {
    return headers.value;
  });

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

  const generateColumnContent = function (column: string, item: Item) {
    const content = getItemValue(column, item);
    return Array.isArray(content) ? content.join(',') : content;
  };

  const getColStyle = (header: Header): string | undefined => {
    const width = header.width ?? null;
    if (width) return `width: ${width}px; min-width: ${width}px;`;
    return undefined;
  };

  const getColSortStyle = (header: Header): string => {
    if (valueOrDefault(header.sortable, true))
      return viewOptionsComputed.value.orderBy[header.field] || 'none';
    return 'none';
  };

  const addIndexer = (items: Array<Item>) => {
    let result = [...items];

    result.map(
      (i, index) =>
      (i['_index'] =
        index +
        (viewOptionsComputed.value.page - 1) * viewOptionsComputed.value.rowsPerPage),
    );

    return result;
  };

  return {
    viewOptionsComputed,
    headersComputed,
    getItemValue,
    generateColumnContent,
    getColStyle,
    getColSortStyle,
    addIndexer,
  };
} 