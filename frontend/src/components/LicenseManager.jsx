import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function LicenseManager({ setIsLicensed, initialError }) {
	const [hwid, setHwid] = useState("");
	const [licenseKey, setLicenseKey] = useState("");
	const [error, setError] = useState(initialError || "");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		invoke("get_hwid").then(setHwid).catch(console.error);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		try {
			const valid = await invoke("validate_license", { licenseKey });
			if (valid) {
				setIsLicensed(true);
			} else {
				setError("Invalid license key");
			}
		} catch (error) {
			console.error("License validation error:", error);
			setError(`An error occurred while validating the license: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-deep-black text-white">
			<div className="bg-mid-black p-8 rounded-xl shadow-lg max-w-md w-full">
				<h2 className="text-2xl font-bold mb-6">License Activation</h2>
				<p className="mb-4">Your HWID: {hwid}</p>
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
							className="w-full px-3 py-2 bg-light-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
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
