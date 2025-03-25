import { Header, Item, ViewOptions, SortType, FilterValue } from '../types/cmp-table';
import { Ref } from 'vue';
import { getProps, valueOrDefault } from './useUtils';
import useBaseItems from './useBaseItems';

export default function useItems(
  viewOptions: Ref<ViewOptions>,
  headers: Ref<Header[]>
) {
  const {
    viewOptionsComputed,
    headersComputed,
    generateColumnContent,
    getColStyle,
    getColSortStyle,
    addIndexer,
  } = useBaseItems(viewOptions, headers);

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

  const compareValues = (value: any, filterValue: FilterValue, fieldValue: string) => {
    const compareValue = String(fieldValue).toLowerCase();
    const searchValue = String(filterValue.value).toLowerCase();

    switch (filterValue.operator) {
      case 'eq':
        return compareValue === searchValue;
      case 'lt':
        return Number(compareValue) < Number(searchValue);
      case 'lte':
        return Number(compareValue) <= Number(searchValue);
      case 'gt':
        return Number(compareValue) > Number(searchValue);
      case 'gte':
        return Number(compareValue) >= Number(searchValue);
      case 'ne':
        return compareValue !== searchValue;
      case 'lk':
        return compareValue.includes(searchValue);
      default:
        return compareValue === searchValue;
    }
  };

  const getFilteredItems = (items: Array<Item>) => {
    let whereKeys = getProps(viewOptionsComputed.value.where);
    if (whereKeys.size <= 0) return items;

    let result: Array<Item> = [];

    /* global search across all fields */
    if (whereKeys.has('_g')) {
      result = [
        ...items.filter((i) => {
          return headersComputed.value
            .filter((c) => valueOrDefault(c.filterable, true))
            .some((c) => {
              const fieldValue = String(generateColumnContent(c.field, i));
              return compareValues(
                fieldValue,
                viewOptionsComputed.value.where['_g'],
                fieldValue
              );
            });
        }),
      ];
      whereKeys.delete('_g');
    } else {
      result = [...items];
    }

    /*  quick search by fields */
    whereKeys.forEach((value, key) => {
      result = [
        ...result.filter((i) => {
          const fieldValue = String(generateColumnContent(key, i));
          return compareValues(
            fieldValue,
            viewOptionsComputed.value.where[key],
            fieldValue
          );
        }),
      ];
    });

    return result;
  };

  const getItemsForRender = (
    items: Array<Item>,
    expandable: Ref<Array<string>>,
    total: Ref<number>,
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
        ...new Set(result.map((item) => generateColumnContent(groupFields[0].field, item))),
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
