// src/components/AutoSave.jsx

import React, { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-toastify";
import { useConfig } from "./ConfigContext";

function AutoSave() {
	const { config, currentlyLoadedConfig } = useConfig();
	const timeoutRef = useRef(null);
	const currentConfigRef = useRef(null);

	useEffect(() => {
		currentConfigRef.current = currentlyLoadedConfig;
	}, [currentlyLoadedConfig]);

	useEffect(() => {
		const setupAutoSave = async () => {
			try {
				const settings = await invoke("load_settings_command");
				console.log("Auto-save settings:", settings);
				if (settings.auto_save_enabled) {
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current);
					}
					timeoutRef.current = setTimeout(
						autoSave,
						settings.auto_save_interval * 60 * 1000
					);
					console.log(
						"Auto-save scheduled for",
						settings.auto_save_interval,
						"minutes"
					);
				}
			} catch (error) {
				console.error("Failed to setup auto-save:", error);
			}
		};

		setupAutoSave();

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [config, currentlyLoadedConfig]);

	const autoSave = async () => {
		try {
			const currentConfig = currentConfigRef.current;
			if (!currentConfig) {
				console.log("No configuration loaded, skipping auto-save");
				return;
			}

			console.log("Attempting to auto-save...", currentConfig);
			await invoke("auto_save_config", { config, configId: currentConfig.id });
			console.log("Auto-save successful");
			toast.success("Configuration auto-saved successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		} catch (error) {
			console.error("Auto-save failed:", error);
			toast.error("Failed to auto-save configuration");
		} finally {
			const settings = await invoke("load_settings_command");
			if (settings.auto_save_enabled) {
				timeoutRef.current = setTimeout(
					autoSave,
					settings.auto_save_interval * 60 * 1000
				);
				console.log(
					"Next auto-save scheduled for",
					settings.auto_save_interval,
					"minutes"
				);
			}
		}
	};

	return null;
}

export default AutoSave;
