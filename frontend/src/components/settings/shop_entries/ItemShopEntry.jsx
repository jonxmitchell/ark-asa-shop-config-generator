// src/components/settings/shop_entries/ItemShopEntry.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/solid";
import SearchableDropdown from "../../SearchableDropdown";

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
	const toggleField = (field) => {
		handleItemChange(
			itemName,
			field,
			itemData[field] === undefined ? 0 : undefined
		);
	};

	return (
		<AnimatePresence>
			{expanded && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-2 mt-2">
					<div className="flex space-x-2 items-end">
						<div className="flex-1">
							<label
								htmlFor={`description-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Description
							</label>
							<input
								id={`description-${itemName}`}
								type="text"
								value={itemData.Description}
								onChange={(e) =>
									handleItemChange(itemName, "Description", e.target.value)
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
							/>
						</div>
						<div className="w-1/4">
							<label
								htmlFor={`price-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Price
							</label>
							<input
								id={`price-${itemName}`}
								type="number"
								value={itemData.Price}
								onChange={(e) =>
									handleItemChange(itemName, "Price", parseInt(e.target.value))
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
							/>
						</div>
						<button
							onClick={() => addItemEntry(itemName)}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center">
							<PlusIcon className="h-5 w-5 mr-1" />
							Add Entry
						</button>
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

					<AnimatePresence>
						{itemData.Items.map((entry, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="bg-light-black p-4 rounded-lg space-y-2">
								<div className="grid grid-cols-2 gap-2">
									<div>
										<label
											htmlFor={`quality-${itemName}-${index}`}
											className="block text-sm font-medium text-gray-300">
											Quality
										</label>
										<input
											id={`quality-${itemName}-${index}`}
											type="number"
											value={entry.Quality}
											onChange={(e) =>
												handleItemEntryChange(
													itemName,
													index,
													"Quality",
													parseInt(e.target.value)
												)
											}
											className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
											autoComplete="off"
										/>
									</div>
									<div>
										<label
											htmlFor={`amount-${itemName}-${index}`}
											className="block text-sm font-medium text-gray-300">
											Amount
										</label>
										<input
											id={`amount-${itemName}-${index}`}
											type="number"
											value={entry.Amount}
											onChange={(e) =>
												handleItemEntryChange(
													itemName,
													index,
													"Amount",
													parseInt(e.target.value)
												)
											}
											className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
											autoComplete="off"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor={`blueprint-${itemName}-${index}`}
										className="block text-sm font-medium text-gray-300">
										Blueprint
									</label>
									<SearchableDropdown
										id={`blueprint-${itemName}-${index}`}
										options={Object.values(arkData.Items)}
										onSelect={(selected) =>
											handleItemEntryChange(
												itemName,
												index,
												"Blueprint",
												selected.Blueprint
											)
										}
										placeholder="Select or enter a blueprint"
										value={entry.Blueprint}
										className={"w-full bg-mid-black"}
									/>
								</div>
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-2">
										<input
											id={`forceBlueprint-${itemName}-${index}`}
											type="checkbox"
											checked={entry.ForceBlueprint}
											onChange={(e) =>
												handleItemEntryChange(
													itemName,
													index,
													"ForceBlueprint",
													e.target.checked
												)
											}
											className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
										/>
										<label
											htmlFor={`forceBlueprint-${itemName}-${index}`}
											className="text-sm text-gray-300">
											Force Blueprint
										</label>
									</div>
									<button
										onClick={() => removeItemEntry(itemName, index)}
										className="text-red-500 hover:text-red-700">
										<TrashIcon className="h-5 w-5" />
									</button>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ItemShopEntry;
