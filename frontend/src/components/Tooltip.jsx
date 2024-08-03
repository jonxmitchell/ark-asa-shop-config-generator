// src/components/Tooltip.jsx
import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Tooltip = ({ id, content }) => {
	return (
		<>
			<ReactTooltip
				id={id}
				place="top"
				content={content}
				className="custom-tooltip"
			/>
		</>
	);
};

export default Tooltip;
