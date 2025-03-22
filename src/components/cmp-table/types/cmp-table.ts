/* eslint-disable @typescript-eslint/no-explicit-any */

export type SortType = 'asc' | 'desc' | 'none';

export type Header = {
  title: string;
  field: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  width?: number;
  expandable?: boolean;
};

export type Item = Record<string, any>;

export type ViewOptions = {
  page: number;
  rowsPerPage: number;
  orderBy: {
    [key: string]: SortType;
  };
  where: {
    [key: string]: any;
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
