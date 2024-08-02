// src/components/AppControls.jsx

import React, { useState, useCallback } from "react";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import {
	HiOutlineDocumentText,
	HiOutlineCog,
	HiOutlineDownload,
	HiOutlineUpload,
	HiOutlineCollection,
} from "react-icons/hi";
import SettingsModal from "./settings/modals/SettingsModal";
import ExportConfirmationModal from "./settings/modals/ExportConfirmationModal";
import ImportWarningModal from "./settings/modals/ImportWarningModal";
import ImportProgressModal from "./settings/modals/ImportProgressModal";
import SavedConfigsModal from "./settings/modals/SavedConfigsModal";
import LicenseInfoModal from "../components/settings/modals/LicenseInfoModal";
import { useConfig } from "./ConfigContext";
import { toast } from "react-toastify";

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
	const [isImportWarningOpen, setIsImportWarningOpen] = useState(false);
	const [isImportProgressOpen, setIsImportProgressOpen] = useState(false);
	const [importProgress, setImportProgress] = useState(0);
	const [isSavedConfigsModalOpen, setIsSavedConfigsModalOpen] = useState(false);
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
	const { config, updateConfig } = useConfig();

	const handleLicense = useCallback(() => {
		setIsLicenseModalOpen(true);
	}, []);

	const handleSettings = useCallback(() => setIsSettingsModalOpen(true), []);

	const importConfig = useCallback(async () => {
		try {
			const selected = await open({
				multiple: false,
				filters: [{ name: "JSON", extensions: ["json"] }],
			});

			if (selected) {
				setIsImportProgressOpen(true);
				setImportProgress(0);

				// Simulate progress
				for (let i = 0; i <= 100; i++) {
					await new Promise((resolve) => setTimeout(resolve, 20)); // 20ms delay between each progress update
					setImportProgress(i);
				}

				const contents = await readTextFile(selected);
				const importedConfig = JSON.parse(contents);
				updateConfig(importedConfig);

				// Ensure the progress modal is shown for at least 2 seconds
				await new Promise((resolve) => setTimeout(resolve, 2000 - 20 * 100));

				setIsImportProgressOpen(false);
				toast.success("Configuration imported successfully!", {
					position: "bottom-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
			}
		} catch (error) {
			console.error("Error importing file:", error);
			setIsImportProgressOpen(false);
			toast.error("Failed to import configuration file.");
		}
	}, [updateConfig]);

	const handleImport = useCallback(() => {
		setIsImportWarningOpen(true);
	}, []);

	const handleExport = useCallback(() => {
		console.log("Export clicked, config:", config);
		setIsExportModalOpen(true);
	}, [config]);

	const handleSavedConfigs = useCallback(() => {
		setIsSavedConfigsModalOpen(true);
	}, []);

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
			<ImportWarningModal
				isOpen={isImportWarningOpen}
				onClose={() => setIsImportWarningOpen(false)}
				onConfirm={() => {
					setIsImportWarningOpen(false);
					importConfig();
				}}
			/>
			{isImportProgressOpen && (
				<ImportProgressModal progress={importProgress} />
			)}
			<SavedConfigsModal
				isOpen={isSavedConfigsModalOpen}
				onClose={() => setIsSavedConfigsModalOpen(false)}
			/>
			<LicenseInfoModal
				isOpen={isLicenseModalOpen}
				onClose={() => setIsLicenseModalOpen(false)}
			/>
		</>
	);
}

export default AppControls;
