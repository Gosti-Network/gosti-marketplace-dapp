import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import GameGrid from "./components/GameGrid";
import MainTopBar from "./components/MainTopBar";
import { useMarketplaceApi } from "./gosti-shared/contexts/MarketplaceApiContext";
import { useWalletConnect } from "./gosti-shared/contexts/WalletConnectContext";
import { SearchRequest, SortOptions } from "./gosti-shared/types/gosti/MarketplaceApiTypes";
import { Media } from "./gosti-shared/types/gosti/Media";


function App() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>(setTimeout(async () => { }, 100));

	const { search } = useMarketplaceApi();

	const [searchResults, setSearchResults] = useState<Media[]>([]);
	useEffect(() => {
		if (searchTerm !== "") {
			clearTimeout(searchDebounce);
			setSearchDebounce(setTimeout(async () => {
				console.log("Searching for", searchTerm);
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

	return (
		<Box>
			{MainTopBar(session, onConnect, disconnect, setSearchTerm)}
			{GameGrid("Search Results", searchResults)}
			{GameGrid("Recently Updated", mostRecentResults)}
		</Box>
	);
}

export default App;
