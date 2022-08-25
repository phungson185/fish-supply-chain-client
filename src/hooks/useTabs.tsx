import { SyntheticEvent, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

type TabType = {
  code: string;
  label: React.ReactNode;
  component: React.ReactNode;
};

const useTabs = (tabs: TabType[]) => {
  const location = useLocation();
  const { tab, ...others } = Object.fromEntries(new URLSearchParams(location.search));

  const [activeTab, setActiveTab] = useState((tabs.find((item) => item.code === tab) ?? tabs[0]).code);

  const handleChangeTab = useCallback(
    (event, value) => {
      setActiveTab(value);
      window.history.replaceState(null, '', '?' + new URLSearchParams({ ...others, tab: value }).toString());
    },
    [others],
  );

  return [activeTab, handleChangeTab] as [any, (event: SyntheticEvent<Element, Event>, value: any) => void];
};

export default useTabs;
