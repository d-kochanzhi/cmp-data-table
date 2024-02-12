<template>
  <tr
    :class="[{ 'even-row': (rowIndex + 1) % 2 === 0 }]"
    @click="
      ($event) => {
        clickRow(item, 'single', $event);
      }
    "
    @dblclick="
      ($event) => {
        clickRow(item, 'double', $event);
      }
    "
    @contextmenu="
      ($event) => {
        $event.preventDefault();
        contextMenuRow(item, $event);
      }
    ">
    <td v-if="showIndex">
      <slot
        :name="`item-index`"
        v-bind="{
          item: item,
        }">
        {{ indexCalculated }}</slot
      >
    </td>
    <td v-for="(column, col_index) in headers" :key="col_index">
      <slot
        v-if="slots[`item-${column.field}`]"
        :name="`item-${column.field}`"
        v-bind="{
          item: item,
          header: column,
        }" />
      <slot
        v-else-if="slots[`item-${column.field.toLowerCase()}`]"
        :name="`item-${column.field.toLowerCase()}`"
        v-bind="{
          item: item,
          header: column,
        }" />
      <template v-else>
        {{ generateColumnContent(column.field, item) }}
      </template>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { PropType, computed, useSlots, toRefs, ref } from 'vue';
import { Item, Header, ViewOptions } from './types/cmp-table';
import useEmits from './useUtils/useEmits';
import useItems from './useUtils/useItems';

// slot
const slots = useSlots();

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
  viewOptions: {
    type: Object as PropType<ViewOptions>,
    required: true,
  },
  showIndex: {
    type: Boolean,
    required: true,
  },
  rowIndex: {
    type: Number,
    required: true,
  },
});

const { viewOptions, headers } = toRefs(props);

const emits = defineEmits([
  'clickRow',
  'contextmenuRow',
  'update:viewOptions',
  'update:items',
  'update:headers',
]);

const { clickRow, contextMenuRow } = useEmits(emits);

const { generateColumnContent } = useItems(viewOptions, headers);

const indexCalculated = computed(() => {
  return isNaN(props.item['_index'])
    ? props.rowIndex + 1 + (props.viewOptions.page - 1) * props.viewOptions.rowsPerPage
    : props.item['_index'] + 1;
});
</script>
