import { Header, Item, ViewOptions, SortType, FilterValue, DataType } from '../types/cmp-table';
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

  const determineDataType = (value: any, dataType?: DataType): DataType => {
    if (dataType) return dataType;

    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'date';
    if (!isNaN(Date.parse(value)) && value.includes('-')) return 'date';
    return 'string';
  };

  const compareByType = (valA: any, valB: any, dataType?: DataType): number => {
    const type = determineDataType(valA, dataType);

    switch (type) {
      case 'number':
        return Number(valA) - Number(valB);
      case 'boolean':
        return (valA === valB) ? 0 : valA ? 1 : -1;
      case 'date':
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        return dateA.getTime() - dateB.getTime();
      default:
        return String(valA).localeCompare(String(valB));
    }
  };

  const sortItemsFunc = function (field: string, sortType: SortType, a: Item, b: Item) {
    const header = headersComputed.value.find(h => h.field === field);
    const valA = generateColumnContent(field, a);
    const valB = generateColumnContent(field, b);

    const compareResult = compareByType(valA, valB, header?.dataType);
    return sortType === 'asc' ? compareResult : -compareResult;
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

  const compareValues = (value: any, filterValue: FilterValue, dataType?: DataType) => {
    const type = determineDataType(value, dataType);
    const compareValue = type === 'number' ? Number(value) : String(value).toLowerCase();
    const searchValue = type === 'number' ? Number(filterValue.value) : String(filterValue.value).toLowerCase();

    switch (type) {
      case 'number':
        switch (filterValue.operator) {
          case 'eq': return compareValue === searchValue;
          case 'lt': return compareValue < searchValue;
          case 'lte': return compareValue <= searchValue;
          case 'gt': return compareValue > searchValue;
          case 'gte': return compareValue >= searchValue;
          case 'ne': return compareValue !== searchValue;
          default: return compareValue === searchValue;
        }

      case 'date':
        const dateCompare = new Date(compareValue).getTime();
        const dateSearch = new Date(searchValue).getTime();
        switch (filterValue.operator) {
          case 'eq': return dateCompare === dateSearch;
          case 'lt': return dateCompare < dateSearch;
          case 'lte': return dateCompare <= dateSearch;
          case 'gt': return dateCompare > dateSearch;
          case 'gte': return dateCompare >= dateSearch;
          case 'ne': return dateCompare !== dateSearch;
          default: return dateCompare === dateSearch;
        }

      case 'boolean':
        const boolCompare = String(compareValue).toLowerCase() === 'true';
        const boolSearch = String(searchValue).toLowerCase() === 'true';
        return filterValue.operator === 'ne' ? boolCompare !== boolSearch : boolCompare === boolSearch;

      default:
        switch (filterValue.operator) {
          case 'eq': return compareValue === searchValue;
          case 'ne': return compareValue !== searchValue;
          case 'lk': return String(compareValue).includes(String(searchValue));
          default: return compareValue === searchValue;
        }
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
                c.dataType
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
      const header = headersComputed.value.find(h => h.field === key);
      result = [
        ...result.filter((i) => {
          const fieldValue = String(generateColumnContent(key, i));
          return compareValues(
            fieldValue,
            viewOptionsComputed.value.where[key],
            header?.dataType
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
