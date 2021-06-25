import React from 'react';
import {AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography} from '@material-ui/core'
import {ShoppingCart} from '@material-ui/icons';
import {Link, useLocation} from 'react-router-dom';
import Logo from '../../assets/shopping-cart.png'
import useStyles from './NavbarStyles'
const Navbar = ({totalItems}) => {
    const classes = useStyles();
    const location = useLocation();

    return (
        <>
        <AppBar position='fixed' className={classes.appBar} color='inherit'>
            <Toolbar>
                <Typography component={Link} to='/' variant='h6' className={classes.title} color='inherit'>
                    <img src={Logo} alt='Commerce.js' height='25px' className={classes.image} />
                    E-Com
                </Typography>
                {location.pathname === '/' && (<div className={classes.grow}>
                    <div className={classes.button}>
                        <IconButton component={Link} to='/cart' aria-label='Show cart items' color='inherit'>
                            <Badge badgeContent={totalItems} color='secondary'>
                                <ShoppingCart/>
                            </Badge>
                        </IconButton>
                    </div>
                </div>)}
            </Toolbar>
        </AppBar>
        </>
    )
}

export default Navbar
