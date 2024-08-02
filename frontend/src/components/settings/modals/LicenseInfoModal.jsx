// src/components/modals/LicenseInfoModal.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/tauri";

function LicenseInfoModal({ isOpen, onClose }) {
	const [licenseInfo, setLicenseInfo] = useState(null);
	const [remainingTime, setRemainingTime] = useState({});

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
				className="bg-mid-black p-6 rounded-lg max-w-md w-full">
				<h2 className="text-xl font-bold mb-4 text-white">
					License Information
				</h2>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-400">
							HWID
						</label>
						<p className="text-white">{licenseInfo.hwid}</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-400">
							License Key
						</label>
						<p className="text-white">{licenseInfo.license_key}</p>
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
				<button
					onClick={onClose}
					className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
					Close
				</button>
			</motion.div>
		</motion.div>
	);
}

export default LicenseInfoModal;
