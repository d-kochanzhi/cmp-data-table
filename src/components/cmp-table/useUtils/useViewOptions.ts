import { Ref, computed, reactive, ref } from 'vue';
import { EmitsEventName, ViewOptions } from '../types/cmp-table';
import useEmits from './useEmits';

export default function useViewOptions(
  viewOptions: Ref<ViewOptions | null>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const { updateViewOptions } = useEmits(emits);

  const viewOptionsRef = ref(
    viewOptions.value || {
      page: 1,
      rowsPerPage: 25,
      orderBy: {},
      where: {},
    },
  );

  const viewOptionsComputed = computed({
    get: (): ViewOptions => {
      return viewOptionsRef.value;
    },
    set: (value) => {
      viewOptionsRef.value = value;
      updateViewOptions(value);
    },
  });

  const updateViewOptionsPage = (page: number) => {
    if (viewOptionsComputed.value) {
      viewOptionsComputed.value.page = page;
      viewOptionsComputed.value = {
        ...viewOptionsComputed.value,
      };
    }
  };

  const updateViewOptionsRowsPerPage = (rowsPerPage: number) => {
    if (viewOptionsComputed.value) {
      viewOptionsComputed.value.page = 1;
      viewOptionsComputed.value.rowsPerPage = rowsPerPage;

      viewOptionsComputed.value = {
        ...viewOptionsComputed.value,
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
        (key) => key !== field && delete viewOptionsComputed.value!.orderBy[key],
      );

      viewOptionsComputed.value = {
        ...viewOptionsComputed.value,
      };
    }
  };

  const updateViewOptionsWhere = (field: string, value: string) => {
    if (viewOptionsComputed.value) {
      viewOptionsComputed.value.page = 1;
      viewOptionsComputed.value.where[field] = value;

      viewOptionsComputed.value = {
        ...viewOptionsComputed.value,
      };
    }
  };

  return {
    viewOptionsComputed,
    updateViewOptionsPage,
    updateViewOptionsOrderBy,
    updateViewOptionsRowsPerPage,
    updateViewOptionsWhere,
  };
}
