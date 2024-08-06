// src/components/settings/shop_entries/BeaconShopEntry.jsx

import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchableDropdown from "../../SearchableDropdown";
import { PowerIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";

function BeaconShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
	arkData,
	showTooltips,
}) {
	const handleBeaconSelect = useCallback(
		(selected) => {
			if (selected && typeof selected === "object") {
				handleItemChange(itemName, "ClassName", selected.ClassName || "");
			} else if (typeof selected === "string") {
				handleItemChange(itemName, "ClassName", selected);
			}
		},
		[itemName, handleItemChange]
	);

	const toggleField = useCallback(
		(field) => {
			handleItemChange(
				itemName,
				field,
				itemData[field] === undefined
					? field === "MinLevel"
						? 1
						: field === "MaxLevel"
						? 2
						: field === "Permissions"
						? "default"
						: 0
					: undefined
			);
		},
		[itemName, itemData, handleItemChange]
	);

	const beaconOptions = useMemo(
		() => Object.values(arkData.Beacons || {}),
		[arkData.Beacons]
	);

	return (
		<AnimatePresence>
			{expanded && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-2 mt-2">
					<div className="grid grid-cols-12 gap-2">
						<div className="col-span-4">
							<label
								htmlFor={`title-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Title
							</label>
							<input
								id={`title-${itemName}`}
								type="text"
								value={itemData.Title || ""}
								onChange={(e) =>
									handleItemChange(itemName, "Title", e.target.value)
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
								data-tooltip-id="beacon-title-tooltip"
								data-tooltip-content="Enter the title for this beacon"
							/>
						</div>
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
								data-tooltip-id="beacon-description-tooltip"
							/>
						</div>
						<div className="col-span-2">
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
								data-tooltip-id="beacon-price-tooltip"
							/>
						</div>
					</div>

					<div className="grid grid-cols-12 gap-2">
						{["MinLevel", "MaxLevel", "Permissions"].map((field) => (
							<div key={field} className="col-span-4 relative">
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
										onChange={(e) => {
											let value = e.target.value;
											if (field === "MinLevel") {
												value = Math.max(1, parseInt(value) || 1);
											} else if (field === "MaxLevel") {
												value = Math.max(2, parseInt(value) || 2);
											}
											handleItemChange(itemName, field, value);
										}}
										className={`w-full px-3 py-2 pr-8 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
											itemData[field] === undefined &&
											"opacity-50 cursor-not-allowed"
										}`}
										disabled={itemData[field] === undefined}
										autoComplete="off"
										min={
											field === "MinLevel"
												? 1
												: field === "MaxLevel"
												? 2
												: undefined
										}
										data-tooltip-id={`beacon-${field.toLowerCase()}-tooltip`}
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
										}
										data-tooltip-id={`beacon-${field.toLowerCase()}-toggle-tooltip`}>
										<PowerIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>

					<div>
						<label
							htmlFor={`className-${itemName}`}
							className="block text-sm font-medium text-gray-300">
							Beacon Class Name
						</label>
						<SearchableDropdown
							id={`className-${itemName}`}
							options={beaconOptions}
							onSelect={handleBeaconSelect}
							placeholder="Select or enter a beacon class name"
							value={itemData.ClassName || ""}
							className="w-full bg-dark-black"
							displayKey="Name"
							valueKey="ClassName"
							data-tooltip-id="beacon-class-tooltip"
						/>
					</div>

					{showTooltips && (
						<>
							<Tooltip
								id="beacon-title-tooltip"
								place="top"
								content="Enter the title for this beacon"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-description-tooltip"
								place="top"
								content="Enter the description for this beacon"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-price-tooltip"
								place="top"
								content="Set the price for this beacon"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-minlevel-tooltip"
								place="top"
								content="Set the minimum level required for this beacon"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-maxlevel-tooltip"
								place="top"
								content="Set the maximum level allowed for this beacon"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-permissions-tooltip"
								place="top"
								content="Set the permissions required for this beacon"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-minlevel-toggle-tooltip"
								place="top"
								content="Toggle minimum level requirement"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-maxlevel-toggle-tooltip"
								place="top"
								content="Toggle maximum level limit"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-permissions-toggle-tooltip"
								place="top"
								content="Toggle permissions requirement"
								offset={20}
								opacity={1}
							/>
							<Tooltip
								id="beacon-class-tooltip"
								place="top"
								content="Select the class name for this beacon"
								offset={20}
								opacity={1}
							/>
						</>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default React.memo(BeaconShopEntry);
