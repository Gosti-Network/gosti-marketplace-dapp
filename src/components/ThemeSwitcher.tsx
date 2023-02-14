import { Button, useColorScheme } from "@mui/material";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
	const { mode, setMode } = useColorScheme();
	const [mounted, setMounted] = useState(false);

	setMode('dark')

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// for server-side rendering
		// learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
		return null;
	}
	
	return (
		<Button
			variant="outlined"
			onClick={() => {
			if (mode === 'light') {
				setMode('dark');
			} else {
				setMode('light');
			}
			}}
		>
			{mode === 'light' ? 'Light Mode' : 'Dark Mode'}
		</Button>
	);
};

export default ThemeSwitcher;