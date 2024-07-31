// src/components/settings/modals/ExportConfirmationModal.jsx

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import ExportProgressModal from "./ExportProgressModal";
import ExportSuccessModal from "./ExportSuccessModal";
import { useConfig } from "../../ConfigContext";

function ExportConfirmationModal({ isOpen, onClose }) {
	const [isExporting, setIsExporting] = useState(false);
	const [exportSuccess, setExportSuccess] = useState(false);
	const [exportedFilePath, setExportedFilePath] = useState("");
	const { config, updateConfig } = useConfig();

	const handleExport = useCallback(async () => {
		setIsExporting(true);
		try {
			console.log("Exporting config:", config);
			if (!config || Object.keys(config).length === 0) {
				throw new Error("Configuration is undefined or empty");
			}
			const result = await invoke("export_config", { config: config });
			console.log("Export result:", result);
			setExportedFilePath(result);
			setExportSuccess(true);
			updateConfig(config);
		} catch (error) {
			console.error("Export failed:", error);
			// Handle error (e.g., show error message to user)
		} finally {
			setIsExporting(false);
		}
	}, [config, updateConfig]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="confirmation-modal"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
								onClick={onClose}
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
				</motion.div>
			)}
			<ExportProgressModal key="progress-modal" isOpen={isExporting} />
			<ExportSuccessModal
				key="success-modal"
				isOpen={exportSuccess}
				onClose={() => {
					setExportSuccess(false);
					onClose();
				}}
				filePath={exportedFilePath}
			/>
		</AnimatePresence>
	);
}

export default React.memo(ExportConfirmationModal);
