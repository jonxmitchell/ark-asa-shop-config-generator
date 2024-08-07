// src/components/settings/modals/ExportConfirmationModal.jsx

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import ExportProgressModal from "./ExportProgressModal";
import ExportSuccessModal from "./ExportSuccessModal";
import { useConfig } from "../../ConfigContext";
import { toast } from "react-toastify";

function ExportConfirmationModal({ isOpen, onClose }) {
	const [modalState, setModalState] = useState("confirmation");
	const [exportedFilePaths, setExportedFilePaths] = useState([]);
	const [progress, setProgress] = useState(0);
	const [currentExportPaths, setCurrentExportPaths] = useState([]);
	const { config, updateConfig, currentlyLoadedConfig } = useConfig();

	const loadExportPaths = useCallback(async () => {
		try {
			const settings = await invoke("load_settings_command");
			if (
				currentlyLoadedConfig &&
				currentlyLoadedConfig.custom_export_paths &&
				currentlyLoadedConfig.custom_export_paths.length > 0
			) {
				setCurrentExportPaths(currentlyLoadedConfig.custom_export_paths);
			} else if (settings.output_path) {
				setCurrentExportPaths([settings.output_path]);
			} else {
				setCurrentExportPaths([]);
			}
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
	}, [currentlyLoadedConfig]);

	useEffect(() => {
		if (isOpen) {
			loadExportPaths();
		}
	}, [isOpen, loadExportPaths]);

	const handleExport = useCallback(async () => {
		if (currentExportPaths.length === 0) {
			toast.error(
				"No export paths set. Please set a default output location in Settings or configure custom export paths for this configuration.",
				{
					position: "bottom-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				}
			);
			return;
		}

		setModalState("progress");
		setProgress(0);

		try {
			console.log("Exporting config:", config);
			console.log("Export paths:", currentExportPaths);
			if (!config || Object.keys(config).length === 0) {
				throw new Error("Configuration is undefined or empty");
			}

			// Simulate progress
			for (let i = 0; i <= 100; i++) {
				await new Promise((resolve) => setTimeout(resolve, 20));
				setProgress(i);
			}

			// Actual export
			const results = await invoke("export_config", {
				config: config,
				exportPaths: currentExportPaths,
			});
			console.log("Export results:", results);
			setExportedFilePaths(results.map((r) => r.file_path));

			// Ensure the progress modal is shown for at least 2 seconds
			await new Promise((resolve) => setTimeout(resolve, 2000 - 20 * 100));

			setModalState(
				results.some((r) => r.file_existed) ? "fileExistsWarning" : "success"
			);
			updateConfig(config);
		} catch (error) {
			console.error("Export failed:", error);
			setModalState("confirmation");
			toast.error("Export failed: " + error.toString(), {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	}, [config, updateConfig, currentExportPaths]);

	const handleClose = () => {
		setModalState("confirmation");
		setProgress(0);
		onClose();
	};

	const handleProceed = async () => {
		try {
			for (const path of currentExportPaths) {
				await invoke("force_export_config", {
					config: config,
					filePath: path,
				});
			}
			setModalState("success");
		} catch (error) {
			console.error("Force export failed:", error);
			setModalState("confirmation");
			toast.error("Force export failed: " + error.toString(), {
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

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
					{modalState === "confirmation" && (
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-mid-black p-6 rounded-lg max-w-md w-full">
							<h2 className="text-xl font-bold mb-4 text-white">
								Confirm Export
							</h2>
							{currentExportPaths.length > 0 ? (
								<>
									<p className="mb-2 text-gray-300">
										Are you sure you want to export the configuration?
									</p>
									<p className="mb-4 text-gray-300">
										Export paths:
										{currentExportPaths.map((path, index) => (
											<span key={index} className="font-semibold block ml-2">
												{path}
											</span>
										))}
									</p>
									<div className="flex justify-end space-x-4">
										<button
											onClick={handleClose}
											className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
											Cancel
										</button>
										<button
											onClick={handleExport}
											className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
											Export
										</button>
									</div>
								</>
							) : (
								<>
									<p className="mb-4 text-red-500">
										No export paths are set. Please set a default output
										location in Settings or configure custom export paths for
										this configuration.
									</p>
									<div className="flex justify-end">
										<button
											onClick={handleClose}
											className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
											Close
										</button>
									</div>
								</>
							)}
						</motion.div>
					)}

					{modalState === "progress" && (
						<ExportProgressModal progress={progress} />
					)}

					{modalState === "fileExistsWarning" && (
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-mid-black p-6 rounded-lg max-w-md w-full">
							<h2 className="text-xl font-bold mb-4 text-white">⚠️ Warning</h2>
							<p className="mb-6 text-gray-300">
								One or more configuration files already exist at the specified
								locations. Do you want to overwrite them?
							</p>
							<div className="flex justify-end space-x-4">
								<button
									onClick={handleClose}
									className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
									Cancel
								</button>
								<button
									onClick={handleProceed}
									className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
									Overwrite
								</button>
							</div>
						</motion.div>
					)}

					{modalState === "success" && (
						<ExportSuccessModal
							filePaths={exportedFilePaths}
							onClose={handleClose}
						/>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ExportConfirmationModal;
