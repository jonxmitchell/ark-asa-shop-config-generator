// src/components/LicenseExpirationWarning.jsx

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

function LicenseExpirationWarning({ expirationDate, isLicensed }) {
	const [remainingTime, setRemainingTime] = useState(null);
	const lastWarningTimeRef = useRef(0);
	const initialCheckDoneRef = useRef(false);
	const expirationToastShownRef = useRef(false);

	const log = (message) => {
		const now = new Date();
		const timestamp = `[${now.getDate().toString().padStart(2, "0")}/${(
			now.getMonth() + 1
		)
			.toString()
			.padStart(2, "0")}/${now.getFullYear()} - ${now
			.getHours()
			.toString()
			.padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
			.getSeconds()
			.toString()
			.padStart(2, "0")}]`;
		console.log(`${timestamp} ${message}`);
	};

	const calculateRemainingTime = useCallback(() => {
		if (!expirationDate) return null;

		const now = new Date();
		const expiration = new Date(expirationDate);
		const diff = expiration.getTime() - now.getTime();

		if (diff > 0) {
			const totalHours = Math.floor(diff / (1000 * 60 * 60));
			const days = Math.floor(totalHours / 24);
			const hours = totalHours % 24;
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

			return { days, hours, minutes, totalHours };
		} else {
			return null;
		}
	}, [expirationDate]);

	const showExpirationToast = useCallback(() => {
		if (!expirationToastShownRef.current) {
			setTimeout(() => {
				toast.error(
					"Your license has expired. Please renew it to continue using the application.",
					{
						position: "top-center",
						autoClose: false,
						closeOnClick: false,
						draggable: false,
						closeButton: false,
						toastId: "license-expired",
					}
				);
				expirationToastShownRef.current = true;
				log("Expiration toast displayed");
			}, 1000);
		} else {
			log("Expiration toast already shown, skipping display");
		}
	}, []);

	useEffect(() => {
		const checkAndUpdateRemainingTime = () => {
			const newRemainingTime = calculateRemainingTime();
			setRemainingTime(newRemainingTime);

			if (newRemainingTime === null && isLicensed) {
				showExpirationToast();
			}
		};

		if (isLicensed && expirationDate) {
			const initialCheckTimeout = setTimeout(() => {
				checkAndUpdateRemainingTime();
				const interval = setInterval(checkAndUpdateRemainingTime, 60000); // Update every minute
				return () => clearInterval(interval);
			}, 1000);

			return () => clearTimeout(initialCheckTimeout);
		}
	}, [calculateRemainingTime, isLicensed, expirationDate, showExpirationToast]);

	useEffect(() => {
		if (remainingTime && isLicensed) {
			const { days, hours, minutes, totalHours } = remainingTime;

			const showWarning = () => {
				const now = Date.now();
				let warningInterval;

				log(
					`Debug: Remaining time - ${days} days, ${hours} hours, ${minutes} minutes (Total: ${totalHours} hours)`
				);

				if (days > 1) {
					log(`Debug: More than 1 day remaining, no warning needed`);
					return; // Exit the function early, no warning needed
				} else if (days === 1) {
					warningInterval = 24 * 60 * 60 * 1000; // Once a day
					log(
						`Debug: Interval set to daily (${warningInterval / 1000} seconds)`
					);
				} else if (hours >= 1) {
					warningInterval = 60 * 60 * 1000; // Every hour
					log(
						`Debug: Interval set to hourly (${warningInterval / 1000} seconds)`
					);
				} else {
					warningInterval = 15 * 60 * 1000; // Every 15 minutes
					log(
						`Debug: Interval set to 15 minutes (${
							warningInterval / 1000
						} seconds)`
					);
				}

				const timeSinceLastWarning = now - lastWarningTimeRef.current;
				const timeUntilNextWarning = Math.max(
					0,
					warningInterval - timeSinceLastWarning
				);

				log(
					`Time until next warning check: ${
						timeUntilNextWarning / 1000
					} seconds`
				);

				if (
					!initialCheckDoneRef.current ||
					timeSinceLastWarning >= warningInterval
				) {
					let message = `Your license will expire in `;
					if (days > 0) message += `${days} day${days > 1 ? "s" : ""}`;
					else if (hours > 0) message += `${hours} hour${hours > 1 ? "s" : ""}`;
					else if (minutes > 0)
						message += `${minutes} minute${minutes > 1 ? "s" : ""}`;
					else message += `less than a minute`;

					log(`Warning triggered: ${message}`);

					if (days <= 1) {
						toast.warn(message, {
							position: "top-center",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
						});
					}

					lastWarningTimeRef.current = now;
					initialCheckDoneRef.current = true;

					log(
						`Next warning will be triggered in ${
							warningInterval / 1000
						} seconds`
					);
				}
			};

			showWarning();
		}
	}, [remainingTime, isLicensed]);

	return null;
}

export default LicenseExpirationWarning;
