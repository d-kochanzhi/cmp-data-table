/* eslint-disable @typescript-eslint/no-explicit-any */

export type SortType = 'asc' | 'desc' | 'none';

//export type ColumnRenderFunction = (item: Item) => string;

export type Header = {
  title: string;
  field: string;
  identity?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  fixed?: boolean;
  width?: number;
  //formatter?: ColumnRenderFunction;
};

export type Item = Record<string, any>;

export interface Table {
  caption: string;
  headers: Header[];
  items: Item[];
}

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

export type ClickEventType = 'single' | 'double';

export type EmitsEventName =
  | 'clickRow'
  | 'updateSort'
  | 'contextmenuRow'
  | 'update:viewOptions'
  | 'update:items'
  | 'update:headers';
