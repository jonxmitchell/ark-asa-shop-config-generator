// src/components/modals/ExportSuccessModal.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/solid";

function ExportSuccessModal({ filePaths, onClose }) {
	const [copiedIndex, setCopiedIndex] = useState(-1);

	const handleOpenLocation = async (path) => {
		try {
			await invoke("open_file_location", { path });
		} catch (error) {
			console.error("Failed to open file location:", error);
		}
	};

	const handleCopyPath = (path, index) => {
		navigator.clipboard.writeText(path).then(() => {
			setCopiedIndex(index);
			setTimeout(() => setCopiedIndex(-1), 2000); // Reset after 2 seconds
		});
	};

	return (
		<motion.div
			initial={{ scale: 0.9, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0.9, opacity: 0 }}
			className="bg-mid-black p-6 rounded-lg max-w-md w-full">
			<h2 className="text-xl font-bold mb-4 text-white">Export Successful</h2>
			<p className="mb-3 text-gray-300">
				The configuration has been successfully exported to:
			</p>
			<div className="space-y-2 max-h-60 overflow-y-auto mb-6">
				{filePaths.map((filePath, index) => (
					<div
						key={index}
						className="flex items-center bg-dark-black rounded-lg p-2">
						<p className="text-sm text-gray-400 mr-2 flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
							{filePath}
						</p>
						<button
							onClick={() => handleCopyPath(filePath, index)}
							className="text-gray-400 hover:text-white transition-colors mr-2"
							title="Copy path">
							{copiedIndex === index ? (
								<CheckIcon className="h-5 w-5 text-green-500" />
							) : (
								<ClipboardDocumentIcon className="h-5 w-5" />
							)}
						</button>
					</div>
				))}
			</div>
			<div className="flex justify-end space-x-4">
				<button
					onClick={() => handleOpenLocation(filePaths[0])}
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
