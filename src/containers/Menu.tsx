import { List, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/styles';
import { Link, useLocation } from 'react-router-dom';
import { privateRoute } from 'routes';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';

const StyledListItem = styled(ListItemButton)({
  borderRadius: 8,
  '&.Mui-selected': {
    backgroundColor: 'var(--color-primary-main) !important',
  },
  '&:hover': {
    backgroundColor: 'var(--color-primary-light) !important',
  },
});

type MenuItemProps = {
  name?: string;
  path: string;
};

const MenuItem = ({ name, path }: MenuItemProps) => {
  const location = useLocation();

  return (
    <Link to={path}>
      <StyledListItem selected={location.pathname.startsWith(path)}>
        <ListItemText classes={{ primary: 'font-medium' }}>{name}</ListItemText>
      </StyledListItem>
    </Link>
  );
};

const Menu = () => {
  const { home } = privateRoute;

  const { isLoggedIn } = useSelector(profileSelector);

  return (
    <>
      <List className='flex flex-col gap-1'>
        <MenuItem {...home} />
      </List>
    </>
  );
};

export default Menu;
