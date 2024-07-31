// src/components/ConfigContext.jsx

import React, { createContext, useContext, useState, useCallback } from "react";
import { defaultConfig } from "../config/defaultConfig";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
	const [config, setConfig] = useState(defaultConfig);

	const updateConfig = useCallback((newConfigOrUpdater) => {
		setConfig((prevConfig) => {
			const newConfig =
				typeof newConfigOrUpdater === "function"
					? newConfigOrUpdater(prevConfig)
					: newConfigOrUpdater;

			// Merge the new config with the previous config
			const updatedConfig = {
				...prevConfig,
				...newConfig,
				// Ensure nested objects are also merged
				Kits: { ...prevConfig.Kits, ...newConfig.Kits },
				Messages: { ...prevConfig.Messages, ...newConfig.Messages },
				General: { ...prevConfig.General, ...newConfig.General },
				ShopItems: { ...prevConfig.ShopItems, ...newConfig.ShopItems },
				SellItems: { ...prevConfig.SellItems, ...newConfig.SellItems },
			};

			console.log("Updated config:", updatedConfig); // For debugging
			return updatedConfig;
		});
	}, []);

	return (
		<ConfigContext.Provider value={{ config, updateConfig }}>
			{children}
		</ConfigContext.Provider>
	);
};
