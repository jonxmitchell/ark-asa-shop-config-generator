// src/components/ConfigContext.jsx

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { defaultConfig } from "../config/defaultConfig";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children, initialShowTooltips = true }) => {
	const [config, setConfig] = useState(defaultConfig);
	const [currentlyLoadedConfig, setCurrentlyLoadedConfig] = useState(null);
	const [showTooltips, setShowTooltips] = useState(initialShowTooltips);
	const [autoSaveSettings, setAutoSaveSettings] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentExportPath, setCurrentExportPath] = useState("");

	const updateConfig = useCallback((newConfigOrUpdater) => {
		setConfig((prevConfig) => {
			const newConfig =
				typeof newConfigOrUpdater === "function"
					? newConfigOrUpdater(prevConfig)
					: newConfigOrUpdater;

			const updatedConfig = {
				...prevConfig,
				...newConfig,
			};

			console.log("Updated config:", updatedConfig);
			return updatedConfig;
		});
	}, []);

	const loadAutoSaveSettings = useCallback(async () => {
		try {
			const settings = await invoke("load_settings_command");
			setAutoSaveSettings({
				enabled: settings.auto_save_enabled,
				interval: settings.auto_save_interval,
			});
			console.log("Loaded auto-save settings:", settings);
		} catch (error) {
			console.error("Failed to load auto-save settings:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadAutoSaveSettings();
	}, [loadAutoSaveSettings]);

	const loadConfig = useCallback((configToLoad) => {
		setCurrentlyLoadedConfig(configToLoad);
		setConfig(JSON.parse(configToLoad.config));
		setCurrentExportPath(configToLoad.custom_export_path || "");
		console.log("Loaded config:", configToLoad);
	}, []);

	const unloadConfig = useCallback(() => {
		setCurrentlyLoadedConfig(null);
		setConfig(defaultConfig);
		setCurrentExportPath("");
		console.log("Unloaded config, reset to default");
	}, []);

	const importConfig = useCallback((importedConfig) => {
		setCurrentlyLoadedConfig(null);
		setConfig(importedConfig);
		setCurrentExportPath("");
		console.log("Imported new config, current config unloaded");
	}, []);

	const toggleTooltips = useCallback((value) => {
		setShowTooltips((prevState) => (value !== undefined ? value : !prevState));
	}, []);

	const updateCurrentExportPath = useCallback((newPath) => {
		setCurrentExportPath(newPath);
	}, []);

	const contextValue = {
		config,
		updateConfig,
		currentlyLoadedConfig,
		loadConfig,
		unloadConfig,
		importConfig,
		showTooltips,
		toggleTooltips,
		autoSaveSettings,
		setAutoSaveSettings,
		loadAutoSaveSettings,
		currentExportPath,
		updateCurrentExportPath,
	};

	if (isLoading) {
		return null; // or a loading spinner
	}

	return (
		<ConfigContext.Provider value={contextValue}>
			{children}
		</ConfigContext.Provider>
	);
};
