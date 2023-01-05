type ThemeType = 'buy' | 'sell';

type color =
  | 'success'
  | 'error'
  | 'warning'
  | 'primary'
  | 'inherit'
  | 'secondary'
  | 'info'
  | undefined;

interface Theme {
  buy: color;
  sell: color;
  warn: color;
}

export const getTheme = (type: ThemeType): color => {
  const theme: Theme = {
    buy: 'success',
    sell: 'error',
    warn: 'warning',
  };

  return theme[type];
};
