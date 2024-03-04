import {
	CardActionArea, Typography,
	CardMedia, CardContent, Card
} from '@mui/material';
import * as React from 'react';

import StorePage, { StorePageProps } from '../gosti-shared/components/StorePage';
import { Media } from '../gosti-shared/types/gosti/Media';

export type GameCardProps = {
	game: Media;
};

export default function GameCard(props: GameCardProps) {
	const { game } = props;

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	return (
		<div><Card sx={{ maxWidth: 345 }} onClick={handleClickOpen}>
			<CardActionArea>
				<CardMedia
					component="img"
					height="140"
					image={props.game.capsuleImage}
					alt={props.game.title}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5">
						{props.game.title}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{props.game.shortDescription}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
			{StorePage({ media: game, open, setOpen } as StorePageProps)}
		</div>
	);
};

