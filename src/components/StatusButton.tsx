import { Button } from '@mui/material';

type StatusButtonType = {
  content: string;
  backgroundColor: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
};

const StatusButton = ({ content, backgroundColor, onClick }: StatusButtonType) => {
  return (
    <Button
      variant='contained'
      sx={{
        backgroundColor: backgroundColor,
        color: 'white',
      }}
      onClick={() => onClick}
    >
      {content}
    </Button>
  );
};

export default StatusButton;
