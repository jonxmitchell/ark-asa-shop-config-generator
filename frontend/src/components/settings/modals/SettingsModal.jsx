import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineFolder, HiX } from "react-icons/hi";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SettingsModal({ isOpen, onClose }) {
	const [outputPath, setOutputPath] = useState("");

	useEffect(() => {
		if (isOpen) {
			loadSavedPath();
		}
	}, [isOpen]);

	const loadSavedPath = async () => {
		try {
			const settings = await invoke("load_settings_command");
			setOutputPath(settings.output_path);
		} catch (error) {
			console.error("Failed to load settings:", error);
			toast.error("Failed to load settings");
		}
	};

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
			toast.error("Failed to open folder dialog");
		}
	};

	const handleSave = async () => {
		try {
			await invoke("save_settings_command", { outputPath });
			console.log("Saved output path:", outputPath);
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
			toast.error("Failed to save settings");
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
					className="absolute top-4 right-4 text-gray-400 hover:text-white">
					<HiX className="h-6 w-6" />
				</button>
				<h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>
				<div className="mb-6">
					<label
						htmlFor="outputPath"
						className="block text-sm font-medium text-gray-300 mb-2">
						Export Output Location
					</label>
					<div className="relative">
						<input
							type="text"
							id="outputPath"
							value={outputPath}
							readOnly
							className="w-full pl-10 pr-24 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						/>
						<HiOutlineFolder className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<button
							onClick={handleSelectFolder}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
							Select
						</button>
					</div>
				</div>
				<div className="flex justify-end">
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
						Save
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
}

export default SettingsModal;
