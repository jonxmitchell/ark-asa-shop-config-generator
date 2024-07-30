// src/config/defaultConfig.js

export const defaultConfig = {
	Mysql: {
		UseMysql: false,
		MysqlHost: "",
		MysqlUser: "",
		MysqlPass: "",
		MysqlDB: "",
		MysqlPort: 3306,
	},
	General: {
		Discord: {
			Enabled: false,
			SenderName: "ArkShop",
			URL: "",
		},
		TimedPointsReward: {
			Enabled: false,
			StackRewards: false,
			Interval: 30,
			Groups: {},
		},
		ItemsPerPage: 15,
		ShopDisplayTime: 15.0,
		ShopTextSize: 1.3,
		DbPathOverride: "",
		DefaultKit: "",
		GiveDinosInCryopods: true,
		UseSoulTraps: false,
		CryoLimitedTime: false,
		CryoItemPath: "",
		UseOriginalTradeCommandWithUI: false,
		PreventUseNoglin: true,
		PreventUseUnconscious: true,
		PreventUseHandcuffed: true,
		PreventUseCarried: true,
	},
	Kits: {},
	ShopItems: {},
	SellItems: {},
	Messages: {
		Sender: "ArkShop",
		BoughtItem:
			'<RichColor Color="0, 1, 0, 1">You have successfully bought item</>',
		BoughtDino:
			'<RichColor Color="0, 1, 0, 1">You have successfully bought dino</>',
		BoughtBeacon:
			'<RichColor Color="0, 1, 0, 1">You have successfully bought beacon</>',
		BoughtExp:
			'<RichColor Color="0, 1, 0, 1">You have successfully bought experience</>',
		ReceivedPoints:
			'<RichColor Color="1, 1, 0, 1">You have received {0} points! (total: {1})</>',
		HavePoints: "You have {0} points",
		NoPoints: '<RichColor Color="1, 0, 0, 1">You don\'t have enough points</>',
		WrongId: '<RichColor Color="1, 0, 0, 1">Wrong id</>',
		NoPermissionsKit:
			'<RichColor Color="1, 0, 0, 1">You don\'t have permission to use this kit</>',
		CantBuyKit: '<RichColor Color="1, 0, 0, 1">You can\'t buy this kit</>',
		BoughtKit:
			'<RichColor Color="0, 1, 0, 1">You have successfully bought {0} kit</>',
		AvailableKits: "Available kits for you:",
		NoKits: "No available kits",
		KitsLeft: "You have {0} {1} kits left",
		NoKitsLeft: "You don't have {0} kits left",
		CantGivePoints:
			'<RichColor Color="1, 0, 0, 1">You can\'t give points to yourself</>',
		RidingDino:
			'<RichColor Color="1, 0, 0, 1">You can\'t buy this item while riding a dino</>',
		SentPoints:
			'<RichColor Color="0, 1, 0, 1">You have successfully sent {0} points to {1}</>',
		GotPoints: "You have received {0} points from {1}",
		NoPlayer: '<RichColor Color="1, 0, 0, 1">Player doesn\'t exist</>',
		FoundMorePlayers:
			'<RichColor Color="1, 0, 0, 1">Found more than one player with the given name</>',
		BuyUsage: "Usage: /buy id amount",
		ShopUsage: "Usage: /shop page",
		KitUsage: "Usage: /kit KitName",
		BuyKitUsage: "Usage: /BuyKit KitName amount",
		TradeUsage: "Usage: /trade 'Player Name' amount",
		PointsCmd: "/points",
		TradeCmd: "/trade",
		BuyCmd: "/buy",
		ShopCmd: "/shop",
		KitCmd: "/kit",
		BuyKitCmd: "/buykit",
		SellCmd: "/sell",
		ShopSellCmd: "/shopsell",
		SellUsage: "Usage: /sell id amount",
		NotEnoughItems:
			'<RichColor Color="1, 0, 0, 1">You don\'t have enough items ({0}/{1})</>',
		SoldItems:
			'<RichColor Color="0, 1, 0, 1">You have successfully sold items</>',
		BadLevel: '<RichColor Color="1, 0, 0, 1">Required level: {0} - {1}</>',
		KitsListPrice: "Price: {0}",
		KitsListFormat: '"{0}" - {1}. {2} left. {3}\n',
		StoreListDino: "{0}) {1}. Level: {2}. Id: {3}. Price: {4}\n",
		StoreListItem: "{0}) {1}. Id: {2}. Price: {3}\n",
		StoreListFormat: "{0}",
		OnlyOnSpawnKit: "This kit can be used only on spawn",
		HelpCmd: "/shophelp",
		ShopMessage: "Usage: /buy id amount",
		HelpMessage: "This is shop help message",
		RefundError: "Points refunded due to an error",
		ShopFindCmd: "/shopfind",
		ShopFindUsage: "Usage: /shopfind searchterm",
		ShopFindNotFound: "No items matched your search",
		ShopFindTooManyResults:
			"Too many results to display refine your search term",
		NoPermissionsStore:
			'<RichColor Color="1, 0, 0, 1">You don\'t have permission to buy this {0}!</>',
		InventoryIsFull:
			'<RichColor Color="1, 0, 0, 1">Unable to redeem your kit, inventory full!</>',
	},
};
