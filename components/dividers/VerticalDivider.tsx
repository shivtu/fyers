import Divider from '@mui/material/Divider/Divider';

const VerticalDivider = (props: { margin?: string }) => (
  <Divider
    orientation='vertical'
    flexItem
    style={{ backgroundColor: 'black', margin: props.margin || '0px' }}
  ></Divider>
);

export default VerticalDivider;
