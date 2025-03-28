/* eslint-disable @typescript-eslint/no-explicit-any */

export type SortType = 'asc' | 'desc' | 'none';

export type DataType = 'number' | 'string' | 'date' | 'boolean';

export type Header = {
  title: string;
  field: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: FilterOptions;
  hidden?: boolean;
  width?: number;
  expandable?: boolean;
  dataType?: DataType;
};

export type Item = Record<string, any>;

export type FilterOperator = 'eq' | 'lt' | 'lte' | 'gt' | 'gte' | 'ne' | 'lk';

export type FilterValue = {
  value: string;
  operator: FilterOperator;
};

export type FilterOptions = {
  showOperatorSelect?: boolean;

};
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  showOperatorSelect: true,
};

export type ViewOptions = {
  page: number;
  rowsPerPage: number;
  orderBy: {
    [key: string]: SortType;
  };
  where: {
    [key: string]: FilterValue;
  };
};

export const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  page: 1,
  rowsPerPage: 25,
  orderBy: {},
  where: {},
};

export type ServerOptions = {
  enabled: boolean;
  url?: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  params?: Record<string, any>;
};

export const DEFAULT_SERVER_OPTIONS: ServerOptions = {
  enabled: false,
  url: '',
  method: 'GET',
  headers: {},
  params: {},
};


export type FetchFunction = (params: ViewOptions) => Promise<{
  items: Item[];
  total: number;
}>;

export type ClickEventType = 'single' | 'double';

export type EmitsEventName =
  | 'clickRow'
  | 'contextmenuRow'
  | 'update:viewOptions'
  | 'update:items'
  | 'update:headers';

export type TextDirection = 'center' | 'left' | 'right';
