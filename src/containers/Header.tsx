import { Logout, Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Button, Divider, Drawer, IconButton, Toolbar } from '@mui/material';
import { AppMenu } from 'containers';
import { useWindowSize } from 'hooks';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { profileSelector, signOut } from 'reducers/profile';
import { walletService } from 'services';
import { shorten } from 'utils/common';

const Header = () => {
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();
  const { isLoggedIn, role, address } = useSelector(profileSelector);

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor='left'
        open={isMobile ? openDrawer : true}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ style: { width: '280px', padding: '8px 16px' } }}
      >
        <div className='flex justify-center items-center h-12 gap-3'>
          <Link to='/'>
            <span className='font-me text-lg text-primary-main'>{`Supply Chain ${role}`}</span>
          </Link>
        </div>
        <Divider className='my-2' />
        <AppMenu />
      </Drawer>

      <AppBar position='sticky' color='inherit' elevation={1}>
        <Toolbar className='p-2 md:px-6 flex-wrap'>
          {isMobile && (
            <IconButton onClick={() => setOpenDrawer(true)} className='mr-2'>
              <MenuIcon />
            </IconButton>
          )}
          {/* <AppBreadcrumb /> */}
          <div className='flex-1' />
          {isLoggedIn ? (
            <div className='flex'>
              <IconButton className='mr-3' onClick={() => dispatch(signOut())}>
                <Logout />
              </IconButton>
              <Button variant='outlined'>{shorten(address)}</Button>
            </div>
          ) : (
            <Button variant='outlined' onClick={() => walletService.connectWallet()}>
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
