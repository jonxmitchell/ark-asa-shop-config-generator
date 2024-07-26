import React from "react";

function DiscordSettings({ config, onConfigUpdate }) {
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		onConfigUpdate({
			...config,
			General: {
				...config.General,
				Discord: {
					...config.General.Discord,
					[name]: type === "checkbox" ? checked : value,
				},
			},
		});
	};

	const isEnabled = config.General.Discord?.Enabled || false;

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
						value={config.General.Discord?.SenderName || ""}
						onChange={handleChange}
						disabled={!isEnabled}
						autoComplete="off"
						className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
							!isEnabled && "opacity-50 cursor-not-allowed"
						}`}
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
						value={config.General.Discord?.URL || ""}
						onChange={handleChange}
						disabled={!isEnabled}
						autoComplete="off"
						className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
							!isEnabled && "opacity-50 cursor-not-allowed"
						}`}
					/>
				</div>
			</div>
		</div>
	);
}

export default DiscordSettings;
