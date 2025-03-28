import { ref, reactive, watch } from 'vue';
import { FilterValue } from '../types/cmp-table';
import { Header } from '../types/cmp-table';
import { valueOrDefault } from './useUtils';

export default function useFiltering(
  updateViewOptionsWhere: (field: string, filterValue: FilterValue) => void
) {
  const searchInputRef = ref('');
  const quickFilters = reactive<{ [key: string]: FilterValue }>({});

  const searchChange = () => updateViewOptionsWhere('_g', {
    value: searchInputRef.value,
    operator: 'lk'
  });

  const updateGlobalFilter = (value: string) => {
    searchInputRef.value = value;
    searchChange();
  };

  const updateQuickFilter = (field: string, filterData: FilterValue) => {
    quickFilters[field] = filterData;
    updateViewOptionsWhere(field, filterData);
  };

  const initializeQuickFilters = (headers: Header[]) => {
    headers.forEach(header => {
      if (valueOrDefault(header.filterable, true) && !quickFilters[header.field]) {
        quickFilters[header.field] = {
          value: '',
          operator: 'eq'
        };
      }
    });

    // Удаляем фильтры для колонок, которых больше нет
    Object.keys(quickFilters).forEach(field => {
      if (!headers.find(h => h.field === field)) {
        delete quickFilters[field];
      }
    });
  };

  return {
    searchInputRef,
    quickFilters,
    updateGlobalFilter,
    updateQuickFilter,
    initializeQuickFilters,
    searchChange
  };
} 