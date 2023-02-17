import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Divider, ListItemIcon } from '@mui/material';
import { SessionTypes } from '@walletconnect/types';
import { ChangeEvent, useState } from 'react';

import ThemeSwitcher from "./ThemeSwitcher";

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
}));

export default function PrimarySearchAppBar(
			session: SessionTypes.Struct | undefined,
			connectToWallet: () => void,
			disconnectFromWallet: () => void,
			setSearchTerm: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
		) {

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [anchor2El, setAnchor2El] = useState<null | HTMLElement>(null);
	const isWalletMenuOpen = Boolean(anchorEl);
	const isMainMenuOpen = Boolean(anchor2El);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchor2El(event.currentTarget);
	};
	const handleClose2 = () => {
		setAnchor2El(null);
	};

	const handleConnectToWallet = () => {
		connectToWallet();
		setAnchorEl(null);
	};

	const handleDisconnectFromWallet = () => {
		disconnectFromWallet();
		setAnchorEl(null);
	};

	const walletMenuId = 'primary-search-account-wallet-mobile';
	const renderWalletMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={walletMenuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isWalletMenuOpen}
			onClose={handleClose}
			>
			<MenuItem disabled={true}>Wallet</MenuItem>
			<Divider/>
			{session
				? <div>
					<MenuItem
						onClick={handleDisconnectFromWallet}
					>
						<ListItemIcon>
							<LinkOffIcon fontSize="small" />
						</ListItemIcon>
						Disconnect
					</MenuItem>
				</div>
				: <div>
					<MenuItem
						onClick={handleConnectToWallet}
					>
						<ListItemIcon>
							<AccountBalanceWalletIcon fontSize="small" />
						</ListItemIcon>
						Connect to Chia Wallet
					</MenuItem>
				</div>
			
			}
		</Menu>
	);


	const mainMenuId = 'primary-search-main';
	const renderMainMenu = (
		<Menu
			anchorEl={anchor2El}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={mainMenuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMainMenuOpen}
			onClose={handleClose2}
			>
			<ThemeSwitcher/>
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="open drawer"
						aria-haspopup="true"
						sx={{ mr: 2 }}
						onClick={handleClick2}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ display: { xs: 'none', sm: 'block' } }}
					>
						Spriggan Marketplace 
					</Typography>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search…"
							inputProps={{ 'aria-label': 'search' }}
							onChange={setSearchTerm}
						/>
					</Search>
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
						<IconButton
							size="large"
							edge="end"
							aria-label=""
							aria-haspopup="true"
							color="inherit"
							onClick={handleClick}
						>
							{session
								?<Badge variant="dot" overlap="circular" color="success" anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}>
									<AccountBalanceWalletIcon />
								</Badge>
								:<Badge variant="dot" overlap="circular" color="warning" anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}>
									<AccountBalanceWalletIcon />
								</Badge>
							}
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			{renderWalletMenu}
			{renderMainMenu}
		</Box>
	);
}
