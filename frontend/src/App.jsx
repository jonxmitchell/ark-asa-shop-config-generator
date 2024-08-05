// src/App.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
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
	const [remainingTime, setRemainingTime] = useState(null);
	const warningIntervalRef = useRef(null);

	useContextMenu();
	usePreventBrowserShortcuts();

	const formatRemainingTime = useCallback((milliseconds) => {
		const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

		if (days > 0) {
			return days === 1 ? "1 day" : `${days} days`;
		} else if (hours > 0) {
			return hours === 1 ? "1 hour" : `${hours} hours`;
		} else {
			return minutes === 1 ? "1 minute" : `${minutes} minutes`;
		}
	}, []);

	const showExpirationWarning = useCallback(
		(remainingTime) => {
			const formattedTime = formatRemainingTime(remainingTime);
			toast.warn(`License expires in ${formattedTime}!`, {
				position: "top-center",
				autoClose: 10000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		},
		[formatRemainingTime]
	);

	const setupExpirationWarnings = useCallback(() => {
		if (warningIntervalRef.current) {
			clearInterval(warningIntervalRef.current);
		}

		warningIntervalRef.current = setInterval(() => {
			if (remainingTime !== null && remainingTime > 0) {
				if (remainingTime <= 15 * 60 * 1000) {
					// 15 minutes or less
					showExpirationWarning(remainingTime);
					setRemainingTime((prev) => Math.max(0, prev - 5 * 60 * 1000));
				} else if (remainingTime <= 60 * 60 * 1000) {
					// 1 hour or less
					showExpirationWarning(remainingTime);
					setRemainingTime((prev) => prev - 15 * 60 * 1000);
				} else if (remainingTime <= 24 * 60 * 60 * 1000) {
					// 24 hours or less
					showExpirationWarning(remainingTime);
					setRemainingTime((prev) => prev - 60 * 60 * 1000);
				} else {
					setRemainingTime((prev) => prev - 60 * 60 * 1000);
				}
			} else if (remainingTime === 0) {
				clearInterval(warningIntervalRef.current);
			}
		}, 60 * 1000); // Check every minute

		return () => {
			if (warningIntervalRef.current) {
				clearInterval(warningIntervalRef.current);
			}
		};
	}, [remainingTime, showExpirationWarning]);

	const checkLicenseValidity = useCallback(async () => {
		try {
			const result = await invoke("check_license_validity");
			if (!result.isValid) {
				setIsLicensed(false);
				setRemainingTime(0);
				toast.error(
					`Your license has expired. Please renew to continue using the application.`,
					{
						position: "top-center",
						autoClose: false,
						hideProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true,
						draggable: false,
						theme: "dark",
					}
				);
			} else {
				setIsLicensed(true);
				setRemainingTime(result.remainingTime);
			}
		} catch (error) {
			console.error("License check failed:", error);
		}
	}, []);

	useEffect(() => {
		const checkLicense = async () => {
			try {
				setIsLoading(true);
				const result = await invoke("check_license_on_startup");
				setIsLicensed(result.isValid);
				setLicenseError("");

				if (result.isValid) {
					setRemainingTime(result.remainingTime);
					if (result.remainingTime <= 24 * 60 * 60 * 1000) {
						showExpirationWarning(result.remainingTime);
					}
				} else {
					setRemainingTime(0);
					toast.error(
						`Your license has expired. Please renew to continue using the application.`,
						{
							position: "top-center",
							autoClose: false,
							hideProgressBar: false,
							closeOnClick: false,
							pauseOnHover: true,
							draggable: false,
							theme: "dark",
						}
					);
				}

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
	}, [showExpirationWarning]);

	useEffect(() => {
		const cleanup = setupExpirationWarnings();
		return cleanup;
	}, [setupExpirationWarnings]);

	useEffect(() => {
		const licenseCheckInterval = setInterval(
			checkLicenseValidity,
			60 * 60 * 1000
		); // Check every hour
		return () => clearInterval(licenseCheckInterval);
	}, [checkLicenseValidity]);

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
