<template>
  <div class="filter-container">
    <select v-model="filterValue.operator" 
            class="operator-select" 
            @change="handleFilter"
            :title="getOperatorTitle(filterValue.operator)">
      <option v-for="option in availableOperators" 
              :key="option.value" 
              :value="option.value" 
              :title="getOperatorTitle(option.value)">
        {{ option.symbol }}
      </option>
    </select>
    <input
      class="text-filter"
      type="text"
      :value="filterValue.value"
      @input="handleInput"
      @keydown.enter="handleFilter" />
    <button 
      v-if="filterValue.value"
      class="clear-button"
      @click="handleClear"
      type="button"
      :title="t('filter.clear')">
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { FilterValue, DataType } from './types/cmp-table';

interface Operator {
  value: string;
  symbol: string;
}

const props = defineProps<{
  modelValue: FilterValue;
  dataType?: DataType;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterValue): void;
  (e: 'filter', value: FilterValue): void;
}>();

const { t } = useI18n();

const filterValue = ref<FilterValue>({
  value: '',
  operator: 'eq'
});

const effectiveDataType = computed((): DataType => {
  return props.dataType || 'auto';
});

const availableOperators = computed((): Operator[] => {
  const baseOperators = [
    { value: 'eq', symbol: '=' },
    { value: 'ne', symbol: '≠' }
  ];

  switch (effectiveDataType.value) {
    case 'number':
    case 'date':
      return [
        ...baseOperators,
        { value: 'lt',  symbol: '<' },
        { value: 'lte', symbol: '≤' },
        { value: 'gt',  symbol: '>' },
        { value: 'gte', symbol: '≥'}
      ];
    case 'string':
      return [
        ...baseOperators,
        { value: 'lk',  symbol: '*' }
      ];
    case 'boolean':
      return baseOperators;
    default:
      return [
        ...baseOperators,
        { value: 'lk', symbol: '*' }
      ];
  }
});

watch(() => props.modelValue, (newValue: FilterValue) => {
  filterValue.value = { ...newValue };
}, { immediate: true });

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  filterValue.value.value = target.value;
  emit('update:modelValue', filterValue.value);
};

const handleFilter = () => {
  emit('filter', filterValue.value);
  emit('update:modelValue', filterValue.value);
};

const handleClear = () => {
  filterValue.value.value = '';
  emit('update:modelValue', filterValue.value);
  emit('filter', filterValue.value);
};

const getOperatorTitle = (operator: string): string => {
  switch (operator) {
    case 'eq':
      return t('filter.equal');
    case 'ne':
      return t('filter.notEqual');
    case 'lt':
      return t('filter.lessThan');
    case 'lte':
      return t('filter.lessThanOrEqual');
    case 'gt':
      return t('filter.greaterThan');
    case 'gte':
      return t('filter.greaterThanOrEqual');
    case 'lk':
      return t('filter.like');
    default:
      return t(`filter.${operator}`);
  }
};
</script>