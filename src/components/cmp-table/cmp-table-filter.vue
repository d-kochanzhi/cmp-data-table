<template>
  <div class="filter-container">
    <select v-model="filterValue.operator" class="operator-select" @change="handleFilter">
      <option v-for="option in filterOptions" 
              :key="option.value" 
              :value="option.value" 
              :title="option.title">
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
        { value: 'eq', title: 'Equal', symbol: '=' },
        { value: 'lt', title: 'Less Than', symbol: '<' },
        { value: 'lte', title: 'Less Than or Equal', symbol: '≤' },
        { value: 'gt', title: 'Greater Than', symbol: '>' },
        { value: 'gte', title: 'Greater Than or Equal', symbol: '≥' },
        { value: 'ne', title: 'Not Equal', symbol: '≠' },
        { value: 'lk', title: 'Like', symbol: '*' }
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