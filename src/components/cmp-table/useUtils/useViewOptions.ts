import { Ref, computed } from 'vue';
import { EmitsEventName, ViewOptions } from '../types/cmp-table';

export default function useViewOptions(
  viewOptions: Ref<ViewOptions | null>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const viewOptionsComputed = computed({
    get: (): ViewOptions => {
      if (viewOptions.value) {
        const { page, rowsPerPage, orderBy, where } = viewOptions.value;
        return {
          page: page,
          rowsPerPage: rowsPerPage,
          orderBy: orderBy ?? {},
          where: where ?? {},
        };
      }
      return {
        page: 1,
        rowsPerPage: 25,
        orderBy: {},
        where: {},
      };
    },
    set: (value) => {
      emits('update:viewOptions', value);
    },
  });

  const updateViewOptionsPage = (page: number) => {
    if (viewOptionsComputed.value) {
      viewOptionsComputed.value = {
        ...viewOptionsComputed.value,
        page,
      };
    }
  };

  const updateViewOptionsRowsPerPage = (rowsPerPage: number) => {
    if (viewOptionsComputed.value) {
      viewOptionsComputed.value = {
        ...viewOptionsComputed.value,
        page: 1,
        rowsPerPage,
      };
    }
  };

  const updateViewOptionsOrderBy = (field: string) => {
    if (viewOptionsComputed.value) {
      switch (viewOptionsComputed.value.orderBy[field]) {
        case 'asc':
          viewOptionsComputed.value.orderBy[field] = 'desc';
          break;
        default:
          viewOptionsComputed.value.orderBy[field] = 'asc';
      }

      Object.keys(viewOptionsComputed.value.orderBy).forEach(
        (key) => key !== field && delete viewOptionsComputed.value.orderBy[key],
      );

      viewOptionsComputed.value = {
        ...viewOptionsComputed.value,
        page: Math.floor(Math.random() * 100),
      };
    }
  };

  return {
    viewOptionsComputed,
    updateViewOptionsPage,
    updateViewOptionsOrderBy,
    updateViewOptionsRowsPerPage,
  };
}
