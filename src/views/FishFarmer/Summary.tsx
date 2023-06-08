import { Container, MenuItem, Paper, Select } from '@mui/material';
import { Spinner } from 'components';
import { is } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fishFarmerService, fishSeedCompanyService } from 'services';
import { SummaryParamsType } from 'types/FishSeedCompany';

import ApexCharts from 'apexcharts';

import Chart from 'react-apexcharts';

const Summary = () => {
  const [dataFilter, setDataFilter] = useState({
    geographicOrigin: 5,
    methodOfReproduction: 5,
  } as SummaryParamsType);
  const [geographicOriginFilter, setGeographicOriginFilter] = useState(5);
  const [methodOfReproductionFilter, setMethodOfReproductionFilter] = useState(5);

  const { data: summaryCommon, isFetching: isFetchingCommon } = useQuery(
    ['fishFarmerService.summaryCommon'],
    () => fishFarmerService.summaryCommon(),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

  const { data: summaryMostOrder, isFetching: isFetchingMostOrder } = useQuery(
    ['fishFarmerService.summaryMostOrder', dataFilter],
    () => fishFarmerService.summaryMostOrder(dataFilter),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

  const [quantityOfOrderData, setQuantityOfOrderData] = useState<any>();
  const [topOrderChartData, setTopOrderChartData] = useState<any>();

  useEffect(() => {
    if (summaryCommon) {
      const quantityOfOrder = {
        series: [
          {
            name: 'Order count',
            data: summaryCommon.quantityOfOrdersForFishGrowth.map((fish: any) => ({
              x: fish.speciesName,
              y: fish.orderCount,
            })),
          },
        ],
        options: {
          xaxis: {
            title: {
              text: 'Species name',
            },
            categories: summaryCommon.quantityOfOrdersForFishGrowth.map((fish: any) => fish.speciesName),
          },
          yaxis: {
            title: {
              text: 'Order count',
            },
          },
        },
      };
      setQuantityOfOrderData(quantityOfOrder);
    }
  }, [summaryCommon]);

  useEffect(() => {
    if (summaryMostOrder) {
      const topOrderChart = {
        series: [
          {
            name: 'Total of farming fish',
            data: summaryMostOrder.map((fish: any) => ({
              x: fish.speciesName,
              y: fish.numberOfFishSeedsOrdered,
            })),
          },
          {
            name: 'Total of ordered fish',
            data: summaryMostOrder.map((fish: any) => ({
              x: fish.speciesName,
              y: fish.numberOfFishOrdered,
            })),
          },
        ],
        options: {
          xaxis: {
            title: {
              text: 'Species name',
            },
            categories: summaryMostOrder.map((fish: any) => fish.speciesName),
          },
        },
      };

      setTopOrderChartData(topOrderChart);
    }
  }, [summaryMostOrder]);

  if (isFetchingCommon) {
    return <Spinner loading={isFetchingCommon} />;
  }

  return (
    <Container>
      {summaryCommon && (
        <div className='flex flex-row gap-10 justify-center mb-10'>
          <Paper className='bg-white flex flex-col items-center p-5 rounded-2xl' style={{ width: '30%' }}>
            <div className='text-2xl mb-5'>Total order to fish seed company</div>
            <div className='text-5xl font-bold'>{summaryCommon.totalOrderToFishSeedCompany}</div>
          </Paper>
          <Paper className='bg-white flex flex-col items-center p-5 rounded-2xl' style={{ width: '30%' }}>
            <div className='text-2xl mb-5'>Total order from fish processor</div>
            <div className='text-5xl font-bold'>{summaryCommon.totalOrderFromFishProcessor}</div>
          </Paper>
          <Paper className='bg-white flex flex-col items-center p-5 rounded-2xl' style={{ width: '30%' }}>
            <div className='text-2xl mb-5'>Average fish weight</div>
            <div className='text-5xl font-bold'>{summaryCommon.averageFishWeight}</div>
          </Paper>
        </div>
      )}
      <div className='flex flex-row gap-10 justify-center'>
        {quantityOfOrderData && (
          <Paper className='p-5' sx={{ width: 'fit-content' }}>
            <Chart
              options={quantityOfOrderData.options}
              series={quantityOfOrderData.series}
              type='bar'
              width={700}
              height={400}
            />
            <div className='text-xl font-bold text-center'>The quantity of orders for each fish</div>
          </Paper>
        )}

        {topOrderChartData && (
          <Paper className='p-5' sx={{ width: 'fit-content' }}>
            <div className='flex flex-row gap-5 items-center justify-center'>
              <div>Geographic origin</div>
              <Select
                className='mr-20'
                style={{ width: '120px' }}
                value={geographicOriginFilter}
                onChange={(e) => {
                  setGeographicOriginFilter(Number(e.target.value));
                  setDataFilter({ ...dataFilter, geographicOrigin: Number(e.target.value) });
                }}
              >
                <MenuItem value={5}>All</MenuItem>
                <MenuItem value={0}>Brackish</MenuItem>
                <MenuItem value={1}>Fresh</MenuItem>
                <MenuItem value={2}>Marine</MenuItem>
              </Select>
              <div>Method of reproduction</div>
              <Select
                style={{ width: '120px' }}
                value={methodOfReproductionFilter}
                onChange={(e) => {
                  setMethodOfReproductionFilter(Number(e.target.value));
                  setDataFilter({ ...dataFilter, methodOfReproduction: Number(e.target.value) });
                }}
              >
                <MenuItem value={5}>All</MenuItem>
                <MenuItem value={0}>Natural</MenuItem>
                <MenuItem value={1}>Artifical</MenuItem>
              </Select>
            </div>
            <Chart
              options={topOrderChartData.options}
              series={topOrderChartData.series}
              type='bar'
              width={700}
              height={400}
            />
            <div className='text-xl font-bold text-center'>
              The ratio between the quantity currently being farmed and the quantity sold for each fish species
            </div>
          </Paper>
        )}
      </div>
    </Container>
  );
};

export default Summary;
