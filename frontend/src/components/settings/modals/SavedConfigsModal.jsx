// src/components/settings/modals/SavedConfigsModal.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import { useConfig } from "../../ConfigContext";
import { toast } from "react-toastify";
import {
	XMarkIcon,
	ArrowPathIcon,
	TrashIcon,
	ArrowDownTrayIcon,
	BoltSlashIcon,
} from "@heroicons/react/24/solid";

function SavedConfigsModal({ isOpen, onClose }) {
	const [savedConfigs, setSavedConfigs] = useState([]);
	const [newConfigName, setNewConfigName] = useState("");
	const [showLoadWarning, setShowLoadWarning] = useState(false);
	const [showSaveWarning, setShowSaveWarning] = useState(false);
	const [configToLoad, setConfigToLoad] = useState(null);
	const { config, currentlyLoadedConfig, loadConfig, unloadConfig } =
		useConfig();

	useEffect(() => {
		if (isOpen) {
			loadSavedConfigs();
		}
	}, [isOpen]);

	const loadSavedConfigs = async () => {
		try {
			const configs = await invoke("load_configs_command");
			setSavedConfigs(configs);
		} catch (error) {
			console.error("Failed to load saved configs:", error);
			toast.error("Failed to load saved configs");
		}
	};

	const handleSaveCurrentConfig = async () => {
		if (!newConfigName.trim()) {
			toast.error("Please enter a name for the current config");
			return;
		}
		if (currentlyLoadedConfig) {
			setShowSaveWarning(true);
		} else {
			saveConfig();
		}
	};

	const saveConfig = async () => {
		try {
			const newConfigId = await invoke("save_config_command", {
				id: null, // Null ID indicates a new save
				name: newConfigName,
				config: config,
			});
			toast.success("Config saved successfully");
			await loadSavedConfigs();
			setNewConfigName("");

			// Unload the current config
			unloadConfig();

			// Load the newly saved config
			const newConfig = {
				id: newConfigId,
				name: newConfigName,
				config: JSON.stringify(config),
			};
			loadConfig(newConfig);
			setShowSaveWarning(false);
		} catch (error) {
			console.error("Failed to save config:", error);
			if (error.toString().includes("already exists")) {
				toast.error("A configuration with this name already exists");
			} else {
				toast.error("Failed to save config");
			}
		}
	};

	const handleLoadConfig = (configToLoad) => {
		setConfigToLoad(configToLoad);
		setShowLoadWarning(true);
	};

	const confirmLoadConfig = () => {
		if (configToLoad) {
			loadConfig(configToLoad);
			toast.success("Config loaded successfully");
			setShowLoadWarning(false);
		}
	};

	const handleDeleteConfig = async (id) => {
		try {
			await invoke("delete_config_command", { id });
			toast.success("Config deleted successfully");
			await loadSavedConfigs();
			if (currentlyLoadedConfig && currentlyLoadedConfig.id === id) {
				unloadConfig();
			}
		} catch (error) {
			console.error("Failed to delete config:", error);
			toast.error("Failed to delete config");
		}
	};

	const handleUpdateConfig = async () => {
		if (currentlyLoadedConfig) {
			try {
				await invoke("save_config_command", {
					id: currentlyLoadedConfig.id,
					name: currentlyLoadedConfig.name,
					config: config,
				});
				toast.success("Config updated successfully");
				await loadSavedConfigs();
			} catch (error) {
				console.error("Failed to update config:", error);
				toast.error("Failed to update config");
			}
		}
	};

	const handleUnloadConfig = () => {
		unloadConfig();
		toast.success("Configuration unloaded");
	};

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-mid-black rounded-lg w-3/4 max-w-3xl max-h-[80vh] flex flex-col">
				<div className="sticky top-0 bg-mid-black z-10 p-6 rounded-t-lg border-b border-gray-700">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold text-white">
							Saved Configurations
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white">
							<XMarkIcon className="h-6 w-6" />
						</button>
					</div>
				</div>

				<div className="overflow-y-auto flex-grow p-6">
					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2 text-white">
							Loaded Configuration
						</h3>
						<div className="bg-light-black p-4 rounded-lg flex justify-between items-center">
							<span className="text-white">
								{currentlyLoadedConfig
									? currentlyLoadedConfig.name
									: "No config loaded"}
							</span>
							<div className="space-x-2">
								<button
									onClick={handleUpdateConfig}
									disabled={!currentlyLoadedConfig}
									className="p-1 text-blue-500 hover:text-blue-400 disabled:text-gray-600 disabled:cursor-not-allowed"
									title="Update">
									<ArrowPathIcon className="h-5 w-5" />
								</button>
								<button
									onClick={handleUnloadConfig}
									disabled={!currentlyLoadedConfig}
									className="p-1 text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed"
									title="Unload">
									<BoltSlashIcon className="h-5 w-5" />
								</button>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2 text-white">
							Save Current Configuration
						</h3>
						<div className="flex space-x-2">
							<input
								type="text"
								value={newConfigName}
								onChange={(e) => setNewConfigName(e.target.value)}
								placeholder="Enter config name"
								className="flex-grow px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
							/>
							<button
								onClick={handleSaveCurrentConfig}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
								Save
							</button>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-2 text-white sticky top-0 bg-mid-black py-2">
							Saved Configurations
						</h3>
						{savedConfigs.map((savedConfig) => (
							<div
								key={savedConfig.id}
								className="flex items-center justify-between bg-light-black p-4 rounded-lg">
								<span className="text-white">{savedConfig.name}</span>
								<div className="space-x-2">
									<button
										onClick={() => handleLoadConfig(savedConfig)}
										className="p-1 text-green-500 hover:text-green-400"
										title="Load">
										<ArrowDownTrayIcon className="h-5 w-5" />
									</button>
									<button
										onClick={() => handleDeleteConfig(savedConfig.id)}
										className="p-1 text-red-500 hover:text-red-400"
										title="Delete">
										<TrashIcon className="h-5 w-5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{showLoadWarning && (
					<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
						<div className="bg-mid-black p-6 rounded-lg">
							<h3 className="text-lg font-semibold mb-4 text-white">
								⚠️ Warning
							</h3>
							<p className="mb-4 text-gray-300">
								Loading a new config will overwrite your current unsaved
								changes. Do you want to proceed?
							</p>
							<div className="flex justify-end space-x-4">
								<button
									onClick={() => setShowLoadWarning(false)}
									className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
									Cancel
								</button>
								<button
									onClick={confirmLoadConfig}
									className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
									Proceed
								</button>
							</div>
						</div>
					</div>
				)}

				{showSaveWarning && (
					<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
						<div className="bg-mid-black p-6 rounded-lg">
							<h3 className="text-lg font-semibold mb-4 text-white">
								⚠️ Warning
							</h3>
							<p className="mb-4 text-gray-300">
								Saving a new config will unload the currently loaded config and
								you will lose any unsaved changes. Do you want to proceed?
							</p>
							<div className="flex justify-end space-x-4">
								<button
									onClick={() => setShowSaveWarning(false)}
									className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
									Cancel
								</button>
								<button
									onClick={saveConfig}
									className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
									Proceed
								</button>
							</div>
						</div>
					</div>
				)}
			</motion.div>
		</motion.div>
	);
}

export default SavedConfigsModal;
