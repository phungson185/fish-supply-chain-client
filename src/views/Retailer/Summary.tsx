import { Container, Paper } from '@mui/material';
import { Spinner } from 'components';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { retailerService } from 'services';

const Summary = () => {
  const { data: summaryCommon, isFetching: isFetchingCommon } = useQuery(
    ['retailerService.summaryCommon'],
    () => retailerService.summaryCommon(),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

  const [summaryCommonChartProductStatusData, setSummaryCommonChartProductStatusData] = useState<any>(null);

  useEffect(() => {
    if (summaryCommon) {
      const summaryCommonChartProductStatus = {
        series: [
          summaryCommon.numberOfProductsInStock,
          summaryCommon.numberOfProductsListed,
          summaryCommon.numberOfProductsExpired,
        ],
        options: {
          labels: ['Number of products in stock', 'Number of products listed', 'Number of products expired'],
        },
      };

      setSummaryCommonChartProductStatusData(summaryCommonChartProductStatus);
    }
  }, [summaryCommon]);

  if (isFetchingCommon) {
    return <Spinner loading={isFetchingCommon} />;
  }

  return (
    <Container>
      {summaryCommonChartProductStatusData && (
        <>
          <div className='flex flex-row gap-10 justify-center mb-10'>
            <Paper
              className='bg-white flex flex-col items-center p-5 rounded-2xl justify-center'
              style={{ width: '30%' }}
            >
              <div className='text-2xl mb-5'>Total order to distributor</div>
              <div className='text-5xl font-bold'>{summaryCommon.totalOrderToDistributor}</div>
            </Paper>
            <Paper className='p-5' sx={{ width: 'fit-content' }}>
              <Chart
                options={summaryCommonChartProductStatusData.options}
                series={summaryCommonChartProductStatusData.series}
                type='pie'
                width={700}
                height={400}
              />
              <div className='text-xl font-bold text-center'>The ratio between the different product statuses</div>
            </Paper>
          </div>
        </>
      )}
    </Container>
  );
};

export default Summary;
