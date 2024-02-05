/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClickEventType, EmitsEventName, Item, ViewOptions } from '../types/cmp-table';

export default function useItems(emits: (event: EmitsEventName, ...args: any[]) => void) {
  const clickRow = (item: Item, clickType: ClickEventType, $event: Event) => {
    emits('clickRow', item, $event);
  };

  const contextMenuRow = (item: Item, $event: MouseEvent) => {
    emits('contextmenuRow', item, $event);
  };

  const updateViewOptions = (value: ViewOptions) => {
    emits('update:viewOptions', value);
  };

  const updateItems = (value: Item[]) => {
    emits('update:items', value);
  };

  return {
    clickRow,
    contextMenuRow,
    updateViewOptions,
    updateItems,
  };
}
