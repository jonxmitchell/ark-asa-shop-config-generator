import React, { useState, useEffect } from "react";
import {
	TrashIcon,
	PencilIcon,
	CubeIcon,
	SparklesIcon,
	CommandLineIcon,
	PowerIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import ItemsModal from "./modals/ItemsModal";
import DinosModal from "./modals/DinosModal";
import CommandsModal from "./modals/CommandsModal";

function KitsSettings({ config, onConfigUpdate }) {
	const [newKitName, setNewKitName] = useState("");
	const [editingKitName, setEditingKitName] = useState("");
	const [newKitNameInput, setNewKitNameInput] = useState("");
	const [modalOpen, setModalOpen] = useState({
		items: false,
		dinos: false,
		commands: false,
	});
	const [currentEditingKit, setCurrentEditingKit] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);

	useEffect(() => {
		const filtered = Object.entries(config.Kits || {}).filter(
			([kitName, kitData]) =>
				kitName.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredItems(filtered);
	}, [searchTerm, config.Kits]);

	const handleKitChange = (kitName, field, value) => {
		onConfigUpdate({
			...config,
			Kits: {
				...config.Kits,
				[kitName]: {
					...config.Kits[kitName],
					[field]: value,
				},
			},
		});
	};

	const addNewKit = () => {
		if (newKitName && (!config.Kits || !config.Kits[newKitName])) {
			onConfigUpdate({
				...config,
				Kits: {
					...(config.Kits || {}),
					[newKitName]: {
						DefaultAmount: 1,
						Description: "",
						Permissions: "",
						Price: 0,
						MinLevel: 1,
						MaxLevel: 20,
						OnlyFromSpawn: false,
					},
				},
			});
			setNewKitName("");
		}
	};

	const deleteKit = (kitName) => {
		const newKits = { ...config.Kits };
		delete newKits[kitName];
		onConfigUpdate({
			...config,
			Kits: newKits,
		});
	};

	const startRenameKit = (kitName) => {
		setEditingKitName(kitName);
		setNewKitNameInput(kitName);
	};

	const finishRenameKit = () => {
		if (newKitNameInput && newKitNameInput !== editingKitName) {
			const newKits = { ...config.Kits };
			newKits[newKitNameInput] = newKits[editingKitName];
			delete newKits[editingKitName];
			onConfigUpdate({
				...config,
				Kits: newKits,
			});
		}
		setEditingKitName("");
		setNewKitNameInput("");
	};

	const openModal = (kitName, type) => {
		setCurrentEditingKit(kitName);
		setModalOpen({ ...modalOpen, [type]: true });
	};

	const closeModal = (type) => {
		setModalOpen({ ...modalOpen, [type]: false });
		setCurrentEditingKit(null);
	};

	const updateKitData = (kitName, field, data) => {
		const updatedKit = { ...config.Kits[kitName] };
		if (data.length > 0) {
			updatedKit[field] = data;
		} else {
			delete updatedKit[field];
		}
		onConfigUpdate({
			...config,
			Kits: {
				...config.Kits,
				[kitName]: updatedKit,
			},
		});
	};

	const toggleField = (kitName, field) => {
		const updatedKits = { ...config.Kits };
		if (field in updatedKits[kitName]) {
			delete updatedKits[kitName][field];
		} else {
			updatedKits[kitName][field] =
				field === "Price" ? 0 : field === "MinLevel" ? 1 : 20;
		}
		onConfigUpdate({ ...config, Kits: updatedKits });
	};

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<div className="space-y-4">
				<div className="flex space-x-2">
					<input
						type="text"
						value={newKitName}
						onChange={(e) => setNewKitName(e.target.value.replace(/\s/g, ""))}
						placeholder="New kit name"
						className="flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						autoComplete="off"
					/>
					<button
						onClick={addNewKit}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
						Add Kit
					</button>
				</div>
				<div className="flex space-x-2 mb-4">
					<input
						type="text"
						placeholder="Search kits..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						autoComplete="off"
					/>
				</div>
				<AnimatePresence>
					{filteredItems.map(([kitName, kitData]) => (
						<motion.div
							key={kitName}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="bg-mid-black p-4 rounded-lg space-y-2">
							<div className="flex justify-between items-center">
								{editingKitName === kitName ? (
									<input
										type="text"
										value={newKitNameInput}
										onChange={(e) =>
											setNewKitNameInput(e.target.value.replace(/\s/g, ""))
										}
										onBlur={finishRenameKit}
										onKeyPress={(e) => e.key === "Enter" && finishRenameKit()}
										className="px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
										autoFocus
										autoComplete="off"
									/>
								) : (
									<h5 className="text-md font-semibold text-white">
										{kitName}
									</h5>
								)}
								<div className="flex space-x-2">
									<button
										onClick={() => startRenameKit(kitName)}
										className="text-blue-500 hover:text-blue-400">
										<PencilIcon className="h-5 w-5" />
									</button>
									<button
										onClick={() => deleteKit(kitName)}
										className="text-red-500 hover:text-red-400">
										<TrashIcon className="h-5 w-5" />
									</button>
								</div>
							</div>
							<div className="grid grid-cols-4 gap-2">
								<div>
									<label
										htmlFor={`${kitName}-default-amount`}
										className="block text-xs font-medium text-gray-300">
										Default Amount
									</label>
									<input
										id={`${kitName}-default-amount`}
										type="number"
										value={kitData.DefaultAmount || 1}
										onChange={(e) =>
											handleKitChange(
												kitName,
												"DefaultAmount",
												parseInt(e.target.value, 10)
											)
										}
										className="w-full px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
										autoComplete="off"
									/>
								</div>
								{["Price", "MinLevel", "MaxLevel"].map((field) => (
									<div key={field} className="relative">
										<label
											htmlFor={`${kitName}-${field.toLowerCase()}`}
											className="block text-xs font-medium text-gray-300">
											{field}
										</label>
										<div className="relative">
											<input
												id={`${kitName}-${field.toLowerCase()}`}
												type="number"
												value={
													kitData[field] ||
													(field === "Price"
														? 0
														: field === "MinLevel"
														? 1
														: 20)
												}
												onChange={(e) =>
													handleKitChange(
														kitName,
														field,
														parseInt(e.target.value, 10)
													)
												}
												className={`w-full px-2 py-1 pr-8 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
													!(field in kitData) && "opacity-50 cursor-not-allowed"
												}`}
												disabled={!(field in kitData)}
												autoComplete="off"
											/>
											<button
												onClick={() => toggleField(kitName, field)}
												className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${
													field in kitData
														? "hover:text-red-500"
														: "hover:text-green-500"
												}`}
												title={
													field in kitData ? "Disable field" : "Enable field"
												}>
												<PowerIcon className="h-4 w-4" />
											</button>
										</div>
									</div>
								))}
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<label
										htmlFor={`${kitName}-description`}
										className="block text-xs font-medium text-gray-300">
										Description
									</label>
									<input
										id={`${kitName}-description`}
										type="text"
										value={kitData.Description || ""}
										onChange={(e) =>
											handleKitChange(kitName, "Description", e.target.value)
										}
										className="w-full px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
										autoComplete="off"
									/>
								</div>
								<div>
									<label
										htmlFor={`${kitName}-permissions`}
										className="block text-xs font-medium text-gray-300">
										Permissions
									</label>
									<input
										id={`${kitName}-permissions`}
										type="text"
										value={kitData.Permissions || ""}
										onChange={(e) =>
											handleKitChange(kitName, "Permissions", e.target.value)
										}
										className="w-full px-2 py-1 text-sm text-white bg-dark-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
										autoComplete="off"
									/>
								</div>
							</div>
							<div className="flex items-center mt-2">
								<input
									type="checkbox"
									id={`${kitName}-only-from-spawn`}
									checked={kitData.OnlyFromSpawn || false}
									onChange={(e) =>
										handleKitChange(kitName, "OnlyFromSpawn", e.target.checked)
									}
									className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
								/>
								<label
									htmlFor={`${kitName}-only-from-spawn`}
									className="ml-2 text-sm font-medium text-gray-300">
									Only From Spawn
								</label>
							</div>
							<div className="grid grid-cols-3 gap-2 mt-2">
								<button
									onClick={() => openModal(kitName, "items")}
									className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
									<CubeIcon className="h-5 w-5 mr-2" />
									Items ({kitData.Items?.length || 0})
								</button>
								<button
									onClick={() => openModal(kitName, "dinos")}
									className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
									<SparklesIcon className="h-5 w-5 mr-2" />
									Dinos ({kitData.Dinos?.length || 0})
								</button>
								<button
									onClick={() => openModal(kitName, "commands")}
									className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
									<CommandLineIcon className="h-5 w-5 mr-2" />
									Commands ({kitData.Commands?.length || 0})
								</button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{modalOpen.items && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center backdrop-filter backdrop-blur-sm">
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="relative bg-mid-black w-full max-w-2xl m-auto rounded-lg shadow-lg overflow-hidden">
							<div className="p-6 max-h-[90vh] overflow-y-auto">
								<button
									onClick={() => closeModal("items")}
									className="absolute top-4 right-4 text-gray-400 hover:text-white">
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
								<ItemsModal
									kitName={currentEditingKit}
									items={config.Kits[currentEditingKit]?.Items || []}
									onSave={(items) =>
										updateKitData(currentEditingKit, "Items", items)
									}
									onClose={() => closeModal("items")}
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{modalOpen.dinos && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center backdrop-filter backdrop-blur-sm">
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="relative bg-mid-black w-full max-w-2xl m-auto rounded-lg shadow-lg overflow-hidden">
							<div className="p-6 max-h-[90vh] overflow-y-auto">
								<button
									onClick={() => closeModal("dinos")}
									className="absolute top-4 right-4 text-gray-400 hover:text-white">
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
								<DinosModal
									kitName={currentEditingKit}
									dinos={config.Kits[currentEditingKit]?.Dinos || []}
									onSave={(dinos) =>
										updateKitData(currentEditingKit, "Dinos", dinos)
									}
									onClose={() => closeModal("dinos")}
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{modalOpen.commands && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center backdrop-filter backdrop-blur-sm">
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="relative bg-mid-black w-full max-w-2xl m-auto rounded-lg shadow-lg overflow-hidden">
							<div className="p-6 max-h-[90vh] overflow-y-auto">
								<button
									onClick={() => closeModal("commands")}
									className="absolute top-4 right-4 text-gray-400 hover:text-white">
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
								<CommandsModal
									kitName={currentEditingKit}
									commands={config.Kits[currentEditingKit]?.Commands || []}
									onSave={(commands) =>
										updateKitData(currentEditingKit, "Commands", commands)
									}
									onClose={() => closeModal("commands")}
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default KitsSettings;
