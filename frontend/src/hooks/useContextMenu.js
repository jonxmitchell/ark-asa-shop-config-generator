// src/hooks/useContextMenu.js

import { useEffect } from "react";
import { writeText, readText } from "@tauri-apps/api/clipboard";
import { showMenu } from "tauri-plugin-context-menu";

export function useContextMenu() {
	useEffect(() => {
		const handleContextMenu = async (e) => {
			e.preventDefault();

			showMenu({
				pos: { x: e.clientX, y: e.clientY },
				theme: "dark",
				style: {
					backgroundColor: "#1E1E1E",
					color: "#FFFFFF",
					borderColor: "#333333",
				},
				items: [
					{
						label: "Cut",
						shortcut: "CmdOrCtrl+X",
						event: () => {
							const selection = document.getSelection();
							if (selection) {
								writeText(selection.toString()).then(() => {
									document.execCommand("delete");
								});
							}
						},
						style: {
							backgroundColor: "#1E1E1E",
							color: "#FFFFFF",
							hoverBackgroundColor: "#2A2A2A",
						},
					},
					{
						label: "Copy",
						shortcut: "CmdOrCtrl+C",
						event: () => {
							const selection = document.getSelection();
							if (selection) {
								writeText(selection.toString());
							}
						},
						style: {
							backgroundColor: "#1E1E1E",
							color: "#FFFFFF",
							hoverBackgroundColor: "#2A2A2A",
						},
					},
					{
						label: "Paste",
						shortcut: "CmdOrCtrl+V",
						event: async () => {
							const text = await readText();
							if (text) {
								document.execCommand("insertText", false, text);
							}
						},
						style: {
							backgroundColor: "#1E1E1E",
							color: "#FFFFFF",
							hoverBackgroundColor: "#2A2A2A",
						},
					},
					{
						label: "Select All",
						shortcut: "CmdOrCtrl+A",
						event: () => {
							document.execCommand("selectAll");
						},
						style: {
							backgroundColor: "#1E1E1E",
							color: "#FFFFFF",
							hoverBackgroundColor: "#2A2A2A",
						},
					},
				],
			});
		};

		document.addEventListener("contextmenu", handleContextMenu);

		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
		};
	}, []);
}
