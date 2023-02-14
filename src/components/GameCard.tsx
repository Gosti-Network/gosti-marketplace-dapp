import * as React from 'react';
import {
	CardActionArea, Typography,
	CardMedia, CardContent, Card
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

import type Game from '../spriggan-shared/types/Game';
import StorePage, { StorePageProps } from './StorePage';

export type GameCardProps = {
	game: Game;
	setActiveOffer: Dispatch<SetStateAction<string>>;
	onBuy: () => void;
};

export default function GameCard( props: GameCardProps ) {

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};	

	return (
		<div><Card sx={{ maxWidth: 345 }} onClick={ handleClickOpen }>
			<CardActionArea>
				<CardMedia
					component="img"
					height="140"
					image={props.game.capsuleimage}
					alt={props.game.title}
				/>
				<CardContent>
				<Typography gutterBottom variant="h5">
					{props.game.title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{props.game.shortdescription}
				</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
		{StorePage({open, setOpen, ...props} as StorePageProps)}
		</div>
	);
};

