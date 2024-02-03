import { PropType } from 'vue';
import { Item } from './cmp-table';

export default {
  caption: {
    type: String,
    default: '',
  },
  alternating: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: 'No Available Data',
  },
  hideFooter: {
    type: Boolean,
    default: false,
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
};
