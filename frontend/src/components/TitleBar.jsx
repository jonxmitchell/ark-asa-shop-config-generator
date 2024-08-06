// frontend/src/components/TitleBar.jsx

import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { XMarkIcon, MinusIcon } from "@heroicons/react/24/solid";
import { VscChromeRestore } from "react-icons/vsc";

function TitleBar() {
	const handleMinimize = () => appWindow.minimize();
	const handleMaximize = () => appWindow.toggleMaximize();
	const handleClose = () => appWindow.close();

	return (
		<div
			data-tauri-drag-region
			className="h-10 bg-mid-black flex justify-between items-center px-4 rounded-t-lg">
			<div className="bg-light-black rounded-full px-3 group">
				<span className="text-sm text-gray-400 group-hover:text-blue-500 transition-colors select-none">
					ASA Ark Shop Config Generator
				</span>
			</div>
			<div className="flex space-x-4">
				<button
					onClick={handleMinimize}
					className="text-gray-400 hover:text-yellow-500 hover:bg-gray-700 rounded-full p-1 transition-colors">
					<MinusIcon className="h-4 w-4" />
				</button>
				<button
					onClick={handleMaximize}
					className="text-gray-400 hover:text-green-500 hover:bg-gray-700 rounded-full p-1 transition-colors">
					<VscChromeRestore className="h-3 w-3" />
				</button>
				<button
					onClick={handleClose}
					className="text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-full p-1 transition-colors">
					<XMarkIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}

export default TitleBar;
