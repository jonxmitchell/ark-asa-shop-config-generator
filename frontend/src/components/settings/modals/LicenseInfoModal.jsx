// src/components/modals/LicenseInfoModal.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";
import {
	ClipboardDocumentIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";

function LicenseInfoModal({ isOpen, onClose }) {
	const [licenseInfo, setLicenseInfo] = useState(null);
	const [remainingTime, setRemainingTime] = useState({});
	const [copiedHWID, setCopiedHWID] = useState(false);
	const [copiedLicenseKey, setCopiedLicenseKey] = useState(false);

	useEffect(() => {
		if (isOpen) {
			invoke("get_license_info")
				.then((info) => {
					setLicenseInfo(info);
				})
				.catch(console.error);
		}
	}, [isOpen]);

	useEffect(() => {
		if (licenseInfo) {
			const interval = setInterval(() => {
				const now = new Date();
				const expirationDate = new Date(licenseInfo.expiration_date);
				const diff = expirationDate.getTime() - now.getTime();

				if (diff > 0) {
					const days = Math.floor(diff / (1000 * 60 * 60 * 24));
					const hours = Math.floor(
						(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
					);
					const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((diff % (1000 * 60)) / 1000);

					setRemainingTime({ days, hours, minutes, seconds });
				} else {
					setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
					clearInterval(interval);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [licenseInfo]);

	const handleCopy = (text, setCopiedState) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopiedState(true);
			setTimeout(() => setCopiedState(false), 2000); // Reset after 2 seconds
		});
	};

	if (!isOpen || !licenseInfo) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-mid-black p-6 rounded-lg max-w-md w-full relative">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
					aria-label="Close">
					<XMarkIcon className="h-6 w-6" />
				</button>
				<h2 className="text-xl font-bold mb-4 text-white pr-8">
					License Information
				</h2>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-400">
							HWID
						</label>
						<div className="flex bg-dark-black rounded-lg p-2 items-start">
							<p className="text-sm text-white mr-2 flex-grow break-all">
								{licenseInfo.hwid}
							</p>
							<div className="flex-shrink-0 ml-2 self-stretch flex items-center">
								<button
									onClick={() => handleCopy(licenseInfo.hwid, setCopiedHWID)}
									className="text-gray-400 hover:text-white transition-colors"
									title="Copy HWID">
									{copiedHWID ? (
										<CheckIcon className="h-5 w-5 text-green-500" />
									) : (
										<ClipboardDocumentIcon className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-400">
							License Key
						</label>
						<div className="flex bg-dark-black rounded-lg p-2 items-start">
							<p className="text-sm text-white mr-2 flex-grow break-all">
								{licenseInfo.license_key}
							</p>
							<div className="flex-shrink-0 ml-2 self-stretch flex items-center">
								<button
									onClick={() =>
										handleCopy(licenseInfo.license_key, setCopiedLicenseKey)
									}
									className="text-gray-400 hover:text-white transition-colors"
									title="Copy License Key">
									{copiedLicenseKey ? (
										<CheckIcon className="h-5 w-5 text-green-500" />
									) : (
										<ClipboardDocumentIcon className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-400">
							Expiration
						</label>
						<p className="text-white">
							{new Date(licenseInfo.expiration_date).toLocaleDateString()}
						</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-400">
							Remaining Time
						</label>
						<p className="text-white">
							{remainingTime.days} days, {remainingTime.hours} hours,{" "}
							{remainingTime.minutes} minutes, {remainingTime.seconds} seconds
						</p>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}

export default LicenseInfoModal;
