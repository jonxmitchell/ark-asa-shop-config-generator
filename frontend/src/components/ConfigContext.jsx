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

			const updatedConfig = {
				...prevConfig,
				...newConfig,
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
