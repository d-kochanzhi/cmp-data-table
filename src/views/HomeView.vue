<template>
  <div class="about">
    <cmpTable
      locale="en"
      :caption="`This is a table`"
      :search-placeholder="`Search`"
      show-index
      :hideFooter="false"
      :headers="headers"
      :items="items"
      :view-options="options"
      @click-row="rowClicked">
      <template #search-global="{ filterModel, filterCallback }">
        <div class="search-container">
          <span>Custom global search template</span>
          <input
            type="text"
            class="input-filter"
            :value="filterModel"
            @keydown.enter="filterCallback(($event.target as HTMLInputElement).value)"
            placeholder="value" />
        </div>
      </template>
      <template #header-player="slotProps">
        <span> Column {{ slotProps.title }}</span>
      </template>
      <template #item-player="slotProps">
        <span> Player {{ slotProps.item[slotProps.header.field] }}</span>
      </template>
      <template #expandable-row="slotProps"> team {{ slotProps.group }} </template>
    </cmpTable>
  </div>
</template>

<script lang="ts" setup>
import cmpTable from '@/components/cmp-table/cmp-table.vue';
import { Header, Item, ViewOptions } from '@/components/cmp-table/types/cmp-table';
import { ref } from 'vue';

const options = ref<ViewOptions>({
  page: 1,
  rowsPerPage: 3,
  orderBy: { team: 'desc' },
  where: {},
});

const headers = ref<Header[]>([
  { title: 'player', field: 'player', width: 250 },
  { title: 'team', field: 'team', sortable: true, expandable: true },
  { title: 'number', field: 'number' },
  { title: 'indicator', field: 'indicator.weight' },
  { title: 'country', field: 'country' },
]);

const items = ref<Item[]>([
  {
    player: 'Stephen Curry',
    team: 'GSW',
    number: 30,
    indicator: { height: '6-9', weight: 250 },
    country: 'USA',
  },
  {
    player: 'Lebron James',
    team: 'LAL',
    number: 6,
    indicator: { height: '6-9', weight: 777 },
    country: 'USA',
  },
  {
    player: 'Stuard Joe',
    team: 'Pioner',
    number: 12,
    indicator: { height: '8', weight: 250 },
    country: 'USA',
  },
  {
    player: 'Jon Joe',
    team: 'Losted',
    number: 2,
    indicator: { height: '8', weight: 250 },
    country: 'Russia',
  },
]);

const rowClicked = (item: Item, event: Event) => {
  console.log(item, event);
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}


</style>
