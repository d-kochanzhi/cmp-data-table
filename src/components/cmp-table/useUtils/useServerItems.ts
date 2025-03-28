import { Header, Item, ViewOptions, ServerOptions } from '../types/cmp-table';
import { Ref } from 'vue';
import useBaseItems from './useBaseItems';

export default function useServerItems(
  viewOptions: Ref<ViewOptions>,
  headers: Ref<Header[]>,  
) {
  const {  
    headersComputed,
    generateColumnContent,
    getColStyle,
    getColSortStyle,
    addIndexer,
    headersForRender
  } = useBaseItems(viewOptions, headers);

  const getItemsForRender = (
    items: Array<Item>,
    expandable: Ref<Array<string>>,
  ) => {
    let result = [...items];

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
    headersForRender
  };
} 