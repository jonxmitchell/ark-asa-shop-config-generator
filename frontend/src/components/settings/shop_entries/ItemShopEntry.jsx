// src/components/settings/shop_entries/ItemShopEntry.jsx

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/solid";
import SearchableDropdown from "../../SearchableDropdown";
import { useConfig } from "../../ConfigContext";
import { Tooltip } from "react-tooltip";

const ItemEntry = React.memo(
	({ entry, index, handleItemEntryChange, removeItemEntry, arkData }) => {
		const { showTooltips } = useConfig();

		return (
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.2 }}
				className="bg-light-black p-4 rounded-lg space-y-2">
				<div className="grid grid-cols-12 gap-2">
					<div className="col-span-2">
						<label
							htmlFor={`quality-${index}`}
							className="block text-sm font-medium text-gray-300">
							Quality
						</label>
						<input
							id={`quality-${index}`}
							type="number"
							value={entry.Quality}
							onChange={(e) =>
								handleItemEntryChange(
									index,
									"Quality",
									parseInt(e.target.value)
								)
							}
							className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
							autoComplete="off"
							data-tooltip-id={`tooltip-quality-${index}`}
						/>
					</div>
					<div className="col-span-2">
						<label
							htmlFor={`amount-${index}`}
							className="block text-sm font-medium text-gray-300">
							Amount
						</label>
						<input
							id={`amount-${index}`}
							type="number"
							value={entry.Amount}
							onChange={(e) =>
								handleItemEntryChange(index, "Amount", parseInt(e.target.value))
							}
							className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
							autoComplete="off"
							data-tooltip-id={`tooltip-amount-${index}`}
						/>
					</div>
					<div className="col-span-8">
						<label
							htmlFor={`blueprint-${index}`}
							className="block text-sm font-medium text-gray-300">
							Blueprint
						</label>
						<SearchableDropdown
							id={`blueprint-${index}`}
							options={Object.values(arkData.Items)}
							onSelect={(selected) =>
								handleItemEntryChange(index, "Blueprint", selected.Blueprint)
							}
							placeholder="Select or enter a blueprint"
							value={entry.Blueprint}
							className={"w-full bg-mid-black"}
							data-tooltip-id={`tooltip-blueprint-${index}`}
						/>
					</div>
				</div>
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<input
							id={`forceBlueprint-${index}`}
							type="checkbox"
							checked={entry.ForceBlueprint}
							onChange={(e) =>
								handleItemEntryChange(index, "ForceBlueprint", e.target.checked)
							}
							className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
							data-tooltip-id={`tooltip-force-blueprint-${index}`}
						/>
						<label
							htmlFor={`forceBlueprint-${index}`}
							className="text-sm text-gray-300">
							Force Blueprint
						</label>
					</div>
					<button
						onClick={() => removeItemEntry(index)}
						className="text-red-500 hover:text-red-700"
						data-tooltip-id={`tooltip-remove-item-${index}`}>
						<TrashIcon className="h-5 w-5" />
					</button>
				</div>
				{showTooltips && (
					<>
						<Tooltip
							id={`tooltip-quality-${index}`}
							place="top"
							content="Set the quality of the item"
						/>
						<Tooltip
							id={`tooltip-amount-${index}`}
							place="top"
							content="Set the quantity of the item"
						/>
						<Tooltip
							id={`tooltip-blueprint-${index}`}
							place="top"
							content="Select the blueprint for the item"
						/>
						<Tooltip
							id={`tooltip-force-blueprint-${index}`}
							place="top"
							content="Force the use of blueprint for this item"
						/>
						<Tooltip
							id={`tooltip-remove-item-${index}`}
							place="top"
							content="Remove this item from the shop"
						/>
					</>
				)}
			</motion.div>
		);
	}
);

function ItemShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
	handleItemEntryChange,
	addItemEntry,
	removeItemEntry,
	arkData,
}) {
	const { showTooltips } = useConfig();

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
								data-tooltip-id={`tooltip-title-${itemName}`}
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
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
								data-tooltip-id={`tooltip-price-${itemName}`}
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
										data-tooltip-id={`tooltip-${field}-${itemName}`}
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
										data-tooltip-id={`tooltip-toggle-${field}-${itemName}`}>
										<PowerIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="space-y-2 mt-4">
						<div className="flex justify-between items-center">
							<h5 className="text-sm font-medium text-gray-300">Items</h5>
							<button
								onClick={() => addItemEntry(itemName)}
								className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center text-sm"
								data-tooltip-id={`tooltip-add-item-${itemName}`}>
								<PlusIcon className="h-4 w-4 mr-1" />
								Add Item
							</button>
						</div>
						{itemData.Items &&
							itemData.Items.map((item, index) => (
								<ItemEntry
									key={index}
									entry={item}
									index={index}
									handleItemEntryChange={(index, field, value) =>
										handleItemEntryChange(itemName, index, field, value)
									}
									removeItemEntry={() => removeItemEntry(itemName, index)}
									arkData={arkData}
								/>
							))}
					</div>
				</motion.div>
			)}
			{showTooltips && (
				<>
					<Tooltip
						id={`tooltip-title-${itemName}`}
						place="top"
						content="Enter the title for this shop item"
					/>
					<Tooltip
						id={`tooltip-description-${itemName}`}
						place="top"
						content="Enter the description for this shop item"
					/>
					<Tooltip
						id={`tooltip-price-${itemName}`}
						place="top"
						content="Set the price for this shop item"
					/>
					<Tooltip
						id={`tooltip-MinLevel-${itemName}`}
						place="top"
						content="Set the minimum level required to purchase this item"
					/>
					<Tooltip
						id={`tooltip-MaxLevel-${itemName}`}
						place="top"
						content="Set the maximum level allowed to purchase this item"
					/>
					<Tooltip
						id={`tooltip-Permissions-${itemName}`}
						place="top"
						content="Set the permissions required to purchase this item"
					/>
					<Tooltip
						id={`tooltip-toggle-MinLevel-${itemName}`}
						place="top"
						content="Toggle minimum level requirement"
					/>
					<Tooltip
						id={`tooltip-toggle-MaxLevel-${itemName}`}
						place="top"
						content="Toggle maximum level limit"
					/>
					<Tooltip
						id={`tooltip-toggle-Permissions-${itemName}`}
						place="top"
						content="Toggle permissions requirement"
					/>
					<Tooltip
						id={`tooltip-add-item-${itemName}`}
						place="top"
						content="Add a new item to this shop entry"
					/>
				</>
			)}
		</AnimatePresence>
	);
}

export default React.memo(ItemShopEntry);
