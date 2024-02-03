<template>
  <div class="cmp-table" :class="[tableClassName]">
    <div class="cmp-table__main">
      <table>
        <caption v-if="props.caption">
          {{
            props.caption
          }}
        </caption>
        <colgroup>
          <col
            v-for="(header, index) in headersForRender"
            :key="index"
            :style="getColStyle(header)" />
        </colgroup>
        <slot v-if="slots['customize-headers']" name="customize-headers" />
        <thead v-else-if="headersForRender.length && !props.hideHeader">
          <tr>
            <th
              v-for="(header, index) in headersForRender"
              :key="index"
              :class="[
                {
                  sortable: header.sortable,
                },
                getColSortStyle(header, viewOptionsComputed),
              ]"
              @click="header.sortable ? updateViewOptionsOrderBy(header.field) : null">
              {{ viewOptionsComputed.orderBy[header.field] }}
              <span class="header">
                <slot
                  v-if="slots[`header-${header.field}`]"
                  :name="`header-${header.field}`"
                  v-bind="header" />
                <slot
                  v-else-if="slots[`header-${header.field.toLowerCase()}`]"
                  :name="`header-${header.field.toLowerCase()}`"
                  v-bind="header" />
                <slot v-else-if="slots['header']" name="header" v-bind="header" />
                <span v-else class="header-text">
                  {{ header.field }}
                </span>
                <i
                  v-if="header.sortable"
                  :key="viewOptionsComputed.orderBy[header.field] ?? 'none'"
                  class="sortType-icon"
                  :class="getColSortStyle(header, viewOptionsComputed)"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody :class="{ 'row-alternation': alternating }">
          <slot
            name="body-prepend"
            v-bind="{
              items: rowsForRender,
              headers: headersForRender,
            }" />
          <template v-for="(item, index) in rowsForRender" :key="index">
            <tr
              :class="[{ 'even-row': (index + 1) % 2 === 0 }]"
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
                  contextMenuRow(item, $event);
                }
              ">
              <td v-for="(column, i) in headersForRender" :key="i">
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
          <slot
            name="body-append"
            v-bind="{
              items: rowsForRender,
              headers: headersForRender,
            }" />
        </tbody>
      </table>
      {{ viewOptionsComputed }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PropType,
  computed,
  defineProps,
  defineEmits,
  useSlots,
  watch,
  toRefs,
} from 'vue';
import { Item, Header, ViewOptions } from './types/cmp-table';
import propsWithDefault from './types/propsWithDefault';
import './scss/style.scss';

import useItems from './useUtils/useItems';
import useEmits from './useUtils/useEmits';
import useViewOptions from './useUtils/useViewOptions';

// slot
const slots = useSlots();

const emits = defineEmits([
  'updateSort',
  'clickRow',
  'contextmenuRow',
  'update:viewOptions',
  'update:items',
  'update:headers',
]);

const props = defineProps({
  ...propsWithDefault,
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
  viewOptions: {
    type: Object as PropType<ViewOptions>,
    required: false,
    default: () => {
      return {
        page: 1,
        rowsPerPage: 25,
        orderBy: {},
        where: {},
      };
    },
  },
});

const { viewOptions, headers, items } = toRefs(props);

const { generateColumnContent, getColStyle, getColSortStyle, getPagedItems } = useItems();
const { clickRow, contextMenuRow } = useEmits(emits);
const {
  viewOptionsComputed,
  updateViewOptionsPage,
  updateViewOptionsOrderBy,
  updateViewOptionsRowsPerPage,
} = useViewOptions(viewOptions, emits);

const headersForRender = computed(() => {
  console.log('headersForRender');
  return headers.value.filter((i) => !i.hidden);
});

const rowsForRender = computed(() => {
  console.log('rowsForRender');
  return getPagedItems(items.value, viewOptions.value);
});

watch(
  viewOptions,
  (newX) => {
    console.log(`x is ${newX}`);
  },
  { deep: true },
);

watch(
  props.viewOptions,
  (newX) => {
    console.log(`y is ${newX}`);
  },
  { deep: true },
);

watch(
  viewOptionsComputed,
  (newX) => {
    console.log(`z is ${newX}`);
  },
  { deep: true },
);
</script>

<style>
:root {
  /*scroll-bar*/
  --cmp-table-scrollbar-track-color: #fff;
  --cmp-table-scrollbar-color: #fff;
  --cmp-table-scrollbar-thumb-color: #c1c1c1;
  --cmp-table-scrollbar-corner-color: #fff;

  --cmp-table-header-font-color: #373737;
}
</style>
