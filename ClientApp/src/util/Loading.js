import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loading(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center' }}>
      <CircularProgress />
    </div>
  );
}

export default Loading;