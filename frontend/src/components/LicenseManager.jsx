// src/components/LicenseManager.jsx

import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/solid";

function LicenseManager({ setLicenseState, initialError }) {
	const [hwid, setHwid] = useState("");
	const [licenseKey, setLicenseKey] = useState("");
	const [error, setError] = useState(initialError || "");
	const [isLoading, setIsLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		invoke("get_hwid").then(setHwid).catch(console.error);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		try {
			console.log("Submitting license key:", licenseKey);
			const result = await invoke("validate_license", { licenseKey });
			console.log("License validation result:", result);

			if (typeof result === "boolean") {
				if (result === true) {
					console.log("License is valid (boolean result). Updating state...");
					// Since we don't have expiration date, we'll set it to a default value
					const defaultExpirationDate = new Date();
					defaultExpirationDate.setFullYear(
						defaultExpirationDate.getFullYear() + 1
					);
					setLicenseState({
						isLicensed: true,
						expirationDate: defaultExpirationDate.toISOString(),
						error: "",
					});
				} else {
					console.log("License is invalid (boolean result).");
					setError("Invalid license key");
				}
			} else if (result && typeof result === "object" && "isValid" in result) {
				if (result.isValid === true) {
					console.log("Received expiration date:", result.expirationDate);

					console.log("License is valid. Updating state...");
					setLicenseState({
						isLicensed: true,
						expirationDate: result.expirationDate,
						error: "",
					});
				} else {
					console.log("License is invalid.");
					setError("Invalid license key");
				}
			} else {
				console.error("Unexpected result structure:", result);
				setError("Received unexpected response from server");
			}
		} catch (error) {
			console.error("License validation error:", error);
			setError(`An error occurred while validating the license: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopyHwid = () => {
		navigator.clipboard.writeText(hwid).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
		});
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-deep-black text-white">
			<div className="bg-mid-black p-8 rounded-xl shadow-lg max-w-md w-full">
				<h2 className="text-2xl font-bold mb-6">License Activation</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-300 mb-1">
						Your HWID
					</label>
					<div className="flex bg-dark-black rounded-lg p-2 items-start">
						<p className="text-sm text-gray-400 mr-2 flex-grow break-all">
							{hwid}
						</p>
						<div className="flex-shrink-0 ml-2 self-stretch flex items-center">
							<button
								onClick={handleCopyHwid}
								className="text-gray-400 hover:text-white transition-colors"
								title="Copy HWID">
								{copied ? (
									<CheckIcon className="h-5 w-5 text-green-500" />
								) : (
									<ClipboardDocumentIcon className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="licenseKey"
							className="block text-sm font-medium mb-1">
							License Key
						</label>
						<input
							id="licenseKey"
							type="text"
							autoComplete="off"
							value={licenseKey}
							onChange={(e) => setLicenseKey(e.target.value)}
							placeholder="Enter your license key"
							className="w-full px-3 py-2 bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
							disabled={isLoading}
						/>
					</div>
					{error && <p className="text-red-500">{error}</p>}
					<button
						type="submit"
						className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
						disabled={isLoading}>
						{isLoading ? "Validating..." : "Activate License"}
					</button>
				</form>
				{isLoading && (
					<div className="mt-4 text-center">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
						<p className="mt-2">Validating license...</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default LicenseManager;
