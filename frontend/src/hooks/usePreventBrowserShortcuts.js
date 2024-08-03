// src/hooks/usePreventBrowserShortcuts.js

import { useEffect } from "react";

export function usePreventBrowserShortcuts() {
	useEffect(() => {
		const handleKeyDown = (event) => {
			// List of shortcuts to disable
			const disabledShortcuts = [
				"F12", // Developer Tools
				"F3", // Find
				"F5", // Reload
				"F7", // Select Text With Keyboard
				"Control+R", // Reload
				"Control+Shift+R", // Hard Reload
				"Control+Shift+I", // Developer Tools
				"Control+Shift+C", // Inspect Element
				"Control+W", // Close Tab
				"Control+S", // Save
				"Control+O", // Open
				"Control+N", // New Window
				"Alt+F4", // Close Window
			];

			const key = event.key;
			const isCtrl = event.ctrlKey;
			const isShift = event.shiftKey;
			const isAlt = event.altKey;

			// Special handling for Ctrl+P and Ctrl+F
			if (
				isCtrl &&
				(key === "p" || key === "P" || key === "f" || key === "F")
			) {
				event.preventDefault();
				event.stopPropagation();
				console.log(`Disabled shortcut: Control+${key}`);
				return false;
			}

			const shortcut = `${isCtrl ? "Control+" : ""}${isShift ? "Shift+" : ""}${
				isAlt ? "Alt+" : ""
			}${key}`;

			if (disabledShortcuts.includes(shortcut)) {
				event.preventDefault();
				event.stopPropagation();
				console.log(`Disabled shortcut: ${shortcut}`);
				return false;
			}
		};

		// Use both keydown and keyup events
		document.addEventListener("keydown", handleKeyDown, { capture: true });
		document.addEventListener("keyup", handleKeyDown, { capture: true });

		return () => {
			document.removeEventListener("keydown", handleKeyDown, { capture: true });
			document.removeEventListener("keyup", handleKeyDown, { capture: true });
		};
	}, []);
}
