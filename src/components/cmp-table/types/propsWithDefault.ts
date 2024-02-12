import { PropType } from 'vue';
import { Item, TextDirection } from './cmp-table';

export default {
  caption: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search',
  },
  striped: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: 'No Available Data',
  },
  hideFooter: {
    type: Boolean,
    default: true,
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  itemsSelected: {
    type: Array as PropType<Item[]> | null,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  tableClassName: {
    type: String,
    default: '',
  },
  headerClassName: {
    type: String,
    default: '',
  },
  headerTextDirection: {
    type: String as PropType<TextDirection>,
    default: 'left',
  },
};
