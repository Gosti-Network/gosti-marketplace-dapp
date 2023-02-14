import axios from "axios";

import {
	createContext,
	ReactNode,
	useContext,
	useState,
} from "react";
import Game from "../spriggan-shared/types/Game";
import { SearchParams } from "../spriggan-shared/types/SearchTypes";

/**
 * Types
 */
interface IContext {
	apiUrl: string,
	setApiUrl: React.Dispatch<React.SetStateAction<string>>,
	search: SearchCallback,
	mostRecent: SearchCallback,
}

type SearchCallback = (params: SearchParams) => Promise<Game[]>;

/**
 * Context
 */
export const SearchContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function SearchContextProvider({children}: {
	children: ReactNode | ReactNode[];
}) {
	const [apiUrl, setApiUrl] = useState('http://localhost:5233')

	const hitsToGameList = (hits: any) => {
		const games = new Array<Game>()
		if (hits) {
			hits.forEach((hit: any) => {
				games.push(hit._source as Game)
			});
		}
		return games
	}

	const search = async (params: SearchParams) => {
		const response = await axios.get(`${apiUrl}/games/search`, { params: { titleTerm: params.titleTerm } })
		return hitsToGameList(response.data.hits.hits);
	}

	const mostRecent = async (params: SearchParams) => {
		const response = await axios.get(`${apiUrl}/games/mostRecent`, { params: {} })
		return hitsToGameList(response.data.hits.hits);
	}

	return (
		<SearchContext.Provider
			value={{
				apiUrl,
				setApiUrl,
				search,
				mostRecent,
			}}
			>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error(
			"useSearch must be used within a SearchContextProvider"
		);
	}
	return context;
}
