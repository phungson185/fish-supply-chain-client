import { CameraAlt } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, CircularProgress, Container, FormControl, Paper, TextField, Typography } from '@mui/material';
import TextEditor from 'components/TextEditor';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { profileSelector, signIn } from 'reducers/profile';
import { getRoute } from 'routes';
import { fileService, queryClient, userService } from 'services';
import { UserType, UserUpdateType } from 'types/User';
import { getBase64 } from 'utils/common';
import { UploadLabel } from 'views/Registration/components';
import { UserAvatar } from './components';

const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const profile = useSelector(profileSelector);

  // const [cover, setCover] = useState(profile.cover);
  const [coverLoading, setCoverLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit, clearErrors, setValue } = useForm();

  // useEffect(() => {
  //   setValue('name', profile.name);
  //   setValue('bio', profile.bio);
  // }, [profile, setValue]);
  const [imageLoading, setImageLoading] = useState(false);

  const { data: user } = useQuery('userService.getProfile', () => userService.getProfile(), {
    onSuccess: (data) => {
      Object.entries(data ?? {}).forEach(([key, value]) => {
        setValue(key, value);
      });
    },
  }) as { data: UserType };

  const [image, setImage] = useState(user?.avatar);
  const { mutate: updateProfile, isLoading } = useMutation(userService.updateProfile, {
    onSuccess: (data) => {
      dispatch(signIn(data));
      enqueueSnackbar('Update profile successfully', { variant: 'success' });
      queryClient.invalidateQueries('userService.getProfile');
    },
  });

  const handleClickSubmit = () => {
    handleSubmit((values) => {
      Object.keys(values).forEach((key) => {
        if (values[key] === '') {
          delete values[key];
        }
      });

      updateProfile(values as UserUpdateType);
    })();
  };

  // const handleChangeCover = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   getBase64(file, setCover);

  //   const formData = new FormData();
  //   formData.append('image', file as Blob);

  //   setCoverLoading(true);
  //   fileService
  //     .uploadFile(formData)
  //     .then((url) => {
  //       setValue('cover', url.data.data);
  //       clearErrors('cover');
  //     })
  //     .finally(() => {
  //       setCoverLoading(false);
  //     });
  // };

  const handleChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const formData = new FormData();
    formData.append('image', file as Blob);

    setImageLoading(true);
    const url = await fileService.uploadFile(formData);
    await userService.updateProfile({ avatar: url.data.data }).then((data) => {
      dispatch(signIn(data));
      enqueueSnackbar('Update avatar successfully', { variant: 'success' });
      queryClient.invalidateQueries('userService.getUserProfile');
    });
    setImage(url.data.data);
    setImageLoading(false);
  };

  return (
    <Container maxWidth='md' className='py-20'>
      <Typography variant='h1' className='mb-4'>
        Profile
      </Typography>
      <Paper className='p-6'>
        <div className='flex items-center gap-6 mb-6'>
          <div className='relative'>
            <Avatar src={user?.avatar} sx={{ width: 160, height: 160 }} className='border-2 border-secondary-main' />
            <div className='absolute bottom-3 -right-3 flex'>
              <input hidden type='file' id='avatar' accept='image/*' onChange={handleChangeFile} />
              <label
                htmlFor='avatar'
                className='w-10 h-10 flex justify-center items-center rounded-full border bg-slate-200 border-slate-300 hover:bg-slate-300 cursor-pointer'
              >
                {imageLoading ? <CircularProgress color='info' size={20} /> : <CameraAlt />}
              </label>
            </div>
          </div>
          <div>
            <Typography variant='h4'>{user?.name}</Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              {user?.address}
            </Typography>
          </div>
        </div>

        <Controller
          name='cover'
          defaultValue=''
          control={control}
          render={({ fieldState: { invalid } }) => (
            <FormControl fullWidth className='mb-4'>
              <Typography variant='subtitle1'>Cover</Typography>
              <Typography color='textSecondary' gutterBottom>
                This image will appear at the top of your profile page, 1600x400 recommended.
              </Typography>
              {/* <input hidden type='file' id='cover' accept='image/*' onChange={handleChangeCover} /> */}
              <input hidden type='file' id='cover' accept='image/*' />
              <UploadLabel
                {...{ htmlFor: 'cover', variant: 'rounded', image: user?.cover }}
                {...{ width: '100%', height: 180, loading: coverLoading, error: invalid }}
              />
            </FormControl>
          )}
        />

        <Controller
          name='name'
          defaultValue=''
          control={control}
          // rules={{
          //   validate: {
          //     required: (value) => value.trim() !== '' || 'Name cannot be empty',
          //   },
          // }}
          render={({ field, fieldState: { invalid, error } }) => (
            <FormControl fullWidth className='mb-4'>
              <Typography variant='subtitle1'>Name</Typography>
              <TextField {...field} error={invalid} helperText={error?.message} />
            </FormControl>
          )}
        />

        <Controller
          name='userAddress'
          defaultValue=''
          control={control}
          // rules={{
          //   validate: {
          //     required: (value) => value.trim() !== '' || 'User address cannot be empty',
          //   },
          // }}
          render={({ field, fieldState: { invalid, error } }) => (
            <FormControl fullWidth className='mb-4'>
              <Typography variant='subtitle1'>User address</Typography>
              <TextField {...field} error={invalid} helperText={error?.message} />
            </FormControl>
          )}
        />

        <Controller
          name='phone'
          defaultValue=''
          control={control}
          // rules={{
          //   validate: {
          //     required: (value) => value.trim() !== '' || 'Phone address cannot be empty',
          //   },
          // }}
          render={({ field, fieldState: { invalid, error } }) => (
            <FormControl fullWidth className='mb-4'>
              <Typography variant='subtitle1'>Phone</Typography>
              <TextField {...field} error={invalid} helperText={error?.message} />
            </FormControl>
          )}
        />

        <Controller
          name='bio'
          defaultValue=''
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl fullWidth className='mb-4'>
              <Typography variant='subtitle1'>Biography</Typography>
              <TextEditor name='bio' onChange={(value: any) => onChange({ target: { value } })} value={user?.bio} />
            </FormControl>
          )}
        />

        <div className='flex justify-end'>
          <LoadingButton variant='contained' loading={isLoading} onClick={handleClickSubmit}>
            Update
          </LoadingButton>
        </div>
      </Paper>
    </Container>
  );
};

export default ProfileUpdate;