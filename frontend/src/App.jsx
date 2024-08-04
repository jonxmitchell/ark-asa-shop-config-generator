// src/App.jsx

import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import LicenseManager from "./components/LicenseManager";
import Sidebar from "./components/Sidebar";
import ConfigTabs from "./components/ConfigTabs";
import { useContextMenu } from "./hooks/useContextMenu";
import { ConfigProvider } from "./components/ConfigContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppControls from "./components/AppControls";
import AutoSave from "./components/AutoSave";
import Loader from "./components/Loader";
import { usePreventBrowserShortcuts } from "./hooks/usePreventBrowserShortcuts";

function App() {
	const [isLicensed, setIsLicensed] = useState(false);
	const [licenseError, setLicenseError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("generator");
	const [activeSidebarItem, setActiveSidebarItem] = useState("MySQL");
	const [initialShowTooltips, setInitialShowTooltips] = useState(true);

	useContextMenu();
	usePreventBrowserShortcuts();

	useEffect(() => {
		const checkLicense = async () => {
			try {
				setIsLoading(true);
				const result = await invoke("check_license_on_startup");
				setIsLicensed(result);
				setLicenseError("");

				// Load initial settings
				const settings = await invoke("load_settings_command");
				setInitialShowTooltips(settings.show_tooltips);
			} catch (error) {
				console.error("License check failed:", error);
				setIsLicensed(false);
				setLicenseError(error);
				toast.error(`License error: ${error}`, {
					position: "bottom-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
			} finally {
				setIsLoading(false);
			}
		};

		checkLicense();
	}, []);

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center bg-deep-black">
				<Loader />
			</div>
		);
	}

	if (!isLicensed) {
		return (
			<LicenseManager
				setIsLicensed={setIsLicensed}
				initialError={licenseError}
			/>
		);
	}

	return (
		<ConfigProvider initialShowTooltips={initialShowTooltips}>
			<div autoComplete="off" data-form-type="other">
				<div className="flex h-screen bg-deep-black text-white p-4 overflow-hidden">
					<div className="flex w-full space-x-4 h-full">
						<div className="w-64 bg-mid-black rounded-xl shadow-lg flex flex-col overflow-hidden">
							<Sidebar
								activeItem={activeSidebarItem}
								setActiveItem={setActiveSidebarItem}
							/>
							<div className="mt-4 bg-light-black rounded-lg p-2 ml-2 mr-2 mb-6">
								<AppControls />
							</div>
						</div>
						<div className="flex-1 bg-mid-black rounded-xl shadow-lg flex flex-col overflow-hidden">
							<ConfigTabs
								activeTab={activeTab}
								setActiveTab={setActiveTab}
								activeSidebarItem={activeSidebarItem}
							/>
						</div>
					</div>
				</div>
				<ToastContainer />
				<AutoSave />
			</div>
		</ConfigProvider>
	);
}

export default App;
