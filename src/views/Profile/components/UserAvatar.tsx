import { CameraAlt, CheckCircle } from '@mui/icons-material';
import { Avatar, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from 'reducers/profile';
import { fileService, queryClient, userService } from 'services';
import { UserType } from 'types/User';

const UserAvatar = ({ user }: { user: UserType }) => {
  console.log(user)
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [image, setImage] = useState(user?.avatar);
  const [imageLoading, setImageLoading] = useState(false);

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
    <div className='relative inline-block'>
      <Avatar src={image} variant='rounded' className='w-[180px] h-[180px] border-2 border-primary-main' />
      {/* {isOwner ? (
        <div className='absolute bottom-5 -right-[18px] flex'>
          <input hidden type='file' id='avatar' accept='image/*' onChange={handleChangeFile} />
          <label
            htmlFor='avatar'
            className='w-10 h-10 flex justify-center items-center rounded-full border bg-slate-200 border-slate-300 hover:bg-slate-300 cursor-pointer'
          >
            {imageLoading ? <CircularProgress color='info' size={20} /> : <CameraAlt />}
          </label>
        </div>
      ) : (
        <div className='absolute bottom-5 -right-[18px] flex'>
          <CheckCircle
            color='secondary'
            fontSize='small'
            className='absolute w-8 h-8 bottom-[0px] right-[2px] bg-white rounded-full'
          />
        </div>
      )} */}
      <div className='absolute bottom-5 -right-[18px] flex'>
        <input hidden type='file' id='avatar' accept='image/*' onChange={handleChangeFile} />
        <label
          htmlFor='avatar'
          className='w-10 h-10 flex justify-center items-center rounded-full border bg-slate-200 border-slate-300 hover:bg-slate-300 cursor-pointer'
        >
          {imageLoading ? <CircularProgress color='info' size={20} /> : <CameraAlt />}
        </label>
      </div>
    </div>
  );
};

export default UserAvatar;
