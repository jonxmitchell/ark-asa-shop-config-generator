// src/App.jsx

import React, { useState, useEffect, useCallback } from "react";
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
import LicenseExpirationWarning from "./components/LicenseExpirationWarning";
import TitleBar from "./components/TitleBar";

function App() {
	const [licenseState, setLicenseState] = useState({
		isLicensed: false,
		expirationDate: null,
		error: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isAppLoaded, setIsAppLoaded] = useState(false);
	const [activeTab, setActiveTab] = useState("generator");
	const [activeSidebarItem, setActiveSidebarItem] = useState("MySQL");
	const [initialShowTooltips, setInitialShowTooltips] = useState(true);

	useContextMenu();
	usePreventBrowserShortcuts();

	const checkLicense = useCallback(async () => {
		try {
			const result = await invoke("check_license_on_startup");
			console.log("License check result:", result);
			setLicenseState({
				isLicensed: result.isValid,
				expirationDate: result.expirationDate,
				error: "",
			});
		} catch (error) {
			console.error("License check failed:", error);
			setLicenseState({
				isLicensed: false,
				expirationDate: null,
				error: error.toString(),
			});
		}
	}, []);

	useEffect(() => {
		const initialSetup = async () => {
			setIsLoading(true);
			await checkLicense();

			try {
				const settings = await invoke("load_settings_command");
				setInitialShowTooltips(settings.show_tooltips);
			} catch (error) {
				console.error("Failed to load settings:", error);
				toast.error("Failed to load settings", {
					position: "bottom-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
			}

			setIsLoading(false);

			// Simulate app loading
			setTimeout(() => {
				setIsAppLoaded(true);
			}, 1000);
		};

		initialSetup();

		const licenseCheckInterval = setInterval(checkLicense, 5 * 60 * 1000); // Check every 5 minutes

		return () => clearInterval(licenseCheckInterval);
	}, [checkLicense]);

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center bg-deep-black">
				<Loader />
			</div>
		);
	}

	if (!licenseState.isLicensed) {
		return (
			<div>
				<TitleBar />
				<LicenseManager
					setLicenseState={setLicenseState}
					initialError={licenseState.error}
				/>
			</div>
		);
	}

	return (
		<ConfigProvider initialShowTooltips={initialShowTooltips}>
			<div
				autoComplete="off"
				data-form-type="other"
				className="flex flex-col h-screen bg-window-bg rounded-window overflow-hidden">
				<TitleBar />
				<div className="flex-1 flex bg-deep-black text-white overflow-hidden">
					{isAppLoaded && licenseState.isLicensed && (
						<LicenseExpirationWarning
							expirationDate={licenseState.expirationDate}
							isLicensed={licenseState.isLicensed}
						/>
					)}
					<div className="flex w-full space-x-4 h-full p-4">
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
