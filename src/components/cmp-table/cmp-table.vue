<template>
  <div class="cmp-table" :class="[tableClassName]">
    <div v-if="loading" class="loading-overlay">
      <slot v-if="slots['loading']" name="loading"></slot>
      <template v-else>
        <span class="loader"></span>
      </template>
    </div>
    <div class="cmp-table__filter">
      <slot
        v-bind="{
          filterModel: searchInput,
          filterCallback: updateGlobalFilter,
        }"
        name="search-global">
        <i class="icon-filter"></i>
        <input
          class="input-filter"
          :placeholder="searchPlaceholder"
          v-model="searchInput"
          @keydown.enter="searchChange" />
      </slot>
    </div>

    <div class="cmp-table__main">
      <div
        :class="[
          {
            virtualscroller: scrollHeight > 0 || scrollWidth > 0,
            vertical: scrollHeight > 0,
            horizontal: scrollWidth > 0,
          },
        ]"
        :style="[
          {
            height: scrollHeight > 0 ? scrollHeight + `px` : '100%',
            width: scrollWidth > 0 ? scrollWidth + `px` : '100%',
          },
        ]">
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
            <slot
              name="header-prepend"
              v-bind="{
                items: rowsForRender,
                headers: headersForRender,
              }" />
            <tr>
              <th v-if="showIndex">#</th>
              <th
                v-for="(header, index) in headersForRender"
                :key="index"
                :class="[
                  {
                    sortable: valueOrDefault(header.sortable, true),
                    filterable: valueOrDefault(header.filterable, true),
                  },
                  getColSortStyle(header),
                ]"
                @click="
                  valueOrDefault(header.sortable, true)
                    ? updateViewOptionsOrderBy(header.field)
                    : null
                ">
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
                    v-if="valueOrDefault(header.sortable, true)"
                    :key="viewOptionsComputed.orderBy[header.field] ?? 'none'"
                    class="sortType-icon"
                    :class="getColSortStyle(header)"></i>
                </span>
              </th>
            </tr>
            <slot
              name="header-append"
              v-bind="{
                items: rowsForRender,
                headers: headersForRender,
              }" />
            <tr>
              <th v-if="showIndex"></th>
              <th
                v-for="(header, index) in headersForRender"
                :key="index"
                class="header-quickFilter">
                <div v-if="valueOrDefault(header.filterable, true)">
                  <input
                    class="text-filter"
                    type="text"
                    v-model="quickFilters[header.field]"
                    @keydown.enter="
                      updateQuickFilter(header.field, quickFilters[header.field])
                    " />
                </div>
              </th>
            </tr>
          </thead>
          <tbody :class="{ 'row-striped': striped }">
            <slot
              name="body-prepend"
              v-bind="{
                items: rowsForRender,
                headers: headersForRender,
              }" />
            <template
              v-if="expandableRowsRef.length > 0"
              v-for="(group, group_index) in expandableRowsRef"
              :key="group_index">
              <tr class="expandable-row">
                <td colspan="1000">
                  <div class="expandable__item" @click.stop="clickExpandableRow(group)">
                    <i
                      class="expand-icon"
                      :class="[{ expanding: expandableRowsState.get(group) == 1 }]"></i>
                    <slot
                      :name="`expandable-row`"
                      v-bind="{
                        group: group,
                      }">
                      <span>{{ group }}</span>
                    </slot>
                  </div>
                </td>
              </tr>
              <template
                v-if="expandableRowsState.get(group) == 1"
                v-for="(item, row_index) in rowsForExpand(group)"
                :key="row_index">
                <cmpTableBodyRow
                  :view-options="viewOptionsComputed"
                  :headers="headersForRender"
                  :item="item"
                  :show-index="showIndex"
                  :rowIndex="row_index"
                  @click-row="clickRow"
                  @contextmenu-row="contextMenuRow">
                  <template v-for="(_, name) in $slots" #[name]="slotData">
                    <slot :name="name" v-bind="slotData" />
                  </template>
                </cmpTableBodyRow>
              </template>
            </template>
            <template v-else v-for="(item, row_index) in rowsForRender" :key="row_index">
              <cmpTableBodyRow
                :view-options="viewOptionsComputed"
                :headers="headersForRender"
                :item="item"
                :show-index="showIndex"
                :rowIndex="row_index"
                @click-row="clickRow"
                @contextmenu-row="contextMenuRow">
                <template v-for="(_, name) in $slots" #[name]="slotData">
                  <slot :name="name" v-bind="slotData" />
                </template>
              </cmpTableBodyRow>
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
import cmpTableBodyRow from './cmp-table-body-row.vue';
import { PropType, computed, useSlots, toRefs, ref, reactive } from 'vue';
import { Item, Header, ViewOptions } from './types/cmp-table';
import propsWithDefault from './types/propsWithDefault';
import './scss/style.scss';

import useItems from './useUtils/useItems';
import useEmits from './useUtils/useEmits';
import useViewOptions from './useUtils/useViewOptions';
import usePaging from './useUtils/usePaging';
import { valueOrDefault } from './useUtils/useUtils';

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

const { viewOptions, headers, items, scrollHeight, scrollWidth } = toRefs(props);

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

/* expandable  */
const expandableRowsRef = ref([]);
const expandableRowsState = reactive<Map<string, number>>(new Map());

const clickExpandableRow = (group: string) => {
  expandableRowsState.set(
    group,
    expandableRowsState.has(group) ? expandableRowsState.get(group)! * -1 : 1,
  );
};

/* global filter */
const searchInput = ref('');
const searchChange = () => updateViewOptionsWhere('_g', searchInput.value);
const updateGlobalFilter = (event: Event) => {
  searchInput.value = (event.target as HTMLInputElement).value;
  searchChange();
};

/* quick filter */

const quickFilters = reactive<{ [key: string]: any }>({});
const updateQuickFilter = (field: string, value: string) =>
  updateViewOptionsWhere(field, value);

/* render  */
const headersForRender = computed(() => {
  console.log('headersForRender');
  return headers.value.filter((i) => !i.hidden);
});

const rowsForRender = computed(() => {
  console.log('rowsForRender');
  return getItemsForRender(items.value, totalCountRef, expandableRowsRef);
});

/**
 * get items by expandable group name
 */
const rowsForExpand = (groupValue: string) => {
  if (expandableRowsRef.value.length < 0) return [];

  let groupFields = headers.value.filter((c) => c.expandable === true);

  return rowsForRender.value.filter(
    (item) => groupValue == generateColumnContent(groupFields[0].field, item),
  );
};
/*---------------- */

defineExpose({
  // expose main functionality
  rowsForExpand,
  updateQuickFilter,
});
</script>

<style>
:root {
  /* root */
  --cmp-table-background-color: #fff;

  /*scroll-bar*/
  --cmp-table-scrollbar-track-color: #fff;
  --cmp-table-scrollbar-color: #fff;
  --cmp-table-scrollbar-thumb-color: #c1c1c1;
  --cmp-table-scrollbar-corner-color: #fff;

  /*header*/
  --cmp-table-header-font-color: #373737;

  /*row*/
  --cmp-table-row-even-color: ghostwhite;

  /* pagination */
  --active-page-color: #0e9d6e;
}
</style>
