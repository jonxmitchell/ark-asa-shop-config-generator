// src/components/settings/DiscordSettings.jsx

import React from "react";
import { useConfig } from "../ConfigContext";
import { Tooltip } from "react-tooltip";

function DiscordSettings() {
	const { config, updateConfig, showTooltips } = useConfig();
	const discordConfig = config?.General?.Discord || {};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		updateConfig((prevConfig) => ({
			...prevConfig,
			General: {
				...prevConfig.General,
				Discord: {
					...prevConfig.General?.Discord,
					[name]: type === "checkbox" ? checked : value,
				},
			},
		}));
	};

	const isEnabled = discordConfig.Enabled || false;

	return (
		<div className="bg-light-black p-6 rounded-lg mb-6">
			<h4 className="text-lg font-semibold mb-4 text-white">
				Discord Settings
			</h4>
			<div className="space-y-4">
				<div className="flex items-center">
					<input
						type="checkbox"
						id="discordEnabled"
						name="Enabled"
						checked={isEnabled}
						onChange={handleChange}
						className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
						data-tooltip-id="discord-enabled"
						data-tooltip-content="Enable or disable Discord logging"
					/>
					<label
						htmlFor="discordEnabled"
						className="ml-2 text-sm font-medium text-gray-300">
						Enable Discord Logging
					</label>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="senderName"
						className={`block text-sm font-medium text-gray-300 ${
							!isEnabled && "opacity-50"
						}`}>
						Sender Name
					</label>
					<input
						type="text"
						id="senderName"
						name="SenderName"
						value={discordConfig.SenderName || ""}
						onChange={handleChange}
						disabled={!isEnabled}
						autoComplete="off"
						className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
							!isEnabled && "opacity-50 cursor-not-allowed"
						}`}
						data-tooltip-id="discord-sender-name"
						data-tooltip-content="Set the name that will appear as the sender in Discord"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="webhookURL"
						className={`block text-sm font-medium text-gray-300 ${
							!isEnabled && "opacity-50"
						}`}>
						Webhook URL
					</label>
					<input
						type="text"
						id="webhookURL"
						name="URL"
						value={discordConfig.URL || ""}
						onChange={handleChange}
						disabled={!isEnabled}
						autoComplete="off"
						className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
							!isEnabled && "opacity-50 cursor-not-allowed"
						}`}
						data-tooltip-id="discord-webhook-url"
						data-tooltip-content="Enter the Discord webhook URL for logging"
					/>
				</div>
			</div>
			{showTooltips && (
				<>
					<Tooltip id="discord-enabled" place="top" opacity={1} />
					<Tooltip id="discord-sender-name" place="top" opacity={1} />
					<Tooltip id="discord-webhook-url" place="top" opacity={1} />
				</>
			)}
		</div>
	);
}

export default DiscordSettings;
