// src/components/settings/ShopItemsSettings.jsx

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	TrashIcon,
	PencilSquareIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { useArkData } from "../../hooks/useArkData";
import ItemShopEntry from "./shop_entries/ItemShopEntry";
import BeaconShopEntry from "./shop_entries/BeaconShopEntry";
import ExperienceShopEntry from "./shop_entries/ExperienceShopEntry";
import UnlockEngramShopEntry from "./shop_entries/UnlockEngramShopEntry";
import CommandShopEntry from "./shop_entries/CommandShopEntry";
import DinoShopEntry from "./shop_entries/DinoShopEntry";
import ConfirmationModal from "../ConfirmationModal";
import { useConfig } from "../ConfigContext";
import { Tooltip } from "react-tooltip";

function ShopItemsSettings() {
	const { config, updateConfig, showTooltips } = useConfig();
	const shopItemsConfig = useMemo(() => config?.ShopItems || {}, [config]);

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

	// Memoize the ark data
	const memoizedArkData = useMemo(() => arkData, [arkData]);

	useEffect(() => {
		const filtered = Object.entries(shopItemsConfig)
			.filter(([itemName]) =>
				itemName.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => a[0].localeCompare(b[0]));
		setFilteredItems(filtered);
	}, [searchTerm, shopItemsConfig]);

	const validateItemName = useCallback(
		(name, isEditing = false) => {
			if (name.includes(" ")) {
				return "Spaces are not allowed in item names.";
			}
			if (shopItemsConfig[name] && (!isEditing || name !== editingName)) {
				return "An item with this name already exists.";
			}
			return "";
		},
		[shopItemsConfig, editingName]
	);

	const handleItemChange = useCallback(
		(itemName, field, value) => {
			updateConfig((prevConfig) => ({
				...prevConfig,
				ShopItems: {
					...prevConfig.ShopItems,
					[itemName]: {
						...prevConfig.ShopItems[itemName],
						[field]: value,
					},
				},
			}));
		},
		[updateConfig]
	);

	const handleItemEntryChange = useCallback(
		(itemName, index, field, value) => {
			updateConfig((prevConfig) => {
				const newItems = [...prevConfig.ShopItems[itemName].Items];
				newItems[index] = { ...newItems[index], [field]: value };
				return {
					...prevConfig,
					ShopItems: {
						...prevConfig.ShopItems,
						[itemName]: {
							...prevConfig.ShopItems[itemName],
							Items: newItems,
						},
					},
				};
			});
		},
		[updateConfig]
	);

	const addItemEntry = useCallback(
		(itemName) => {
			updateConfig((prevConfig) => {
				const itemType = prevConfig.ShopItems[itemName].Type;
				let newEntry;

				switch (itemType) {
					case "item":
						newEntry = {
							Quality: 0,
							ForceBlueprint: false,
							Amount: 1,
							Blueprint: "",
						};
						break;
					case "unlockengram":
						newEntry = { Blueprint: "" };
						break;
					case "command":
						newEntry = { Command: "", DisplayAs: "" };
						break;
					default:
						newEntry = {};
				}

				const newItems = [
					...(prevConfig.ShopItems[itemName].Items || []),
					newEntry,
				];
				return {
					...prevConfig,
					ShopItems: {
						...prevConfig.ShopItems,
						[itemName]: {
							...prevConfig.ShopItems[itemName],
							Items: newItems,
						},
					},
				};
			});
		},
		[updateConfig]
	);

	const removeItemEntry = useCallback(
		(itemName, index) => {
			updateConfig((prevConfig) => {
				const newItems = prevConfig.ShopItems[itemName].Items.filter(
					(_, i) => i !== index
				);
				return {
					...prevConfig,
					ShopItems: {
						...prevConfig.ShopItems,
						[itemName]: {
							...prevConfig.ShopItems[itemName],
							Items: newItems,
						},
					},
				};
			});
		},
		[updateConfig]
	);

	const addNewItem = useCallback(() => {
		const validationError = validateItemName(newItemName);
		if (validationError) {
			setNewItemValidationMessage(validationError);
			return;
		}

		if (newItemName) {
			updateConfig((prevConfig) => ({
				...prevConfig,
				ShopItems: {
					...prevConfig.ShopItems,
					[newItemName]: {
						Type: newItemType,
						Description: "",
						Price: 0,
						Items: [],
					},
				},
			}));
			setNewItemName("");
			setExpandedItem(newItemName);
			setNewItemValidationMessage("");
		}
	}, [newItemName, newItemType, updateConfig, validateItemName]);

	const deleteItem = useCallback(
		(itemName) => {
			updateConfig((prevConfig) => {
				const newShopItems = { ...prevConfig.ShopItems };
				delete newShopItems[itemName];
				return { ...prevConfig, ShopItems: newShopItems };
			});
			if (expandedItem === itemName) {
				setExpandedItem(null);
			}
		},
		[updateConfig, expandedItem]
	);

	const startRenameItem = useCallback((itemName) => {
		setEditingName(itemName);
		setEditedName(itemName);
		setEditValidationMessage("");
	}, []);

	const finishRenameItem = useCallback(() => {
		const validationError = validateItemName(editedName, true);
		if (validationError) {
			setEditValidationMessage(validationError);
			return;
		}

		if (editedName && editedName !== editingName) {
			updateConfig((prevConfig) => {
				const newShopItems = { ...prevConfig.ShopItems };
				newShopItems[editedName] = newShopItems[editingName];
				delete newShopItems[editingName];
				return { ...prevConfig, ShopItems: newShopItems };
			});
			if (expandedItem === editingName) {
				setExpandedItem(editedName);
			}
		}
		setEditingName(null);
		setEditedName("");
		setEditValidationMessage("");
	}, [editedName, editingName, expandedItem, updateConfig, validateItemName]);

	const cancelRenameItem = useCallback(() => {
		setEditingName(null);
		setEditedName("");
		setEditValidationMessage("");
	}, []);

	const toggleItemExpansion = useCallback((itemName) => {
		setExpandedItem((prevExpanded) =>
			prevExpanded === itemName ? null : itemName
		);
	}, []);

	const renderShopEntry = useCallback(
		(itemName, itemData) => {
			const commonProps = {
				itemName,
				itemData,
				expanded: expandedItem === itemName,
				handleItemChange,
				arkData: memoizedArkData,
			};

			switch (itemData.Type) {
				case "item":
					return (
						<ItemShopEntry
							{...commonProps}
							handleItemEntryChange={handleItemEntryChange}
							addItemEntry={addItemEntry}
							removeItemEntry={removeItemEntry}
						/>
					);
				case "dino":
					return <DinoShopEntry {...commonProps} />;
				case "beacon":
					return (
						<BeaconShopEntry {...commonProps} showTooltips={showTooltips} />
					);
				case "experience":
					return <ExperienceShopEntry {...commonProps} />;
				case "unlockengram":
					return (
						<UnlockEngramShopEntry
							{...commonProps}
							handleItemEntryChange={handleItemEntryChange}
							addItemEntry={addItemEntry}
							removeItemEntry={removeItemEntry}
						/>
					);
				case "command":
					return (
						<CommandShopEntry
							{...commonProps}
							handleItemEntryChange={handleItemEntryChange}
							addItemEntry={addItemEntry}
							removeItemEntry={removeItemEntry}
						/>
					);
				default:
					return null;
			}
		},
		[
			expandedItem,
			handleItemChange,
			handleItemEntryChange,
			addItemEntry,
			removeItemEntry,
			memoizedArkData,
		]
	);

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<div className="space-y-4">
				<div className="flex space-x-2">
					<input
						type="text"
						value={newItemName}
						onChange={(e) => setNewItemName(e.target.value.replace(/\s/g, ""))}
						placeholder="New item name (no spaces)"
						className={`flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border ${
							newItemValidationMessage ? "border-red-500" : "border-gray-600"
						} focus:ring-blue-500 focus:border-blue-500`}
						autoComplete="off"
						data-tooltip-id="new-item-name"
					/>
					<select
						value={newItemType}
						onChange={(e) => setNewItemType(e.target.value)}
						className="px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						data-tooltip-id="new-item-type">
						<option value="item">Item</option>
						<option value="dino">Dino</option>
						<option value="beacon">Beacon</option>
						<option value="experience">Experience</option>
						<option value="unlockengram">Unlock Engram</option>
						<option value="command">Command</option>
					</select>
					<button
						onClick={addNewItem}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						data-tooltip-id="add-new-item">
						Add Item
					</button>
				</div>
				{newItemValidationMessage && (
					<p className="text-red-500 text-xs mt-1 mb-2">
						{newItemValidationMessage}
					</p>
				)}

				<div className="flex space-x-2 mb-4">
					<input
						type="text"
						placeholder="Search items..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						autoComplete="off"
						data-tooltip-id="search-items"
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
												data-tooltip-id="edit-item-name"
											/>
											<button
												onClick={finishRenameItem}
												className="text-green-500 hover:text-green-400"
												disabled={!!editValidationMessage}
												data-tooltip-id="confirm-rename">
												<CheckIcon className="h-5 w-5" />
											</button>
											<button
												onClick={cancelRenameItem}
												className="text-red-500 hover:text-red-400"
												data-tooltip-id="cancel-rename">
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
												: itemData.Type === "experience"
												? "bg-orange-700"
												: itemData.Type === "unlockengram"
												? "bg-green-600"
												: itemData.Type === "command"
												? "bg-yellow-600"
												: itemData.Type === "dino"
												? "bg-pink-600"
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
											onClick={() => startRenameItem(itemName)}
											className="text-blue-500 hover:text-blue-400"
											data-tooltip-id="rename-item">
											<PencilSquareIcon className="h-5 w-5" />
										</button>
									)}
									<button
										onClick={() => setDeleteConfirmation(itemName)}
										className="text-red-500 hover:text-red-400"
										data-tooltip-id="delete-item">
										<TrashIcon className="h-5 w-5" />
									</button>
									<button
										onClick={() => toggleItemExpansion(itemName)}
										className="text-gray-400 hover:text-gray-300"
										data-tooltip-id="toggle-expansion">
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

							{renderShopEntry(itemName, itemData)}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{deleteConfirmation && (
					<ConfirmationModal
						isOpen={true}
						onClose={() => setDeleteConfirmation(null)}
						onConfirm={() => {
							deleteItem(deleteConfirmation);
							setDeleteConfirmation(null);
						}}
						title="Confirm Deletion"
						message={`Are you sure you want to delete the item "${deleteConfirmation}"?`}
					/>
				)}
			</AnimatePresence>

			{showTooltips && (
				<>
					<Tooltip
						id="new-item-name"
						place="top"
						content="Enter a new item name (spaces are not allowed)"
					/>
					<Tooltip
						id="new-item-type"
						place="top"
						content="Select the type of item to add"
					/>
					<Tooltip
						id="add-new-item"
						place="top"
						content="Add the new item to the shop"
					/>
					<Tooltip
						id="search-items"
						place="top"
						content="Search for items in the shop"
					/>
					<Tooltip
						id="edit-item-name"
						place="top"
						content="Edit the item name"
					/>
					<Tooltip
						id="confirm-rename"
						place="top"
						content="Confirm the new item name"
					/>
					<Tooltip id="cancel-rename" place="top" content="Cancel renaming" />
					<Tooltip id="rename-item" place="top" content="Rename this item" />
					<Tooltip id="delete-item" place="top" content="Delete this item" />
					<Tooltip
						id="toggle-expansion"
						place="top"
						content="Expand or collapse item details"
					/>
				</>
			)}
		</div>
	);
}

export default React.memo(ShopItemsSettings);
