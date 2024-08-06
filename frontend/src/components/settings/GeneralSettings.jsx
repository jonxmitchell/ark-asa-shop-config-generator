// src/components/settings/GeneralSettings.jsx

import React from "react";
import DiscordSettings from "./DiscordSettings";
import TimedPointsRewards from "./TimedPointsRewards";
import { useConfig } from "../ConfigContext";
import { Tooltip } from "react-tooltip";

function GeneralSettings() {
	const { config, updateConfig, showTooltips } = useConfig();
	const generalConfig = config?.General || {};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		updateConfig({
			General: {
				...generalConfig,
				[name]:
					type === "checkbox"
						? checked
						: type === "number"
						? parseFloat(value)
						: value,
			},
		});
	};

	const handleSliderChange = (name, value) => {
		updateConfig({
			General: {
				...generalConfig,
				[name]: parseFloat(value),
			},
		});
	};

	return (
		<div className="space-y-6">
			<div className="bg-light-black p-6 rounded-lg">
				<div className="space-y-6">
					{/* Numeric inputs with sliders */}
					{["ItemsPerPage", "ShopDisplayTime", "ShopTextSize"].map(
						(setting) => (
							<div key={setting} className="space-y-2">
								<label
									htmlFor={setting}
									className="block text-sm font-medium text-gray-300">
									{setting}
								</label>
								<div className="flex items-center space-x-4">
									<input
										type="range"
										id={`${setting}-slider`}
										name={setting}
										min={0}
										max={setting === "ItemsPerPage" ? 100 : 30}
										step={setting === "ShopTextSize" ? 0.1 : 1}
										value={generalConfig[setting] || 0}
										onChange={(e) =>
											handleSliderChange(setting, e.target.value)
										}
										className="w-11/12 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
										data-tooltip-id={`tooltip-${setting}`}
									/>
									<input
										type="number"
										id={setting}
										name={setting}
										value={generalConfig[setting] || 0}
										onChange={handleChange}
										step={setting === "ShopTextSize" ? 0.1 : 1}
										autoComplete="off"
										className="w-1/12 px-2 py-1 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
						)
					)}

					{/* Text inputs */}
					{["DbPathOverride", "DefaultKit", "CryoItemPath"].map((setting) => (
						<div key={setting} className="space-y-2">
							<label
								htmlFor={setting}
								className="block text-sm font-medium text-gray-300">
								{setting}
							</label>
							<input
								type="text"
								id={setting}
								name={setting}
								value={generalConfig[setting] || ""}
								onChange={handleChange}
								autoComplete="off"
								className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								data-tooltip-id={`tooltip-${setting}`}
							/>
						</div>
					))}

					{/* Checkbox inputs in two columns */}
					<div className="grid grid-cols-2 gap-4">
						{[
							"GiveDinosInCryopods",
							"UseSoulTraps",
							"CryoLimitedTime",
							"UseOriginalTradeCommandWithUI",
							"PreventUseNoglin",
							"PreventUseUnconscious",
							"PreventUseHandcuffed",
							"PreventUseCarried",
						].map((setting) => (
							<div key={setting} className="flex items-center">
								<input
									type="checkbox"
									id={setting}
									name={setting}
									checked={generalConfig[setting] || false}
									onChange={handleChange}
									className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
								/>
								<label
									htmlFor={setting}
									className="ml-2 text-sm font-medium text-gray-300"
									data-tooltip-id={`tooltip-${setting}`}>
									{setting}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>

			<DiscordSettings />
			<TimedPointsRewards />

			{showTooltips && (
				<>
					{[
						"ItemsPerPage",
						"ShopDisplayTime",
						"ShopTextSize",
						"DbPathOverride",
						"DefaultKit",
						"CryoItemPath",
						"GiveDinosInCryopods",
						"UseSoulTraps",
						"CryoLimitedTime",
						"UseOriginalTradeCommandWithUI",
						"PreventUseNoglin",
						"PreventUseUnconscious",
						"PreventUseHandcuffed",
						"PreventUseCarried",
					].map((setting) => (
						<Tooltip
							key={setting}
							id={`tooltip-${setting}`}
							place="top"
							content={getTooltipContent(setting)}
							offset={35}
							opacity={1}
						/>
					))}
				</>
			)}
		</div>
	);
}

function getTooltipContent(setting) {
	const tooltipContent = {
		ItemsPerPage: "Number of items to display per page in the shop",
		ShopDisplayTime: "Time in seconds to display the shop",
		ShopTextSize: "Size of the text in the shop UI",
		DbPathOverride: "Custom path for the database file",
		DefaultKit: "Name of the default kit to give new players",
		CryoItemPath: "Path to the cryopod item blueprint",
		GiveDinosInCryopods: "Give purchased dinos in cryopods",
		UseSoulTraps: "Use soul traps instead of cryopods",
		CryoLimitedTime: "Limit the time dinos can stay in cryopods",
		UseOriginalTradeCommandWithUI: "Use the original trade command with a UI",
		PreventUseNoglin: "Prevent using the shop while controlling a Noglin",
		PreventUseUnconscious: "Prevent using the shop while unconscious",
		PreventUseHandcuffed: "Prevent using the shop while handcuffed",
		PreventUseCarried: "Prevent using the shop while being carried",
	};

	return tooltipContent[setting] || "No description available";
}

export default GeneralSettings;
