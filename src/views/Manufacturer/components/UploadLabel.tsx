import { Avatar, Backdrop, CircularProgress } from '@mui/material';
import { merge } from 'utils/common';

type UploadLabelType = {
  htmlFor: string;
  variant: 'circular' | 'rounded';
  image?: string;
  width: number | string;
  height: number;
  loading: boolean;
  error: boolean;
};

const UploadLabel = ({ htmlFor, variant, image, width, height, loading, error }: UploadLabelType) => (
  <label
    htmlFor={htmlFor}
    className={merge(
      'relative border-2 border-dashed cursor-pointer block',
      'bg-slate-50  hover:border-secondary-main/75',
      { 'border-red-400': error },
    )}
    style={{ width, height, borderRadius: variant === 'circular' ? '50%' : 4 }}
  >
    <Backdrop
      open={loading}
      sx={{
        position: 'absolute',
        borderRadius: variant === 'circular' ? '50%' : 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(18, 18, 18, 0.2)',
      }}
    >
      <CircularProgress />
    </Backdrop>
    <div className='flex items-center justify-center h-full'>
      {image ? (
        <Avatar src={image} className='w-full h-full' variant={variant} />
      ) : (
        <img src={require('assets/images/placeholder_4_4.png').default.src} style={{ height: height - 30 }} />
      )}
    </div>
  </label>
);

export default UploadLabel;
