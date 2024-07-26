import React from "react";

function GeneralSettings({ config, onConfigUpdate }) {
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		onConfigUpdate({
			...config,
			General: {
				...config.General,
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
		onConfigUpdate({
			...config,
			General: {
				...config.General,
				[name]: parseFloat(value),
			},
		});
	};

	const handleTimedRewardsChange = (e) => {
		const { name, value, type, checked } = e.target;
		onConfigUpdate({
			...config,
			General: {
				...config.General,
				TimedPointsReward: {
					...config.General.TimedPointsReward,
					[name]:
						type === "checkbox"
							? checked
							: type === "number"
							? parseInt(value, 10)
							: value,
				},
			},
		});
	};

	const handleTimedRewardsSliderChange = (value) => {
		onConfigUpdate({
			...config,
			General: {
				...config.General,
				TimedPointsReward: {
					...config.General.TimedPointsReward,
					Interval: parseInt(value, 10),
				},
			},
		});
	};

	const isTimedRewardsEnabled =
		config.General.TimedPointsReward?.Enabled || false;

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
										value={config.General[setting] || 0}
										onChange={(e) =>
											handleSliderChange(setting, e.target.value)
										}
										className="w-11/12 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
									/>
									<input
										type="number"
										id={setting}
										name={setting}
										value={config.General[setting] || 0}
										onChange={handleChange}
										step={setting === "ShopTextSize" ? 0.1 : 1}
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
								value={config.General[setting] || ""}
								onChange={handleChange}
								className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
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
									checked={config.General[setting] || false}
									onChange={handleChange}
									className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
								/>
								<label
									htmlFor={setting}
									className="ml-2 text-sm font-medium text-gray-300">
									{setting}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Timed Points Reward in its own bubble */}
			<div className="bg-light-black p-6 rounded-lg">
				<h4 className="text-lg font-semibold mb-4 text-white">
					Timed Points Reward
				</h4>
				<div className="space-y-4">
					<div className="flex items-center">
						<input
							type="checkbox"
							id="timedRewardsEnabled"
							name="Enabled"
							checked={isTimedRewardsEnabled}
							onChange={handleTimedRewardsChange}
							className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
						/>
						<label
							htmlFor="timedRewardsEnabled"
							className="ml-2 text-sm font-medium text-gray-300">
							Enable Timed Points Reward
						</label>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="stackRewards"
								name="StackRewards"
								checked={
									config.General.TimedPointsReward?.StackRewards || false
								}
								onChange={handleTimedRewardsChange}
								disabled={!isTimedRewardsEnabled}
								className={`w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 ${
									!isTimedRewardsEnabled && "opacity-50 cursor-not-allowed"
								}`}
							/>
							<label
								htmlFor="stackRewards"
								className={`ml-2 text-sm font-medium text-gray-300 ${
									!isTimedRewardsEnabled && "opacity-50"
								}`}>
								Stack Rewards
							</label>
						</div>
						{/* Add another checkbox here if needed */}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="rewardInterval"
							className={`block text-sm font-medium text-gray-300 ${
								!isTimedRewardsEnabled && "opacity-50"
							}`}>
							Reward Interval (minutes)
						</label>
						<div className="flex items-center space-x-4">
							<input
								type="range"
								id="rewardIntervalSlider"
								name="Interval"
								min={1}
								max={120}
								step={1}
								value={config.General.TimedPointsReward?.Interval || 30}
								onChange={(e) => handleTimedRewardsSliderChange(e.target.value)}
								disabled={!isTimedRewardsEnabled}
								className={`w-11/12 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${
									!isTimedRewardsEnabled && "opacity-50 cursor-not-allowed"
								}`}
							/>
							<input
								type="number"
								id="rewardInterval"
								name="Interval"
								value={config.General.TimedPointsReward?.Interval || 30}
								onChange={handleTimedRewardsChange}
								disabled={!isTimedRewardsEnabled}
								className={`w-1/12 px-2 py-1 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
									!isTimedRewardsEnabled && "opacity-50 cursor-not-allowed"
								}`}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GeneralSettings;
