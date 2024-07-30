// src/components/AppControls.jsx

import React, { useState } from "react";
import {
	HiOutlineDocumentText,
	HiOutlineCog,
	HiOutlineDownload,
	HiOutlineUpload,
	HiOutlineCollection,
} from "react-icons/hi";
import SettingsModal from "./settings/modals/SettingsModal";

const IconButton = ({ Icon, onClick, title }) => (
	<button
		onClick={onClick}
		className="text-gray-400 hover:text-accent-blue transition-colors"
		title={title}>
		<Icon className="h-6 w-6" />
	</button>
);

function AppControls() {
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

	const handleLicense = () => console.log("License clicked");
	const handleSettings = () => setIsSettingsModalOpen(true);
	const handleImport = () => console.log("Import clicked");
	const handleExport = () => console.log("Export clicked");
	const handleSavedConfigs = () => console.log("Saved Configs clicked");

	return (
		<>
			<div className="flex justify-around">
				<IconButton
					Icon={HiOutlineDocumentText}
					onClick={handleLicense}
					title="License"
				/>
				<IconButton
					Icon={HiOutlineCog}
					onClick={handleSettings}
					title="Settings"
				/>
				<IconButton
					Icon={HiOutlineDownload}
					onClick={handleImport}
					title="Import"
				/>
				<IconButton
					Icon={HiOutlineUpload}
					onClick={handleExport}
					title="Export"
				/>
				<IconButton
					Icon={HiOutlineCollection}
					onClick={handleSavedConfigs}
					title="Saved Configs"
				/>
			</div>
			<SettingsModal
				isOpen={isSettingsModalOpen}
				onClose={() => setIsSettingsModalOpen(false)}
			/>
		</>
	);
}

export default AppControls;
