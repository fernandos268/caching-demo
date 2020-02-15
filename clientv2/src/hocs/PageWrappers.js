import React from 'react'
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
   main: {
      marginTop: 40
   },
   appBar: {
     [theme.breakpoints.up('sm')]: {
       width: `calc(100% - ${drawerWidth}px)`,
       marginLeft: drawerWidth,
     },
   },
   menuButton: {
     marginRight: theme.spacing(2),
     [theme.breakpoints.up('sm')]: {
       display: 'none',
     },
   },
 }));

const Bar = (props) => {
  const classes = useStyles();
   return(
      <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
         <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            // onClick={handleDrawerToggle}
            className={classes.menuButton}
         >
            <MenuIcon />
         </IconButton>
         <Typography variant="h6" noWrap>
            {props.name}
         </Typography>
      </Toolbar>
      </AppBar>
   )
}
const PageWrappers = (Component, name) => {
   return class extends React.PureComponent {
      constructor(props){
         super(props)
      }
      render() {
         return(
            <div>
               <div>
                  <Bar name={name}/>
               </div>
               <div style={{ marginTop: '50px'}}>
                  <Component {...this.props}/>
               </div>
            </div>
         )
      }
   }
}

export default PageWrappers