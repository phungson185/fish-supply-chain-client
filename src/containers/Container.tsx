import { AppTheme } from 'containers';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'services';

type ContainerType = {
  children: React.ReactNode;
};

const Container = ({ children }: ContainerType) => {
  return (
    <SnackbarProvider
      preventDuplicate={false}
      autoHideDuration={3000}
      variant='success'
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <QueryClientProvider client={queryClient}>
        <AppTheme>{children}</AppTheme>
      </QueryClientProvider>
    </SnackbarProvider>
  );
};

export default Container;
