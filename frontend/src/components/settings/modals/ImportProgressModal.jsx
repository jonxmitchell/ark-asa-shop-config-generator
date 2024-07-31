// src/components/settings/modals/ImportProgressModal.jsx

import React from "react";
import { motion } from "framer-motion";

function ImportProgressModal({ progress }) {
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
				className="bg-mid-black p-6 rounded-lg max-w-md w-full">
				<h2 className="text-xl font-bold mb-4 text-white">
					Importing Configuration
				</h2>
				<div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
					<motion.div
						className="bg-blue-500 h-1.5 rounded-full"
						initial={{ width: "0%" }}
						animate={{ width: `${progress}%` }}
						transition={{ duration: 0.1 }}
					/>
				</div>
				<div className="text-center">
					<span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
						{progress}%
					</span>
				</div>
			</motion.div>
		</motion.div>
	);
}

export default ImportProgressModal;
