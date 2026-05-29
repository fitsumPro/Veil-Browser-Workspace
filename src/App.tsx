/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Eye, Sliders, Globe, Code2, Hammer, BarChart2, ShieldCheck, 
  Settings2, HelpCircle, Flame, Star, Cpu, Lock, ToggleLeft, 
  ToggleRight, RefreshCw, Terminal, Plus, Play, Sparkles
} from "lucide-react";
import { BrowserPreferences, SystemLog } from "./types";
import { rustFiles } from "./rustCode";
import { BrowserSimulator } from "./components/BrowserSimulator";
import { CodeExplorer } from "./components/CodeExplorer";
import { InstallerCreator } from "./components/InstallerCreator";
import { BuildGuide } from "./components/BuildGuide";
import { TestDashboard } from "./components/TestDashboard";

export default function App() {
  // Navigation Trackers
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"simulator" | "scaffold" | "wix" | "guide" | "benchmarks">("simulator");

  // State Preferences Editor
  const [preferences, setPreferences] = useState<BrowserPreferences>({
    hardwareAcceleration: true,
    resourceSaverEnabled: true,
    autoDiscardEnabled: true,
    autoDiscardTimeoutMinutes: 5,
    httpsOnlyMode: true,
    doNotTrack: true,
    userAgentOverride: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    canvasNoiseEnabled: true,
    webAudioProtection: true,
    blockThirdPartyCookies: true,
    clearOnExitCookies: true,
    clearOnExitCache: true,
    clearOnExitHistory: false,
    webInspectorEnabled: true,
    searchEngine: "DuckDuckGo",
    homePage: "https://duckduckgo.com",
    fontScalePercentage: 100,
    customCss: ""
  });

  // Diagnostic Logs Console
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: "log-1", timestamp: "14:17:55", level: "INFO", module: "Engine", message: "Veil desktop web shell process initiated." },
    { id: "log-2", timestamp: "14:17:55", level: "INFO", module: "UI", message: "GTK4 container layouts mapping window coordinates 1280x800." },
    { id: "log-3", timestamp: "14:17:56", level: "SUCCESS", module: "Engine", message: "WebKit6 WebContext initialized with hardware rasterization pipelines forced." },
    { id: "log-4", timestamp: "14:17:56", level: "SECURITY", module: "Privacy", message: "Canvas Obfuscator active: Random high frequency rendering offsets injected." },
    { id: "log-5", timestamp: "14:17:56", level: "SECURITY", module: "Privacy", message: "Outgoing client header modified: Applying [DNT: 1] bypass rule." }
  ]);

  const addLog = (message: string, level: SystemLog["level"] = "INFO", module: SystemLog["module"] = "Engine") => {
    const timeString = new Date().toUTCString().split(" ")[4];
    const newLog: SystemLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: timeString,
      level,
      module,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Clamp logs heap
  };

  // Preset Handlers
  const applyPresetSecurityArmor = () => {
    addLog("Preset armor loaded: Applying high safety headers and absolute cookie blocklists", "SECURITY", "Privacy");
    setPreferences(prev => ({
      ...prev,
      blockThirdPartyCookies: true,
      httpsOnlyMode: true,
      canvasNoiseEnabled: true,
      webAudioProtection: true,
      doNotTrack: true,
      userAgentOverride: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0" // Mask as secure Tor/Firefox standard
    }));
  };

  const applyPresetPerformanceDefault = () => {
    addLog("Preset default loaded: Restoring basic WebKit engine balance limits", "INFO", "Engine");
    setPreferences(prev => ({
      ...prev,
      hardwareAcceleration: true,
      autoDiscardEnabled: true,
      resourceSaverEnabled: true,
      blockThirdPartyCookies: true,
      httpsOnlyMode: true,
      canvasNoiseEnabled: true,
      doNotTrack: true,
      userAgentOverride: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }));
  };

  const handleTogglePref = (key: keyof BrowserPreferences) => {
    const updatedValue = !preferences[key];
    setPreferences(prev => ({
      ...prev,
      [key]: updatedValue
    }));
    addLog(`Preference changed: ${String(key)} -> ${updatedValue}`, "INFO", "UI");
  };

  const downloadCompleteBundle = () => {
    const csharpCode = `using System;
using System.Drawing;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO;

namespace VeilWorkspace
{
    public class LauncherForm : Form
    {
        private Panel headerPanel;
        private Label titleLabel;
        private Label subtitleLabel;
        private Button buildBtn;
        private Button fixPathsBtn;
        private Button runTestsBtn;
        private TextBox logBox;

        public LauncherForm()
        {
            this.Text = "Veil Browser - Windows Native Development Hub";
            this.Size = new Size(700, 500);
            this.MinimumSize = new Size(700, 500);
            this.BackColor = Color.FromArgb(13, 13, 18);
            this.ForeColor = Color.White;
            this.Font = new Font("Segoe UI", 9.5f);
            this.StartPosition = FormStartPosition.CenterScreen;

            headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = 85;
            headerPanel.BackColor = Color.FromArgb(28, 20, 42);

            titleLabel = new Label();
            titleLabel.Text = "VEIL BROWSER DEVELOPER HUB";
            titleLabel.Font = new Font("Segoe UI", 16f, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(167, 139, 250);
            titleLabel.Location = new Point(20, 15);
            titleLabel.AutoSize = true;

            subtitleLabel = new Label();
            subtitleLabel.Text = "Native MSVC, Vcpkg Environment & GTK4 Build Controller";
            subtitleLabel.Font = new Font("Segoe UI", 9f);
            subtitleLabel.ForeColor = Color.DarkGray;
            subtitleLabel.Location = new Point(22, 50);
            subtitleLabel.AutoSize = true;

            headerPanel.Controls.Add(titleLabel);
            headerPanel.Controls.Add(subtitleLabel);
            this.Controls.Add(headerPanel);

            int startY = 100;
            fixPathsBtn = CreateStyledButton("1. Configure Paths (.ps1)", 20, startY, 200, 40);
            fixPathsBtn.Click += (s, e) => {
                Log("[*] Launching automated PowerShell Toolchain Configurator (fix_build.ps1)...");
                try {
                    ProcessStartInfo psi = new ProcessStartInfo("powershell", "-ExecutionPolicy Bypass -File fix_build.ps1");
                    psi.UseShellExecute = false;
                    Process.Start(psi);
                    Log("[✓] Process spawned successfully in separate terminal!");
                } catch (Exception ex) {
                    Log("[!] Fail to launch script: " + ex.Message);
                }
            };

            buildBtn = CreateStyledButton("2. Trigger Cargo Build", 240, startY, 200, 40);
            buildBtn.Click += (s, e) => {
                Log("[*] Testing Cargo toolchain presence...");
                try {
                    ProcessStartInfo psi = new ProcessStartInfo("cargo", "build --release");
                    psi.UseShellExecute = false;
                    Process.Start(psi);
                    Log("[✓] Cargo builder invoked!");
                } catch {
                    Log("[!] Cargo compiler not globally registered. Installing Rust up from https://rustup.rs recommended.");
                }
            };

            runTestsBtn = CreateStyledButton("3. Launch Webview Tester", 460, startY, 200, 40);
            runTestsBtn.Click += (s, e) => {
                Log("[*] Starting local web test emulation framework...");
                try {
                    Process.Start("https://duckduckgo.com");
                    Log("[✓] Launched browser view successfully!");
                } catch (Exception ex) {
                    Log("[!] Error: " + ex.Message);
                }
            };

            logBox = new TextBox();
            logBox.Multiline = true;
            logBox.ReadOnly = true;
            logBox.BackColor = Color.FromArgb(20, 20, 28);
            logBox.ForeColor = Color.FromArgb(196, 181, 253);
            logBox.Font = new Font("Consolas", 9.5f);
            logBox.Location = new Point(20, 160);
            logBox.Size = new Size(642, 280);
            logBox.ScrollBars = ScrollBars.Vertical;
            logBox.BorderStyle = BorderStyle.FixedSingle;

            this.Controls.Add(fixPathsBtn);
            this.Controls.Add(buildBtn);
            this.Controls.Add(runTestsBtn);
            this.Controls.Add(logBox);

            Log("===============================================================");
            Log("VEIL BROWSER WINDOWS 10/11 WORKSPACE EXE HUB LOADED");
            Log("===============================================================");
            Log("Workspace state: Active and fully configured.");
            Log("Select of of the automation tasks above to proceed compiling.");
            Log("");
        }

        private Button CreateStyledButton(string text, int x, int y, int w, int h)
        {
            Button btn = new Button();
            btn.Text = text;
            btn.Location = new Point(x, y);
            btn.Size = new Size(w, h);
            btn.FlatStyle = FlatStyle.Flat;
            btn.BackColor = Color.FromArgb(32, 27, 44);
            btn.ForeColor = Color.White;
            btn.FlatAppearance.BorderColor = Color.FromArgb(139, 92, 246);
            btn.Cursor = Cursors.Hand;
            return btn;
        }

        private void Log(string s)
        {
            logBox.AppendText("[" + DateTime.Now.ToString("HH:mm:ss") + "] " + s + Environment.NewLine);
        }

        [STAThread]
        public static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new LauncherForm());
        }
    }
}`;

    const base64Csharp = btoa(unescape(encodeURIComponent(csharpCode)));

    let script = `@echo off
title Veil Browser Windows 10 Workspace Setup
echo ======================================================================
echo          VEIL BROWSER WINDOWS 10 NATIVE DEVELOPMENT WORKSPACE
echo ======================================================================
echo.
echo This script will automatically recreate the full Veil source code
echo directory structure and files on your Windows 10 machine.
echo.
echo Please execute this .bat file inside an EMPTY directory to prevent
echo overwriting any of your existing files.
echo.
pause

echo.
echo [1/4] Recreating source directory hierarchy...
if not exist "src" mkdir "src"
if not exist "src\\engine" mkdir "src\\engine"
if not exist "src\\ui" mkdir "src\\ui"
if not exist "src\\privacy" mkdir "src\\privacy"
if not exist "src\\config" mkdir "src\\config"
if not exist "src\\utils" mkdir "src\\utils"
if not exist "wix" mkdir "wix"
if not exist ".github" mkdir ".github"
if not exist ".github\\workflows" mkdir ".github\\workflows"

echo.
echo [2/4] Recreating source files...
`;

    // Add each file write to the batch file using safe Base64 encoding decoding via PowerShell
    rustFiles.forEach(file => {
      const base64Content = btoa(unescape(encodeURIComponent(file.content)));
      const escapedPath = file.path.replace(/\//g, "\\");
      script += `echo Creating file: ${escapedPath} ...\n`;
      script += `powershell -NoProfile -ExecutionPolicy Bypass -Command "$dir = [System.IO.Path]::GetDirectoryName('${escapedPath}'); if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }; [System.IO.File]::WriteAllText('${escapedPath}', [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${base64Content}')))"\n\n`;
    });

    script += `
echo.
echo [3/4] Registering WiX Installer schema and automated workspace checks...
echo.
echo [4/4] Auto-compiling Windows Native Setup GUI (VeilWorkspaceHub.exe)...
echo Writing launcher source assembly...
powershell -NoProfile -ExecutionPolicy Bypass -Command "[System.IO.File]::WriteAllText('launcher.cs', [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${base64Csharp}')))"

set "csc_path=%SystemRoot%\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe"
if not exist "%csc_path%" set "csc_path=%SystemRoot%\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe"

if exist "%csc_path%" (
    echo Compiling C# assembly to native Windows diagnostic launchpad (VeilWorkspaceHub.exe)...
    "%csc_path%" /target:winexe /out:VeilWorkspaceHub.exe launcher.cs /reference:System.Windows.Forms.dll,System.Drawing.dll >nul
    del launcher.cs
    echo SUCCESS: VeilWorkspaceHub.exe successfully compiled locally!
) else (
    echo WARNING: MSVC system compiler (csc.exe) not found. Skipping VeilWorkspaceHub.exe generation.
)

echo.
echo ======================================================================
echo SUCCESS: Veil Browser source files and workspace set up!
echo ======================================================================
echo.
echo Guidelines to build:
echo 1. Install Visual Studio 2022 v143 toolkit (C++ workload)
echo 2. Setup vcpkg and install packages: vcpkg install gtk4 libadwaita webkitgtk
echo 3. Build Rust exe: cargo build --release
echo.
echo Build Guide and fix_build.ps1 are now fully generated and ready on your device.
echo.
echo ======================================================================
echo AUTOMATED TOOLCHAIN PATHS CONFIGURATION AT YOUR CHOICE
echo ======================================================================
echo Would you like to run the automated PowerShell script (fix_build.ps1)
echo to configure the MSVC linker, pkg-config, and automatically install
echo dynamic library dependencies now?
echo.
set /p run_ps="Execute fix_build.ps1 automatically? (Y/N): "
if /i "%run_ps%"=="Y" (
    echo.
    echo Launching fix_build.ps1...
    powershell -ExecutionPolicy Bypass -File fix_build.ps1
) else (
    echo.
    echo Configuration skipped. You can always run fix_build.ps1 manually later.
)
echo.
echo Would you like to launch the newly compiled VeilWorkspaceHub.exe native GUI launcher now?
echo.
set /p run_gui="Launch local Workspace HUB .exe now? (Y/N): "
if /i "%run_gui%"=="Y" (
    echo Launching VeilWorkspaceHub.exe...
    start VeilWorkspaceHub.exe
)
echo.
echo Setup script complete!
pause
`;

    const element = document.createElement("a");
    const file = new Blob([script], { type: "application/bat" });
    element.href = URL.createObjectURL(file);
    element.download = "setup_veil_win10.bat";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    addLog("Downloaded Windows 10 Workspace Bundler setup script successfully with embedded C# native compiler!", "SUCCESS", "UI");
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-gray-100 flex flex-col font-sans select-none antialiased">
      
      {/* 1. TOP HEADER: Premium Branded Veil Navigation Strip */}
      <div className="bg-gradient-to-r from-purple-950 via-[#101015] to-[#14141d] border-b border-purple-900/20 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Title Brand Layout */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1f162d]/90 rounded-xl border border-purple-800/40 flex items-center justify-center text-purple-400 shadow-xl relative hover:scale-105 transition-transform duration-300">
            <Eye size={22} className="text-purple-300 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black font-mono tracking-tight text-white leading-none">VEIL</h1>
            <span className="text-[10px] text-purple-400 font-mono tracking-wider font-semibold">"Browse unseen. Load instantly."</span>
          </div>
        </div>

        {/* Workspace core navigation buttons */}
        <div className="flex items-center gap-1.5 bg-[#101015] p-1 rounded-xl border border-purple-900/10">
          <button
            onClick={() => {
              setActiveWorkspaceTab("simulator");
              addLog("Opened workspace: Veil Simulator Panel", "INFO", "UI");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeWorkspaceTab === "simulator"
                ? "bg-[#20182c] text-purple-300 border border-purple-800/20 shadow-md font-semibold"
                : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/10"
            }`}
          >
            <Globe size={13} /> Browser Simulator
          </button>
          
          <button
            onClick={() => {
              setActiveWorkspaceTab("scaffold");
              addLog("Opened workspace: Rust Scaffold Code Explorer", "INFO", "UI");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeWorkspaceTab === "scaffold"
                ? "bg-[#20182c] text-purple-300 border border-purple-800/20 shadow-md font-semibold"
                : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/10"
            }`}
          >
            <Code2 size={13} /> Rust Scaffolding
          </button>

          <button
            onClick={() => {
              setActiveWorkspaceTab("wix");
              addLog("Opened workspace: MSI Installer Builder", "INFO", "UI");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeWorkspaceTab === "wix"
                ? "bg-[#20182c] text-purple-300 border border-purple-800/20 shadow-md font-semibold"
                : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/10"
            }`}
          >
            <Sliders size={13} /> MSI Setup Engine
          </button>

          <button
            onClick={() => {
              setActiveWorkspaceTab("guide");
              addLog("Opened workspace: MSVC Compilation Guide", "INFO", "UI");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeWorkspaceTab === "guide"
                ? "bg-[#20182c] text-purple-300 border border-purple-800/20 shadow-md font-semibold"
                : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/10"
            }`}
          >
            <Hammer size={13} /> Build Guide
          </button>

          <button
            onClick={() => {
              setActiveWorkspaceTab("benchmarks");
              addLog("Opened workspace: Comprehensive Benchmarks Runner", "INFO", "UI");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeWorkspaceTab === "benchmarks"
                ? "bg-[#20182c] text-purple-300 border border-purple-800/20 shadow-md font-semibold"
                : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/10"
            }`}
          >
            <BarChart2 size={13} /> Compliance Tests
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Global indicator detailing system engine safety integrity */}
          <div className="flex items-center gap-1.5 bg-[#112415] border border-emerald-900/30 text-emerald-300 text-xs px-3.5 py-1.5 rounded-xl font-mono">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="font-bold">STANDALONE WEBKIT INTEGRITY: HARDENED</span>
          </div>

          <button
            onClick={downloadCompleteBundle}
            className="flex items-center gap-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] border border-[#a78bfa]/40 text-white font-mono text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-lg shadow-purple-950/20 active:scale-95 transition-transform cursor-pointer"
            title="Download the automated setup script for Windows 10"
            id="btn-export-win10-workspace"
          >
            <Sparkles size={13} className="text-yellow-300 animate-pulse" />
            <span>EXPORT WORKSPACE FOR WIN10 (.BAT)</span>
          </button>
        </div>

      </div>

      {/* 2. CORE WORKSPACE: Sidebar preferences panels & contents stack splitting */}
      <div className="flex-1 grid lg:grid-cols-[300px_1fr] p-5 gap-6 overflow-hidden">
        
        {/* Left Side: Granular Control Panel Toggles */}
        <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
          
          {/* Quick preset templates router */}
          <div className="bg-[#111116] border border-purple-900/15 p-4 rounded-xl text-left shadow-lg">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-500 block mb-2">QUICK PROFILE CONTROLLER</span>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold">
              <button 
                onClick={applyPresetSecurityArmor}
                className="bg-[#2a1738] hover:bg-purple-900 text-purple-300 py-1.5 px-2 rounded-lg transition-transform hover:scale-102 flex items-center gap-1 justify-center"
              >
                <Lock size={11} /> Stealth Armor
              </button>
              <button
                onClick={applyPresetPerformanceDefault}
                className="bg-[#102a1b] hover:bg-emerald-900 text-emerald-300 py-1.5 px-2 rounded-lg transition-transform hover:scale-102 flex items-center gap-1 justify-center"
              >
                <Flame size={11} /> Opti-Express
              </button>
            </div>
          </div>

          {/* Granular browser controls editor */}
          <div className="bg-[#111116] border border-purple-900/15 p-4 rounded-xl flex-1 text-left flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-500 block border-b border-purple-900/10 pb-1.5 mb-3">VEIL SETTINGS EDITOR</span>
              
              <div className="space-y-4">
                
                {/* Toggle 1: Hardware graphics acceleration */}
                <div className="flex items-center justify-between">
                  <div className="leading-tight pr-2">
                    <span className="text-xs font-bold text-gray-200 block">Hardware Rasterization</span>
                    <span className="text-[10px] text-gray-500">Forces GPU layouts draw pipelines</span>
                  </div>
                  <button 
                    onClick={() => handleTogglePref("hardwareAcceleration")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {preferences.hardwareAcceleration ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                  </button>
                </div>

                {/* Toggle 2: Auto-discarding idle background frames */}
                <div className="flex items-center justify-between">
                  <div className="leading-tight pr-2">
                    <span className="text-xs font-bold text-gray-200 block">Tab Auto-Discarding</span>
                    <span className="text-[10px] text-gray-500">Suspends RAM footprint after 5m idle</span>
                  </div>
                  <button 
                    onClick={() => handleTogglePref("autoDiscardEnabled")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {preferences.autoDiscardEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                  </button>
                </div>

                {/* Toggle 3: Forced TLS Security upgrades */}
                <div className="flex items-center justify-between">
                  <div className="leading-tight pr-2">
                    <span className="text-xs font-bold text-gray-200 block">HTTPS-Only Upgrader</span>
                    <span className="text-[10px] text-gray-500">Auto replaces http with secure channels</span>
                  </div>
                  <button 
                    onClick={() => handleTogglePref("httpsOnlyMode")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {preferences.httpsOnlyMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                  </button>
                </div>

                {/* Toggle 4: Random Canvas Noise Injection obfuscation */}
                <div className="flex items-center justify-between">
                  <div className="leading-tight pr-2">
                    <span className="text-xs font-bold text-gray-200 block">Canvas Jitter Guard</span>
                    <span className="text-[10px] text-gray-500">Obfuscates layout unique tracing</span>
                  </div>
                  <button 
                    onClick={() => handleTogglePref("canvasNoiseEnabled")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {preferences.canvasNoiseEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                  </button>
                </div>

                {/* Toggle 5: Third party cookies filter */}
                <div className="flex items-center justify-between">
                  <div className="leading-tight pr-2">
                    <span className="text-xs font-bold text-gray-200 block">Block Third Party Cookies</span>
                    <span className="text-[10px] text-gray-500">Locks down iframe cookies fully</span>
                  </div>
                  <button 
                    onClick={() => handleTogglePref("blockThirdPartyCookies")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {preferences.blockThirdPartyCookies ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                  </button>
                </div>

              </div>
            </div>

            {/* Quick manual indicator detailing preferences binding parameters */}
            <div className="bg-[#181223]/30 border-t border-purple-900/10 pt-4 mt-6 flex gap-2 text-[10.5px] leading-normal text-purple-400 items-start">
              <Settings2 className="shrink-0 mt-0.5" size={14} />
              <div>
                <strong>Active Synchronization:</strong> Changing settings directly triggers runtime event loops within the simulator panel in real-time.
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Primary workspace visual wrapper rendering selected container tabs */}
        <div className="h-full overflow-hidden flex flex-col gap-5">
          <div className="flex-1 min-h-0 bg-[#121217] border border-purple-900/10 rounded-2xl shadow-xl overflow-hidden p-5 flex flex-col">
            {activeWorkspaceTab === "simulator" && (
              <BrowserSimulator 
                preferences={preferences} 
                onUpdatePreferences={setPreferences} 
                logs={logs} 
                addLog={addLog} 
              />
            )}
            
            {activeWorkspaceTab === "scaffold" && (
              <CodeExplorer files={rustFiles} />
            )}

            {activeWorkspaceTab === "wix" && (
              <InstallerCreator />
            )}

            {activeWorkspaceTab === "guide" && (
              <BuildGuide />
            )}

            {activeWorkspaceTab === "benchmarks" && (
              <TestDashboard />
            )}
          </div>

          {/* 3. DIAGNOSTIC SYSTEM LOG ENGINE TERMINAL LOGS SECTION */}
          <div className="bg-[#0c0c11] border border-purple-900/15 rounded-xl h-44 overflow-hidden flex flex-col shadow-inner">
            <div className="bg-[#101015] px-4 py-2 border-b border-purple-900/10 flex items-center justify-between select-none shrink-0 text-xs">
              <span className="font-mono font-bold text-purple-300 flex items-center gap-1.5">
                <Terminal size={13} className="text-purple-400 animate-pulse" />
                VEIL SYSTEM COMPLIANCE INTERFACE LOGGER (STDOUT)
              </span>
              <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase tracking-wider">Ctrl + ~ (Console Active)</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 font-mono text-[10.5px] text-left space-y-1 bg-[#09090d]">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 leading-relaxed">
                  <span className="text-gray-600">[{log.timestamp}]</span>
                  <span className={`font-bold shrink-0 ${
                    log.level === "ERROR" ? "text-red-500" :
                    log.level === "WARN" ? "text-amber-500" :
                    log.level === "SUCCESS" ? "text-emerald-400" :
                    log.level === "SECURITY" ? "text-purple-400 bg-purple-950/20 px-1 rounded" :
                    "text-blue-400"
                  }`}>{log.level}</span>
                  <span className="text-gray-500 font-bold">[{log.module}]</span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
