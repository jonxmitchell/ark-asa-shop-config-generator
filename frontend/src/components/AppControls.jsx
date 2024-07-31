// src/components/AppControls.jsx
import React, { useState, useCallback } from "react";
import {
	HiOutlineDocumentText,
	HiOutlineCog,
	HiOutlineDownload,
	HiOutlineUpload,
	HiOutlineCollection,
} from "react-icons/hi";
import SettingsModal from "./settings/modals/SettingsModal";
import ExportConfirmationModal from "./settings/modals/ExportConfirmationModal";
import { useConfig } from "./ConfigContext";

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
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);
	const { config } = useConfig();

	const handleLicense = useCallback(() => console.log("License clicked"), []);
	const handleSettings = useCallback(() => setIsSettingsModalOpen(true), []);
	const handleImport = useCallback(() => console.log("Import clicked"), []);
	const handleExport = useCallback(() => {
		console.log("Export clicked, config:", config);
		setIsExportModalOpen(true);
	}, [config]);
	const handleSavedConfigs = useCallback(
		() => console.log("Saved Configs clicked"),
		[]
	);

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
			<ExportConfirmationModal
				isOpen={isExportModalOpen}
				onClose={() => setIsExportModalOpen(false)}
			/>
		</>
	);
}

export default AppControls;
