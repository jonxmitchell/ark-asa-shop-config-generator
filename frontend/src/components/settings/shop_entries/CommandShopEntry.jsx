// src/components/settings/shop_entries/CommandShopEntry.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

function CommandShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
	handleItemEntryChange,
	addItemEntry,
	removeItemEntry,
}) {
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
						<div className="col-span-3 flex items-end">
							<button
								onClick={() => addItemEntry(itemName)}
								className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
								<PlusIcon className="h-4 w-4 mr-1" />
								Add Command
							</button>
						</div>
					</div>
					<div className="space-y-2 mt-4">
						<h5 className="text-sm font-medium text-gray-300">Commands</h5>
						{itemData.Items &&
							itemData.Items.map((command, index) => (
								<div
									key={index}
									className="bg-light-black p-3 rounded-lg space-y-2">
									<div className="flex items-center space-x-2">
										<div className="flex-grow space-y-2">
											<input
												type="text"
												value={command.Command}
												onChange={(e) =>
													handleItemEntryChange(
														itemName,
														index,
														"Command",
														e.target.value
													)
												}
												placeholder="Command"
												className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
												autoComplete="off"
											/>
											<input
												type="text"
												value={command.DisplayAs}
												onChange={(e) =>
													handleItemEntryChange(
														itemName,
														index,
														"DisplayAs",
														e.target.value
													)
												}
												placeholder="Display As"
												className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
												autoComplete="off"
											/>
										</div>
										<button
											onClick={() => removeItemEntry(itemName, index)}
											className="text-red-500 hover:text-red-700 self-center">
											<TrashIcon className="h-5 w-5" />
										</button>
									</div>
								</div>
							))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default CommandShopEntry;
