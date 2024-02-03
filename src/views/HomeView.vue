<template>
  <div class="about">
    <h1>This is home page</h1>

    <cmpTable
      :caption="`this is a table`"
      :headers="headers"
      :items="items"
      :view-options="options"
      @click-row="rowClicked">
      <template #header-player="slotProps">
        <span> Колонка {{ slotProps.title }}</span>
      </template>
      <template #item-player="slotProps">
        <span> Игрок {{ slotProps.item[slotProps.header.field] }}</span>
      </template>
    </cmpTable>
  </div>
</template>

<script lang="ts" setup>
import cmpTable from '@/components/cmp-table/cmp-table.vue';
import { Header, Item, ViewOptions } from '@/components/cmp-table/types/cmp-table';

const options: ViewOptions = {
  page: 1,
  rowsPerPage: 25,
  orderBy: { team: 'desc' },
  where: {},
};

const headers: Header[] = [
  { title: 'player', field: 'player', width: 150, identity: true },
  { title: 'team', field: 'team', sortable: true },
  { title: 'number', field: 'number' },
  { title: 'indicator', field: 'indicator.weight' },
  { title: 'country', field: 'country' },
];

const items: Item[] = [
  {
    player: 'Stephen Curry',
    team: 'GSW',
    number: 30,
    indicator: { height: '6-9', weight: 250 },
    lastAttended: 'Davidson',
    country: 'USA',
  },
  {
    player: 'Lebron James',
    team: 'LAL',
    number: 6,
    indicator: { height: '6-9', weight: 777 },
    lastAttended: 'St. Vincent-St. Mary HS (OH)',
    country: 'USA',
  },
];

const rowClicked = (item: Item, event: Event) => {
  console.log('row clicked!');
};
</script>
