import { Container, MenuItem, Paper, Select } from '@mui/material';
import { Spinner } from 'components';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fishSeedCompanyService } from 'services';
import { SummaryParamsType } from 'types/FishSeedCompany';

import Chart from 'react-apexcharts';

const Summary = () => {
  const [dataFilter, setDataFilter] = useState({
    geographicOrigin: 5,
    methodOfReproduction: 5,
  } as SummaryParamsType);
  const [geographicOriginFilter, setGeographicOriginFilter] = useState(5);
  const [methodOfReproductionFilter, setMethodOfReproductionFilter] = useState(5);

  const { data: summaryCommon, isFetching: isFetchingCommon } = useQuery(
    ['fishSeedCompanyService.summaryCommon'],
    () => fishSeedCompanyService.summaryCommon(),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

  const { data: summaryMostOrder, isFetching: isFetchingMostOrder } = useQuery(
    ['fishSeedCompanyService.summaryMostOrder', dataFilter],
    () => fishSeedCompanyService.summaryMostOrder(dataFilter),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

  const [farmedFishChartData, setFarmedFishChartData] = useState<any>();
  const [topOrderChartData, setTopOrderChartData] = useState<any>();

  useEffect(() => {
    if (summaryCommon) {
      const farmedFishChart = {
        series: [
          {
            name: 'Order count',
            data: summaryCommon.topFarmedFish.map((fish: any) => ({
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
            categories: summaryCommon.topFarmedFish.map((fish: any) => fish.speciesName),
          },
          yaxis: {
            title: {
              text: 'Order count',
            },
          },
        },
      };
      setFarmedFishChartData(farmedFishChart);
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
              y: fish.quantity,
            })),
          },
          {
            name: 'Total of deployed fish',
            data: summaryMostOrder.map((fish: any) => ({
              x: fish.speciesName,
              y: fish.numberOfFishSeedsOrdered,
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
            <div className='text-2xl mb-5'>Total of fish seeds</div>
            <div className='text-5xl font-bold'>{summaryCommon.totalFishSeed}</div>
          </Paper>
          <Paper className='bg-white flex flex-col items-center p-5 rounded-2xl' style={{ width: '30%' }}>
            <div className='text-2xl mb-5'>Total of contracts</div>
            <div className='text-5xl font-bold'>{summaryCommon.totalFarmedFish}</div>
          </Paper>
          <Paper className='bg-white flex flex-col items-center p-5 rounded-2xl' style={{ width: '30%' }}>
            <div className='text-2xl mb-5'>Total of order</div>
            <div className='text-5xl font-bold'>{summaryCommon.totalOrder}</div>
          </Paper>
        </div>
      )}
      <div className='flex flex-row gap-10 justify-center'>
        {farmedFishChartData && (
          <Paper className='p-5' sx={{ width: 'fit-content' }}>
            <Chart
              options={farmedFishChartData.options}
              series={farmedFishChartData.series}
              type='bar'
              width={700}
              height={400}
            />
            <div className='text-xl font-bold text-center'>The quantity of orders for each contract</div>
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
            <div className='text-xl font-bold text-center'>The contracts ordered the most</div>
          </Paper>
        )}
      </div>
    </Container>
  );
};

export default Summary;
