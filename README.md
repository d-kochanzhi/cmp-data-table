# cmp-table (under construction)

## _vue 3 data table_

cmp-table is simple but cusomizable data table.

## Demo online

[here](https://d-kochanzhi.github.io/cmp-data-table/)

## Features

- sorting
- grouping
- row expanding
- fixed headers
- fixed columns
- global filtering
- column filtering
- pagination

## Installation

text

```sh
cd 
npm i
node app
```

## props

main props

| property name | type | sample |
| ------ | ------ | ------ |
| items | PropType<Item[]> |  ```const items = ref<Item[]>([{ team: 'dream team'});``` |
| headers | PropType<Header[]> | ```const headers = ref<Header[]>([{ title: 'team', field: 'team', sortable: false, filterable:false, expandable: true }]);```|
| viewOptions | PropType<ViewOptions> |  ```const options = ref<ViewOptions>({page: 1,rowsPerPage: 3,orderBy: { team: 'desc' }, where: {}, });```|

additional table props

| property name | type | description |
| ------ | ------ | ------ |
| caption | string | table caption |
| searchPlaceholder | string | global filter text placeholder |
| striped | boolean | use striped css class on rows |
|emptyMessage| string | no data text|
|hideFooter|boolean| hide table footer|
|hideHeader| boolean | hide table header|
|itemsSelected| PropType<Item[]> or null | array of selected items |
|loading|boolean| show loading spiner|
|showIndex|boolean| show row index as first column (autocalculated)|
|tableClassName| string| table css class|
|headerClassName|string| table header css class|
|scrollHeight|number| table height in pixel. to enable scrolling|
|scrollWidth|number| table width in pixel. to enable scrolling|

## slots

column slots

| template name | description |
| ------ | ------ |
| customize-headers | fully custom table header (custom THEAD) |
| header-prepend | first slot after THEAD |
| header-{YourFieldName} | TH column slot |
| header-append | last slot after all rows in THEAD |

row slots

| template name | description |
| ------ | ------ |
| body-prepend | first slot in TBODY  |
| expandable-row| expandable row slot|
| item-index| customize index cell |
| item-{YourFieldName}| td cell slot|
| empty-row| empty message row slot|
| body-append| last slot in TBODY|

## events

| event name | description |
| ------ | ------ |
|clickRow| click on row|
|contextmenuRow| context menu click|

## License

MIT
