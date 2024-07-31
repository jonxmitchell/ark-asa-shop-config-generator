// src/components/settings/modals/ExportConfirmationModal.jsx

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import ExportProgressModal from "./ExportProgressModal";
import ExportSuccessModal from "./ExportSuccessModal";
import { useConfig } from "../../ConfigContext";

function ExportConfirmationModal({ isOpen, onClose }) {
	const [modalState, setModalState] = useState("confirmation");
	const [exportedFilePath, setExportedFilePath] = useState("");
	const [progress, setProgress] = useState(0);
	const { config, updateConfig } = useConfig();

	const handleExport = useCallback(async () => {
		setModalState("progress");
		setProgress(0);

		try {
			console.log("Exporting config:", config);
			if (!config || Object.keys(config).length === 0) {
				throw new Error("Configuration is undefined or empty");
			}

			// Simulate progress
			for (let i = 0; i <= 100; i++) {
				await new Promise((resolve) => setTimeout(resolve, 20)); // 20ms delay between each progress update
				setProgress(i);
			}

			// Actual export
			const result = await invoke("export_config", { config: config });
			console.log("Export result:", result);
			setExportedFilePath(result);

			// Ensure the progress modal is shown for at least 2 seconds
			await new Promise((resolve) => setTimeout(resolve, 2000 - 20 * 100));

			setModalState("success");
			updateConfig(config);
		} catch (error) {
			console.error("Export failed:", error);
			// Handle error (e.g., show error message to user)
			setModalState("confirmation"); // Go back to confirmation on error
		}
	}, [config, updateConfig]);

	const handleClose = () => {
		setModalState("confirmation");
		setProgress(0);
		onClose();
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
							<h2 className="text-xl font-bold mb-4">Confirm Export</h2>
							<p className="mb-6">
								Are you sure you want to export the configuration to the chosen
								location?
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
						</motion.div>
					)}

					{modalState === "progress" && (
						<ExportProgressModal progress={progress} />
					)}

					{modalState === "success" && (
						<ExportSuccessModal
							filePath={exportedFilePath}
							onClose={handleClose}
						/>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default React.memo(ExportConfirmationModal);
