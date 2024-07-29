// src/components/settings/ShopItemsSettings.jsx

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
import ItemShopEntry from "./shop_entries/ItemShopEntry";
import BeaconShopEntry from "./shop_entries/BeaconShopEntry";
import ConfirmationModal from "../ConfirmationModal";

function ShopItemsSettings({ config, onConfigUpdate }) {
	const [newItemName, setNewItemName] = useState("");
	const [newItemType, setNewItemType] = useState("item");
	const [editingName, setEditingName] = useState(null);
	const [editedName, setEditedName] = useState("");
	const [expandedItem, setExpandedItem] = useState(null);
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const [newItemValidationMessage, setNewItemValidationMessage] = useState("");
	const [editValidationMessage, setEditValidationMessage] = useState("");
	const { arkData } = useArkData();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);

	useEffect(() => {
		const filtered = Object.entries(config.ShopItems || {})
			.filter(([itemName]) =>
				itemName.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => a[0].localeCompare(b[0]));
		setFilteredItems(filtered);
	}, [searchTerm, config.ShopItems]);

	useEffect(() => {
		const cleanupBeaconEntries = () => {
			const updatedShopItems = { ...config.ShopItems };
			let hasChanges = false;

			Object.entries(updatedShopItems).forEach(([itemName, itemData]) => {
				if (itemData.Type === "beacon" && "Items" in itemData) {
					delete itemData.Items;
					hasChanges = true;
				}
			});

			if (hasChanges) {
				onConfigUpdate({
					...config,
					ShopItems: updatedShopItems,
				});
			}
		};

		cleanupBeaconEntries();
	}, [config, onConfigUpdate]);

	const handleNewItemNameChange = (e) => {
		const value = e.target.value.replace(/\s/g, "");
		setNewItemName(value);
	};

	const validateItemName = useCallback(
		(name, isEditing = false) => {
			if (name.includes(" ")) {
				return "Spaces are not allowed in item names.";
			}
			if (config.ShopItems[name] && (!isEditing || name !== editingName)) {
				return "An item with this name already exists.";
			}
			return "";
		},
		[config.ShopItems, editingName]
	);

	const handleAddItem = useCallback(() => {
		const validationError = validateItemName(newItemName);
		if (validationError) {
			setNewItemValidationMessage(validationError);
			return;
		}

		let newItemStructure = {
			Type: newItemType,
			Description: "",
			Price: 0,
		};

		// Add type-specific fields
		switch (newItemType) {
			case "item":
				newItemStructure.Items = [];
				break;
			case "dino":
				newItemStructure.Level = 1;
				newItemStructure.Blueprint = "";
				break;
			case "beacon":
				newItemStructure.ClassName = "";
				break;
			case "experience":
				newItemStructure.Amount = 0;
				newItemStructure.GiveToDino = false;
				break;
			case "unlockengram":
				newItemStructure.Items = [];
				break;
			case "command":
				newItemStructure.Items = [{ Command: "", DisplayAs: "" }];
				break;
			default:
				break;
		}

		onConfigUpdate({
			...config,
			ShopItems: {
				...config.ShopItems,
				[newItemName]: newItemStructure,
			},
		});
		setNewItemName("");
		setExpandedItem(newItemName);
		setNewItemValidationMessage("");
	}, [config, newItemName, newItemType, onConfigUpdate, validateItemName]);

	const handleItemChange = useCallback(
		(itemName, field, value) => {
			onConfigUpdate({
				...config,
				ShopItems: {
					...config.ShopItems,
					[itemName]: {
						...config.ShopItems[itemName],
						[field]: value,
					},
				},
			});
		},
		[config, onConfigUpdate]
	);

	const handleItemEntryChange = useCallback(
		(itemName, index, field, value) => {
			const newItems = [...config.ShopItems[itemName].Items];
			newItems[index] = { ...newItems[index], [field]: value };
			handleItemChange(itemName, "Items", newItems);
		},
		[config.ShopItems, handleItemChange]
	);

	const addItemEntry = useCallback(
		(itemName) => {
			const newItems = [
				...(config.ShopItems[itemName].Items || []),
				{ Quality: 0, ForceBlueprint: false, Amount: 1, Blueprint: "" },
			];
			handleItemChange(itemName, "Items", newItems);
		},
		[config.ShopItems, handleItemChange]
	);

	const removeItemEntry = useCallback(
		(itemName, index) => {
			const newItems = config.ShopItems[itemName].Items.filter(
				(_, i) => i !== index
			);
			handleItemChange(itemName, "Items", newItems);
		},
		[config.ShopItems, handleItemChange]
	);

	const removeItem = useCallback(
		(itemName) => {
			const newShopItems = { ...config.ShopItems };
			delete newShopItems[itemName];
			onConfigUpdate({
				...config,
				ShopItems: newShopItems,
			});
			if (expandedItem === itemName) {
				setExpandedItem(null);
			}
		},
		[config, onConfigUpdate, expandedItem]
	);

	const toggleItemExpansion = useCallback((itemName) => {
		setExpandedItem((prevExpanded) =>
			prevExpanded === itemName ? null : itemName
		);
	}, []);

	const startEditingName = useCallback((itemName) => {
		setEditingName(itemName);
		setEditedName(itemName);
		setEditValidationMessage("");
	}, []);

	const cancelEditingName = useCallback(() => {
		setEditingName(null);
		setEditedName("");
		setEditValidationMessage("");
	}, []);

	const confirmNameEdit = useCallback(
		(oldName) => {
			const validationError = validateItemName(editedName, true);
			if (validationError) {
				setEditValidationMessage(validationError);
				return;
			}

			if (editedName && editedName !== oldName) {
				const { [oldName]: item, ...rest } = config.ShopItems;
				onConfigUpdate({
					...config,
					ShopItems: {
						...rest,
						[editedName]: item,
					},
				});
				if (expandedItem === oldName) {
					setExpandedItem(editedName);
				}
			}
			setEditingName(null);
			setEditedName("");
			setEditValidationMessage("");
		},
		[config, editedName, onConfigUpdate, validateItemName, expandedItem]
	);

	const handleDeleteConfirmation = (itemName) => {
		setDeleteConfirmation(itemName);
	};

	const handleDeleteCancel = () => {
		setDeleteConfirmation(null);
	};

	const handleDeleteConfirm = () => {
		if (deleteConfirmation) {
			removeItem(deleteConfirmation);
			setDeleteConfirmation(null);
		}
	};

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<h4 className="text-lg font-semibold mb-4 text-white">Shop Items</h4>
			<div className="space-y-4">
				<div className="flex flex-col space-y-2">
					<div className="flex space-x-2">
						<input
							type="text"
							value={newItemName}
							onChange={handleNewItemNameChange}
							placeholder="New item name (no spaces)"
							className={`flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border ${
								newItemValidationMessage ? "border-red-500" : "border-gray-600"
							} focus:ring-blue-500 focus:border-blue-500`}
							autoComplete="off"
						/>
						<select
							value={newItemType}
							onChange={(e) => setNewItemType(e.target.value)}
							className="px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
							<option value="item">Item</option>
							<option value="dino">Dino</option>
							<option value="beacon">Beacon</option>
							<option value="experience">Experience</option>
							<option value="unlockengram">Unlock Engram</option>
							<option value="command">Command</option>
						</select>
						<button
							onClick={handleAddItem}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
							Add Item
						</button>
					</div>
					{newItemValidationMessage && (
						<p className="text-red-500 text-xs mt-1 mb-2">
							{newItemValidationMessage}
						</p>
					)}
				</div>

				<div className="flex space-x-2 mb-4">
					<input
						type="text"
						placeholder="Search items..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						autoComplete="off"
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
							className="bg-mid-black p-4 rounded-lg hover:bg-opacity-80 transition-colors">
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() => toggleItemExpansion(itemName)}>
								<div className="flex items-center space-x-2">
									{editingName === itemName ? (
										<div
											className="flex items-center space-x-2"
											onClick={(e) => e.stopPropagation()}>
											<input
												type="text"
												value={editedName}
												onChange={(e) =>
													setEditedName(e.target.value.replace(/\s/g, ""))
												}
												className={`px-2 py-1 text-sm text-white bg-dark-black rounded border ${
													editValidationMessage
														? "border-red-500"
														: "border-gray-600"
												} focus:ring-blue-500 focus:border-blue-500`}
												autoFocus
											/>
											<button
												onClick={() => confirmNameEdit(itemName)}
												className="text-green-500 hover:text-green-400"
												disabled={!!editValidationMessage}>
												<CheckIcon className="h-5 w-5" />
											</button>
											<button
												onClick={cancelEditingName}
												className="text-red-500 hover:text-red-400">
												<XMarkIcon className="h-5 w-5" />
											</button>
										</div>
									) : (
										<h5 className="text-md font-semibold text-white">
											{itemName}
										</h5>
									)}
									<span
										className={`text-xs px-2 py-1 text-white rounded ${
											itemData.Type === "beacon"
												? "bg-purple-600"
												: "bg-blue-600"
										}`}>
										{itemData.Type}
									</span>
								</div>
								<div
									className="flex items-center space-x-2"
									onClick={(e) => e.stopPropagation()}>
									{editingName !== itemName && (
										<button
											onClick={() => startEditingName(itemName)}
											className="text-blue-500 hover:text-blue-400">
											<PencilIcon className="h-5 w-5" />
										</button>
									)}
									<button
										onClick={() => handleDeleteConfirmation(itemName)}
										className="text-red-500 hover:text-red-400">
										<TrashIcon className="h-5 w-5" />
									</button>
									<button
										onClick={() => toggleItemExpansion(itemName)}
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

							{itemData.Type === "item" && (
								<ItemShopEntry
									itemName={itemName}
									itemData={itemData}
									expanded={expandedItem === itemName}
									handleItemChange={handleItemChange}
									handleItemEntryChange={handleItemEntryChange}
									addItemEntry={addItemEntry}
									removeItemEntry={removeItemEntry}
									arkData={arkData}
								/>
							)}
							{itemData.Type === "beacon" && (
								<BeaconShopEntry
									itemName={itemName}
									itemData={itemData}
									expanded={expandedItem === itemName}
									handleItemChange={handleItemChange}
									arkData={arkData}
								/>
							)}
							{/* Add other item type components here when implemented */}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{deleteConfirmation && (
					<ConfirmationModal
						isOpen={true}
						onClose={handleDeleteCancel}
						onConfirm={handleDeleteConfirm}
						title="Confirm Deletion"
						message={`Are you sure you want to delete the item "${deleteConfirmation}"?`}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}

export default ShopItemsSettings;
