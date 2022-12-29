import Divider from '@mui/material/Divider/Divider';

const HorizantalDivider = (props: { margin?: string }) => (
  <Divider
    orientation='horizontal'
    flexItem
    style={{ backgroundColor: 'black', margin: props.margin || '0px' }}
  ></Divider>
);

export default HorizantalDivider;
