<template>
  <div class="server-view">
    <cmpTable
      ref="tableRef"
      :caption="`This is a table`"
      :search-placeholder="`Search`"
      show-index
      :hideFooter="false"
      :headers="headers"
      v-model:items="items"
      :view-options="options"
      :server-options="serverOptions"
      :fetch-function="fetchFunction" 
      >     
    </cmpTable>
  </div>
</template>

<script lang="ts" setup>
import cmpTable from '@/components/cmp-table/cmp-table.vue';
import { Header, Item, ViewOptions, ServerOptions, FetchFunction } from '@/components/cmp-table/types/cmp-table';
import { ref, onMounted } from 'vue';

const options = ref<ViewOptions>({
  page: 1,
  rowsPerPage: 3,
  orderBy: { title: 'desc' },
  where: {},
});

const tableRef = ref<InstanceType<typeof cmpTable>>();
const items = ref<Item[]>([]);

const serverOptions = ref<ServerOptions>({
  enabled: true,
});


const fetchFunction = ref<FetchFunction>((params:ViewOptions) => {
  return fetch('http://localhost:3000/posts?_page=' + params.page + '&_per_page=' + params.rowsPerPage)
    .then((res) => res.json())
    .then((data) => {
    return {
      items: data.data,
      total: data.items
    };
  });
});


const headers = ref<Header[]>([
  { title: 'id', field: 'id', width: 50  },
  { title: 'title', field: 'title'}, 
]);

 
 onMounted(() => {
  tableRef.value?.loadServerData();
 });

</script>

 
