"use client";

import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { monokaiPro } from "@codesandbox/sandpack-themes";
import { GripVertical } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

interface SandpackPreviewProps {
  files: Record<string, string>;
  dependencies: Record<string, string>;
}

export default function SandpackPreviewComponent({
  files,
  dependencies,
}: SandpackPreviewProps) {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#2D2E2C]">
      <SandpackProvider
        template="react"
        theme={monokaiPro}
        files={files}
        customSetup={{
          dependencies: dependencies,
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        className="h-full"
      >
        <SandpackLayout
          style={{ height: "100vh", borderRadius: 0, border: "none" }}
        >
          <Group orientation="horizontal" className="h-full w-full">
            {/* File Explorer Panel */}
            <Panel defaultSize={15} minSize={10} className="h-full">
              <SandpackFileExplorer style={{ height: "100vh" }} />
            </Panel>

            <Separator className="w-1 bg-slate-800 hover:bg-blue-500 transition-colors flex items-center justify-center cursor-col-resize group">
              <div className="opacity-0 group-hover:opacity-100 text-blue-300">
                <GripVertical className="w-4 h-4" />
              </div>
            </Separator>

            {/* Code Editor Panel */}
            <Panel defaultSize={40} minSize={20} className="h-full">
              <SandpackCodeEditor
                style={{ height: "100vh" }}
                showLineNumbers
                showTabs
                closableTabs
              />
            </Panel>

            <Separator className="w-1 bg-slate-800 hover:bg-blue-500 transition-colors flex items-center justify-center cursor-col-resize group">
              <div className="opacity-0 group-hover:opacity-100 text-blue-300">
                <GripVertical className="w-4 h-4" />
              </div>
            </Separator>

            {/* Preview Panel */}
            <Panel defaultSize={45} minSize={20} className="h-full bg-white">
              <SandpackPreview
                style={{ height: "100vh" }}
                showNavigator
                showOpenInCodeSandbox={false}
              />
            </Panel>
          </Group>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
