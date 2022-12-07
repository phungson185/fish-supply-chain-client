import { List, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/styles';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute } from 'routes';

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
  const { isLoggedIn, role } = useSelector(profileSelector);
  const privateRoute = getRoute(role);

  return (
    <>
      {isLoggedIn ? (
        <List className='flex flex-col gap-1'>
          {Object.values(privateRoute).filter((item) => item.name).map(({ name, path }) => (
            <MenuItem key={path} name={name} path={path} />
          ))}
        </List>
      ) : null}
    </>
  );
};

export default Menu;
