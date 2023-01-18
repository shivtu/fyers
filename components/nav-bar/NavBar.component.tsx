import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ListSubheader from '@mui/material/ListSubheader/ListSubheader';
import Button from '@mui/material/Button/Button';
import VerticalDivider from '../dividers/VerticalDivider';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField/TextField';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import Stack from '@mui/material/Stack/Stack';
import Switch from '@mui/material/Switch/Switch';
import { useRouter } from 'next/router';
import { ROUTES } from '../../utils/constants';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton/IconButton';

const drawerWidth = 240;

export default function NavBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [drawerAnchorLeft, setdrawerAnchorLeft] =
    React.useState<boolean>(false);

  // Do not render AppBar and Drawer menu if auth page
  const renderAppBarAndDrawer = () => router.pathname !== ROUTES.AUTH;

  const BO_ROUTE = `${ROUTES.ORDERS}${ROUTES.BO}`;

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        color='default'
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          mr: `${drawerAnchorLeft ? drawerWidth : 0}px`,
        }}
      >
        {renderAppBarAndDrawer() && (
          <Toolbar style={{ justifyContent: 'space-around' }}>
            <Typography variant='h6' noWrap component='div'>
              Fyers Trading API
            </Typography>

            <Stack direction='row'>
              <TextField
                label='Risk to reward ratio'
                id='rsik-to-reward-ratio'
                sx={{ m: 1, width: '15ch' }}
                type='number'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>1 : </InputAdornment>
                  ),
                }}
                size='small'
                variant='outlined'
              />
              <TextField
                sx={{ m: 1, width: '15ch' }}
                size='small'
                variant='outlined'
                label='Risk per trade'
                type='number'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CurrencyRupeeIcon />{' '}
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                sx={{ m: 1, width: '24ch' }}
                size='small'
                variant='outlined'
              >
                Set for all trades
              </Button>
            </Stack>
            <IconButton
              color='primary'
              aria-label='trade preferences'
              component='label'
            >
              <Typography variant='subtitle1'>
                Pre define trade settings
              </Typography>
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        )}
      </AppBar>
      {drawerAnchorLeft && (
        <Box
          component='main'
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          {children}
        </Box>
      )}

      {renderAppBarAndDrawer() && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
            backgroundColor: '#f5f5f5',
          }}
          variant='permanent'
          anchor={drawerAnchorLeft ? 'right' : 'left'}
        >
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography>Move menu right</Typography>
            <Switch onChange={() => setdrawerAnchorLeft(!drawerAnchorLeft)} />
          </Stack>
          <Toolbar />

          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component='nav'
            subheader={<ListSubheader component='div'>Orders</ListSubheader>}
          >
            <ListItemButton onClick={handleClick}>
              <ListItemText primary='Bracket orders' />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <List component='div' disablePadding>
                <ListItem>
                  <Button
                    size='small'
                    variant='contained'
                    color='success'
                    startIcon={<TrendingUpIcon />}
                    onClick={() => router.push(`${BO_ROUTE}${ROUTES.BUY}`)}
                  >
                    Buy
                  </Button>
                  <VerticalDivider margin='4px' />
                  <Button
                    size='small'
                    variant='contained'
                    color='error'
                    endIcon={<TrendingDownIcon />}
                    onClick={() => router.push(`${BO_ROUTE}${ROUTES.SELL}`)}
                  >
                    Sell
                  </Button>
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Drawer>
      )}

      {!drawerAnchorLeft && (
        <Box
          component='main'
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          {children}
        </Box>
      )}
    </Box>
  );
}
