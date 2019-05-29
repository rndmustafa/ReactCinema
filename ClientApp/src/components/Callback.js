import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Callback(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center' }}>
      <CircularProgress />
    </div>
  );
}

export default Callback;