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
};
