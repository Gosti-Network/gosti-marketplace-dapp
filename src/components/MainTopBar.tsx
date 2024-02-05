
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { styled, alpha } from '@mui/material/styles';
import { SessionTypes } from '@walletconnect/types';
import React, { useState } from 'react';

import { AddMarketplaceModal } from '../gosti-shared/components/AddMarketplaceModal';
import WalletConnectMenu from '../gosti-shared/components/WalletConnectMenu';
import { GostiConfig } from '../gosti-shared/types/gosti/GostiRpcTypes';
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
	config: GostiConfig | undefined,
	saveConfig: (config: GostiConfig) => void,
	connectToWallet: () => void,
	disconnectFromWallet: () => void,
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
) {

	const [anchor2El, setAnchor2El] = useState<null | HTMLElement>(null);
	const isMainMenuOpen = Boolean(anchor2El);
	const [addMarketplaceModalOpen, setAddMarketplaceModalOpen] = useState<boolean>(false);


	const openAppMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchor2El(event.currentTarget);
	};
	const closeAppMenu = () => {
		setAnchor2El(null);
	};


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
			onClose={closeAppMenu}
		>
			<ThemeSwitcher />
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ height: 70 }}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="open drawer"
						aria-haspopup="true"
						sx={{ mr: 2 }}
						onClick={openAppMenu}
					>
						<MenuIcon />
					</IconButton>
					<Autocomplete
						id={`marketplaces-select`}
						clearIcon={null}
						sx={{ width: 300, padding: 4 }}
						options={config?.marketplaces?.map((marketplace) => marketplace.displayName).concat("Add New Marketplace") ?? []}
						value={config?.activeMarketplace?.displayName ?? "Gosti Marketplace"}
						onChange={
							(event: any, value: string | null) => {
								config?.marketplaces.forEach((marketplace) => {
									if (marketplace.displayName === value || (value === "" && config?.activeMarketplace?.displayName === marketplace.displayName)) {
										const tmp = config || {} as GostiConfig;
										tmp.activeMarketplace = marketplace;
										saveConfig(tmp);
									}
								});
								if (value === "Add New Marketplace") {
									setAddMarketplaceModalOpen(true);
								}
							}
						}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Active Marketplace"
								placeholder="Active Marketplace"
							/>
						)}

					/>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search…"
							inputProps={{ 'aria-label': 'search' }}
							onChange={(event) => {
								if (event.target.value !== undefined) {
									setSearchTerm(event.target.value);
								} else {
									setSearchTerm("");
								}
							}}
						/>
					</Search>
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { xs: 'flex' } }}>
						{WalletConnectMenu(session, connectToWallet, disconnectFromWallet)}
					</Box>
				</Toolbar>
			</AppBar>
			{renderMainMenu}
			{AddMarketplaceModal(addMarketplaceModalOpen, () => { setAddMarketplaceModalOpen(false); }, config, saveConfig)}
		</Box>
	);
}
