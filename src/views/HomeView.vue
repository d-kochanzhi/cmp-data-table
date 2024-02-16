<template>
  <div class="about">
    <cmpTable
      :caption="`Это таблица`"
      :search-placeholder="`Поиск`"
      show-index
      :hideFooter="false"
      :headers="headers"
      :items="items"
      :view-options="options"
      @click-row="rowClicked">
      <template #search-global="{ filterModel, filterCallback }">
        <span>Поиск по таблице</span>
        <input
          type="text"
          :value="filterModel"
          @keydown.enter="filterCallback($event)"
          placeholder="Введите значение" />
      </template>
      <template #header-player="slotProps">
        <span> Колонка {{ slotProps.title }}</span>
      </template>
      <template #item-player="slotProps">
        <span> Игрок {{ slotProps.item[slotProps.header.field] }}</span>
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
  items.value.push({
    player: 'New Joe',
    team: 'Pioner',
    number: 0,
    indicator: { height: '0', weight: 0 },
    country: 'RUS',
  });
};
</script>
