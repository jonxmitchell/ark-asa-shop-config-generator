// src/components/settings/shop_entries/CommandShopEntry.jsx

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";

function CommandShopEntry({
	itemName,
	itemData,
	expanded,
	handleItemChange,
	handleItemEntryChange,
	addItemEntry,
	removeItemEntry,
}) {
	const toggleField = useCallback(
		(field) => {
			handleItemChange(
				itemName,
				field,
				itemData[field] === undefined
					? field === "MinLevel"
						? 1
						: field === "MaxLevel"
						? 2
						: field === "Permissions"
						? "default"
						: 0
					: undefined
			);
		},
		[itemName, itemData, handleItemChange]
	);

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
						<div className="col-span-4">
							<label
								htmlFor={`title-${itemName}`}
								className="block text-sm font-medium text-gray-300">
								Title
							</label>
							<input
								id={`title-${itemName}`}
								type="text"
								value={itemData.Title || ""}
								onChange={(e) =>
									handleItemChange(itemName, "Title", e.target.value)
								}
								className="w-full px-3 py-2 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
								autoComplete="off"
								data-tooltip-id={`tooltip-title-${itemName}`}
							/>
						</div>
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
								data-tooltip-id={`tooltip-description-${itemName}`}
							/>
						</div>
						<div className="col-span-2">
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
								data-tooltip-id={`tooltip-price-${itemName}`}
							/>
						</div>
					</div>

					<div className="grid grid-cols-12 gap-2">
						{["MinLevel", "MaxLevel", "Permissions"].map((field) => (
							<div key={field} className="col-span-4 relative">
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
										onChange={(e) => {
											let value = e.target.value;
											if (field === "MinLevel") {
												value = Math.max(1, parseInt(value) || 1);
											} else if (field === "MaxLevel") {
												value = Math.max(2, parseInt(value) || 2);
											}
											handleItemChange(itemName, field, value);
										}}
										className={`w-full px-3 py-2 pr-8 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
											itemData[field] === undefined &&
											"opacity-50 cursor-not-allowed"
										}`}
										disabled={itemData[field] === undefined}
										autoComplete="off"
										min={
											field === "MinLevel"
												? 1
												: field === "MaxLevel"
												? 2
												: undefined
										}
										data-tooltip-id={`tooltip-${field.toLowerCase()}-${itemName}`}
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
										}
										data-tooltip-id={`tooltip-toggle-${field.toLowerCase()}-${itemName}`}>
										<PowerIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="space-y-2 mt-4">
						<div className="flex justify-between items-center">
							<h5 className="text-sm font-medium text-gray-300">Commands</h5>
							<button
								onClick={() => addItemEntry(itemName)}
								className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center text-sm"
								data-tooltip-id={`tooltip-add-command-${itemName}`}>
								<PlusIcon className="h-4 w-4 mr-1" />
								Add Command
							</button>
						</div>
						{itemData.Items &&
							itemData.Items.map((command, index) => (
								<div
									key={index}
									className="bg-light-black p-3 rounded-lg space-y-2">
									<div className="flex items-center space-x-2">
										<div className="flex-grow space-y-2">
											<input
												type="text"
												value={command.Command}
												onChange={(e) =>
													handleItemEntryChange(
														itemName,
														index,
														"Command",
														e.target.value
													)
												}
												placeholder="Command"
												className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
												autoComplete="off"
												data-tooltip-id={`tooltip-command-${itemName}-${index}`}
											/>
											<input
												type="text"
												value={command.DisplayAs}
												onChange={(e) =>
													handleItemEntryChange(
														itemName,
														index,
														"DisplayAs",
														e.target.value
													)
												}
												placeholder="Display As"
												className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
												autoComplete="off"
												data-tooltip-id={`tooltip-display-as-${itemName}-${index}`}
											/>
											<div className="flex items-center space-x-2">
												<input
													id={`executeAsAdmin-${itemName}-${index}`}
													type="checkbox"
													checked={command.ExecuteAsAdmin || false}
													onChange={(e) =>
														handleItemEntryChange(
															itemName,
															index,
															"ExecuteAsAdmin",
															e.target.checked
														)
													}
													className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
												/>
												<label
													htmlFor={`executeAsAdmin-${itemName}-${index}`}
													className="text-sm font-medium text-gray-300"
													data-tooltip-id={`tooltip-execute-as-admin-${itemName}-${index}`}>
													Execute As Admin
												</label>
											</div>
										</div>
										<button
											onClick={() => removeItemEntry(itemName, index)}
											className="text-red-500 hover:text-red-700 self-start mt-2"
											data-tooltip-id={`tooltip-remove-command-${itemName}-${index}`}>
											<TrashIcon className="h-5 w-5" />
										</button>
									</div>
								</div>
							))}
					</div>
				</motion.div>
			)}
			{/* Tooltips */}
			<Tooltip
				id={`tooltip-title-${itemName}`}
				place="top"
				content="Enter the title for this command"
			/>
			<Tooltip
				id={`tooltip-description-${itemName}`}
				place="top"
				content="Enter a description for this command"
			/>
			<Tooltip
				id={`tooltip-price-${itemName}`}
				place="top"
				content="Set the price for this command"
			/>
			<Tooltip
				id={`tooltip-minlevel-${itemName}`}
				place="top"
				content="Set the minimum level required for this command"
			/>
			<Tooltip
				id={`tooltip-maxlevel-${itemName}`}
				place="top"
				content="Set the maximum level allowed for this command"
			/>
			<Tooltip
				id={`tooltip-permissions-${itemName}`}
				place="top"
				content="Set the permissions required for this command"
			/>
			<Tooltip
				id={`tooltip-toggle-minlevel-${itemName}`}
				place="top"
				content="Toggle minimum level requirement"
			/>
			<Tooltip
				id={`tooltip-toggle-maxlevel-${itemName}`}
				place="top"
				content="Toggle maximum level limit"
			/>
			<Tooltip
				id={`tooltip-toggle-permissions-${itemName}`}
				place="top"
				content="Toggle permissions requirement"
			/>
			<Tooltip
				id={`tooltip-add-command-${itemName}`}
				place="top"
				content="Add a new command to this item"
			/>
			{itemData.Items &&
				itemData.Items.map((_, index) => (
					<React.Fragment key={index}>
						<Tooltip
							id={`tooltip-command-${itemName}-${index}`}
							place="top"
							content="Enter the command to be executed"
						/>
						<Tooltip
							id={`tooltip-display-as-${itemName}-${index}`}
							place="top"
							content="Enter how the command should be displayed"
						/>
						<Tooltip
							id={`tooltip-execute-as-admin-${itemName}-${index}`}
							place="top"
							content="Check to execute the command with admin privileges"
						/>
						<Tooltip
							id={`tooltip-remove-command-${itemName}-${index}`}
							place="top"
							content="Remove this command"
						/>
					</React.Fragment>
				))}
		</AnimatePresence>
	);
}

export default React.memo(CommandShopEntry);
