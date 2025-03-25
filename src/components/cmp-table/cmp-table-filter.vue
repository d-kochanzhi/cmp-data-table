<template>
  <div class="filter-container">
    <select v-model="filterValue.operator" class="operator-select" @change="handleFilter">
      <option value="eq">=</option>
      <option value="lt">&lt;</option>
      <option value="lte">&le;</option>
      <option value="gt">&gt;</option>
      <option value="gte">&ge;</option>
      <option value="ne">&ne;</option>
      <option value="lk">*</option>
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