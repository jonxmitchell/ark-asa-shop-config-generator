// src/components/settings/shop_entries/ExperienceShopEntry.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PowerIcon } from "@heroicons/react/24/solid";

function ExperienceShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
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
