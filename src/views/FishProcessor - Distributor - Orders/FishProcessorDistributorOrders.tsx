import { Container, Tab, Tabs } from '@mui/material';
import { ProcessStatus } from 'components/ConfirmStatus';
import useTabs, { TabType } from 'hooks/useTabs';
import OrdersTab from './OrdersTab';

const FishProcessorDistributorOrders = () => {
  const tabs = ([] as TabType[])
    .concat([{ code: 'all', label: 'All orders', component: <OrdersTab status={ProcessStatus.All} /> }])
    .concat([{ code: 'pending', label: 'Pending orders', component: <OrdersTab status={ProcessStatus.Pending} /> }])
    .concat([{ code: 'accepted', label: 'Accepted orders', component: <OrdersTab status={ProcessStatus.Accepted} /> }])
    .concat([{ code: 'rejected', label: 'Rejected orders', component: <OrdersTab status={ProcessStatus.Rejected} /> }])
    .concat([{ code: 'received', label: 'Received orders', component: <OrdersTab status={ProcessStatus.Received} /> }]);

  const [activeTab, onTabChange] = useTabs(tabs);

  // useEffect(() => {
  //   onTabChange({} as SyntheticEvent<Element, Event>, 'account');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <Container>
        <Tabs value={activeTab} onChange={onTabChange} classes={{ flexContainer: 'justify-center' }} className='mb-5'>
          {tabs.map((tab) => (
            <Tab
              key={tab.code}
              className='w-[120px] sm:w-[180px] border-none text-xl'
              style={{ wordBreak: 'break-word' }}
              label={tab.label}
              value={tab.code}
            />
          ))}
        </Tabs>
        {tabs.map((tab) => (
          <div key={tab.code} hidden={tab.code !== activeTab} className=''>
            {tab.component}
          </div>
        ))}
      </Container>
    </>
  );
};

export default FishProcessorDistributorOrders;
