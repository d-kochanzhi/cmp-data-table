<template>
  <div class="Fetch">
    <cmpTable
      show-index
      :headers="headers"
      :items="items"
      :view-options="options"
      :striped="true"
      :loading="loading">
    </cmpTable>
  </div>
</template>

<script lang="ts" setup>
import cmpTable from '@/components/cmp-table/cmp-table.vue';
import { Header, Item, ViewOptions } from '@/components/cmp-table/types/cmp-table';
import { onMounted, ref } from 'vue';

const loading = ref<boolean>(false);

const options = ref<ViewOptions>({
  page: 1,
  rowsPerPage: 5,
  orderBy: {},
  where: {},
});

const headers = ref<Header[]>([
  { title: 'name', field: 'name', sortable: true, filterable: true },
  { title: 'username', field: 'username', sortable: true, filterable: true },
  { title: 'email', field: 'email', sortable: true, filterable: true },
  { title: 'website', field: 'website', sortable: true, filterable: true },
  { title: 'address', field: 'address.city', sortable: true, filterable: true },
]);

const items = ref<Item[]>([]);

onMounted(() => {
  loading.value = true;
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => (items.value = [...json]))
    .then(() => (loading.value = false));
});
</script>
