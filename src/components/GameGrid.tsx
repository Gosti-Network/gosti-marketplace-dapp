import { Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Media from "../spriggan-shared/types/Media";
import GameCard from "./GameCard";

const GameGrid = (
			title: string,
			searchResults: Media[],
			onBuy: () => Promise<void>,
			setActiveOffer: React.Dispatch<React.SetStateAction<string>>
		) => {

	let render = <></>

	if (searchResults.length > 0) {
		render =
			<Paper elevation={1} sx={{ m:2 }}>
				<Typography sx={{ p:2 }} variant="h4">{title}</Typography>
				<Grid container p={4} spacing={4} id="gameslist">
						{searchResults && searchResults.map((result: Media) => (
							<Grid key={result.productid} item xs={6} sm={4} md={3} lg={2}>
							<GameCard
								game={result}
								onBuy={onBuy}
								setActiveOffer={setActiveOffer}
								/>
							</Grid>
						))}
				</Grid>
			</Paper>
	}
	
	return (
		<Paper elevation={1} sx={{ m:2 }}>
			{render}
		</Paper>
	);
}

export default GameGrid;