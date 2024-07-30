// src/components/settings/shop_entries/DinoShopEntry.jsx

import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import SearchableDropdown from "../../SearchableDropdown";
import { useArkData } from "../../../hooks/useArkData";
import { PowerIcon } from "@heroicons/react/24/solid";

const STRYDER_BLUEPRINT =
	"Blueprint'/Game/Genesis2/Dinos/TekStrider/TekStrider_Character_BP.TekStrider_Character_BP'";
const GACHA_BLUEPRINT =
	"Blueprint'/Game/Extinction/Dinos/Gacha/Gacha_Character_BP.Gacha_Character_BP'";

function DinoShopEntry({ itemName, itemData, expanded, handleItemChange }) {
	const { arkData, loading, error } = useArkData();

	const isStryder = useMemo(
		() => itemData.Blueprint === STRYDER_BLUEPRINT,
		[itemData.Blueprint]
	);
	const isGacha = useMemo(
		() => itemData.Blueprint === GACHA_BLUEPRINT,
		[itemData.Blueprint]
	);

	useEffect(() => {
		const updateFields = () => {
			const updates = {};
			if (isStryder || isGacha) {
				updates.Gender = undefined;
			}
			if (isStryder) {
				updates.SaddleBlueprint = undefined;
			} else {
				updates.StryderHead = undefined;
				updates.StryderChest = undefined;
				updates.PreventCryo = undefined;
			}
			if (!isGacha) {
				updates.GachaResources = undefined;
			}

			Object.entries(updates).forEach(([key, value]) => {
				if (itemData[key] !== value) {
					handleItemChange(itemName, key, value);
				}
			});
		};

		updateFields();
	}, [isStryder, isGacha, itemName, handleItemChange, itemData]);

	const toggleField = (field) => {
		handleItemChange(
			itemName,
			field,
			itemData[field] === undefined ? 0 : undefined
		);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading data</div>;

	const dinoOptions = Object.values(arkData.Dinos || {});
	const saddleOptions = Object.values(arkData.Items || {}).filter(
		(item) => item.Type === "Saddles"
	);

	const renderGachaResources = () => {
		const resourceOptions = Object.values(arkData.Items || {}).filter(
			(item) => item.Type === "Resources"
		);
		const currentResources = itemData.GachaResources || {};
		const resourceTypes = [
			{ label: "Very Rare Resource", maxQty: 60 },
			{ label: "Rare Resource", maxQty: 10 },
			{ label: "Uncommon Resource 1", maxQty: 20 },
			{ label: "Uncommon Resource 2", maxQty: 20 },
			{ label: "Common Resource 1", maxQty: 40 },
			{ label: "Common Resource 2", maxQty: 40 },
		];

		return (
			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-300">
					Gacha Resources
				</label>
				{resourceTypes.map((resourceType, index) => (
					<div key={index} className="flex flex-col space-y-1">
						<label className="text-xs font-medium text-gray-400">
							{resourceType.label} (Max: {resourceType.maxQty})
						</label>
						<div className="flex items-center space-x-2">
							<SearchableDropdown
								options={resourceOptions}
								onSelect={(selected) => {
									const newResources = { ...currentResources };
									delete newResources[Object.keys(currentResources)[index]];
									newResources[selected.Blueprint] =
										Object.values(currentResources)[index] || 0;
									handleItemChange(itemName, "GachaResources", newResources);
								}}
								placeholder={`Select ${resourceType.label.toLowerCase()}`}
								value={Object.keys(currentResources)[index] || ""}
								className="flex-grow bg-dark-black"
							/>
							<input
								type="number"
								value={Object.values(currentResources)[index] || 0}
								onChange={(e) => {
									const newResources = { ...currentResources };
									newResources[Object.keys(currentResources)[index]] = Math.min(
										parseInt(e.target.value),
										resourceType.maxQty
									);
									handleItemChange(itemName, "GachaResources", newResources);
								}}
								className="w-20 px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								max={resourceType.maxQty}
							/>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: expanded ? 1 : 0, height: expanded ? "auto" : 0 }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.3 }}
			className="space-y-2 mt-2 overflow-hidden">
			{expanded && (
				<>
					<div className="grid grid-cols-12 gap-2">
						<div className="col-span-6">
							<label
								htmlFor={`description-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Description
							</label>
							<input
								id={`description-${itemName}`}
								type="text"
								value={itemData.Description || ""}
								onChange={(e) =>
									handleItemChange(itemName, "Description", e.target.value)
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
							/>
						</div>
						<div className="col-span-3">
							<label
								htmlFor={`price-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Price
							</label>
							<input
								id={`price-${itemName}`}
								type="number"
								value={itemData.Price || 0}
								onChange={(e) =>
									handleItemChange(itemName, "Price", parseInt(e.target.value))
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
							/>
						</div>
						<div className="col-span-3">
							<label
								htmlFor={`level-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Level
							</label>
							<input
								id={`level-${itemName}`}
								type="number"
								value={itemData.Level || 1}
								onChange={(e) =>
									handleItemChange(itemName, "Level", parseInt(e.target.value))
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
							/>
						</div>
					</div>

					{/* New fields: MinLevel, MaxLevel, Permissions */}
					<div className="grid grid-cols-3 gap-2">
						{["MinLevel", "MaxLevel", "Permissions"].map((field) => (
							<div key={field} className="relative">
								<label
									htmlFor={`${field}-${itemName}`}
									className="block text-sm font-medium text-gray-300">
									{field}
								</label>
								<div className="relative">
									<input
										id={`${field}-${itemName}`}
										type={field === "Permissions" ? "text" : "number"}
										value={itemData[field] !== undefined ? itemData[field] : ""}
										onChange={(e) =>
											handleItemChange(
												itemName,
												field,
												field === "Permissions"
													? e.target.value
													: parseInt(e.target.value)
											)
										}
										className={`w-full px-3 py-2 pr-8 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
											itemData[field] === undefined &&
											"opacity-50 cursor-not-allowed"
										}`}
										disabled={itemData[field] === undefined}
										autoComplete="off"
									/>
									<button
										onClick={() => toggleField(field)}
										className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${
											itemData[field] !== undefined
												? "hover:text-red-500"
												: "hover:text-green-500"
										}`}
										title={
											itemData[field] !== undefined
												? "Disable field"
												: "Enable field"
										}>
										<PowerIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="flex items-center space-x-2">
						<div className="flex-grow">
							<label
								htmlFor={`blueprint-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Dino Blueprint
							</label>
							<SearchableDropdown
								options={dinoOptions}
								onSelect={(selected) =>
									handleItemChange(itemName, "Blueprint", selected.Blueprint)
								}
								placeholder="Select or enter a dino blueprint"
								value={itemData.Blueprint || ""}
								className="bg-dark-black"
							/>
						</div>
						<div className="flex items-center space-x-2 mt-6">
							<input
								type="checkbox"
								id={`neutered-${itemName}`}
								checked={itemData.Neutered || false}
								onChange={(e) =>
									handleItemChange(itemName, "Neutered", e.target.checked)
								}
								className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
							/>
							<label
								htmlFor={`neutered-${itemName}`}
								className="text-sm font-medium text-gray-300">
								Neutered
							</label>
						</div>
					</div>

					{!isStryder && !isGacha && (
						<div>
							<label
								htmlFor={`gender-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Gender
							</label>
							<select
								id={`gender-${itemName}`}
								value={itemData.Gender || "random"}
								onChange={(e) =>
									handleItemChange(itemName, "Gender", e.target.value)
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
								<option value="random">Random</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>
					)}
					{!isStryder && (
						<div>
							<label
								htmlFor={`saddle-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Saddle Blueprint
							</label>
							<SearchableDropdown
								options={saddleOptions}
								onSelect={(selected) =>
									handleItemChange(
										itemName,
										"SaddleBlueprint",
										selected.Blueprint
									)
								}
								placeholder="Select a saddle"
								value={itemData.SaddleBlueprint || ""}
								className="w-full bg-dark-black"
							/>
						</div>
					)}
					{isStryder && (
						<>
							<div>
								<label
									htmlFor={`stryderHead-${itemName}`}
									className="block text-sm font-medium text-gray-300">
									Stryder Head
								</label>
								<select
									id={`stryderHead-${itemName}`}
									value={itemData.StryderHead || -1}
									onChange={(e) =>
										handleItemChange(
											itemName,
											"StryderHead",
											parseInt(e.target.value)
										)
									}
									className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
									<option value={-1}>Random</option>
									<option value={0}>Harvester</option>
									<option value={1}>Silence Cannon</option>
									<option value={2}>Machine Gun</option>
									<option value={3}>Radar</option>
								</select>
							</div>
							<div>
								<label
									htmlFor={`stryderChest-${itemName}`}
									className="block text-sm font-medium text-gray-300">
									Stryder Chest
								</label>
								<select
									id={`stryderChest-${itemName}`}
									value={itemData.StryderChest || -1}
									onChange={(e) =>
										handleItemChange(
											itemName,
											"StryderChest",
											parseInt(e.target.value)
										)
									}
									className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
									<option value={-1}>Random</option>
									<option value={0}>Shield</option>
									<option value={1}>One-sided Shield</option>
									<option value={2}>Cannon</option>
									<option value={3}>Saddlebags</option>
								</select>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id={`preventCryo-${itemName}`}
									checked={itemData.PreventCryo || false}
									onChange={(e) =>
										handleItemChange(itemName, "PreventCryo", e.target.checked)
									}
									className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
								/>
								<label
									htmlFor={`preventCryo-${itemName}`}
									className="text-sm font-medium text-gray-300">
									Prevent Cryo
								</label>
							</div>
						</>
					)}
					{isGacha && renderGachaResources()}
				</>
			)}
		</motion.div>
	);
}

export default DinoShopEntry;
