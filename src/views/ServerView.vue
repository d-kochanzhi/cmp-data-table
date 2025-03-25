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


const fetchFunction = ref<FetchFunction>(async (params:ViewOptions) => {
 
  const url = new URL('http://localhost:3000/posts');

  url.searchParams.append('_page', params.page.toString());
  url.searchParams.append('_per_page', params.rowsPerPage.toString());
  
  if(params.orderBy) {
    const sortParams = Object.entries(params.orderBy || {})
    .map(([field, direction]) => direction === 'desc' ? `-${field}` : field)
    .join(',');
  }

  // Добавляем параметры фильтрации
  if (params.where) {
    Object.entries(params.where).forEach(([field, filterValue]) => {
      if (filterValue && filterValue.value && filterValue.value.trim() !== '') {
        url.searchParams.append(`${field}_${filterValue.operator}`, filterValue.value);
      }
    });
  }

  // Функция для создания случайной задержки
  const randomDelay = () => {
    const min = 100; // 100 мсекунды
    const max = 3000; // 3 секунд
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Добавляем случайную задержку перед запросом
  await new Promise(resolve => setTimeout(resolve, randomDelay()));

  const response = await fetch(url.toString());
  const data = await response.json();
  
  return {
    items: data.data,
    total: data.items
  };
});


const headers = ref<Header[]>([
  { title: 'id', field: 'id', width: 50  },
  { title: 'category', field: 'category', width: 100 },
  { title: 'title', field: 'title'}, 
]);

 
 onMounted(() => {
  tableRef.value?.loadServerData();
 });

</script>

 
