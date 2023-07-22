
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import GameGrid from "./components/GameGrid";
import MainTopBar from "./components/MainTopBar";
import { useJsonRpc } from "./spriggan-shared/contexts/JsonRpcContext";
import { useMarketplaceApi } from "./spriggan-shared/contexts/MarketplaceApiContext";
import { useWalletConnect } from "./spriggan-shared/contexts/WalletConnectContext";
import { SearchRequest, SortOptions } from "./spriggan-shared/types/spriggan/MarketplaceApiTypes";
import { Media } from "./spriggan-shared/types/spriggan/Media";
import { TakeOfferRequest } from "./spriggan-shared/types/walletconnect/rpc/TakeOffer";

function App() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>(setTimeout(async () => { }, 100));
	const [activeOffer, setActiveOffer] = useState<string>("");

	const { search } = useMarketplaceApi();

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
		document.title = `Spriggan Marketplace`;
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
			console.log(`${x[0]}:${x[1]}`, x[2]);
			await takeOffer({ fingerprint: x[2], offer: activeOffer, fee: 1 } as TakeOfferRequest);
		}
	};


	return (
		<Box>
			{MainTopBar(session, onConnect, disconnect, (event) => { setSearchTerm(event.target.value); })}
			{GameGrid("Search Results", searchResults, executeOffer, setActiveOffer)}
			{GameGrid("Recently Updated", mostRecentResults, executeOffer, setActiveOffer)}
		</Box>
	);
}

export default App;
