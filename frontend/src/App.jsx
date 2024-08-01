// src/App.jsx

import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import LicenseManager from "./components/LicenseManager";
import Sidebar from "./components/Sidebar";
import ConfigTabs from "./components/ConfigTabs";
import { useContextMenu } from "./hooks/useContextMenu";
import { ConfigProvider } from "./components/ConfigContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppControls from "./components/AppControls";

function App() {
	const [isLicensed, setIsLicensed] = useState(false);
	const [activeTab, setActiveTab] = useState("generator");
	const [activeSidebarItem, setActiveSidebarItem] = useState("MySQL");

	useContextMenu();

	useEffect(() => {
		const checkLicense = async () => {
			try {
				const licenseState = await invoke("get_license_state");
				setIsLicensed(licenseState);
			} catch (error) {
				console.error("Failed to check license state:", error);
			}
		};

		checkLicense();
	}, []);

	if (!isLicensed) {
		return <LicenseManager setIsLicensed={setIsLicensed} />;
	}

	return (
		<ConfigProvider>
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
			</div>
		</ConfigProvider>
	);
}

export default App;
