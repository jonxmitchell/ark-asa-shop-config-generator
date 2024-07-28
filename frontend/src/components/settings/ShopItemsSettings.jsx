import React, { useState, useCallback } from "react";
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
import ConfirmationModal from "../ConfirmationModal";

function ShopItemsSettings({ config, onConfigUpdate }) {
	const [newItemName, setNewItemName] = useState("");
	const [newItemType, setNewItemType] = useState("item");
	const [editingName, setEditingName] = useState(null);
	const [editedName, setEditedName] = useState("");
	const [expandedItems, setExpandedItems] = useState({});
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const [newItemValidationMessage, setNewItemValidationMessage] = useState("");
	const [editValidationMessage, setEditValidationMessage] = useState("");
	const { arkData } = useArkData();

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

		onConfigUpdate({
			...config,
			ShopItems: {
				...config.ShopItems,
				[newItemName]: {
					Type: newItemType,
					Description: "",
					Price: 0,
					Items: [],
				},
			},
		});
		setNewItemName("");
		setExpandedItems((prev) => ({ ...prev, [newItemName]: true }));
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
			setExpandedItems((prev) => {
				const newExpanded = { ...prev };
				delete newExpanded[itemName];
				return newExpanded;
			});
		},
		[config, onConfigUpdate]
	);

	const toggleItemExpansion = useCallback((itemName) => {
		setExpandedItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
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
				setExpandedItems((prev) => {
					const { [oldName]: expanded, ...rest } = prev;
					return { ...rest, [editedName]: expanded };
				});
			}
			setEditingName(null);
			setEditedName("");
			setEditValidationMessage("");
		},
		[config, editedName, onConfigUpdate, validateItemName]
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

				<AnimatePresence>
					{Object.entries(config.ShopItems).map(([itemName, itemData]) => (
						<motion.div
							key={itemName}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
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
									<span className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
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
										{expandedItems[itemName] ? (
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
									expanded={expandedItems[itemName]}
									handleItemChange={handleItemChange}
									handleItemEntryChange={handleItemEntryChange}
									addItemEntry={addItemEntry}
									removeItemEntry={removeItemEntry}
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
