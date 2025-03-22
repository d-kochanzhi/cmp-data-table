# cmp-table

## _Vue 3 Data Table Component_

cmp-table - это настраиваемая таблица данных для Vue 3 с поддержкой TypeScript.

## Демо

[Онлайн демо](https://d-kochanzhi.github.io/cmp-data-table/)

## Возможности

- Сортировка данных
- Группировка строк
- Раскрывающиеся строки
- Фиксированные заголовки
- Фиксированные колонки
- Глобальный поиск
- Фильтрация по колонкам
- Пагинация

## Установка

```sh
npm install cmp-data-table
```

## Использование

```vue
<template>
  <cmp-table
    :items="items"
    :headers="headers"
    :view-options="viewOptions"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CmpTable from 'cmp-data-table'



const items = ref<Item[]>([
  { team: 'dream team' }
])

const headers = ref<Header[]>([
  { 
    title: 'team', 
    field: 'team', 
    sortable: false, 
    filterable: false, 
    expandable: true 
  }
])

const viewOptions = ref<ViewOptions>({
  page: 1,
  rowsPerPage: 3,
  orderBy: { team: 'desc' },
  where: {}
})
</script>
```

## Props

### Основные props

| Имя | Тип | Пример |
| ------ | ------ | ------ |
| items | PropType<Item[]> | ```const items = ref<Item[]>([{ team: 'dream team'});``` |
| headers | PropType<Header[]> | ```const headers = ref<Header[]>([{ title: 'team', field: 'team', sortable: false, filterable:false, expandable: true }]);```|
| viewOptions | PropType<ViewOptions> | ```const options = ref<ViewOptions>({page: 1,rowsPerPage: 3,orderBy: { team: 'desc' }, where: {}, });```|

### Дополнительные props таблицы

| Имя | Тип | Описание |
| ------ | ------ | ------ |
| caption | string | Заголовок таблицы |
| searchPlaceholder | string | Плейсхолдер для глобального поиска |
| striped | boolean | Использовать чередующиеся строки |
| emptyMessage | string | Текст при отсутствии данных |
| hideFooter | boolean | Скрыть футер таблицы |
| hideHeader | boolean | Скрыть заголовок таблицы |
| itemsSelected | PropType<Item[]> \| null | Массив выбранных элементов |
| loading | boolean | Показывать индикатор загрузки |
| showIndex | boolean | Показывать индекс строки как первую колонку |
| tableClassName | string | CSS класс для таблицы |
| headerClassName | string | CSS класс для заголовка таблицы |
| scrollHeight | number | Высота таблицы в пикселях для включения прокрутки |
| scrollWidth | number | Ширина таблицы в пикселях для включения прокрутки |

## Слоты

### Слоты для колонок

| Имя шаблона | Описание |
| ------ | ------ |
| customize-headers | Полностью кастомный заголовок таблицы (THEAD) |
| header-prepend | Первый слот после THEAD |
| header-{YourFieldName} | Слот для колонки TH |
| header-append | Последний слот после всех строк в THEAD |

### Слоты для строк

| Имя шаблона | Описание |
| ------ | ------ |
| body-prepend | Первый слот в TBODY |
| expandable-row | Слот для раскрывающейся строки |
| item-index | Кастомизация ячейки индекса |
| item-{YourFieldName} | Слот для ячейки TD |
| empty-row | Слот для сообщения об отсутствии данных |
| body-append | Последний слот в TBODY |

## События

| Имя события | Описание |
| ------ | ------ |
| clickRow | Клик по строке |
| contextmenuRow | Клик правой кнопкой мыши по строке |

## Лицензия

MIT
