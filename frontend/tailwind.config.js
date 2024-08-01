module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
	theme: {
		extend: {
			colors: {
				"deep-black": "#000000",
				"dark-black": "#121212",
				"mid-black": "#1E1E1E",
				"light-black": "#2D2D2D",
				"accent-blue": "#3B82F6",
				"scrollbar-thumb": "#3B82F6",
				"scrollbar-track": "#1E1E1E",
			},
			boxShadow: {
				// prettier-ignore
				'tabs': "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.46)",
			},
			backdropBlur: {
				sm: "4px",
			},
		},
	},
	variants: {
		extend: {
			backdropBlur: ["responsive"],
		},
	},
	plugins: [
		require("flowbite/plugin"),
		function ({ addUtilities }) {
			const newUtilities = {
				".scrollbar-thin": {
					scrollbarWidth: "thin",
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "8px",
					},
				},
				".scrollbar-thumb-blue": {
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "#3B82F6",
					},
					"&::-webkit-scrollbar-thumb:hover": {
						backgroundColor: "#60A5FA",
					},
				},
				".scrollbar-track-gray": {
					"&::-webkit-scrollbar-track": {
						backgroundColor: "#1E1E1E",
					},
				},
			};
			addUtilities(newUtilities, ["responsive", "hover"]);
		},
	],
	darkMode: "class",
};
