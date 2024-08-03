// src/components/ConfigContext.jsx

import React, { createContext, useContext, useState, useCallback } from "react";
import { defaultConfig } from "../config/defaultConfig";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
	const [config, setConfig] = useState(defaultConfig);
	const [currentlyLoadedConfig, setCurrentlyLoadedConfig] = useState(null);

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
		// Unload current config
		setCurrentlyLoadedConfig(null);
		// Set the new imported config
		setConfig(importedConfig);
		console.log("Imported new config, current config unloaded");
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
			}}>
			{children}
		</ConfigContext.Provider>
	);
};
