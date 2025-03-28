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
          <th colspan="2" style="background-color: ghostwhite">User</th>
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
  rowsPerPage: 5,
  orderBy: {},
  where: {},
});

const headers = ref<Header[]>([
  { title: 'name', field: 'name' },
  { title: 'username', field: 'username' },
  { title: 'email', field: 'email' },
  { title: 'website', field: 'website', sortable: false, filterable: false },
  { title: 'address', field: 'address.city' },
]);

const items = ref<Item[]>([]);

onMounted(() => {
  loading.value = true;
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => (items.value = [...json]))
    .then(() => (loading.value = false))
    .catch((error) => {
      console.error('Error fetching data:', error);     
    }).finally(() => {
      loading.value = false;
    });
});
</script>
