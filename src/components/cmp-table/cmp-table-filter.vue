<template>
  <div class="filter-container">
    <select v-model="filterValue.operator" class="operator-select" @change="handleFilter">
      <option v-for="option in filterOptions" 
              :key="option.value" 
              :value="option.value" 
              :title="$t(option.title)">
        {{ option.symbol }}
      </option>
    </select>
    <input
      class="text-filter"
      type="text"
      :value="filterValue.value"
      @input="handleInput"
      @keydown.enter="handleFilter" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FilterValue } from './types/cmp-table';

export default defineComponent({
  name: 'CmpTableFilter',
  
  props: {
    modelValue: {
      type: Object as () => FilterValue,
      required: true
    },
    filterOptions: {
      type: Array as () => Array<{ value: string; title: string; symbol: string }>,
      default: () => [
        { value: 'eq', title: 'filter.equal', symbol: '=' },
        { value: 'lt', title: 'filter.lessThan', symbol: '<' },
        { value: 'lte', title: 'filter.lessThanOrEqual', symbol: '≤' },
        { value: 'gt', title: 'filter.greaterThan', symbol: '>' },
        { value: 'gte', title: 'filter.greaterThanOrEqual', symbol: '≥' },
        { value: 'ne', title: 'filter.notEqual', symbol: '≠' },
        { value: 'lk', title: 'filter.like', symbol: '*' }
      ]
    }
  },

  data() {
    return {
      filterValue: {
        value: '',
        operator: 'eq'
      } as FilterValue
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue: FilterValue) {
        this.filterValue = { ...newValue };
      }
    }
  },

  emits: ['update:modelValue', 'filter'],

  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      this.filterValue.value = target.value;
      this.$emit('update:modelValue', this.filterValue);
    },

    handleFilter() {
      this.$emit('filter', this.filterValue);
      this.$emit('update:modelValue', this.filterValue);
    }
  }
});
</script>