// src/components/settings/shop_entries/UnlockEngramShopEntry.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchableDropdown from "../../SearchableDropdown";
import { useArkData } from "../../../hooks/useArkData";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

function UnlockEngramShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
	handleItemEntryChange,
	addItemEntry,
	removeItemEntry,
}) {
	const { arkData, loading, error } = useArkData();

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading data</div>;

	const engramOptions = Object.values(arkData.Engrams || {});

	return (
		<AnimatePresence>
			{expanded && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-2 mt-2">
					<div className="flex space-x-2">
						<div className="flex-grow">
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
						<div className="w-1/4">
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
						<div className="flex items-end">
							<button
								onClick={() => addItemEntry(itemName)}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
								<PlusIcon className="h-5 w-4 mr-1" />
								Add Engram
							</button>
						</div>
					</div>
					<div className="space-y-2 mt-4">
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
													onSelect={(selected) => {
														handleItemEntryChange(
															itemName,
															index,
															"Blueprint",
															selected.Blueprint
														);
													}}
													placeholder="Select or enter an engram"
													value={engram.Blueprint || ""}
													className="w-full bg-mid-black"
												/>
											</div>
											<button
												onClick={() => removeItemEntry(itemName, index)}
												className="text-red-500 hover:text-red-700 flex-shrink-0">
												<TrashIcon className="h-5 w-5" />
											</button>
										</div>
									</motion.div>
								))}
						</AnimatePresence>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default UnlockEngramShopEntry;
