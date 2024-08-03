// src/components/ConfigContext.jsx

import React, { createContext, useContext, useState, useCallback } from "react";
import { defaultConfig } from "../config/defaultConfig";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children, initialShowTooltips = true }) => {
	const [config, setConfig] = useState(defaultConfig);
	const [currentlyLoadedConfig, setCurrentlyLoadedConfig] = useState(null);
	const [showTooltips, setShowTooltips] = useState(initialShowTooltips);

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

	const loadConfig = useCallback((configToLoad) => {
		setCurrentlyLoadedConfig(configToLoad);
		setConfig(JSON.parse(configToLoad.config));
		console.log("Loaded config:", configToLoad);
	}, []);

	const unloadConfig = useCallback(() => {
		setCurrentlyLoadedConfig(null);
		setConfig(defaultConfig);
		console.log("Unloaded config");
	}, []);

	const importConfig = useCallback((importedConfig) => {
		setCurrentlyLoadedConfig(null);
		setConfig(importedConfig);
		console.log("Imported new config, current config unloaded");
	}, []);

	const toggleTooltips = useCallback((value) => {
		setShowTooltips((prevState) => (value !== undefined ? value : !prevState));
	}, []);

	return (
		<ConfigContext.Provider
			value={{
				config,
				updateConfig,
				currentlyLoadedConfig,
				loadConfig,
				unloadConfig,
				importConfig,
				showTooltips,
				toggleTooltips,
			}}>
			{children}
		</ConfigContext.Provider>
	);
};
