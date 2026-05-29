/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Check, Download, FolderOpen, FileCode, CheckCircle2, AlertCircle } from "lucide-react";
import { CodeFile } from "../types";

interface CodeExplorerProps {
  files: CodeFile[];
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(files[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [buildStatus, setBuildStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([selectedFile.content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleTriggerSimulatedBuild = () => {
    setIsBuilding(true);
    setBuildStatus("idle");
    setBuildLogs(["[Cargo] Initializing MSVC toolchain...", "[Cargo] Resolving dependency graph schema vcpkg.json..."]);

    const steps = [
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling gtk4 v0.7.3 bindings..."]),
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling libadwaita v0.5.3 bindings..."]),
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling webkit2gtk v2.0.1 (WebKit6 integration)..."]),
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling local modules: engine, privacy, config, ui, utils"]),
      () => {
        setBuildLogs(prev => [...prev, "[Cargo] Output: target/release/veil.exe (Size: 22.4 MB stripped)", "✓ Compilation Successful!"]);
        setBuildStatus("success");
        setIsBuilding(false);
      }
    ];

    steps.forEach((step, idx) => {
      setTimeout(step, (idx + 1) * 600);
    });
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 h-full text-sm">
      
      {/* Sidebar - File Explorer */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#18181f] border border-purple-900/10 p-4 rounded-xl shadow-lg">
          <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest block mb-3">VEIL CODE WORKSPACE</span>
          
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {files.map((file) => (
              <div
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors border ${
                  selectedFile.path === file.path
                    ? "bg-[#251e2f] text-purple-300 border-purple-800/40"
                    : "bg-[#101014] text-gray-400 hover:text-gray-200 border-transparent hover:bg-purple-950/20"
                }`}
              >
                <FileCode size={14} className={selectedFile.path === file.path ? "text-purple-400" : "text-gray-500"} />
                <div className="truncate text-xs text-left">
                  <div className="font-bold leading-none truncate">{file.name}</div>
                  <div className="font-mono text-[9px] text-gray-500 leading-none mt-1 truncate">{file.path}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cargo Build Dashboard widget */}
        <div className="bg-[#18181f] border border-purple-900/10 p-4 rounded-xl shadow-lg flex-1 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-purple-300 uppercase block mb-1">MOCK CARGO COMPILER</span>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Trigger a local compilation run evaluating Veil's Rust structures and headers compatibility.
            </p>
          </div>

          <div className="space-y-3">
            {buildStatus !== "idle" && (
              <div className="p-3 rounded-lg flex items-center gap-2.5 text-xs font-mono font-medium border leading-normal">
                {buildStatus === "success" ? (
                  <>
                    <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />
                    <span className="text-emerald-300">target/release/veil.exe successfully compiled (22.4MB)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-red-400 shrink-0" size={16} />
                    <span className="text-red-300">Build failed with diagnostic conflicts</span>
                  </>
                )}
              </div>
            )}

            {buildLogs.length > 0 && (
              <div className="bg-[#0b0c10] border border-purple-950/40 font-mono text-[10px] text-purple-400 p-2.5 rounded-lg h-28 overflow-y-auto space-y-0.5 shadow-inner">
                {buildLogs.map((log, idx) => (
                  <div key={idx} className={log.includes("✓") || log.includes("Successful") ? "text-emerald-400 font-bold" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleTriggerSimulatedBuild}
              disabled={isBuilding}
              className={`w-full font-mono font-bold text-xs py-2 rounded-lg transition-all border ${
                isBuilding 
                  ? "bg-purple-950/20 text-purple-500 border-purple-950/10 cursor-not-allowed" 
                  : "bg-purple-900 hover:bg-purple-800 text-white border-purple-800 hover:shadow-lg hover:shadow-purple-950/10"
              }`}
            >
              {isBuilding ? "Compiling source structures..." : "Run Simulated cargo build"}
            </button>
          </div>
        </div>

      </div>

      {/* Code Viewer Viewbox */}
      <div className="bg-[#18181f] border border-purple-900/10 rounded-xl overflow-hidden flex flex-col shadow-lg">
        <div className="bg-[#121216] px-4 py-3 border-b border-purple-900/10 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-200">{selectedFile.name}</h4>
            <p className="text-xs text-gray-500 font-mono leading-none mt-1">{selectedFile.path} · {selectedFile.language.toUpperCase()} file syntax</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900 border border-purple-800 hover:bg-purple-800 rounded-lg text-xs font-mono font-bold text-white transition-colors hover:shadow-md"
              title="Download this file to your machine"
            >
              <Download size={13} />
              <span>Download File</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e24] border border-purple-950 hover:bg-purple-950/20 rounded-lg text-xs font-mono font-bold text-gray-300 hover:text-purple-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400 font-bold" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Block</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code description header banner */}
        <div className="bg-[#211a2d]/30 border-b border-purple-900/10 px-4 py-2 text-xs text-purple-300 leading-relaxed font-sans italic">
          {selectedFile.description}
        </div>

        {/* Source formatting */}
        <div className="flex-1 overflow-auto p-4 bg-[#0d0d11]">
          <pre className="font-mono text-xs text-gray-300 leading-relaxed text-left selection:bg-purple-900 select-all whitespace-pre">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
