// src/components/settings/modals/SavedConfigsModal.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { useConfig } from "../../ConfigContext";
import { toast } from "react-toastify";
import {
	XMarkIcon,
	TrashIcon,
	ArrowDownTrayIcon,
	BoltSlashIcon,
	PencilSquareIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { CiFloppyDisk } from "react-icons/ci";
import { Tooltip } from "react-tooltip";

function SavedConfigsModal({ isOpen, onClose }) {
	const [savedConfigs, setSavedConfigs] = useState([]);
	const [newConfigName, setNewConfigName] = useState("");
	const [showLoadWarning, setShowLoadWarning] = useState(false);
	const [showSaveWarning, setShowSaveWarning] = useState(false);
	const [configToLoad, setConfigToLoad] = useState(null);
	const [renamingConfig, setRenamingConfig] = useState(null);
	const [newName, setNewName] = useState("");
	const [showExportPath, setShowExportPath] = useState({});
	const [customExportPaths, setCustomExportPaths] = useState({});
	const {
		config,
		currentlyLoadedConfig,
		loadConfig,
		unloadConfig,
		showTooltips,
	} = useConfig();

	useEffect(() => {
		if (isOpen) {
			loadSavedConfigs();
		}
	}, [isOpen]);

	const loadSavedConfigs = async () => {
		try {
			const configs = await invoke("load_configs_command");
			setSavedConfigs(configs);
			const paths = {};
			configs.forEach((config) => {
				paths[config.id] = config.custom_export_paths || [];
			});
			setCustomExportPaths(paths);
		} catch (error) {
			console.error("Failed to load saved configs:", error);
			toast.error("Failed to load saved configs", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	};

	const handleSaveCurrentConfig = async () => {
		if (!newConfigName.trim()) {
			toast.error("Please enter a name for the current config", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			return;
		}

		if (savedConfigs.some((config) => config.name === newConfigName.trim())) {
			toast.error("A configuration with this name already exists", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
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
				id: null,
				name: newConfigName,
				config: config,
				customExportPaths: [],
			});
			toast.success("Config saved successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			await loadSavedConfigs();
			setNewConfigName("");

			const newConfig = {
				id: newConfigId,
				name: newConfigName,
				config: JSON.stringify(config),
				custom_export_paths: [],
			};
			loadConfig(newConfig);
			setShowSaveWarning(false);
		} catch (error) {
			console.error("Failed to save config:", error);
			toast.error("Failed to save config", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	};

	const handleLoadConfig = (configToLoad) => {
		setConfigToLoad(configToLoad);
		setShowLoadWarning(true);
	};

	const confirmLoadConfig = () => {
		if (configToLoad) {
			loadConfig(configToLoad);
			toast.success("Config loaded successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			setShowLoadWarning(false);
		}
	};

	const handleDeleteConfig = async (id) => {
		try {
			await invoke("delete_config_command", { id });
			toast.success("Config deleted successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			await loadSavedConfigs();
			if (currentlyLoadedConfig && currentlyLoadedConfig.id === id) {
				unloadConfig();
			}
		} catch (error) {
			console.error("Failed to delete config:", error);
			toast.error("Failed to delete config", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	};

	const handleUpdateConfig = async () => {
		if (currentlyLoadedConfig) {
			try {
				await invoke("save_config_command", {
					id: currentlyLoadedConfig.id,
					name: currentlyLoadedConfig.name,
					config: config,
					customExportPaths: customExportPaths[currentlyLoadedConfig.id] || [],
				});
				toast.success("Config updated successfully", {
					position: "bottom-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
				await loadSavedConfigs();
			} catch (error) {
				console.error("Failed to update config:", error);
				toast.error("Failed to update config", {
					position: "bottom-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
			}
		}
	};

	const handleUnloadConfig = () => {
		unloadConfig();
		toast.success("Configuration unloaded", {
			position: "bottom-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			theme: "dark",
		});
	};

	const handleStartRename = (config) => {
		setRenamingConfig(config);
		setNewName(config.name);
	};

	const handleCancelRename = () => {
		setRenamingConfig(null);
		setNewName("");
	};

	const handleConfirmRename = async () => {
		if (newName.trim() === "") {
			toast.error("Config name cannot be empty", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			return;
		}

		if (
			savedConfigs.some(
				(config) =>
					config.name === newName.trim() && config.id !== renamingConfig.id
			)
		) {
			toast.error("A configuration with this name already exists", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			return;
		}

		try {
			await invoke("save_config_command", {
				id: renamingConfig.id,
				name: newName,
				config: JSON.parse(renamingConfig.config),
				customExportPaths: customExportPaths[renamingConfig.id] || [],
			});
			toast.success("Config renamed successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			await loadSavedConfigs();
			setRenamingConfig(null);
			setNewName("");

			if (
				currentlyLoadedConfig &&
				currentlyLoadedConfig.id === renamingConfig.id
			) {
				loadConfig({
					...currentlyLoadedConfig,
					name: newName,
				});
			}
		} catch (error) {
			console.error("Failed to rename config:", error);
			toast.error("Failed to rename config", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	};

	const handleCustomExportPathChange = async (configId, paths) => {
		try {
			await invoke("update_config_export_paths_command", { configId, paths });
			toast.success("Custom export paths updated successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
			await loadSavedConfigs();

			if (currentlyLoadedConfig && currentlyLoadedConfig.id === configId) {
				loadConfig({
					...currentlyLoadedConfig,
					custom_export_paths: paths,
				});
			}
		} catch (error) {
			console.error("Failed to update custom export paths:", error);
			toast.error("Failed to update custom export paths", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	};

	const handleAddExportPath = async (configId) => {
		try {
			const selected = await open({
				directory: true,
				multiple: false,
			});
			if (selected) {
				const updatedPaths = [...(customExportPaths[configId] || []), selected];
				setCustomExportPaths({
					...customExportPaths,
					[configId]: updatedPaths,
				});
				handleCustomExportPathChange(configId, updatedPaths);
			}
		} catch (error) {
			console.error("Failed to open folder dialog:", error);
			toast.error("Failed to open folder dialog", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	};

	const toggleShowExportPath = (configId) => {
		setShowExportPath((prev) => ({
			...prev,
			[configId]: !prev[configId],
		}));
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
							className="text-gray-400 hover:text-white"
							data-tooltip-id="close-modal"
							data-tooltip-content="Close modal">
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
									className="p-1 text-green-500 hover:text-green-400 disabled:text-gray-600 disabled:cursor-not-allowed"
									data-tooltip-id="update-config"
									data-tooltip-content="Update current configuration">
									<CiFloppyDisk className="h-5 w-5" />
								</button>
								<button
									onClick={handleUnloadConfig}
									disabled={!currentlyLoadedConfig}
									className="p-1 text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed"
									data-tooltip-id="unload-config"
									data-tooltip-content="Unload current configuration">
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
								data-tooltip-id="new-config-name"
								data-tooltip-content="Enter a name for the new configuration"
							/>
							<button
								onClick={handleSaveCurrentConfig}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
								data-tooltip-id="save-config"
								data-tooltip-content="Save current configuration">
								Save
							</button>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-2 text-white sticky top-0 bg-mid-black py-2">
							Saved Configurations
						</h3>
						<AnimatePresence>
							{savedConfigs.map((savedConfig) => (
								<motion.div
									key={savedConfig.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="bg-light-black p-4 rounded-lg space-y-4">
									<div className="flex items-center justify-between">
										{renamingConfig && renamingConfig.id === savedConfig.id ? (
											<div className="flex items-center space-x-2">
												<input
													type="text"
													value={newName}
													onChange={(e) => setNewName(e.target.value)}
													className="w-48 px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
													autoFocus
												/>
												<button
													onClick={handleConfirmRename}
													className="p-1 text-green-500 hover:text-green-400"
													data-tooltip-id={`confirm-rename-${savedConfig.id}`}
													data-tooltip-content="Confirm rename">
													<CheckIcon className="h-5 w-5" />
												</button>
												<button
													onClick={handleCancelRename}
													className="p-1 text-red-500 hover:text-red-400"
													data-tooltip-id={`cancel-rename-${savedConfig.id}`}
													data-tooltip-content="Cancel rename">
													<XMarkIcon className="h-5 w-5" />
												</button>
											</div>
										) : (
											<>
												<span className="text-white flex-grow">
													{savedConfig.name}
												</span>
												<div
													className="text-gray-400 hover:text-gray-300 cursor-pointer flex items-center mx-4"
													onClick={() => toggleShowExportPath(savedConfig.id)}>
													<span className="mr-2 text-sm">
														Custom Export Paths
													</span>
													{showExportPath[savedConfig.id] ? (
														<ChevronUpIcon className="h-4 w-4" />
													) : (
														<ChevronDownIcon className="h-4 w-4" />
													)}
												</div>
												<div className="flex items-center space-x-2">
													<button
														onClick={() => handleStartRename(savedConfig)}
														className="p-1 text-blue-500 hover:text-blue-400"
														data-tooltip-id={`rename-config-${savedConfig.id}`}
														data-tooltip-content={`Rename ${savedConfig.name}`}>
														<PencilSquareIcon className="h-5 w-5" />
													</button>
													<button
														onClick={() => handleLoadConfig(savedConfig)}
														className="p-1 text-green-500 hover:text-green-400"
														data-tooltip-id={`load-config-${savedConfig.id}`}
														data-tooltip-content={`Load ${savedConfig.name}`}>
														<ArrowDownTrayIcon className="h-5 w-5" />
													</button>
													<button
														onClick={() => handleDeleteConfig(savedConfig.id)}
														className="p-1 text-red-500 hover:text-red-400"
														data-tooltip-id={`delete-config-${savedConfig.id}`}
														data-tooltip-content={`Delete ${savedConfig.name}`}>
														<TrashIcon className="h-5 w-5" />
													</button>
												</div>
											</>
										)}
									</div>
									{showExportPath[savedConfig.id] && (
										<div className="mt-2 space-y-2">
											<h6 className="text-sm font-medium text-gray-300">
												Custom Export Paths
											</h6>
											{(customExportPaths[savedConfig.id] || []).map(
												(path, index) => (
													<div
														key={index}
														className="flex items-center space-x-2">
														<input
															type="text"
															value={path}
															readOnly
															className="flex-grow px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
														/>
														<button
															onClick={() => {
																const updatedPaths = customExportPaths[
																	savedConfig.id
																].filter((_, i) => i !== index);
																setCustomExportPaths({
																	...customExportPaths,
																	[savedConfig.id]: updatedPaths,
																});
																handleCustomExportPathChange(
																	savedConfig.id,
																	updatedPaths
																);
															}}
															className="text-red-500 hover:text-red-400"
															data-tooltip-id={`remove-export-path-${savedConfig.id}-${index}`}
															data-tooltip-content="Remove this export path">
															<XMarkIcon className="h-5 w-5" />
														</button>
													</div>
												)
											)}
											<button
												onClick={() => handleAddExportPath(savedConfig.id)}
												className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
												data-tooltip-id={`add-export-path-${savedConfig.id}`}
												data-tooltip-content="Add a new export path">
												Add Export Path
											</button>
										</div>
									)}
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</div>

				{showTooltips && (
					<>
						<Tooltip id="close-modal" place="left" opacity={1} />
						<Tooltip id="update-config" place="top" opacity={1} />
						<Tooltip id="unload-config" place="top" opacity={1} />
						<Tooltip id="new-config-name" place="top" opacity={1} />
						<Tooltip id="save-config" place="top" opacity={1} />
						{savedConfigs.map((savedConfig) => (
							<React.Fragment key={savedConfig.id}>
								<Tooltip
									id={`load-config-${savedConfig.id}`}
									place="top"
									opacity={1}
								/>
								<Tooltip
									id={`delete-config-${savedConfig.id}`}
									place="top"
									opacity={1}
								/>
								<Tooltip
									id={`rename-config-${savedConfig.id}`}
									place="top"
									opacity={1}
								/>
								<Tooltip
									id={`confirm-rename-${savedConfig.id}`}
									place="top"
									opacity={1}
								/>
								<Tooltip
									id={`cancel-rename-${savedConfig.id}`}
									place="top"
									opacity={1}
								/>
								<Tooltip
									id={`add-export-path-${savedConfig.id}`}
									place="top"
									opacity={1}
								/>
								{(customExportPaths[savedConfig.id] || []).map((_, index) => (
									<Tooltip
										key={index}
										id={`remove-export-path-${savedConfig.id}-${index}`}
										place="top"
										opacity={1}
									/>
								))}
							</React.Fragment>
						))}
					</>
				)}

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
