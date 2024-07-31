// src/components/modals/ExportSuccessModal.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { open } from "@tauri-apps/api/shell";

function ExportSuccessModal({ isOpen, onClose, filePath }) {
	const handleOpenLocation = async () => {
		try {
			await open(filePath);
		} catch (error) {
			console.error("Failed to open file location:", error);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className="bg-mid-black p-6 rounded-lg max-w-md w-full">
						<h2 className="text-xl font-bold mb-4">Export Successful</h2>
						<p className="mb-6">
							The configuration has been successfully exported.
						</p>
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
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ExportSuccessModal;
