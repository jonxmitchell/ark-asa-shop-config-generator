// src/components/settings/MessagesSettings.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useConfig } from "../ConfigContext";
import { Tooltip } from "react-tooltip";

function MessagesSettings() {
	const { config, updateConfig, showTooltips } = useConfig();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredMessages, setFilteredMessages] = useState([]);

	const messagesConfig = useMemo(() => config?.Messages || {}, [config]);

	const filterMessages = useCallback(() => {
		return Object.entries(messagesConfig)
			.filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
			.sort((a, b) => a[0].localeCompare(b[0]));
	}, [messagesConfig, searchTerm]);

	useEffect(() => {
		setFilteredMessages(filterMessages());
	}, [filterMessages]);

	const handleChange = useCallback(
		(key, value) => {
			updateConfig((prevConfig) => ({
				...prevConfig,
				Messages: {
					...prevConfig.Messages,
					[key]: value,
				},
			}));
		},
		[updateConfig]
	);

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<input
				type="text"
				placeholder="Search messages..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-full px-3 py-2 mb-4 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
				data-tooltip-id="tooltip-search"
			/>
			<div className="space-y-4">
				{filteredMessages.map(([key, value]) => (
					<motion.div key={key} layout className="space-y-2">
						<label
							htmlFor={key}
							className="block text-sm font-medium text-gray-300">
							{key}
						</label>
						<input
							id={key}
							type="text"
							value={value}
							onChange={(e) => handleChange(key, e.target.value)}
							className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
							data-tooltip-id={`tooltip-${key}`}
						/>
					</motion.div>
				))}
			</div>
			{showTooltips && (
				<>
					<Tooltip
						id="tooltip-search"
						place="top"
						content="Search for specific messages"
						offset={5}
						float={true}
					/>
					{Object.keys(messagesConfig).map((key) => (
						<Tooltip
							key={key}
							id={`tooltip-${key}`}
							place="top"
							content={getTooltipContent(key)}
							offset={5}
							float={true}
						/>
					))}
				</>
			)}
		</div>
	);
}

function getTooltipContent(key) {
	const tooltipContent = {
		Sender: "Name of the sender for in-game messages",
		BoughtItem: "Message displayed when a player buys an item",
		BoughtDino: "Message displayed when a player buys a dino",
		BoughtBeacon: "Message displayed when a player buys a beacon",
		BoughtExp: "Message displayed when a player buys experience",
		ReceivedPoints: "Message displayed when a player receives points",
		HavePoints: "Message to show a player's current points",
		NoPoints: "Message displayed when a player doesn't have enough points",
		WrongId: "Message displayed when an incorrect ID is used",
		NoPermissionsKit:
			"Message displayed when a player lacks permission for a kit",
		CantBuyKit: "Message displayed when a player can't buy a kit",
		BoughtKit: "Message displayed when a player successfully buys a kit",
		AvailableKits: "Message to list available kits",
		NoKits: "Message displayed when no kits are available",
		KitsLeft: "Message to show remaining kits",
		NoKitsLeft: "Message displayed when no kits are left",
		CantGivePoints: "Message displayed when points can't be given",
		RidingDino: "Message displayed when trying to buy while riding a dino",
		SentPoints: "Message displayed when points are sent to another player",
		GotPoints: "Message displayed when receiving points from another player",
		NoPlayer: "Message displayed when a player doesn't exist",
		FoundMorePlayers: "Message displayed when multiple players are found",
		BuyUsage: "Usage instructions for the buy command",
		ShopUsage: "Usage instructions for the shop command",
		KitUsage: "Usage instructions for the kit command",
		BuyKitUsage: "Usage instructions for the buykit command",
		TradeUsage: "Usage instructions for the trade command",
		PointsCmd: "Command to check points",
		TradeCmd: "Command to trade points",
		BuyCmd: "Command to buy items",
		ShopCmd: "Command to open the shop",
		KitCmd: "Command to use kits",
		BuyKitCmd: "Command to buy kits",
		SellCmd: "Command to sell items",
		ShopSellCmd: "Command to open the sell shop",
		SellUsage: "Usage instructions for the sell command",
		NotEnoughItems:
			"Message displayed when trying to sell without enough items",
		SoldItems: "Message displayed after successfully selling items",
		BadLevel: "Message displayed when player level doesn't meet requirements",
		KitsListPrice: "Format for displaying kit prices",
		KitsListFormat: "Format for displaying kit information",
		StoreListDino: "Format for displaying dino information in the store",
		StoreListItem: "Format for displaying item information in the store",
		StoreListFormat: "General format for store listings",
		OnlyOnSpawnKit: "Message for kits that can only be used on spawn",
		HelpCmd: "Command to display help information",
		ShopMessage: "General shop usage message",
		HelpMessage: "Content of the help message",
		RefundError: "Message displayed when points are refunded due to an error",
		ShopFindCmd: "Command to search the shop",
		ShopFindUsage: "Usage instructions for the shop find command",
		ShopFindNotFound: "Message displayed when no items match the search",
		ShopFindTooManyResults: "Message displayed when too many results are found",
		NoPermissionsStore:
			"Message displayed when a player lacks permission to buy from the store",
		InventoryIsFull:
			"Message displayed when the inventory is full and can't redeem a kit",
	};

	return tooltipContent[key] || "Customize this message";
}

export default MessagesSettings;
