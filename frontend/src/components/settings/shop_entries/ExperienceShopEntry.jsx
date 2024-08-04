// src/components/settings/shop_entries/ExperienceShopEntry.jsx

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PowerIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";

function ExperienceShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
}) {
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
						<div className="col-span-3">
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
								data-tooltip-id={`tooltip-title-${itemName}`}
							/>
						</div>
						<div className="col-span-5">
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
								data-tooltip-id={`tooltip-description-${itemName}`}
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
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-500 focus:border-blue-500"
								autoComplete="off"
								data-tooltip-id={`tooltip-price-${itemName}`}
							/>
						</div>
						<div className="col-span-2">
							<label
								htmlFor={`amount-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Amount
							</label>
							<input
								id={`amount-${itemName}`}
								type="number"
								value={itemData.Amount || 0}
								onChange={(e) =>
									handleItemChange(
										itemName,
										"Amount",
										parseFloat(e.target.value)
									)
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
								data-tooltip-id={`tooltip-amount-${itemName}`}
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
										data-tooltip-id={`tooltip-${field.toLowerCase()}-${itemName}`}
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
										data-tooltip-id={`tooltip-toggle-${field.toLowerCase()}-${itemName}`}>
										<PowerIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="flex items-center">
						<input
							id={`giveToDino-${itemName}`}
							type="checkbox"
							checked={itemData.GiveToDino || false}
							onChange={(e) =>
								handleItemChange(itemName, "GiveToDino", e.target.checked)
							}
							className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
						/>
						<label
							htmlFor={`giveToDino-${itemName}`}
							className="ml-2 text-sm font-medium text-gray-300"
							data-tooltip-id={`tooltip-give-to-dino-${itemName}`}>
							Give To Dino
						</label>
					</div>
				</motion.div>
			)}
			{/* Tooltips */}
			<Tooltip
				id={`tooltip-title-${itemName}`}
				place="top"
				content="Enter the title for this experience item"
			/>
			<Tooltip
				id={`tooltip-description-${itemName}`}
				place="top"
				content="Enter a description for this experience item"
			/>
			<Tooltip
				id={`tooltip-price-${itemName}`}
				place="top"
				content="Set the price for this experience item"
			/>
			<Tooltip
				id={`tooltip-amount-${itemName}`}
				place="top"
				content="Set the amount of experience to give"
			/>
			<Tooltip
				id={`tooltip-minlevel-${itemName}`}
				place="top"
				content="Set the minimum level required for this experience item"
			/>
			<Tooltip
				id={`tooltip-maxlevel-${itemName}`}
				place="top"
				content="Set the maximum level allowed for this experience item"
			/>
			<Tooltip
				id={`tooltip-permissions-${itemName}`}
				place="top"
				content="Set the permissions required for this experience item"
			/>
			<Tooltip
				id={`tooltip-toggle-minlevel-${itemName}`}
				place="top"
				content="Toggle minimum level requirement"
			/>
			<Tooltip
				id={`tooltip-toggle-maxlevel-${itemName}`}
				place="top"
				content="Toggle maximum level limit"
			/>
			<Tooltip
				id={`tooltip-toggle-permissions-${itemName}`}
				place="top"
				content="Toggle permissions requirement"
			/>
			<Tooltip
				id={`tooltip-give-to-dino-${itemName}`}
				place="top"
				content="Check to give experience to the player's dinosaur instead of the player"
			/>
		</AnimatePresence>
	);
}

export default React.memo(ExperienceShopEntry);
