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
      <template #item-age="slotProps">
        <span> {{ slotProps.item[slotProps.header.field] }} years old</span>
      </template>
      <template #item-isAdult="slotProps">
        <span> {{ slotProps.item[slotProps.header.field] ? 'Adult' : 'Child' }}</span>
      </template>
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
  { title: 'weight ', field: 'indicator.weight' },
  { title: 'age (number)', field: 'age', dataType: 'number' },
  { title: 'birth (date)', field: 'birth', dataType: 'date' },
  { title:'isAdult (bool)', field: 'isAdult', dataType: 'boolean'},
]);

const items = ref<Item[]>([
  {
    player: 'Stephen Curry',
    team: 'GSW',
    indicator: { height: '6-9', weight: 250 },
    age: 30,
    birth: '2009-03-14',
    isAdult: false,
  },
  {
    player: 'Lebron James',
    team: 'LAL',
    indicator: { height: '6-9', weight: 777 },
    age: 35,
    birth: '1984-12-30',
    isAdult: true,
  },
  {
    player: 'Stuard Joe',
    team: 'Pioner',
    indicator: { height: '8', weight: 250 },
    age: 30,
    birth: '1988-03-14',
    isAdult: true,
  },
  { 
    player: 'Jon Joe',
    team: 'Losted',
    indicator: { height: '8', weight: 250 },
    age: 30,
    birth: '2022-03-14',
    isAdult: false,
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
