/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClickEventType, EmitsEventName, Item, ViewOptions } from '../types/cmp-table';

export default function useItems(emits: (event: EmitsEventName, ...args: any[]) => void) {
  /*
  const inversOrder = (field: string, options: ViewOptions) => {
    switch (options.orderBy[field]) {
      case 'asc':
        options.orderBy[field] = 'desc';
        break;
      default:
        options.orderBy[field] = 'asc';
    }

    Object.keys(options.orderBy).forEach(
      (key) => key !== field && delete options.orderBy[key],
    );
  };

  const updateSortField = (field: string, options: ViewOptions) => {
    inversOrder(field, options);
    emits('update:viewOptions', options);
    emits('updateSort', {
      sortBy: field,
      sortType: options.orderBy[field],
    });
  };
*/
  const clickRow = (item: Item, clickType: ClickEventType, $event: Event) => {
    emits('clickRow', item, $event);
  };

  const contextMenuRow = (item: Item, $event: MouseEvent) => {
    emits('contextmenuRow', item, $event);
  };

  return {
    //updateSortField,
    clickRow,
    contextMenuRow,
  };
}
