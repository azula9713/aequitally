import { useCallback, useEffect, useState } from "react";
import {
	defaultTipsPreferences,
	loadTipsPreferences,
	saveTipsPreferences,
	type TipsPreferences,
} from "@/lib/handlers/tips-handler";

export default function useTipsPreferences() {
	const [preferences, setPreferences] = useState<TipsPreferences>(
		defaultTipsPreferences,
	);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setPreferences(loadTipsPreferences());
		setIsLoaded(true);
	}, []);

	useEffect(() => {
		const handleStorageChange = () => {
			setPreferences(loadTipsPreferences());
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const updatePreferences = useCallback(
		(updater: (prev: TipsPreferences) => TipsPreferences) => {
			const newPreferences = updater(preferences);
			setPreferences(newPreferences);
			saveTipsPreferences(newPreferences);

			window.dispatchEvent(new Event("storage"));
		},
		[preferences],
	);

	const hideTips = useCallback(
		(tipType: keyof TipsPreferences) => {
			updatePreferences((prev) => ({
				...prev,
				[tipType]: false,
			}));
		},
		[updatePreferences],
	);

	const showTips = useCallback(
		(tipType: keyof TipsPreferences) => {
			updatePreferences((prev) => ({
				...prev,
				[tipType]: true,
			}));
		},
		[updatePreferences],
	);

	return {
		preferences,
		updatePreferences,
		hideTips,
		showTips,
		isLoaded,
	};
}
