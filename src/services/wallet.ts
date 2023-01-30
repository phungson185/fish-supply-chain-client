import WalletConnectProvider from '@walletconnect/web3-provider';
import { web3 } from 'contracts';
import { store } from 'reducers';
import { signIn, signOut } from 'reducers/profile';
import { authService } from 'services';
import { SyncRoleType } from 'types/Auth';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

const connectProvider = async () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: [],
      },
    },
  };
  const web3Modal = new Web3Modal({
    providerOptions,
    theme: 'dark',
    cacheProvider: false,
  });

  const provider = Web3.givenProvider || (await web3Modal.connect());
  provider.on('accountsChanged', () => store.dispatch(signOut()));
  provider.on('disconnect', () => store.dispatch(signOut()));

  web3.setProvider(provider);
};

const connectWallet = async () => {
  try {
    await connectProvider();
    let address;
    try {
      [address] = await web3.eth.requestAccounts();
    } catch {
      [address] = await web3.eth.getAccounts();
    }
    address = address.toLowerCase();
    const role = await authService.getRole(address);
    if (role === 'Unknown') {
      store.dispatch(signOut());
    } else {
      const { nonce } = await authService.getNonce({ address });
      const signature = await web3.eth.personal.sign(nonce.toString(), address, '');
      const accessToken = await authService.getToken({ address, signature });
      store.dispatch(signIn({ accessToken, address, role }));
      await authService.syncRole({ address, role } as SyncRoleType);
    }
  } catch (error) {
    console.log(error);
  }
};

export default {
  connectProvider,
  connectWallet,
};
