<template>
  <input
    class="text-filter"
    type="text"
    :value="modelValue"
    @input="handleInput"
    @keydown.enter="handleFilter" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CmpTableFilter',
  
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },

  emits: ['update:modelValue', 'filter'],

  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit('update:modelValue', target.value);
    },

    handleFilter() {
      this.$emit('filter', this.modelValue);
    }
  }
});
</script> 