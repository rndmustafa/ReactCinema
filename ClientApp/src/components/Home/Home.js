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
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: '2px 0px 2px 0px',
    borderColor: 'rgb(166,166,166)',
    borderStyle: 'solid'
  },
  form: {
    maxWidth: '800px',
    width: '100%'
  }
});

function Home(props) {
  const { classes } = props;
  const [showdate, setShowdate] = useState(moment().format('YYYY-MM-DD'));
  const [searchFilter, setSearchFilter] = useState('');
  return (
    <div className={classes.flexCol} >
      <Typography variant='h4' gutterBottom>What's Showing</Typography>
      <form noValidate className={classes.form} onSubmit={e => e.preventDefault()} >
        <div className={classes.flexRow}>
          <DateRange fontSize='large' style={{ marginRight: 8, marginBottom: 16 }} />
          <TextField
            id='date'
            type='date'
            value={showdate}
            onChange={e => setShowdate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className={classes.searchContainer}>
          <TextField
            id='outlined-full-width'
            style={{ margin: 8, maxWidth:'500px',width:'100%' }}
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
      </form>
      <MovieGrid searchFilter={searchFilter} showDate={showdate} />
    </div>
  );
}

export default withStyles(styles)(Home);