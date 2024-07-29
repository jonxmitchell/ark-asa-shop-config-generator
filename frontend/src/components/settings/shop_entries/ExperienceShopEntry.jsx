// src/components/settings/shop_entries/ExperienceShopEntry.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function ExperienceShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
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
					<div className="grid grid-cols-3 gap-2">
						<div>
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
						<div>
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
						<div>
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
							/>
						</div>
					</div>
					<div className="flex items-center">
						<input
							type="checkbox"
							id={`giveToDino-${itemName}`}
							checked={itemData.GiveToDino || false}
							onChange={(e) =>
								handleItemChange(itemName, "GiveToDino", e.target.checked)
							}
							className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
						/>
						<label
							htmlFor={`giveToDino-${itemName}`}
							className="ml-2 text-sm font-medium text-gray-300">
							Give To Dino
						</label>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ExperienceShopEntry;
