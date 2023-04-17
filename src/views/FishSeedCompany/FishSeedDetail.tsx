import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fishSeedCompanyService } from 'services';
import { FishSeedType } from 'types/FishSeedCompany';
import moment from 'moment';
import { DeviceThermostat, SetMeal } from '@mui/icons-material';
import AddFishSeedPopup from './popups/AddFishSeedPopup';
import { useState } from 'react';
import UpdateFishSeedPopup from './popups/UpdateFishSeedPopup';

const FishSeedDetail = () => {
  const params = useParams();
  const [openUpdateFishSeedPopup, setOpenUpdateFishSeedPopup] = useState(false);

  const { data: item, isSuccess } = useQuery(['fishSeedCompanyService.getFishSeed', { id: params.id }], () =>
    fishSeedCompanyService.getFishSeed({ id: params.id as string }),
  ) as { data: FishSeedType; isSuccess: boolean };
  if (!isSuccess) return <></>;

  return (
    <>
      <div>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <Paper className='min-h-screen p-6'>
              <div className='flex flex-row justify-between items-center mb-5'>
                <div>
                  <Typography variant='h1'>{item.title}</Typography>
                  <Typography variant='h4'>{item.subTitle}</Typography>
                </div>
                <Typography variant='caption'>Updated time: {moment(item.updatedAt).format('L')}</Typography>
              </div>
              <Typography variant='caption' className='text-base'>
                {item.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardMedia
                sx={{ height: 300 }}
                image='https://picsum.photos/200/300'
                title='feed image'
                className='bg-cover bg-no-repeat'
              />
              <CardContent className='flex flex-col gap-5'>
                <div>
                  <Typography gutterBottom variant='h3' component='div'>
                    {item.title}
                  </Typography>
                  <Typography variant='h6' color='text.secondary'>
                    {item.subTitle}
                  </Typography>
                </div>
                <div className='flex gap-3 items-center'>
                  <Chip
                    label={fishSeedCompanyService.handleMapGeographicOrigin(item.geographicOrigin)}
                    color='warning'
                  />
                  <Chip
                    label={fishSeedCompanyService.handleMapMethodOfReproduction(item.methodOfReproduction)}
                    color='secondary'
                  />
                </div>
                <div className='flex gap-1 items-center'>
                  <DeviceThermostat color='error' />
                  <div>Nhiệt độ nước:</div>
                  <div className='font-bold'>{item.waterTemperature}°C</div>
                </div>
                <div className='flex gap-1 items-center'>
                  <SetMeal className='text-blue-600' />
                  <div>Số lượng:</div>
                  <div className='font-bold'>{item.quantity}kg</div>
                </div>
              </CardContent>
              <CardActions className='flex justify-end'>
                <Button size='small' onClick={() => setOpenUpdateFishSeedPopup(true)}>
                  Edit
                </Button>
                <Button size='small'>Create contract</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>

      <Dialog open={openUpdateFishSeedPopup} fullWidth maxWidth='md'>
        <UpdateFishSeedPopup data={item} onClose={() => setOpenUpdateFishSeedPopup(false)} />
      </Dialog>
    </>
  );
};

export default FishSeedDetail;
