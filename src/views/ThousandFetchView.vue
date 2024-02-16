<template>
  <div class="Fetch">
    <cmpTable
      ref="tableRef"
      show-index
      :headers="headers"
      :items="items"
      :view-options="options"
      striped
      :loading="loading">
      <template #header-prepend>
        <tr>
          <th></th>
          <th colspan="2" style="background-color: ghostwhite">Пользователь</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </template>
    </cmpTable>
  </div>
</template>

<script lang="ts" setup>
import cmpTable from '@/components/cmp-table/cmp-table.vue';
import { Header, Item, ViewOptions } from '@/components/cmp-table/types/cmp-table';
import { onMounted, ref } from 'vue';

const tableRef = ref<InstanceType<typeof cmpTable>>();

const loading = ref<boolean>(false);

const options = ref<ViewOptions>({
  page: 1,
  rowsPerPage: 50,
  orderBy: {},
  where: {},
});

const headers = ref<Header[]>([
  { title: 'name', field: 'firstname' },
  { title: 'last', field: 'yourlastname' },
  { title: 'email', field: 'email' },
  { title: 'city', field: 'city' },
  { title: 'date', field: 'date_value' },
]);

const items = ref<Item[]>([]);

onMounted(() => {
  loading.value = true;
  fetch('/data/1000.json', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => (items.value = [...json]))
    .then(() => (loading.value = false));
});
</script>
