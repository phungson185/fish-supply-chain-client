import { Edit } from '@mui/icons-material';
import { Container, IconButton, Paper, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { userService } from 'services';
import { UserType } from 'types/User';
import { shorten } from 'utils/common';
import { UserAvatar } from './components';

const Profile = () => {
  const { address } = useSelector(profileSelector);
  const { data: user } = useQuery('userService.getProfile', () => userService.getProfile) as { data: UserType };
  const cover = user?.cover || require(`assets/images/cover.png`).default.src;

  return (
    <>
      <div style={{ background: `url(${cover}) no-repeat center / cover`, height: 360 }}></div>
      <Container className='flex items-start gap-10 flex-col md:flex-row mb-20'>
        <Paper className='md:sticky top-[120px] p-6 md:w-[286px] -mt-[40px] rounded-[20px]'>
          <UserAvatar user={user} />
          <div className='mt-5'>
            <Typography className='font-semibold text-2xl mb-[6px]'>
              {user?.name || address}
              <a href='/'>
                <IconButton title='Update Profile' className='-mr-12 ml-2 mb-2'>
                  <Edit />
                </IconButton>
              </a>
            </Typography>
            <Typography className='text-secondary-main mb-6'>{shorten(user?.address)}</Typography>

            <div dangerouslySetInnerHTML={{ __html: user?.bio! }} className='text-editor' />
          </div>
        </Paper>

        {/* <div className='flex-1 py-12'>
          <TabAssets address={address} />
        </div> */}
      </Container>
    </>
  );
};

export default Profile;
