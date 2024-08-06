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
import { Tooltip } from "react-tooltip";

const IconButton = ({ Icon, onClick, title, tooltipId, hoverColorClass }) => (
	<button
		onClick={onClick}
		className={`text-gray-400 ${hoverColorClass} transition-colors transform hover:-translate-y-1 hover:scale-110 duration-200`}
		title={title}
		data-tooltip-id={tooltipId}>
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
	const { config, importConfig, showTooltips } = useConfig();

	const handleLicense = useCallback(() => {
		setIsLicenseModalOpen(true);
	}, []);

	const handleSettings = useCallback(() => setIsSettingsModalOpen(true), []);

	const importConfigFile = useCallback(async () => {
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
					await new Promise((resolve) => setTimeout(resolve, 20));
					setImportProgress(i);
				}

				const contents = await readTextFile(selected);
				const importedConfig = JSON.parse(contents);
				importConfig(importedConfig);

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
			toast.error("Failed to import configuration file.", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		}
	}, [importConfig]);

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
			<div className="flex flex-col space-y-4">
				<div className="flex justify-around">
					<IconButton
						Icon={HiOutlineDocumentText}
						onClick={handleLicense}
						tooltipId="tooltip-license"
						hoverColorClass="hover:text-purple-500"
					/>
					<IconButton
						Icon={HiOutlineCog}
						onClick={handleSettings}
						tooltipId="tooltip-settings"
						hoverColorClass="hover:text-green-500"
					/>
					<IconButton
						Icon={HiOutlineDownload}
						onClick={handleImport}
						tooltipId="tooltip-import"
						hoverColorClass="hover:text-blue-500"
					/>
					<IconButton
						Icon={HiOutlineUpload}
						onClick={handleExport}
						tooltipId="tooltip-export"
						hoverColorClass="hover:text-yellow-500"
					/>
					<IconButton
						Icon={HiOutlineCollection}
						onClick={handleSavedConfigs}
						tooltipId="tooltip-saved-configs"
						hoverColorClass="hover:text-red-500"
					/>
				</div>

				<div className="text-center text-xs text-gray-500">
					Developed by{" "}
					<a
						href="https://discordapp.com/users/727813657949634570"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-400 hover:text-gray-300">
						arti.artificial
					</a>
				</div>
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
					importConfigFile();
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
			{showTooltips && (
				<>
					<Tooltip
						id="tooltip-license"
						place="top"
						content="View license information"
						offset={5}
						opacity={1}
					/>
					<Tooltip
						id="tooltip-settings"
						place="top"
						content="Open settings"
						offset={5}
						opacity={1}
					/>
					<Tooltip
						id="tooltip-import"
						place="top"
						content="Import configuration"
						offset={5}
						opacity={1}
					/>
					<Tooltip
						id="tooltip-export"
						place="top"
						content="Export configuration"
						offset={5}
						opacity={1}
					/>
					<Tooltip
						id="tooltip-saved-configs"
						place="top"
						content="Manage saved configurations"
						offset={5}
						opacity={1}
					/>
				</>
			)}
		</>
	);
}

export default AppControls;
