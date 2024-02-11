import { Header, Item, ViewOptions, SortType } from '../types/cmp-table';
import { computed, reactive, ref, Ref } from 'vue';

export default function usePaging(viewOptions: Ref<ViewOptions>, total: Ref<number>) {
  const viewOptionsComputed = computed((): ViewOptions => {
    return viewOptions.value;
  });

  const totalComputed = computed((): number => {
    return total.value | 0;
  });

  const lastPage = computed(() => {
    if (!totalComputed.value || !viewOptionsComputed.value) return 1;

    return totalComputed.value < viewOptionsComputed.value.rowsPerPage
      ? 1
      : Math.ceil(totalComputed.value / viewOptionsComputed.value.rowsPerPage);
  });

  const isFirstPage = computed(() => {
    return viewOptionsComputed.value.page === 1;
  });

  const isLastPage = computed(() => {
    return viewOptionsComputed.value.page >= lastPage.value;
  });

  const canGoBackPage = computed(() => {
    return viewOptionsComputed.value.page > 1;
  });

  const canGoNextPage = computed(() => {
    return viewOptionsComputed.value.page < lastPage.value;
  });

  const getPageListForRender = computed(() => {
    let result = [];

    for (let i = 1; i <= lastPage.value; i++) {
      if (
        i >= viewOptionsComputed.value.page - 3 &&
        i <= viewOptionsComputed.value.page + 3
      )
        result.push(i);
    }

    return result;
  });

  return {
    isFirstPage,
    isLastPage,
    canGoBackPage,
    canGoNextPage,
    lastPage,
    getPageListForRender,
  };
}
