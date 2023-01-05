import TextField from '@mui/material/TextField/TextField';
import React from 'react';

export default function InquiryContentInput(props: any) {
  return (
    <TextField
      variant='filled'
      value={props.content}
      size='small'
      label='Суть обращения'
    />
  );
}
