// src/components/settings/sell_shop_entries/SellDinoEntry.jsx

import React from "react";
import { motion } from "framer-motion";
import SearchableDropdown from "../../SearchableDropdown";

function SellDinoEntry({ itemName, itemData, handleItemChange, arkData }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			layout
			className="space-y-4">
			<div className="flex space-x-4">
				<div className="flex-grow">
					<label
						htmlFor={`${itemName}-description`}
						className="block text-sm font-medium text-gray-300 mb-1">
						Description
					</label>
					<input
						id={`${itemName}-description`}
						type="text"
						value={itemData.Description || ""}
						onChange={(e) =>
							handleItemChange(itemName, "Description", e.target.value)
						}
						className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div className="w-24">
					<label
						htmlFor={`${itemName}-price`}
						className="block text-sm font-medium text-gray-300 mb-1">
						Price
					</label>
					<input
						id={`${itemName}-price`}
						type="number"
						value={itemData.Price || 0}
						onChange={(e) =>
							handleItemChange(itemName, "Price", parseInt(e.target.value))
						}
						className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div className="w-24">
					<label
						htmlFor={`${itemName}-level`}
						className="block text-sm font-medium text-gray-300 mb-1">
						Level
					</label>
					<input
						id={`${itemName}-level`}
						type="number"
						value={itemData.Level || 1}
						onChange={(e) =>
							handleItemChange(itemName, "Level", parseInt(e.target.value))
						}
						className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>
			<div>
				<label
					htmlFor={`${itemName}-blueprint`}
					className="block text-sm font-medium text-gray-300 mb-1">
					Blueprint
				</label>
				<SearchableDropdown
					id={`${itemName}-blueprint`}
					options={Object.values(arkData.Dinos || {})}
					onSelect={(selected) =>
						handleItemChange(itemName, "Blueprint", selected.Blueprint)
					}
					placeholder="Select or enter a blueprint"
					value={itemData.Blueprint || ""}
					className="w-full bg-dark-black"
				/>
			</div>
		</motion.div>
	);
}

export default SellDinoEntry;
