// src/components/modals/ExportProgressModal.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function ExportProgressModal({ isOpen }) {
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
						<h2 className="text-xl font-bold mb-4">Exporting Configuration</h2>
						<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
							<motion.div
								className="bg-blue-600 h-2.5 rounded-full"
								initial={{ width: "0%" }}
								animate={{ width: "100%" }}
								transition={{ duration: 2 }}></motion.div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ExportProgressModal;
