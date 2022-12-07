import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { registrationService } from 'services';
import Registration from './components/Registration';
const RegistrationView = () => {
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: registerConsumer } = useMutation(registrationService.registerConsumer, {
    onSuccess: () => {
      enqueueSnackbar('Add consumer successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const { mutate: registerDistributor } = useMutation(registrationService.registerDistributor, {
    onSuccess: () => {
      enqueueSnackbar('Add distributor successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const { mutate: registerFishFarmer } = useMutation(registrationService.registerFishFarmer, {
    onSuccess: () => {
      enqueueSnackbar('Add fish farmer successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const { mutate: registerFishProcessor } = useMutation(registrationService.registerFishProcessor, {
    onSuccess: () => {
      enqueueSnackbar('Add fish processor successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const { mutate: registerFishSeedCompany } = useMutation(registrationService.registerFishSeedCompany, {
    onSuccess: () => {
      enqueueSnackbar('Add fish seed company successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const { mutate: registerRetailer } = useMutation(registrationService.registerRetailer, {
    onSuccess: () => {
      enqueueSnackbar('Add retailer successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const { mutate: registerWildCaughtFisher } = useMutation(registrationService.registerWildCaughtFisher, {
    onSuccess: () => {
      enqueueSnackbar('Add wild-caught fisher successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Registration title='Register consumer' handle={registerConsumer}></Registration>
      <Registration title='Register distributor' handle={registerDistributor}></Registration>
      <Registration title='Register fish farmer' handle={registerFishFarmer}></Registration>
      <Registration title='Register fish processor' handle={registerFishProcessor}></Registration>
      <Registration title='Register fish seed company' handle={registerFishSeedCompany}></Registration>
      <Registration title='Register retailer' handle={registerRetailer}></Registration>
      <Registration title='Register wild-caught fisher' handle={registerWildCaughtFisher}></Registration>
    </>
  );
};

export default RegistrationView;
