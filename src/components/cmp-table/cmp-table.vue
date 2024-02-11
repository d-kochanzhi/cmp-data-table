<template>
  <div class="cmp-table" :class="[tableClassName]">
    <div class="cmp-table__main">
      <div class="filter__global">
        <slot
          v-bind="{
            filterModel: searchInput,
            filterCallback: updateGlobalFilter,
          }"
          name="search-global">
          <input
            :placeholder="searchPlaceholder"
            v-model="searchInput"
            @keydown.enter="searchChange" />
        </slot>
      </div>
      <table>
        <caption v-if="props.caption">
          {{
            props.caption
          }}
        </caption>
        <colgroup>
          <col v-if="showIndex" />
          <col
            v-for="(header, index) in headersForRender"
            :key="index"
            :style="getColStyle(header)" />
        </colgroup>
        <slot v-if="slots['customize-headers']" name="customize-headers" />
        <thead v-else-if="headersForRender.length && !props.hideHeader">
          <tr>
            <th v-if="showIndex">#</th>
            <th
              v-for="(header, index) in headersForRender"
              :key="index"
              :class="[
                {
                  sortable: header.sortable,
                },
                getColSortStyle(header),
              ]"
              @click="header.sortable ? updateViewOptionsOrderBy(header.field) : null">
              <span class="header" :class="`direction-${headerTextDirection}`">
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
                  {{ header.title }}
                </span>
                <i
                  v-if="header.sortable"
                  :key="viewOptionsComputed.orderBy[header.field] ?? 'none'"
                  class="sortType-icon"
                  :class="getColSortStyle(header)"></i>
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
          <template v-for="(item, row_index) in rowsForRender" :key="row_index">
            <tr
              :class="[{ 'even-row': (row_index + 1) % 2 === 0 }]"
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
              <td v-if="showIndex">
                <slot
                  :name="`item-index`"
                  v-bind="{
                    item: item,
                  }">
                  {{
                    row_index +
                    1 +
                    (viewOptionsComputed.page - 1) * viewOptionsComputed.rowsPerPage
                  }}</slot
                >
              </td>
              <td v-for="(column, col_index) in headersForRender" :key="col_index">
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
        <slot v-if="slots['customize-footer']" name="customize-footer" />
        <tfoot v-else-if="!props.hideFooter">
          <tr>
            <th v-if="showIndex"></th>
            <td v-for="(column, col_index) in headersForRender" :key="col_index">
              <slot
                v-if="slots[`footer-item-${column.field}`]"
                :name="`footer-item-${column.field}`"
                v-bind="{
                  items: rowsForRender,
                  header: column,
                }" />
              <slot
                v-else-if="slots[`footer-item-${column.field.toLowerCase()}`]"
                :name="`footer-item-${column.field.toLowerCase()}`"
                v-bind="{
                  items: rowsForRender,
                  header: column,
                }" />
              <template v-else> </template>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <nav class="cmp-table__paginator">
      <ul class="pagination">
        <li class="page-item">
          <button
            class="page-link"
            :disabled="isFirstPage"
            @click.stop="updateViewOptionsPage(1)">
            «
          </button>
        </li>
        <li class="page-item">
          <button
            :disabled="!canGoBackPage"
            class="page-link"
            @click.stop="updateViewOptionsPage(viewOptionsComputed.page - 1)">
            ‹
          </button>
        </li>
        <!----><!--[-->
        <li class="page-item" v-for="page in getPageListForRender">
          <button
            class="page-link"
            :disabled="page == viewOptionsComputed.page"
            :class="[{ active: page == viewOptionsComputed.page }]"
            @click.stop="updateViewOptionsPage(page)">
            {{ page }}
          </button>
        </li>
        <!--]--><!---->
        <li class="page-item">
          <button
            :disabled="!canGoNextPage"
            class="page-link"
            @click.stop="updateViewOptionsPage(viewOptionsComputed.page + 1)">
            ›
          </button>
        </li>
        <li class="page-item">
          <button
            :disabled="isLastPage"
            class="page-link"
            @click.stop="updateViewOptionsPage(lastPage)">
            »
          </button>
        </li>
      </ul>
    </nav>
  </div>

  total items {{ totalCountRef }} <br />
  total pages {{ lastPage }} <br />
  Options {{ viewOptionsComputed }}
</template>

<script setup lang="ts">
import { PropType, computed, useSlots, toRefs, ref } from 'vue';
import { Item, Header, ViewOptions } from './types/cmp-table';
import propsWithDefault from './types/propsWithDefault';
import './scss/style.scss';

import useItems from './useUtils/useItems';
import useEmits from './useUtils/useEmits';
import useViewOptions from './useUtils/useViewOptions';
import usePaging from './useUtils/usePaging';

// slot
const slots = useSlots();

const emits = defineEmits([
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

const totalCountRef = ref(0);

const { viewOptions, headers, items } = toRefs(props);

const { clickRow, contextMenuRow } = useEmits(emits);
const {
  viewOptionsComputed,
  updateViewOptionsPage,
  updateViewOptionsOrderBy,
  updateViewOptionsRowsPerPage,
  updateViewOptionsWhere,
} = useViewOptions(viewOptions, emits);

const { generateColumnContent, getColStyle, getColSortStyle, getItemsForRender } =
  useItems(viewOptionsComputed, headers);

const {
  isFirstPage,
  isLastPage,
  canGoBackPage,
  canGoNextPage,
  lastPage,
  getPageListForRender,
} = usePaging(viewOptionsComputed, totalCountRef);

/* global filter */
const searchInput = ref('');
const searchChange = () => updateViewOptionsWhere(searchInput.value);
const updateGlobalFilter = (event: Event) => {
  searchInput.value = (event.target as HTMLInputElement).value;
  searchChange();
};
/*---------------- */

const headersForRender = computed(() => {
  console.log('headersForRender');
  return headers.value.filter((i) => !i.hidden);
});

const rowsForRender = computed(() => {
  console.log('rowsForRender');
  return getItemsForRender(items.value, totalCountRef);
});
</script>

<style>
:root {
  /*scroll-bar*/
  --cmp-table-scrollbar-track-color: #fff;
  --cmp-table-scrollbar-color: #fff;
  --cmp-table-scrollbar-thumb-color: #c1c1c1;
  --cmp-table-scrollbar-corner-color: #fff;

  /*header*/
  --cmp-table-header-font-color: #373737;

  /*row*/
  --cmp-table-row-even-color: #dddddd;

  /* pagination */
  --active-page-color: #0e9d6e;
}
</style>
