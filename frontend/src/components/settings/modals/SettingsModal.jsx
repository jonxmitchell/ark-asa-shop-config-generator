// src/components/settings/modals/SettingsModal.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineFolder, HiX } from "react-icons/hi";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useConfig } from "../../ConfigContext";
import { Tooltip } from "react-tooltip";

// Custom Toggle component
const Toggle = ({ checked, onChange }) => (
	<div
		className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
			checked ? "bg-blue-600" : "bg-gray-700"
		}`}
		onClick={() => onChange(!checked)}>
		<motion.div
			className="bg-white w-3 h-3 rounded-full shadow-md"
			animate={{ x: checked ? 20 : 0 }}
		/>
	</div>
);

function SettingsModal({ isOpen, onClose }) {
	const [outputPath, setOutputPath] = useState("");
	const {
		showTooltips,
		toggleTooltips,
		autoSaveSettings,
		setAutoSaveSettings,
		loadAutoSaveSettings,
	} = useConfig();
	const [localAutoSaveEnabled, setLocalAutoSaveEnabled] = useState(
		autoSaveSettings.enabled
	);
	const [localAutoSaveInterval, setLocalAutoSaveInterval] = useState(
		autoSaveSettings.interval
	);

	useEffect(() => {
		if (isOpen) {
			const loadSavedSettings = async () => {
				try {
					const settings = await invoke("load_settings_command");
					setOutputPath(settings.output_path);
					setLocalAutoSaveEnabled(settings.auto_save_enabled);
					setLocalAutoSaveInterval(settings.auto_save_interval);
					toggleTooltips(settings.show_tooltips);
				} catch (error) {
					console.error("Failed to load settings:", error);
					toast.error("Failed to load settings", {
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

			loadSavedSettings();
		}
	}, [isOpen, toggleTooltips]);

	const handleSelectFolder = async () => {
		try {
			const selected = await open({
				directory: true,
				multiple: false,
				defaultPath: outputPath || undefined,
			});
			if (selected) {
				setOutputPath(selected);
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

	const handleSave = async () => {
		try {
			await invoke("save_settings_command", {
				outputPath,
				autoSaveEnabled: localAutoSaveEnabled,
				autoSaveInterval: localAutoSaveInterval,
				showTooltips,
			});
			setAutoSaveSettings({
				enabled: localAutoSaveEnabled,
				interval: localAutoSaveInterval,
			});
			await loadAutoSaveSettings();
			console.log("Saved settings:", {
				outputPath,
				autoSaveEnabled: localAutoSaveEnabled,
				autoSaveInterval: localAutoSaveInterval,
				showTooltips,
			});
			toast.success("Settings saved successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		} catch (error) {
			console.error("Failed to save settings:", error);
			toast.error("Failed to save settings", {
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
				className="bg-mid-black p-8 rounded-lg w-2/3 max-w-2xl relative"
				onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white"
					data-tooltip-id="close-settings"
					data-tooltip-content="Close settings">
					<HiX className="h-6 w-6" />
				</button>
				<h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>

				{/* Export Output Location */}
				<div className="mb-6 bg-light-black p-4 rounded-lg">
					<h3 className="text-lg font-semibold mb-2 text-white">
						Export Output Location
					</h3>
					<div className="relative">
						<input
							type="text"
							id="outputPath"
							value={outputPath}
							readOnly
							className="w-full pl-10 pr-24 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
							data-tooltip-id="output-path"
							data-tooltip-content="Current export output location"
						/>
						<HiOutlineFolder className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<button
							onClick={handleSelectFolder}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
							data-tooltip-id="select-folder"
							data-tooltip-content="Choose export output location">
							Select
						</button>
					</div>
				</div>

				{/* Auto-save Settings */}
				<div className="mb-6 bg-light-black p-4 rounded-lg">
					<h3 className="text-lg font-semibold mb-2 text-white">
						Auto-save Settings
					</h3>
					<div className="flex flex-col space-y-2 mb-4">
						<span className="text-sm text-gray-400">Enable auto-save</span>
						<Toggle
							checked={localAutoSaveEnabled}
							onChange={setLocalAutoSaveEnabled}
							data-tooltip-id="auto-save-toggle"
							data-tooltip-content="Toggle auto-save feature"
						/>
					</div>
					<div className={`space-y-2 ${!localAutoSaveEnabled && "opacity-50"}`}>
						<span className="text-sm text-gray-400">
							Auto-Save Duration (in minutes)
						</span>
						<div className="flex items-center space-x-4">
							<input
								type="range"
								id="autoSaveInterval"
								min="1"
								max="60"
								value={localAutoSaveInterval}
								onChange={(e) =>
									setLocalAutoSaveInterval(parseInt(e.target.value))
								}
								disabled={!localAutoSaveEnabled}
								className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
								data-tooltip-id="auto-save-interval"
								data-tooltip-content="Set auto-save interval"
							/>
							<input
								type="number"
								value={localAutoSaveInterval}
								onChange={(e) =>
									setLocalAutoSaveInterval(
										Math.max(1, Math.min(60, parseInt(e.target.value) || 1))
									)
								}
								disabled={!localAutoSaveEnabled}
								className="w-16 px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								data-tooltip-id="auto-save-interval-input"
								data-tooltip-content="Set auto-save interval in minutes"
							/>
						</div>
					</div>
				</div>

				{/* Tooltip Settings */}
				<div className="mb-6 bg-light-black p-4 rounded-lg">
					<h3 className="text-lg font-semibold mb-2 text-white">
						Tooltip Settings
					</h3>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-400">Show Tooltips</span>
						<Toggle
							checked={showTooltips}
							onChange={toggleTooltips}
							data-tooltip-id="show-tooltips-toggle"
							data-tooltip-content="Toggle visibility of tooltips"
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
						data-tooltip-id="save-settings"
						data-tooltip-content="Save current settings">
						Save
					</button>
				</div>

				{showTooltips && (
					<>
						<Tooltip id="close-settings" place="left" />
						<Tooltip id="output-path" place="top" />
						<Tooltip id="select-folder" place="left" />
						<Tooltip id="auto-save-toggle" place="right" />
						<Tooltip id="auto-save-interval" place="top" />
						<Tooltip id="auto-save-interval-input" place="top" />
						<Tooltip id="show-tooltips-toggle" place="right" />
						<Tooltip id="save-settings" place="top" />
					</>
				)}
			</motion.div>
		</motion.div>
	);
}

export default SettingsModal;
