import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

function TimedPointsRewards({ config, onConfigUpdate }) {
	const [newGroupName, setNewGroupName] = useState("");

	const handleChange = (e) => {
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

	const handleSliderChange = (value) => {
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

	const handleGroupChange = (groupName, amount) => {
		onConfigUpdate({
			...config,
			General: {
				...config.General,
				TimedPointsReward: {
					...config.General.TimedPointsReward,
					Groups: {
						...config.General.TimedPointsReward.Groups,
						[groupName]: { Amount: parseInt(amount, 10) },
					},
				},
			},
		});
	};

	const addGroup = () => {
		if (newGroupName.trim() !== "") {
			handleGroupChange(newGroupName, 0);
			setNewGroupName("");
		}
	};

	const removeGroup = (groupName) => {
		const updatedGroups = { ...config.General.TimedPointsReward.Groups };
		delete updatedGroups[groupName];
		onConfigUpdate({
			...config,
			General: {
				...config.General,
				TimedPointsReward: {
					...config.General.TimedPointsReward,
					Groups: updatedGroups,
				},
			},
		});
	};

	const isEnabled = config.General.TimedPointsReward?.Enabled || false;

	const sortedGroups = Object.entries(
		config.General.TimedPointsReward?.Groups || {}
	).sort((a, b) => a[0].localeCompare(b[0]));

	return (
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
						checked={isEnabled}
						onChange={handleChange}
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
							checked={config.General.TimedPointsReward?.StackRewards || false}
							onChange={handleChange}
							disabled={!isEnabled}
							className={`w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 ${
								!isEnabled && "opacity-50 cursor-not-allowed"
							}`}
						/>
						<label
							htmlFor="stackRewards"
							className={`ml-2 text-sm font-medium text-gray-300 ${
								!isEnabled && "opacity-50"
							}`}>
							Stack Rewards
						</label>
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="rewardInterval"
						className={`block text-sm font-medium text-gray-300 ${
							!isEnabled && "opacity-50"
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
							onChange={(e) => handleSliderChange(e.target.value)}
							disabled={!isEnabled}
							className={`w-11/12 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${
								!isEnabled && "opacity-50 cursor-not-allowed"
							}`}
						/>
						<input
							type="number"
							id="rewardInterval"
							name="Interval"
							value={config.General.TimedPointsReward?.Interval || 30}
							onChange={handleChange}
							disabled={!isEnabled}
							autoComplete="off"
							className={`w-1/12 px-2 py-1 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
								!isEnabled && "opacity-50 cursor-not-allowed"
							}`}
						/>
					</div>
				</div>

				<div className={`space-y-4 ${!isEnabled && "opacity-50"}`}>
					<h5 className="text-md font-semibold text-white">Groups</h5>
					<div className="flex space-x-2 mb-4">
						<input
							type="text"
							value={newGroupName}
							onChange={(e) => setNewGroupName(e.target.value)}
							placeholder="New group name"
							disabled={!isEnabled}
							autoComplete="off"
							className={`flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
								!isEnabled && "cursor-not-allowed"
							}`}
						/>
						<button
							onClick={addGroup}
							disabled={!isEnabled}
							className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
								!isEnabled && "opacity-50 cursor-not-allowed"
							}`}>
							Add Group
						</button>
					</div>
					{sortedGroups.map(([groupName, groupData]) => (
						<div
							key={groupName}
							className="bg-mid-black p-4 rounded-lg space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-300">
									{groupName}
								</span>
							</div>
							<div className="flex items-center space-x-4">
								<input
									type="range"
									min={0}
									max={100}
									step={1}
									value={groupData.Amount}
									onChange={(e) => handleGroupChange(groupName, e.target.value)}
									disabled={!isEnabled}
									className={`w-9/12 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${
										!isEnabled && "cursor-not-allowed"
									}`}
								/>
								<input
									type="number"
									value={groupData.Amount}
									onChange={(e) => handleGroupChange(groupName, e.target.value)}
									disabled={!isEnabled}
									autoComplete="off"
									className={`w-2/12 px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
										!isEnabled && "cursor-not-allowed"
									}`}
								/>
								<button
									onClick={() => removeGroup(groupName)}
									disabled={!isEnabled}
									className={`text-red-500 hover:text-red-700 ${
										!isEnabled && "cursor-not-allowed"
									}`}>
									<TrashIcon className="h-5 w-5" />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default TimedPointsRewards;
