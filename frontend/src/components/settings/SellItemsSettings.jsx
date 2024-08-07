// src/components/settings/SellItemsSettings.jsx

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
import ConfirmationModal from "../ConfirmationModal";
import SellItemEntry from "./sell_shop_entries/SellItemEntry";
import { useConfig } from "../ConfigContext";
import { Tooltip } from "react-tooltip";

function SellItemsSettings() {
	const { config, updateConfig, showTooltips } = useConfig();
	const sellItemsConfig = useMemo(() => config?.SellItems || {}, [config]);

	const [newItemName, setNewItemName] = useState("");
	const [editingName, setEditingName] = useState(null);
	const [editedName, setEditedName] = useState("");
	const [expandedItem, setExpandedItem] = useState(null);
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const [nameValidationMessage, setNameValidationMessage] = useState("");
	const [editValidationMessage, setEditValidationMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);
	const { arkData } = useArkData();

	const handleItemChange = useCallback(
		(itemName, field, value) => {
			updateConfig((prevConfig) => ({
				...prevConfig,
				SellItems: {
					...prevConfig.SellItems,
					[itemName]: {
						...prevConfig.SellItems[itemName],
						[field]: value,
					},
				},
			}));
		},
		[updateConfig]
	);

	useEffect(() => {
		const filtered = Object.entries(sellItemsConfig)
			.filter(([itemName]) =>
				itemName.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => a[0].localeCompare(b[0]));
		setFilteredItems(filtered);
	}, [searchTerm, sellItemsConfig]);

	const validateItemName = useCallback(
		(name, isEditing = false) => {
			if (name.includes(" ")) {
				return "Spaces are not allowed in item names.";
			}
			if (sellItemsConfig[name] && (!isEditing || name !== editingName)) {
				return "An item with this name already exists.";
			}
			return "";
		},
		[sellItemsConfig, editingName]
	);

	const addNewItem = useCallback(() => {
		const validationError = validateItemName(newItemName);
		if (validationError) {
			setNameValidationMessage(validationError);
			return;
		}

		if (newItemName) {
			updateConfig((prevConfig) => ({
				...prevConfig,
				SellItems: {
					...prevConfig.SellItems,
					[newItemName]: {
						Type: "item",
						Description: "",
						Price: 0,
						Amount: 1,
						Blueprint: "",
					},
				},
			}));
			setNewItemName("");
			setExpandedItem(newItemName);
			setNameValidationMessage("");
		}
	}, [newItemName, updateConfig, validateItemName]);

	const deleteItem = useCallback(
		(itemName) => {
			updateConfig((prevConfig) => {
				const newSellItems = { ...prevConfig.SellItems };
				delete newSellItems[itemName];
				return { ...prevConfig, SellItems: newSellItems };
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
				const newSellItems = { ...prevConfig.SellItems };
				newSellItems[editedName] = newSellItems[editingName];
				delete newSellItems[editingName];
				return { ...prevConfig, SellItems: newSellItems };
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
		setEditingName("");
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
			return (
				<SellItemEntry
					itemName={itemName}
					itemData={itemData}
					handleItemChange={handleItemChange}
					arkData={arkData}
				/>
			);
		},
		[handleItemChange, arkData]
	);

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<div className="space-y-4">
				<div className="flex space-x-2">
					<input
						type="text"
						value={newItemName}
						onChange={(e) => setNewItemName(e.target.value.replace(/\s/g, ""))}
						placeholder="New sell item name (no spaces)"
						className={`flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border ${
							nameValidationMessage ? "border-red-500" : "border-gray-600"
						} focus:ring-blue-500 focus:border-blue-500`}
						autoComplete="off"
						data-tooltip-id="new-item-name"
						data-tooltip-content="Enter a name for the new sell item (no spaces allowed)"
					/>
					<button
						onClick={addNewItem}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						data-tooltip-id="add-new-item"
						data-tooltip-content="Add a new sell item to the configuration">
						Add Item
					</button>
				</div>
				{nameValidationMessage && (
					<p className="text-red-500 text-xs mt-1 mb-2">
						{nameValidationMessage}
					</p>
				)}
				<div className="flex space-x-2 mb-4">
					<input
						type="text"
						placeholder="Search sell items..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						autoComplete="off"
						data-tooltip-id="search-items"
						data-tooltip-content="Search for specific sell items"
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
												data-tooltip-content="Edit the name of this sell item"
											/>
											<button
												onClick={finishRenameItem}
												className="text-green-500 hover:text-green-400"
												disabled={!!editValidationMessage}
												data-tooltip-id="confirm-rename"
												data-tooltip-content="Confirm the name change">
												<CheckIcon className="h-5 w-5" />
											</button>
											<button
												onClick={cancelRenameItem}
												className="text-red-500 hover:text-red-400"
												data-tooltip-id="cancel-rename"
												data-tooltip-content="Cancel the name change">
												<XMarkIcon className="h-5 w-5" />
											</button>
										</div>
									) : (
										<>
											<h5 className="text-md font-semibold text-white">
												{itemName}
											</h5>
										</>
									)}
								</div>
								<div
									className="flex items-center space-x-2"
									onClick={(e) => e.stopPropagation()}>
									{editingName !== itemName && (
										<button
											onClick={() => startRenameItem(itemName)}
											className="text-blue-500 hover:text-blue-400"
											data-tooltip-id="rename-item"
											data-tooltip-content="Rename this sell item">
											<PencilSquareIcon className="h-5 w-5" />
										</button>
									)}
									<button
										onClick={() => setDeleteConfirmation(itemName)}
										className="text-red-500 hover:text-red-400"
										data-tooltip-id="delete-item"
										data-tooltip-content="Delete this sell item">
										<TrashIcon className="h-5 w-5" />
									</button>
									<button
										onClick={() => toggleItemExpansion(itemName)}
										className="text-gray-400 hover:text-gray-300"
										data-tooltip-id="toggle-expansion"
										data-tooltip-content="Expand or collapse item details">
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
										{renderShopEntry(itemName, itemData)}
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

			{showTooltips && (
				<>
					<Tooltip id="new-item-name" />
					<Tooltip id="add-new-item" />
					<Tooltip id="search-items" />
					<Tooltip id="edit-item-name" />
					<Tooltip id="confirm-rename" />
					<Tooltip id="cancel-rename" />
					<Tooltip id="rename-item" />
					<Tooltip id="delete-item" />
					<Tooltip id="toggle-expansion" />
				</>
			)}
		</div>
	);
}

export default React.memo(SellItemsSettings);
