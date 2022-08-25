import { Search as SearchIcon } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { InputAdornment, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const Search = () => {
  const { control } = useForm({ mode: 'onChange' });
  const classes = useStyles();
  return (
    <Controller
      name='search'
      defaultValue=''
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          className='hidden sm:block'
          placeholder='Search'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SearchIcon className={classes.searchIcon} />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

const useStyles = makeStyles({
  searchIcon: {
    backgroundColor: '#7A89FE',
    padding: 4,
    borderRadius: '10px',
    color: 'white',
  },
});

export default Search;
