import { Backdrop, CircularProgress } from '@mui/material';

type SpinnerType = {
  loading?: boolean;
  icon?: JSX.Element;
  children?: React.ReactNode;
};

const Spinner = ({ loading, icon, children }: SpinnerType) => {
  return (
    <div className='relative' style={{ minHeight: 160 }}>
      {children}
      <Backdrop
        open={loading ?? false}
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(18, 18, 18, 0.05)',
        }}
      >
        {icon ?? <CircularProgress />}
      </Backdrop>
    </div>
  );
};

export default Spinner;
