import { CssBaseline } from "@mui/material";
import { green } from '@mui/material/colors';
import { Experimental_CssVarsProvider as CssVarsProvider, experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { NostrProvider } from "nostr-react";
import React from "react";
import ReactDOM from 'react-dom/client';


import App from './App';
import { CHAIN_ID, PROJECT_ID, RELAY_URL } from "./gosti-shared/constants/env";
import { JsonRpcProvider } from "./gosti-shared/contexts/JsonRpcContext";
import { MarketplaceApiContextProvider } from "./gosti-shared/contexts/MarketplaceApiContext";
import { WalletConnectProvider } from "./gosti-shared/contexts/WalletConnectContext";

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

const relayUrls = [
	"ws://localhost:8008",
];

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<CssVarsProvider theme={theme}>
			<WalletConnectProvider
				projectId={PROJECT_ID}
				relayUrl={RELAY_URL}
				chainId={CHAIN_ID}>
				<JsonRpcProvider>
					<MarketplaceApiContextProvider>
						<NostrProvider relayUrls={relayUrls} debug={true}>
							<CssBaseline />
							<App />
						</NostrProvider>
					</MarketplaceApiContextProvider>
				</JsonRpcProvider>
			</WalletConnectProvider>
		</CssVarsProvider>
	</React.StrictMode >
);

