// src/components/Loader.jsx

import React from "react";
import { trio } from "ldrs";

trio.register();

function Loader() {
	return (
		<div className="flex justify-center items-center h-full">
			<l-trio size="60" speed="1.5" color="#3B82F6"></l-trio>
		</div>
	);
}

export default Loader;
