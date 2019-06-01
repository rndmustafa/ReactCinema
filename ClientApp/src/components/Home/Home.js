import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import DateRange from '@material-ui/icons/DateRange';
import MovieGrid from './MovieGrid';
import moment from 'moment';


const styles = (theme) => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

function Home(props) {
  const { classes } = props;
  const [showdate, setShowdate] = useState(moment().format('YYYY-MM-DD'));
  const [searchFilter, setSearchFilter] = useState('');
  return (
    <div className={classes.flexCol} >
      <Typography variant='h4' style={{ marginBottom: 8 }}>What's Showing</Typography>
      <form noValidate onSubmit={e => e.preventDefault()} >
        <div className={classes.flexRow} style={{width:800}}>
          <DateRange fontSize='large' style={{ marginRight: 8 }} />
          <TextField
              id='date'
              type='date'
              value={showdate}
              onChange={e => setShowdate(e.target.value)}
              InputLabelProps={{ shrink: true }}
          />
        </div>
        <hr style={{ margin: 6 }} />
        <div className={classes.flexRow}>
          <TextField
              id='outlined-full-width'
              style={{ margin: 8, width:500 }}
              placeholder='Search'
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              margin='normal'
              variant='outlined'
              InputLabelProps={{
                shrink: true
              }}
          />
        </div>
        <hr style={{ margin: 6 }} />
      </form>
      <MovieGrid searchFilter={searchFilter} date={showdate} />
    </div>
  );
}

export default withStyles(styles)(Home);