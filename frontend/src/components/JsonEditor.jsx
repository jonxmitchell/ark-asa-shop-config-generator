import React from "react";
import Editor from "@monaco-editor/react";

function JsonEditor({ config }) {
	const jsonString = JSON.stringify(config, null, 2);

	return (
		<div className="h-full w-full bg-mid-black rounded-lg overflow-hidden">
			<div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray">
				<Editor
					height="100%"
					defaultLanguage="json"
					value={jsonString}
					theme="vs-dark"
					options={{
						readOnly: true,
						minimap: { enabled: false },
						fontSize: 14,
						scrollBeyondLastLine: false,
						renderLineHighlight: "all",
						lineNumbers: "on",
						roundedSelection: false,
						selectOnLineNumbers: false,
						automaticLayout: true,
						scrollbar: {
							vertical: "hidden",
							horizontal: "hidden",
						},
						overviewRulerLanes: 0,
						overviewRulerBorder: false,
						hideCursorInOverviewRuler: true,
					}}
				/>
			</div>
		</div>
	);
}

export default JsonEditor;
