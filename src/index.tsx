import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { green } from '@mui/material/colors';

import { WalletConnectClientContextProvider } from "./chia-walletconnect/contexts/WalletConnectClientContext";
import { WalletConnectRpcContextProvider } from "./chia-walletconnect/contexts/WalletConnectRpcContext";
import { SearchContextProvider } from "./spriggan-shared/contexts/SearchContext";

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
					<SearchContextProvider>
						<CssBaseline />
						<App />
					</SearchContextProvider>
					{/* </SprigganRpcContext> */}
				</WalletConnectRpcContextProvider>
			</WalletConnectClientContextProvider>
		</CssVarsProvider>
	</React.StrictMode>
);

