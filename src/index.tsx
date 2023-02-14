import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { green } from '@mui/material/colors';

import { ClientContextProvider } from "./contexts/ClientContext";
import { JsonRpcContextProvider } from "./contexts/JsonRpcContext";
import { ChainDataContextProvider } from "./contexts/ChainDataContext";
import { SearchContextProvider } from "./contexts/SearchContext";

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
			<ChainDataContextProvider>
				<ClientContextProvider>
					<JsonRpcContextProvider>
						<SearchContextProvider>
							<CssBaseline />
							<App />
						</SearchContextProvider>
					</JsonRpcContextProvider>
				</ClientContextProvider>
			</ChainDataContextProvider>
		</CssVarsProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
