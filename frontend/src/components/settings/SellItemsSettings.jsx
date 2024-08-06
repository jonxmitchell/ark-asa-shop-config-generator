// src/components/settings/SellItemsSettings.jsx

import React, {
	useState,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	TrashIcon,
	PencilSquareIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CheckIcon,
	XMarkIcon,
	XCircleIcon,
} from "@heroicons/react/24/solid";
import { useArkData } from "../../hooks/useArkData";
import ConfirmationModal from "../ConfirmationModal";
import SellItemEntry from "./sell_shop_entries/SellItemEntry";
import SellDinoEntry from "./sell_shop_entries/SellDinoEntry";
import { useConfig } from "../ConfigContext";
import { Tooltip } from "react-tooltip";

function SellItemsSettings() {
	const { config, updateConfig, showTooltips } = useConfig();
	const sellItemsConfig = useMemo(() => config?.SellItems || {}, [config]);

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
	const [selectedTypes, setSelectedTypes] = useState([]);
	const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
	const filterDropdownRef = useRef(null);
	const { arkData } = useArkData();

	const FilterDropdown = () => {
		const filterCount = selectedTypes.length;

		const clearFilters = (e) => {
			e.stopPropagation(); // Prevent the dropdown from toggling
			setSelectedTypes([]);
		};

		return (
			<div className="relative" ref={filterDropdownRef}>
				<button
					onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
					data-tooltip-id="filter-types">
					{filterCount > 0 ? (
						<>
							<span>{`${filterCount} Filter${
								filterCount > 1 ? "s" : ""
							} Applied`}</span>
							<XCircleIcon
								className="w-4 h-4 ml-2 text-gray-400 hover:text-white transition-colors"
								onClick={clearFilters}
								data-tooltip-id="clear-filters"
							/>
						</>
					) : (
						"Filter Types"
					)}
					{isFilterDropdownOpen ? (
						<ChevronUpIcon className="w-2.5 h-2.5 ms-3" />
					) : (
						<ChevronDownIcon className="w-2.5 h-2.5 ms-3" />
					)}
				</button>
				{isFilterDropdownOpen && (
					<div className="absolute z-10 mt-2 w-48 bg-mid-black border-blue-600 rounded-lg border-2 shadow-md right-0">
						<ul className="p-3 space-y-1 text-sm text-gray-200">
							{["item", "dino"].map((type) => (
								<li key={type}>
									<div className="flex items-center p-2 rounded hover:bg-light-black">
										<input
											id={`checkbox-${type}`}
											type="checkbox"
											value={type}
											checked={selectedTypes.includes(type)}
											onChange={() => handleTypeCheckboxChange(type)}
											className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
										/>
										<label
											htmlFor={`checkbox-${type}`}
											className="w-full ms-2 text-sm font-medium text-gray-300 select-none cursor-pointer">
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</label>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		);
	};

	useEffect(() => {
		const filtered = Object.entries(sellItemsConfig)
			.filter(
				([itemName, itemData]) =>
					itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
					(selectedTypes.length === 0 || selectedTypes.includes(itemData.Type))
			)
			.sort((a, b) => a[0].localeCompare(b[0]));
		setFilteredItems(filtered);
	}, [searchTerm, sellItemsConfig, selectedTypes]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				filterDropdownRef.current &&
				!filterDropdownRef.current.contains(event.target)
			) {
				setIsFilterDropdownOpen(false);
			}
		};

		const handleScroll = () => {
			setIsFilterDropdownOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("scroll", handleScroll, true);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("scroll", handleScroll, true);
		};
	}, []);

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

	const handleItemChange = (itemName, field, value) => {
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
	};

	const addNewItem = () => {
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
						Type: newItemType,
						Description: "",
						Price: 0,
						Amount: newItemType === "item" ? 1 : undefined,
						Level: newItemType === "dino" ? 1 : undefined,
						Blueprint: "",
					},
				},
			}));
			setNewItemName("");
			setExpandedItem(newItemName);
			setNameValidationMessage("");
		}
	};

	const deleteItem = (itemName) => {
		updateConfig((prevConfig) => {
			const newSellItems = { ...prevConfig.SellItems };
			delete newSellItems[itemName];
			return { ...prevConfig, SellItems: newSellItems };
		});
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

	const handleTypeCheckboxChange = (type) => {
		setSelectedTypes((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
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
						className={`flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border ${
							nameValidationMessage ? "border-red-500" : "border-gray-600"
						} focus:ring-blue-500 focus:border-blue-500`}
						autoComplete="off"
						data-tooltip-id="new-item-name"
						data-tooltip-content="Enter a name for the new sell item (no spaces allowed)"
					/>
					<select
						value={newItemType}
						onChange={(e) => setNewItemType(e.target.value)}
						className="px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						data-tooltip-id="item-type"
						data-tooltip-content="Select the type of item to sell">
						<option value="item">Item</option>
						<option value="dino">Dino</option>
					</select>
					<button
						onClick={addNewItem}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						data-tooltip-id="add-item"
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
					<FilterDropdown />
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
											<span
												className={`text-xs px-2 py-1 text-white rounded ${
													itemData.Type === "dino"
														? "bg-green-600 text-white"
														: "bg-blue-600 text-white"
												}`}>
												{itemData.Type}
											</span>
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

			{showTooltips && (
				<>
					<Tooltip id="new-item-name" />
					<Tooltip id="item-type" />
					<Tooltip id="add-item" />
					<Tooltip id="search-items" />
					<Tooltip id="edit-item-name" />
					<Tooltip id="confirm-rename" />
					<Tooltip id="cancel-rename" />
					<Tooltip id="rename-item" />
					<Tooltip id="delete-item" />
					<Tooltip id="toggle-expansion" />
					<Tooltip
						id="filter-types"
						place="top"
						content="Filter items by type"
						offset={5}
						opacity={1}
					/>
					<Tooltip
						id="clear-filters"
						place="top"
						content="Clear all filters"
						offset={5}
						opacity={1}
					/>
				</>
			)}
		</div>
	);
}

export default React.memo(SellItemsSettings);
