// src/components/AutoSave.jsx

import React, { useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-toastify";
import { useConfig } from "./ConfigContext";

function AutoSave() {
	const { config, currentlyLoadedConfig, autoSaveSettings } = useConfig();
	const intervalRef = useRef(null);
	const latestConfigRef = useRef(config);
	const latestLoadedConfigRef = useRef(currentlyLoadedConfig);

	// Update refs when config or currentlyLoadedConfig changes
	useEffect(() => {
		latestConfigRef.current = config;
	}, [config]);

	const autoSave = useCallback(async () => {
		const currentConfig = latestConfigRef.current;
		const currentLoadedConfig = latestLoadedConfigRef.current;

		if (!currentLoadedConfig) {
			console.log("Auto-save skipped: no configuration loaded");
			return;
		}

		try {
			console.log("Attempting to auto-save...", currentLoadedConfig);
			await invoke("auto_save_config", {
				config: currentConfig,
				configId: currentLoadedConfig.id,
			});
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
			toast.error("Failed to auto-save configuration", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	}, []);

	const setupAutoSave = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (autoSaveSettings.enabled && latestLoadedConfigRef.current) {
			console.log("Setting up auto-save...");
			intervalRef.current = setInterval(
				autoSave,
				autoSaveSettings.interval * 60 * 1000
			);
			console.log(
				"Auto-save scheduled for every",
				autoSaveSettings.interval,
				"minutes"
			);
		} else {
			console.log("Auto-save is disabled or no configuration is loaded");
		}
	}, [autoSaveSettings, autoSave]);

	useEffect(() => {
		latestLoadedConfigRef.current = currentlyLoadedConfig;
		setupAutoSave();
	}, [currentlyLoadedConfig, setupAutoSave]);

	useEffect(() => {
		setupAutoSave();

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [setupAutoSave]);

	return null;
}

export default React.memo(AutoSave);
