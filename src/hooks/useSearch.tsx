import { useCallback, useState } from 'react';

const useSearch = (search?: any) => {
  const [dataSearch, setDataSearch] = useState({ page: 1, size: 10, ...search });

  const onSearchChange = useCallback((search) => {
    setDataSearch((current: any) => ({
      ...current,
      page: 1,
      ...search,
    }));
  }, []);

  return [dataSearch, onSearchChange];
};

export default useSearch;
