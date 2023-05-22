import { CssBaseline } from "@mui/material";
import { green } from '@mui/material/colors';
import { Experimental_CssVarsProvider as CssVarsProvider, experimental_extendTheme as extendTheme } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { WalletConnectClientContextProvider } from "./chia-walletconnect/contexts/WalletConnectClientContext";
import { WalletConnectRpcContextProvider } from "./chia-walletconnect/contexts/WalletConnectRpcContext";
import { MarketplaceApiContextProvider } from "./spriggan-shared/contexts/MarketplaceApiContext";

const theme = extendTheme({
	colorSchemes: {
		dark: { // palette for dark mode
			palette: {
				primary: {
					main: green[500]
				},
				secondary: {
					main: green[500]
				}
			}
		}
	}
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<CssVarsProvider theme={theme}>
			<WalletConnectClientContextProvider>
				<WalletConnectRpcContextProvider>
					{/* <SprigganRpcContext> */}
					<MarketplaceApiContextProvider>
						<CssBaseline />
						<App />
					</MarketplaceApiContextProvider>
					{/* </SprigganRpcContext> */}
				</WalletConnectRpcContextProvider>
			</WalletConnectClientContextProvider>
		</CssVarsProvider>
	</React.StrictMode>
);

