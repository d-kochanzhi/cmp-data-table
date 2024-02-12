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

export type ClickEventType = 'single' | 'double';

export type EmitsEventName =
  | 'clickRow'
  | 'contextmenuRow'
  | 'update:viewOptions'
  | 'update:items'
  | 'update:headers';

export type TextDirection = 'center' | 'left' | 'right';
