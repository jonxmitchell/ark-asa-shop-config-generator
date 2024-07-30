// src/components/settings/SellItemsSettings.jsx

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	TrashIcon,
	PencilIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { useArkData } from "../../hooks/useArkData";
import ConfirmationModal from "../ConfirmationModal";
import SellItemEntry from "./sell_shop_entries/SellItemEntry";
import SellDinoEntry from "./sell_shop_entries/SellDinoEntry";

function SellItemsSettings({ config, onConfigUpdate }) {
	const [newItemName, setNewItemName] = useState("");
	const [newItemType, setNewItemType] = useState("item");
	const [editingName, setEditingName] = useState(null);
	const [editedName, setEditedName] = useState("");
	const [expandedItem, setExpandedItem] = useState(null);
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const [nameValidationMessage, setNameValidationMessage] = useState("");
	const [editValidationMessage, setEditValidationMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);
	const { arkData } = useArkData();

	useEffect(() => {
		const filtered = Object.entries(config.SellItems || {})
			.filter(([itemName]) =>
				itemName.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => a[0].localeCompare(b[0]));
		setFilteredItems(filtered);
	}, [searchTerm, config.SellItems]);

	const validateItemName = useCallback(
		(name, isEditing = false) => {
			if (name.includes(" ")) {
				return "Spaces are not allowed in item names.";
			}
			if (
				config.SellItems &&
				config.SellItems[name] &&
				(!isEditing || name !== editingName)
			) {
				return "An item with this name already exists.";
			}
			return "";
		},
		[config.SellItems, editingName]
	);

	const handleItemChange = (itemName, field, value) => {
		onConfigUpdate({
			...config,
			SellItems: {
				...(config.SellItems || {}),
				[itemName]: {
					...(config.SellItems?.[itemName] || {}),
					[field]: value,
				},
			},
		});
	};

	const addNewItem = () => {
		const validationError = validateItemName(newItemName);
		if (validationError) {
			setNameValidationMessage(validationError);
			return;
		}

		if (newItemName) {
			onConfigUpdate({
				...config,
				SellItems: {
					...(config.SellItems || {}),
					[newItemName]: {
						Type: newItemType,
						Description: "",
						Price: 0,
						Amount: newItemType === "item" ? 1 : undefined,
						Level: newItemType === "dino" ? 1 : undefined,
						Blueprint: "",
					},
				},
			});
			setNewItemName("");
			setExpandedItem(newItemName);
			setNameValidationMessage("");
		}
	};

	const deleteItem = (itemName) => {
		const newSellItems = { ...config.SellItems };
		delete newSellItems[itemName];
		onConfigUpdate({
			...config,
			SellItems: newSellItems,
		});
		setDeleteConfirmation(null);
		if (expandedItem === itemName) {
			setExpandedItem(null);
		}
	};

	const startRenameItem = (itemName) => {
		setEditingName(itemName);
		setEditedName(itemName);
		setEditValidationMessage("");
	};

	const finishRenameItem = () => {
		const validationError = validateItemName(editedName, true);
		if (validationError) {
			setEditValidationMessage(validationError);
			return;
		}

		if (editedName && editedName !== editingName) {
			const newSellItems = { ...config.SellItems };
			newSellItems[editedName] = newSellItems[editingName];
			delete newSellItems[editingName];
			onConfigUpdate({
				...config,
				SellItems: newSellItems,
			});
			if (expandedItem === editingName) {
				setExpandedItem(editedName);
			}
		}
		setEditingName("");
		setEditedName("");
		setEditValidationMessage("");
	};

	const cancelRenameItem = () => {
		setEditingName("");
		setEditedName("");
		setEditValidationMessage("");
	};

	const toggleItemExpansion = (itemName) => {
		setExpandedItem((prevExpanded) =>
			prevExpanded === itemName ? null : itemName
		);
	};

	const renderItemFields = (itemName, itemData) => {
		if (itemData.Type === "dino") {
			return (
				<SellDinoEntry
					itemName={itemName}
					itemData={itemData}
					handleItemChange={handleItemChange}
					arkData={arkData}
				/>
			);
		} else {
			return (
				<SellItemEntry
					itemName={itemName}
					itemData={itemData}
					handleItemChange={handleItemChange}
					arkData={arkData}
				/>
			);
		}
	};

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<div className="space-y-4">
				<div className="flex space-x-2">
					<input
						type="text"
						value={newItemName}
						onChange={(e) => setNewItemName(e.target.value.replace(/\s/g, ""))}
						placeholder="New sell item name"
						className="flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					/>
					<select
						value={newItemType}
						onChange={(e) => setNewItemType(e.target.value)}
						className="px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
						<option value="item">Item</option>
						<option value="dino">Dino</option>
					</select>
					<button
						onClick={addNewItem}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
						Add Item
					</button>
				</div>
				{nameValidationMessage && (
					<p className="text-red-500 text-xs mt-1">{nameValidationMessage}</p>
				)}
				<div className="flex space-x-2 mb-4">
					<input
						type="text"
						placeholder="Search sell items..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<AnimatePresence initial={false}>
					{filteredItems.map(([itemName, itemData]) => (
						<motion.div
							key={itemName}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							layout
							className="bg-mid-black p-4 rounded-lg space-y-2 hover:bg-opacity-80 transition-colors cursor-pointer"
							onClick={() => toggleItemExpansion(itemName)}>
							<div className="flex justify-between items-center">
								<div className="flex items-center space-x-2">
									{editingName === itemName ? (
										<div className="flex items-center space-x-2">
											<input
												type="text"
												value={editedName}
												onChange={(e) =>
													setEditedName(e.target.value.replace(/\s/g, ""))
												}
												className="px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
												autoFocus
											/>
											<button
												onClick={(e) => {
													e.stopPropagation();
													finishRenameItem();
												}}
												className="text-green-500 hover:text-green-400"
												disabled={!!editValidationMessage}>
												<CheckIcon className="h-5 w-5" />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													cancelRenameItem();
												}}
												className="text-red-500 hover:text-red-400">
												<XMarkIcon className="h-5 w-5" />
											</button>
										</div>
									) : (
										<>
											<h5 className="text-md font-semibold text-white">
												{itemName}
											</h5>
											<span
												className={`text-xs px-2 py-1 rounded ${
													itemData.Type === "dino"
														? "bg-green-600 text-white"
														: "bg-blue-600 text-white"
												}`}>
												{itemData.Type}
											</span>
										</>
									)}
								</div>
								<div className="flex space-x-2">
									{editingName !== itemName && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												startRenameItem(itemName);
											}}
											className="text-blue-500 hover:text-blue-400">
											<PencilIcon className="h-5 w-5" />
										</button>
									)}
									<button
										onClick={(e) => {
											e.stopPropagation();
											setDeleteConfirmation(itemName);
										}}
										className="text-red-500 hover:text-red-400">
										<TrashIcon className="h-5 w-5" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											toggleItemExpansion(itemName);
										}}
										className="text-gray-400 hover:text-gray-300">
										{expandedItem === itemName ? (
											<ChevronUpIcon className="h-5 w-5" />
										) : (
											<ChevronDownIcon className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>
							{editValidationMessage && editingName === itemName && (
								<p className="text-red-500 text-xs mt-1">
									{editValidationMessage}
								</p>
							)}
							<AnimatePresence initial={false}>
								{expandedItem === itemName && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										layout
										className="space-y-2 mt-2"
										onClick={(e) => e.stopPropagation()}>
										{renderItemFields(itemName, itemData)}
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<ConfirmationModal
				isOpen={!!deleteConfirmation}
				onClose={() => setDeleteConfirmation(null)}
				onConfirm={() => deleteItem(deleteConfirmation)}
				title="Confirm Deletion"
				message={`Are you sure you want to delete the sell item "${deleteConfirmation}"?`}
			/>
		</div>
	);
}

export default SellItemsSettings;
