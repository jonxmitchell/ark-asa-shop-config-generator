// src/components/settings/shop_entries/BeaconShopEntry.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchableDropdown from "../../SearchableDropdown";
import { useArkData } from "../../../hooks/useArkData";

function BeaconShopEntry({ itemName, itemData, expanded, handleItemChange }) {
	const { arkData, loading, error } = useArkData();

	const handleBeaconSelect = (selected) => {
		if (selected && typeof selected === "object") {
			handleItemChange(
				itemName,
				"ClassName",
				selected.ClassName || selected.Name || ""
			);
		} else if (typeof selected === "string") {
			handleItemChange(itemName, "ClassName", selected);
		}
	};

	// if (loading) return <div>Loading...</div>;
	// if (error) return <div>Error loading data</div>;

	const beaconOptions = Object.values(arkData.Beacons || {});

	return (
		<AnimatePresence>
			{expanded && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-2 mt-2">
					<div className="grid grid-cols-2 gap-2">
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
					</div>
					<div>
						<label
							htmlFor={`className-${itemName}`}
							className="block text-sm font-medium text-gray-300">
							Beacon Class Name
						</label>
						<SearchableDropdown
							options={beaconOptions}
							onSelect={handleBeaconSelect}
							placeholder="Select or enter a beacon class name"
							value={itemData.ClassName || ""}
							className="bg-dark-black"
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default BeaconShopEntry;
