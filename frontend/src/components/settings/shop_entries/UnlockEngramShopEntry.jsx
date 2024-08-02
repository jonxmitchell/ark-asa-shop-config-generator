// src/components/settings/shop_entries/UnlockEngramShopEntry.jsx

import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchableDropdown from "../../SearchableDropdown";
import { useArkData } from "../../../hooks/useArkData";
import { TrashIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/solid";

const UnlockEngramShopEntry = React.memo(
	({
		itemName,
		itemData,
		expanded,
		handleItemChange,
		handleItemEntryChange,
		addItemEntry,
		removeItemEntry,
	}) => {
		const { arkData, loading, error } = useArkData();

		const toggleField = useCallback(
			(field) => {
				handleItemChange(
					itemName,
					field,
					itemData[field] === undefined ? 0 : undefined
				);
			},
			[itemName, itemData, handleItemChange]
		);

		const handleInputChange = useCallback(
			(field, value) => {
				handleItemChange(itemName, field, value);
			},
			[itemName, handleItemChange]
		);

		const handleEngramSelect = useCallback(
			(index, selected) => {
				handleItemEntryChange(itemName, index, "Blueprint", selected.Blueprint);
			},
			[itemName, handleItemEntryChange]
		);

		const handleAddItemEntry = useCallback(() => {
			addItemEntry(itemName);
		}, [itemName, addItemEntry]);

		const handleRemoveItemEntry = useCallback(
			(index) => {
				removeItemEntry(itemName, index);
			},
			[itemName, removeItemEntry]
		);

		const engramOptions = useMemo(() => {
			return Object.values(arkData.Engrams || {});
		}, [arkData.Engrams]);

		if (loading) return <div>Loading...</div>;
		if (error) return <div>Error loading data</div>;

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
									onChange={(e) => handleInputChange("Title", e.target.value)}
									className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
									autoComplete="off"
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
										handleInputChange("Description", e.target.value)
									}
									className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
									autoComplete="off"
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
										handleInputChange("Price", parseInt(e.target.value))
									}
									className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
									autoComplete="off"
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
											value={
												itemData[field] !== undefined ? itemData[field] : ""
											}
											onChange={(e) =>
												handleInputChange(
													field,
													field === "Permissions"
														? e.target.value
														: parseInt(e.target.value)
												)
											}
											className={`w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
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

						<div className="flex justify-between items-center">
							<h5 className="text-sm font-medium text-gray-300">Engrams</h5>
							<button
								onClick={handleAddItemEntry}
								className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center text-sm">
								<PlusIcon className="h-4 w-4 mr-1" />
								Add Engram
							</button>
						</div>
						<AnimatePresence>
							{itemData.Items &&
								itemData.Items.map((engram, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="bg-light-black p-4 rounded-lg space-y-2">
										<div className="flex items-center space-x-2">
											<div className="flex-grow">
												<SearchableDropdown
													options={engramOptions}
													onSelect={(selected) =>
														handleEngramSelect(index, selected)
													}
													placeholder="Select or enter an engram"
													value={engram.Blueprint || ""}
													className="w-full bg-mid-black"
												/>
											</div>
											<button
												onClick={() => handleRemoveItemEntry(index)}
												className="text-red-500 hover:text-red-700 flex-shrink-0">
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
);

export default UnlockEngramShopEntry;
