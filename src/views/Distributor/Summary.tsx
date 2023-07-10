import { Container, Paper } from '@mui/material';
import { Spinner } from 'components';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { distributorService } from 'services';

const Summary = () => {
  const { data: summaryCommon, isFetching: isFetchingCommon } = useQuery(
    ['distributorService.summaryCommon'],
    () => distributorService.summaryCommon(),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

  const [summaryCommonChartStockSoldProductData, setSummaryCommonChartStockSoldProductData] = useState<any>(null);
  const [summaryCommonChartProductStatusData, setSummaryCommonChartProductStatusData] = useState<any>(null);

  useEffect(() => {
    if (summaryCommon) {
      const summaryCommonChartStockSoldProduct = {
        series: [
          {
            name: 'Total packets in stock',
            data: summaryCommon.topWithFilter.map((fish: any) => ({
              x: fish.speciesName,
              y: fish.totalOfPackets,
            })),
          },
          {
            name: 'Total sale packets',
            data: summaryCommon.topWithFilter.map((fish: any) => ({
              x: fish.speciesName,
              y: fish.totalOfSale,
            })),
          },
        ],
        options: {
          xaxis: {
            title: {
              text: 'Species name',
            },
            categories: summaryCommon.topWithFilter.map((fish: any) => fish.speciesName),
          },
        },
      };
      setSummaryCommonChartStockSoldProductData(summaryCommonChartStockSoldProduct);

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
      {summaryCommonChartStockSoldProductData && (
        <>
          <div className='flex flex-row gap-10 justify-center mb-10'>
            <Paper className='bg-white flex flex-col items-center p-5 rounded-2xl' style={{ width: '30%' }}>
              <div className='text-2xl mb-5'>Total order from retailer</div>
              <div className='text-5xl font-bold'>{summaryCommon.totalOrderFromRetailer}</div>
            </Paper>
            <Paper className='bg-white flex flex-col items-center p-5 rounded-2xl' style={{ width: '30%' }}>
              <div className='text-2xl mb-5'>Total order to fish processor</div>
              <div className='text-5xl font-bold'>{summaryCommon.totalOrderToFishProcessor}</div>
            </Paper>
          </div>
          <div className='flex flex-row gap-10 justify-center items-center'>
            <Paper className='p-5' sx={{ width: 'fit-content' }}>
              <Chart
                options={summaryCommonChartStockSoldProductData.options}
                series={summaryCommonChartStockSoldProductData.series}
                type='bar'
                width={700}
                height={400}
              />
              <div className='text-xl font-bold text-center'>
                The ratio between the quantity of packets in stock and the quantity sold for each product
              </div>
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
