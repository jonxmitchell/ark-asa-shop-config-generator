// src/components/Sidebar.jsx

import React from "react";

const menuItems = [
	"MySQL",
	"General",
	"Kits",
	"Shop Items",
	"Sell Items",
	"Messages",
];

function Sidebar({ activeItem, setActiveItem }) {
	return (
		<aside
			className="w-full h-full bg-mid-black py-6 px-4 flex flex-col"
			aria-label="Sidebar">
			<h2 className="text-xl font-bold mb-6 text-white px-2">Settings</h2>
			<div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray">
				<ul className="space-y-2">
					{menuItems.map((item) => (
						<li key={item}>
							<button
								onClick={() => setActiveItem(item)}
								className={`flex items-center p-2 w-full text-base font-normal rounded-lg transition-colors ${
									activeItem === item
										? "bg-light-black text-accent-blue"
										: "text-gray-300 hover:bg-light-black hover:text-white"
								}`}>
								{item}
							</button>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
}

export default Sidebar;
