import { Header, Item, ViewOptions, SortType } from '../types/cmp-table';
import { computed, reactive, ref, Ref } from 'vue';

export default function useItems(viewOptions: Ref<ViewOptions>, headers: Ref<Header[]>) {
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

  const getColStyle = (header: Header): string | undefined => {
    const width = header.width ?? null;
    if (width) return `width: ${width}px; min-width: ${width}px;`;
    return undefined;
  };

  const getColSortStyle = (header: Header): string => {
    if (header.sortable) return viewOptionsComputed.value.orderBy[header.field] || 'none';
    return 'none';
  };

  const getPagedItems = (items: Array<Item>) => {
    return items.slice(
      (viewOptionsComputed.value.page - 1) * viewOptionsComputed.value.rowsPerPage,
      viewOptionsComputed.value.page * viewOptionsComputed.value.rowsPerPage,
    );
  };

  const getOrderedItems = (items: Array<Item>) => {
    let sortKeys = Object.keys(viewOptionsComputed.value.orderBy);
    if (sortKeys.length > 0) {
      let result = [...items];
      result = result.sort((a, b) =>
        sortItemsFunc(sortKeys[0], viewOptionsComputed.value.orderBy[sortKeys[0]], a, b),
      );

      return result;
    }
    return items;
  };

  const getFilteredItems = (items: Array<Item>) => {
    if (!viewOptionsComputed.value.where['g']) return items;

    let result: Array<Item> = [];
    headersComputed.value
      .filter((c) => c.filterable)
      .forEach((c) => {
        result = [
          ...result,
          ...items.filter(
            (i) =>
              String(generateColumnContent(c.field, i))
                .toLowerCase()
                .indexOf(viewOptionsComputed.value.where['g'].toLowerCase()) > -1,
          ),
        ];
      });

    return result;
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

  const getItemsForRender = (
    items: Array<Item>,
    total: Ref<number>,
    expandable: Ref<Array<string>>,
  ) => {
    let result = [...items];

    result = getFilteredItems(result);
    total.value = result.length;

    result = getOrderedItems(result);
    result = getPagedItems(result);

    let groupFields = headersComputed.value.filter((c) => c.expandable === true);

    if (groupFields.length > 0) {
      result = addIndexer(result);

      expandable.value = [
        ...new Set(result.map((item) => getItemValue(groupFields[0].field, item))),
      ];
    }

    return result;
  };

  return {
    generateColumnContent,
    getColStyle,
    getColSortStyle,
    getItemsForRender,
  };
}
