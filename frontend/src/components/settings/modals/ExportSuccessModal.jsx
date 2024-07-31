// src/components/modals/ExportSuccessModal.jsx

import React from "react";
import { motion } from "framer-motion";
import { open } from "@tauri-apps/api/shell";

function ExportSuccessModal({ filePath, onClose }) {
	const handleOpenLocation = async () => {
		try {
			await open(filePath);
		} catch (error) {
			console.error("Failed to open file location:", error);
		}
	};

	return (
		<motion.div
			initial={{ scale: 0.9, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0.9, opacity: 0 }}
			className="bg-mid-black p-6 rounded-lg max-w-md w-full">
			<h2 className="text-xl font-bold mb-4">Export Successful</h2>
			<p className="mb-6">The configuration has been successfully exported.</p>
			<div className="flex justify-end space-x-4">
				<button
					onClick={handleOpenLocation}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
					Open File Location
				</button>
				<button
					onClick={onClose}
					className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
					Close
				</button>
			</div>
		</motion.div>
	);
}

export default ExportSuccessModal;
