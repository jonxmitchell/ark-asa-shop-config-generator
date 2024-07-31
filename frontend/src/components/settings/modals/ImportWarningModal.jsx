// src/components/settings/modals/ImportWarningModal.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function ImportWarningModal({ isOpen, onClose, onConfirm }) {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
				onClick={onClose}>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ type: "spring", damping: 15 }}
					className="bg-mid-black p-6 rounded-lg max-w-md w-full"
					onClick={(e) => e.stopPropagation()}>
					<h2 className="text-xl font-bold mb-4 text-white">Warning</h2>
					<p className="mb-6 text-gray-300">
						Importing a new configuration file will overwrite your current
						configuration. Make sure you have saved your changes before
						proceeding.
					</p>
					<div className="flex justify-end space-x-4">
						<button
							onClick={onClose}
							className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
							Cancel
						</button>
						<button
							onClick={onConfirm}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
							Import Anyway
						</button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

export default ImportWarningModal;
