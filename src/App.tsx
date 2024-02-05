import { Box } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

import GameGrid from "./components/GameGrid";
import MainTopBar from "./components/MainTopBar";
import { useJsonRpc } from "./gosti-shared/contexts/JsonRpcContext";
import { useMarketplaceApi } from "./gosti-shared/contexts/MarketplaceApiContext";
import { useWalletConnect } from "./gosti-shared/contexts/WalletConnectContext";
import { GostiConfig } from "./gosti-shared/types/gosti/GostiRpcTypes";
import { SearchRequest, SortOptions } from "./gosti-shared/types/gosti/MarketplaceApiTypes";
import { Media } from "./gosti-shared/types/gosti/Media";
import { TakeOfferRequest } from "./gosti-shared/types/walletconnect/rpc/TakeOffer";


function App() {
	const [config, setConfig] = useState<GostiConfig | undefined>(undefined);

	useEffect(() => {
		async function fetchData() {
			const configResponse: any = await invoke("get_config");
			console.log("get_config", configResponse);
			setConfig(configResponse.result);
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function updateConfig() {
			const configResponse: any = await invoke("save_config", { config });
			console.log("save_config", configResponse);
		}
		if (config)
			updateConfig();
	}, [config]);


	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>(setTimeout(async () => { }, 100));
	const [activeOffer, setActiveOffer] = useState<string>("");

	const { search, setApiUrl } = useMarketplaceApi();

	useEffect(() => {
		if (config?.activeMarketplace) {
			setApiUrl(config.activeMarketplace.url);
		}
	}, [config, setApiUrl]);

	const [searchResults, setSearchResults] = useState<Media[]>([]);
	useEffect(() => {
		if (searchTerm !== "") {
			clearTimeout(searchDebounce);
			setSearchDebounce(setTimeout(async () => {
				const searchResponse = await search({ titleTerm: searchTerm, sort: SortOptions.lastUpdatedDesc } as SearchRequest);
				setSearchResults(searchResponse.results);
			}, 300));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- need to ignore debounce for timeout
	}, [searchTerm, search]);

	const [mostRecentResults, setMostRecentResults] = useState<Media[]>([]);
	useEffect(() => {
		async function fetchData() {
			const searchResponse = await search({ sort: SortOptions.lastUpdatedDesc } as SearchRequest);
			setMostRecentResults(searchResponse.results);
		}
		fetchData();
	}, [search]);


	useEffect(() => {
		document.title = `Gosti Marketplace`;
	}, [searchResults]);

	const {
		client,
		pairings,
		session,
		connect,
		disconnect,
	} = useWalletConnect();

	const {
		takeOffer
	} = useJsonRpc();

	const onConnect = () => {
		if (!client) throw new Error('WalletConnect is not initialized.');

		if (pairings.length === 1) {
			connect({ topic: pairings[0].topic });
		} else if (pairings.length) {
			console.log('The pairing modal is not implemented.', pairings);
		} else {
			connect();
		}
	};


	const executeOffer = async () => {
		if (session && activeOffer) {
			const x = session.namespaces.chia.accounts[0].split(":");
			await takeOffer({ fingerprint: x[2], offer: activeOffer, fee: 1 } as TakeOfferRequest);
		}
	};


	return (
		<Box>
			{MainTopBar(session, config, setConfig, onConnect, disconnect, setSearchTerm)}
			{GameGrid("Search Results", searchResults, executeOffer, setActiveOffer)}
			{GameGrid("Recently Updated", mostRecentResults, executeOffer, setActiveOffer)}
		</Box>
	);
}

export default App;
