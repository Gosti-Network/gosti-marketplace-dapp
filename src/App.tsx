import { useEffect, useState } from "react";
import './App.css';

import axios from 'axios';

import { Box } from "@mui/material";
import MainTopBar from "./components/MainTopBar";
import Game from "./spriggan-shared/types/Game";

import { useWalletConnectClient } from "./contexts/ClientContext";
import { useJsonRpc } from "./contexts/JsonRpcContext";
import GameGrid from "./components/GameGrid";
import { useSearch } from "./contexts/SearchContext";
import { SearchParams } from "./spriggan-shared/types/SearchTypes";

function App() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>(setTimeout(async () => {}, 100));
	const [activeOffer, setActiveOffer] = useState<string>("");

	const { search, mostRecent } = useSearch()
	
	const [searchResults, setSearchResults] = useState<Game[]>([]);
	useEffect(() => {
		if (searchTerm !== "") {
			clearTimeout(searchDebounce)
			setSearchDebounce(setTimeout(async () => {
				setSearchResults(await search({titleTerm: searchTerm} as SearchParams))
			}, 300));
		}
	}, [searchTerm]);

	const [mostRecentResults, setMostRecentResults] = useState<Game[]>([]);
	useEffect(() => {
		async function fetchData() {
			setMostRecentResults(await mostRecent({} as SearchParams));
		  }
		  fetchData();
	}, [mostRecent]);

	useEffect(() => {
		document.title = `Spriggan Marketplace`;
	}, [searchResults]);

	const [modal, setModal] = useState("");

	const closeModal = () => setModal("");
	const openPingModal = () => setModal("ping");

	// Initialize the WalletConnect client.
	const {
		client,
		pairings,
		session,
		connect,
		disconnect,
		chains,
		setChains,
	} = useWalletConnectClient();

	// Use `JsonRpcContext` to provide us with relevant RPC methods and states.
	const {
		ping,
		chiaRpc,
	} = useJsonRpc();

	// Close the pairing modal after a session is established.
	useEffect(() => {
		if (session && modal === "pairing") {
		closeModal();
		}
	}, [session, modal]);

	const onConnect = () => {
		if (typeof client === "undefined") {
			throw new Error("WalletConnect is not initialized");
		}
		// Suggest existing pairings (if any).
		if (pairings.length) {
			connect(pairings[0]);
		} else {
			handleChainSelectionClick("chia:mainnet");
			// If no existing pairings are available, trigger `WalletConnectClient.connect`.
			connect();
		}
	};

	const onPing = async () => {
		openPingModal();
		await ping();
	};

	const executeOffer = async () => {
		if (session && activeOffer) {
			var x = session.namespaces.chia.accounts[0].split(":");
			console.log(x[0] + ':' + x[1], x[2]);
			await chiaRpc.acceptOffer(x[0] + ':' + x[1], x[2], activeOffer);
		}
	};

	const handleChainSelectionClick = (chainId: string) => {
		if (chains.includes(chainId)) {
			// setChains(chains.filter((chain) => chain !== chainId));
		} else {
			setChains([...chains, chainId]);
		}
	};

	
	return (
			<Box>
				{MainTopBar(session, onConnect, onPing, disconnect, (event) => {setSearchTerm(event.target.value)})}
				{GameGrid("Search Results", searchResults, executeOffer, setActiveOffer)}
				{GameGrid("Recently Updated", mostRecentResults, executeOffer, setActiveOffer)}
			</Box>
	);
}

export default App;
