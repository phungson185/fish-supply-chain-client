export type PaginateParamsType = {
  page: number;
  size: number;
};

export type PaginateType = {
  currentPage: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PopupController = {
  onSuccess?: () => void;
  onClose: () => void;
};

export type SearchController = {
  onChange: (search: any) => void;
};
