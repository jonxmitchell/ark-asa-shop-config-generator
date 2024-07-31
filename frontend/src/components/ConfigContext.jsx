// src/components/ConfigContext.jsx

import React, { createContext, useContext, useState, useCallback } from "react";
import { defaultConfig } from "../config/defaultConfig";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
	const [config, setConfig] = useState(defaultConfig);

	const updateConfig = useCallback((newConfig) => {
		if (typeof newConfig === "function") {
			setConfig((prevConfig) => {
				const updatedConfig = newConfig(prevConfig);
				console.log("Updated config:", updatedConfig); // For debugging
				return updatedConfig;
			});
		} else {
			setConfig(newConfig);
			console.log("Updated config:", newConfig); // For debugging
		}
	}, []);

	return (
		<ConfigContext.Provider value={{ config, updateConfig }}>
			{children}
		</ConfigContext.Provider>
	);
};
