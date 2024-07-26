import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ConfigTabs from "./components/ConfigTabs";

const defaultConfig = {
	Mysql: {
		UseMysql: false,
		MysqlHost: "",
		MysqlUser: "",
		MysqlPass: "",
		MysqlDB: "",
		MysqlPort: 3306,
	},
	General: {
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
		TimedPointsReward: {
			Enabled: false,
			StackRewards: false,
			Interval: 30,
		},
	},
};

function App() {
	const [config, setConfig] = useState(defaultConfig);
	const [activeTab, setActiveTab] = useState("generator");
	const [activeSidebarItem, setActiveSidebarItem] = useState("MySQL");

	const handleConfigUpdate = (newConfig) => {
		setConfig(newConfig);
	};

	return (
		<div className="flex h-screen bg-deep-black text-white p-4 overflow-hidden">
			<div className="flex w-full space-x-4 h-full">
				<div className="w-64 bg-mid-black rounded-xl shadow-lg flex flex-col overflow-hidden">
					<Sidebar
						activeItem={activeSidebarItem}
						setActiveItem={setActiveSidebarItem}
					/>
				</div>
				<div className="flex-1 bg-mid-black rounded-xl shadow-lg flex flex-col overflow-hidden">
					<ConfigTabs
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						config={config}
						onConfigUpdate={handleConfigUpdate}
						activeSidebarItem={activeSidebarItem}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
