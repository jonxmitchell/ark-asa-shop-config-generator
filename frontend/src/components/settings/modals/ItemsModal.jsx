// src/components/settings/modals/ItemsModal.jsx

import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import SearchableDropdown from "../../SearchableDropdown";
import { useArkData } from "../../../hooks/useArkData";

function ItemsModal({ kitName, items, onSave, onClose }) {
	const [editedItems, setEditedItems] = useState(items);
	const { arkData, loading, error } = useArkData();
	const [searchTerm, setSearchTerm] = useState("");
	const [searchField, setSearchField] = useState("Blueprint");
	const [filteredItems, setFilteredItems] = useState(items);

	useEffect(() => {
		const filtered = editedItems.filter((item) =>
			item[searchField]
				.toString()
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		);
		setFilteredItems(filtered);
	}, [searchTerm, searchField, editedItems]);

	const handleItemChange = (index, field, value) => {
		const newItems = [...editedItems];
		newItems[index] = { ...newItems[index], [field]: value };
		setEditedItems(newItems);
	};

	const addItem = () => {
		setEditedItems([
			...editedItems,
			{ Amount: 1, Quality: 0, ForceBlueprint: false, Blueprint: "" },
		]);
	};

	const removeItem = (index) => {
		setEditedItems(editedItems.filter((_, i) => i !== index));
	};

	return (
		<div className="text-white" style={{ zIndex: 40 }}>
			<h3 className="text-2xl font-semibold mb-4">Edit Items for {kitName}</h3>
			{loading && <p>Loading item data...</p>}
			{error && <p>Error loading item data: {error.toString()}</p>}
			{!loading && !error && (
				<>
					<div className="flex space-x-2 mb-4">
						<input
							type="text"
							placeholder="Search items..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-grow px-3 py-2 text-sm text-white bg-light-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
							autoComplete="off"
						/>
						<select
							value={searchField}
							onChange={(e) => setSearchField(e.target.value)}
							className="px-3 py-2 text-sm text-white bg-light-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
							<option value="Blueprint">Blueprint</option>
							<option value="Amount">Amount</option>
							<option value="Quality">Quality</option>
						</select>
					</div>
					<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
						<AnimatePresence initial={false}>
							{filteredItems.map((item, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ type: "tween", duration: 0.2 }}
									className="bg-light-black rounded-lg overflow-hidden">
									<div className="p-4">
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div>
												<label
													htmlFor={`item-amount-${index}`}
													className="block text-sm font-medium text-gray-300 mb-1">
													Amount
												</label>
												<input
													id={`item-amount-${index}`}
													type="number"
													value={item.Amount}
													onChange={(e) =>
														handleItemChange(
															index,
															"Amount",
															parseInt(e.target.value)
														)
													}
													className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
													autoComplete="off"
												/>
											</div>
											<div>
												<label
													htmlFor={`item-quality-${index}`}
													className="block text-sm font-medium text-gray-300 mb-1">
													Quality
												</label>
												<input
													id={`item-quality-${index}`}
													type="number"
													value={item.Quality}
													onChange={(e) =>
														handleItemChange(
															index,
															"Quality",
															parseInt(e.target.value)
														)
													}
													className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
													autoComplete="off"
												/>
											</div>
										</div>
										<div className="mb-4">
											<label
												htmlFor={`item-blueprint-${index}`}
												className="block text-sm font-medium text-gray-300 mb-1">
												Blueprint
											</label>
											<SearchableDropdown
												options={Object.values(arkData.Items)}
												onSelect={(selected) => {
													handleItemChange(
														index,
														"Blueprint",
														selected.Blueprint
													);
												}}
												placeholder="Select or enter a blueprint"
												value={item.Blueprint}
											/>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center">
												<input
													type="checkbox"
													id={`item-forceblueprint-${index}`}
													checked={item.ForceBlueprint}
													onChange={(e) =>
														handleItemChange(
															index,
															"ForceBlueprint",
															e.target.checked
														)
													}
													className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 mr-2"
												/>
												<label
													htmlFor={`item-forceblueprint-${index}`}
													className="text-sm font-medium text-gray-300">
													Force Blueprint
												</label>
											</div>
											<button
												onClick={() => removeItem(index)}
												className="text-red-500 hover:text-red-700">
												<TrashIcon className="h-5 w-5" />
											</button>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</>
			)}
			<div className="mt-6 flex justify-between">
				<button
					onClick={addItem}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
					Add Item
				</button>
				<div className="space-x-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
						Cancel
					</button>
					<button
						onClick={() => {
							onSave(editedItems);
							onClose();
						}}
						className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}

export default ItemsModal;
