/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, ShieldCheck, ShieldAlert, ArrowLeft, ArrowRight, RotateCw, Plus, X, 
  Settings, Terminal, Globe, Download, Lock, Unlock, Search, Play, RefreshCw,
  Sliders, Cpu, Database, Eye, FileText, Check, AlertTriangle, Monitor, Sparkles
} from "lucide-react";
import { SimulatedTab, ProxyProfile, DownloadItem, BrowserPreferences, SystemLog } from "../types";

// Constant Prebuilt Profiles for Proxies
const DEFAULT_PRESETS: ProxyProfile[] = [
  { id: "direct", name: "Direct Connection (No Proxy)", host: "127.0.0.1", port: 80, type: "HTTP", countryCode: "US", isActive: true },
  { id: "swiss", name: "Zurich SecNode SOCKS5", host: "109.202.107.5", port: 1080, type: "SOCKS5", countryCode: "CH", username: "veil_user", isActive: false },
  { id: "iceland", name: "Reykjavik CryptSocks", host: "185.112.144.30", port: 9050, type: "SOCKS5", countryCode: "IS", isActive: false },
  { id: "tokyo", name: "Tokyo StealthProxy", host: "210.140.10.8", port: 8080, type: "HTTPS", countryCode: "JP", isActive: false }
];

interface BrowserSimulatorProps {
  preferences: BrowserPreferences;
  onUpdatePreferences: (pref: BrowserPreferences) => void;
  logs: SystemLog[];
  addLog: (msg: string, level: SystemLog["level"], module: SystemLog["module"]) => void;
}

export const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({
  preferences,
  onUpdatePreferences,
  logs,
  addLog,
}) => {
  // Simulator Navigation & Tab State
  const [tabs, setTabs] = useState<SimulatedTab[]>([
    {
      id: "tab-1",
      title: "Hacker News Discussions",
      url: "https://hackernews.ycombinator.com",
      icon: "https://news.ycombinator.com/favicon.ico",
      isPrivate: false,
      isActive: true,
      isLoaded: true,
      trackersBlocked: [
        { name: "Google Analytics UA", url: "https://www.google-analytics.com/analytics.js", category: "analytics" },
        { name: "DoubleClick Ad Server", url: "https://ad.doubleclick.net/pixel", category: "advertising" }
      ],
      memoryUsageMb: 42.1,
      lastInteractionTime: Date.now(),
      isThrottled: false,
      isDiscarded: false
    },
    {
      id: "tab-2",
      title: "EFF Cover Your Tracks Test",
      url: "https://coveryourtracks.eff.org",
      icon: "https://coveryourtracks.eff.org/favicon.ico",
      isPrivate: false,
      isActive: false,
      isLoaded: true,
      trackersBlocked: [
        { name: "Facebook Pixel", url: "https://connect.facebook.net/en_US/fbevents.js", category: "analytics" },
        { name: "Tealium IQ Tracker", url: "https://tags.tiqcdn.com/utag/utag.js", category: "social" },
        { name: "Google Tag Manager", url: "https://www.googletagmanager.com/gtm.js", category: "analytics" }
      ],
      memoryUsageMb: 58.4,
      lastInteractionTime: Date.now(),
      isThrottled: false,
      isDiscarded: false
    },
    {
      id: "tab-3",
      title: "Acid3 rendering test success",
      url: "https://acid3.acidtests.org",
      icon: "🌐",
      isPrivate: false,
      isActive: false,
      isLoaded: true,
      trackersBlocked: [],
      memoryUsageMb: 12.8,
      lastInteractionTime: Date.now() - 360000, // Over 5 mins old
      isThrottled: true,
      isDiscarded: false
    }
  ]);

  const [activeUrlInput, setActiveUrlInput] = useState<string>("https://hackernews.ycombinator.com");
  const [showPrivacyBadgePopover, setShowPrivacyBadgePopover] = useState<boolean>(false);
  const [showLocationPopover, setShowLocationPopover] = useState<boolean>(false);
  const [showDownloadsPopover, setShowDownloadsPopover] = useState<boolean>(false);
  
  // Custom SOCKS Proxy Lists
  const [proxies, setProxies] = useState<ProxyProfile[]>(DEFAULT_PRESETS);
  
  // Custom Interactive Canvas fingerprint demonstration
  const [canvasColorSeed, setCanvasColorSeed] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulated Web Inspector / Console State
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<"console" | "network">("console");

  // Downloads simulation state
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: "dl-1",
      filename: "veil_setup_v010.msi",
      url: "https://releases.veil-browser.org/stable/veil_setup.msi",
      sizeBytes: 114200300,
      receivedBytes: 114200300,
      status: "completed",
      speedKbps: 0,
      path: "C:\\Users\\User\\Downloads"
    }
  ]);

  const downloadRealHelperFile = () => {
    const text = `@echo off
echo =======================================================
echo          VEIL BROWSER WINDOWS 10 QUICK-START TOOLKIT
echo =======================================================
echo.
echo [Prerequisites]
echo 1. Install Visual Studio 2022 v143 with "Desktop development with C++"
echo 2. Install Rust compiler from https://rustup.rs/
echo.
echo [1/3] Setting up local directory...
if not exist "src" md src
echo.
echo [2/3] Downloading Git packages and bindings...
echo cloning native Vcpkg repository dependency...
echo git clone https://github.com/microsoft/vcpkg.git
echo.
echo [3/3] Compiling and registry linking...
echo set VCPKG_DEFAULT_TRIPLET=x86_64-pc-windows-msvc
echo cargo build --release
echo.
echo =======================================================
echo Veil C++ dependencies and Rust workspace setup ready!
echo =======================================================
echo.
pause
`;
    const element = document.createElement("a");
    const file = new Blob([text], { type: "application/bat" });
    element.href = URL.createObjectURL(file);
    element.download = "veil_setup_win10.bat";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Sync address bar input with active tab url
  const activeTab = tabs.find(t => t.isActive) || tabs[0];
  useEffect(() => {
    if (activeTab) {
      setActiveUrlInput(activeTab.url);
    }
  }, [activeTab?.id, activeTab?.url]);

  // Resource Saver background manager loop stimulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (preferences.autoDiscardEnabled) {
        setTabs(currentTabs => {
          let tabToDiscard: string | null = null;
          const mapped = currentTabs.map(tab => {
            if (!tab.isActive && !tab.isDiscarded && (Date.now() - tab.lastInteractionTime > preferences.autoDiscardTimeoutMinutes * 60 * 1000)) {
              tabToDiscard = tab.title;
              return { 
                ...tab, 
                isDiscarded: true, 
                memoryUsageMb: 1.2 // Retains holding info under a fraction of a megabyte
              };
            }
            return tab;
          });
          if (tabToDiscard) {
            setTimeout(() => {
              addLog(`[Resource Saver] Unloading inactive tab "${tabToDiscard}" to free memory.`, "SUCCESS", "Task");
            }, 0);
          }
          return mapped;
        });
      }
      
      // Update download speeds if downloading
      setDownloads(currentDls => {
        let completedFilename: string | null = null;
        const mapped = currentDls.map(dl => {
          if (dl.status === "downloading") {
            const increment = Math.round(5000000 + Math.random() * 8000000); // 5-13MB per frame simulation
            const newBytes = Math.min(dl.receivedBytes + increment, dl.sizeBytes);
            const speed = Math.round((7000 + Math.random() * 5000));
            if (newBytes >= dl.sizeBytes) {
              completedFilename = dl.filename;
              return { ...dl, receivedBytes: dl.sizeBytes, status: "completed", speedKbps: 0 };
            }
            return { ...dl, receivedBytes: newBytes, speedKbps: speed };
          }
          return dl;
        });
        if (completedFilename) {
          const nameToDownload = completedFilename;
          setTimeout(() => {
            addLog(`Download of "${nameToDownload}" complete!`, "SUCCESS", "Engine");
            if (nameToDownload === "veil_rust_v011.zip") {
              downloadRealHelperFile();
            }
          }, 0);
        }
        return mapped;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [preferences.autoDiscardEnabled, preferences.autoDiscardTimeoutMinutes]);

  // Canvas context rendering loop simulating the browser fingerprinter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Direct background redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw complex gradient with intersecting lines and custom texts
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, `hsl(${canvasColorSeed}, 70%, 20%)`);
    grad.addColorStop(1, `hsl(${(canvasColorSeed + 120) % 360}, 60%, 10%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(100, 150, 255, 0.2)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(canvas.width - i, canvas.height);
      ctx.stroke();
    }

    // Text rendering creates specific font rasterization hashes: key profiling vectors
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.font = "italic 13px 'JetBrains Mono', Courier, monospace";
    ctx.shadowColor = "rgba(120, 50, 255, 0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText("Veil Fingerprint Safe Guard", 15, 35);

    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#a855f7";
    ctx.fillText("WebKit WinCairo HTML5 Canvas rendering", 15, 55);

    // Dynamic noise feedback representation in bottom right
    if (preferences.canvasNoiseEnabled) {
      ctx.fillStyle = "rgba(0, 255, 100, 0.85)";
      ctx.fillRect(canvas.width - 45, canvas.height - 25, 30, 10);
      ctx.fillStyle = "#000";
      ctx.font = "bold 8px system-ui";
      ctx.fillText("GUARDED", canvas.width - 43, canvas.height - 17);
    } else {
      ctx.fillStyle = "rgba(255, 50, 50, 0.85)";
      ctx.fillRect(canvas.width - 40, canvas.height - 25, 25, 10);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px system-ui";
      ctx.fillText("RAW", canvas.width - 34, canvas.height - 17);
    }
  }, [canvasColorSeed, preferences.canvasNoiseEnabled]);

  // Simulated browser navigation callbacks
  const handleNavigate = (url: string) => {
    let cleanUrl = url.trim();
    if (!cleanUrl) return;

    // HTTPS Upgrader module checkpoint
    let protocolUpgradeNeeded = false;
    if (cleanUrl.startsWith("http://")) {
      protocolUpgradeNeeded = true;
    } else if (!cleanUrl.startsWith("https://") && !cleanUrl.startsWith("http://")) {
      // Auto complete input
      if (cleanUrl.includes(".") && !cleanUrl.includes(" ")) {
        cleanUrl = "https://" + cleanUrl;
      } else {
        cleanUrl = `https://duckduckgo.com/?q=${encodeURIComponent(cleanUrl)}`;
      }
    }

    // Process HTTPS-only upgrades
    if (protocolUpgradeNeeded && preferences.httpsOnlyMode) {
      const targetHttps = cleanUrl.replace("http://", "https://");
      addLog(`[HTTPS-Only] Intercepted unsecure URL. Auto upgrading: ${cleanUrl} -> ${targetHttps}`, "SECURITY", "Network");
      cleanUrl = targetHttps;
    }

    addLog(`Navigating to URL: ${cleanUrl}`, "INFO", "Engine");

    // Inject trackers list mock-data based on destination
    let trackers: SimulatedTab["trackersBlocked"] = [];
    let memory = 15 + Math.random() * 40;
    let title = cleanUrl.replace("https://", "").replace("http://", "");

    if (cleanUrl.includes("ycombinator")) {
      trackers = [
        { name: "Google Analytics UA", url: "https://www.google-analytics.com/analytics.js", category: "analytics" },
        { name: "DoubleClick Ad Server", url: "https://ad.doubleclick.net/pixel", category: "advertising" }
      ];
      title = "Hacker News Discussions";
    } else if (cleanUrl.includes("coveryourtracks")) {
      trackers = [
        { name: "Facebook Pixel", url: "https://connect.facebook.net/en_US/fbevents.js", category: "analytics" },
        { name: "Tealium IQ Tracker", url: "https://tags.tiqcdn.com/utag/utag.js", category: "social" },
        { name: "Google Tag Manager", url: "https://www.googletagmanager.com/gtm.js", category: "analytics" }
      ];
      title = "EFF Cover Your Tracks Test";
    } else if (cleanUrl.includes("acid3")) {
      trackers = [];
      title = "Acid3 rendering test success";
    } else if (cleanUrl.includes("html5test")) {
      trackers = [
        { name: "Quantcast Telemetry Tracker", url: "https://pixel.quantserve.com/pixel", category: "analytics" }
      ];
      title = "HTML5test - How well does your browser support HTML5?";
    } else {
      trackers = [
        { name: "Generic Beacon Track", url: "https://tracker.net/beacon.png", category: "advertising" },
        { name: "Context ads helper", url: "https://context-ad.com/js", category: "advertising" }
      ];
    }

    // Update the active tab parameters
    setTabs(currentTabs => 
      currentTabs.map(tab => {
        if (tab.isActive) {
          return {
            ...tab,
            url: cleanUrl,
            title,
            isLoaded: true,
            isDiscarded: false,
            lastInteractionTime: Date.now(),
            trackersBlocked: preferences.blockThirdPartyCookies ? trackers : [], // Blockers trigger only under preferences boundary
            memoryUsageMb: parseFloat(memory.toFixed(1))
          };
        }
        return tab;
      })
    );
  };

  const handleCreateTab = (url: string = preferences.homePage) => {
    addLog(`Creating new active browser frame...`, "INFO", "UI");
    setTabs(currentTabs => {
      const deactivated = currentTabs.map(t => ({ ...t, isActive: false }));
      const newId = `tab-${Date.now()}`;
      return [
        ...deactivated,
        {
          id: newId,
          title: "New Tab",
          url,
          icon: "🌐",
          isPrivate: false,
          isActive: true,
          isLoaded: true,
          trackersBlocked: [],
          memoryUsageMb: 8.5,
          lastInteractionTime: Date.now(),
          isThrottled: false,
          isDiscarded: false
        }
      ];
    });
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      addLog("Cannot close unique running tab container.", "WARN", "UI");
      return;
    }
    addLog(`Closed tab window frame.`, "INFO", "UI");
    
    setTabs(currentTabs => {
      const targetIndex = currentTabs.findIndex(t => t.id === id);
      const isTargetActive = currentTabs[targetIndex].isActive;
      const filtered = currentTabs.filter(t => t.id !== id);
      
      if (isTargetActive) {
        // Activate relative neighbour tab
        const nextActiveIndex = Math.max(0, targetIndex - 1);
        filtered[nextActiveIndex].isActive = true;
      }
      return filtered;
    });
  };

  const handleActivateTab = (id: string) => {
    const selectedTab = tabs.find(t => t.id === id);
    if (selectedTab) {
      addLog(`Focusing tab framework: "${selectedTab.title}"`, "INFO", "UI");
    }
    setTabs(currentTabs => 
      currentTabs.map(tab => {
        if (tab.id === id) {
          return { 
            ...tab, 
            isActive: true, 
            isDiscarded: false, // Auto restoring tab container
            memoryUsageMb: tab.isDiscarded ? (20 + Math.random() * 20) : tab.memoryUsageMb,
            lastInteractionTime: Date.now() 
          };
        }
        return { ...tab, isActive: false };
      })
    );
  };

  const handleSelectProxy = (id: string) => {
    const selectedProxy = proxies.find(p => p.id === id);
    if (selectedProxy) {
      addLog(`Routing global browser stream securely through profile: ${selectedProxy.name} (${selectedProxy.host}:${selectedProxy.port})`, "SECURITY", "Proxy");
    }
    setProxies(curProxies => 
      curProxies.map(p => {
        if (p.id === id) {
          return { ...p, isActive: true };
        }
        return { ...p, isActive: false };
      })
    );
    setShowLocationPopover(false);
  };

  const handleStartSimDownload = () => {
    addLog(`Initiating download stream: veil_rust_v011.zip`, "INFO", "Engine");
    const newId = `dl-${Date.now()}`;
    const newDl: DownloadItem = {
      id: newId,
      filename: "veil_rust_v011.zip",
      url: "https://releases.veil-browser.org/snapshots/veil_rust_v011.zip",
      sizeBytes: 88400120, // 84.3MB
      receivedBytes: 0,
      status: "downloading",
      speedKbps: 4500,
      path: "C:\\Users\\User\\Downloads"
    };

    setDownloads(cur => [newDl, ...cur]);
    setShowDownloadsPopover(true);
  };

  const activeProxy = proxies.find(p => p.isActive) || proxies[0];

  return (
    <div className="flex flex-col h-full bg-[#1e1e24] text-gray-200 font-sans border-2 border-purple-900/30 rounded-xl overflow-hidden shadow-2xl">
      
      {/* SECTION HEADER: Windows Native Style Libadwaita Title Container */}
      <div className="bg-[#121216] border-b border-purple-900/20 px-3 py-1 flex items-center justify-between text-xs text-gray-400 select-none">
        <div className="flex items-center gap-2">
          <Eye size={13} className="text-purple-400 animate-pulse" />
          <span className="font-mono tracking-wider font-semibold text-purple-300">VEIL DEKTOP FRAME v0.1.0 (WebKit6 + GTK4 WinCairo)</span>
        </div>
        
        {/* Hardware details line for developers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Cpu size={12} className="text-gray-500" />
            <span className="font-mono text-[10px] text-gray-500">GPU ACCEL: {preferences.hardwareAcceleration ? "ENABLED" : "DISABLED"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Database size={12} className="text-gray-500" />
            <span className="font-mono text-[10px] text-gray-500">COOKIE POLY: {preferences.blockThirdPartyCookies ? "ISOLATED" : "PERMISSIBLE"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${activeProxy.id !== "direct" ? "bg-emerald-500 animate-ping" : "bg-purple-500"}`} />
            <span className="font-mono text-[10px] uppercase text-purple-300">{activeProxy.name}</span>
          </div>
        </div>
      </div>

      {/* ADW HEADER BAR LAYOUT CONTAINER */}
      <div className="bg-[#18181f] border-b border-purple-900/30 p-2.5 flex flex-wrap items-center gap-2 select-none">
        
        {/* Navigation Core Panel */}
        <div className="flex items-center gap-1 bg-[#101015]/60 p-0.5 rounded-lg border border-purple-900/20">
          <button 
            onClick={() => handleNavigate(activeTab.url)} 
            className="p-1.5 hover:bg-purple-950/40 rounded-md text-gray-400 hover:text-purple-300 transition-colors"
            title="Go Back (Alt+Left)"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            className="p-1.5 hover:bg-purple-950/40 rounded-md text-gray-600 cursor-not-allowed transition-colors"
            disabled
            title="Go Forward (Alt+Right)"
          >
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => handleNavigate(activeTab.url)} 
            className="p-1.5 hover:bg-purple-950/40 rounded-md text-gray-400 hover:text-purple-300 transition-colors"
            title="Reload Page (Ctrl+R)"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Dynamic Navigation Smart URL input field with HTTPS lock status */}
        <div className="flex-1 min-w-[280px] relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {activeTab.url.startsWith("https://") ? (
              <Lock size={13} className="text-emerald-400" title="HTTPS Secure connection verified by WebKit engine." />
            ) : (
              <AlertTriangle size={13} className="text-amber-500" title="Insecure HTTP transport. Unsafe!" />
            )}
          </div>
          
          <input
            type="text"
            className="w-full bg-[#101014] border border-purple-950/50 hover:border-purple-800/40 focus:border-purple-500 rounded-lg py-1.5 pl-8 pr-28 text-sm outline-none text-gray-100 font-mono transition-all shadow-inner focus:ring-1 focus:ring-purple-900/50"
            value={activeUrlInput}
            onChange={(e) => setActiveUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleNavigate(activeUrlInput); }}
            placeholder="Secure URL search or protocol address..."
          />

          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Real-time blocked trackers badge dashboard */}
            <button
              onClick={() => setShowPrivacyBadgePopover(!showPrivacyBadgePopover)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono transition-all border ${
                activeTab.trackersBlocked.length > 0 
                  ? "bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/80" 
                  : "bg-[#141418] text-gray-500 border-gray-800/40 hover:bg-gray-800/40"
              }`}
            >
              <Shield size={12} className={activeTab.trackersBlocked.length > 0 ? "text-purple-400 fill-purple-400/20" : ""} />
              <span>{activeTab.trackersBlocked.length}</span>
            </button>
            
            {showPrivacyBadgePopover && (
              <div className="absolute top-[32px] right-0 z-50 w-72 bg-[#121216] border border-purple-900/45 rounded-xl shadow-2xl p-3.5 text-xs text-gray-200">
                <div className="flex items-center justify-between border-b border-purple-900/20 pb-2 mb-2">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-purple-400" />
                    Privacy Shield Control
                  </span>
                  <span className="font-mono text-[9px] bg-purple-950 px-1.5 py-0.5 text-purple-300 rounded font-semibold">ACTIVE</span>
                </div>
                
                {activeTab.trackersBlocked.length > 0 ? (
                  <>
                    <p className="text-gray-400 mb-2 leading-relaxed text-[11px]">
                      The native <span className="font-mono text-purple-300">UserContentFilterStore</span> intercepted and quarantined the following telemetry structures:
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {activeTab.trackersBlocked.map((tr, idx) => (
                        <div key={idx} className="bg-[#1a1a22] border border-purple-950/50 p-2 rounded flex flex-col gap-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-300 leading-none">{tr.name}</span>
                            <span className={`text-[8px] uppercase px-1 py-0.1 outline font-mono ${
                              tr.category === "analytics" ? "text-blue-400 border-blue-900" : "text-amber-400 border-amber-900"
                            }`}>{tr.category}</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-500 truncate" title={tr.url}>{tr.url}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 mb-1 py-4 text-center">
                    No tracing beacons or ad-pixels detected on this safe page context.
                  </p>
                )}

                <div className="border-t border-purple-900/20 pt-2.5 mt-2.5 flex justify-between gap-2">
                  <div className="text-[10px] text-purple-400 font-mono">
                    EasyList filter integrated
                  </div>
                  <button 
                    onClick={() => setShowPrivacyBadgePopover(false)}
                    className="bg-purple-900 hover:bg-purple-800 text-white rounded px-2.5 py-1 font-bold text-[10px] transition-colors"
                  >
                    Close Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Agent / Proxy controller widget */}
        <div className="relative">
          <button
            onClick={() => setShowLocationPopover(!showLocationPopover)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs leading-none transition-all font-medium border ${
              activeProxy.id !== "direct" 
                ? "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60 border-emerald-900/40" 
                : "bg-[#14141a] hover:bg-[#1f202a] text-gray-400 border-purple-950/50"
            }`}
          >
            <Globe size={13} className={activeProxy.id !== "direct" ? "text-emerald-400 animate-pulse" : "text-gray-500"} />
            <span className="font-mono text-[11px]">{activeProxy.id === "direct" ? "No Proxy" : `${activeProxy.countryCode} IP`}</span>
          </button>

          {showLocationPopover && (
            <div className="absolute top-[34px] right-0 z-50 w-64 bg-[#121216] border border-purple-900/40 rounded-xl shadow-2xl p-3 text-xs">
              <span className="block font-bold text-purple-300 pb-1.5 border-b border-purple-900/10 mb-2">My Location Agent (SOCKS5/HTTP)</span>
              
              <div className="space-y-1.5">
                {proxies.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectProxy(p.id)}
                    className={`p-2 rounded border cursor-pointer transition-colors flex items-center justify-between ${
                      p.isActive 
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-100" 
                        : "bg-[#1a1a23] border-purple-950/50 hover:bg-purple-955/20 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>{p.name}</span>
                        {p.id !== "direct" && <span className="text-[9px] bg-purple-900 text-purple-200 px-1 rounded">{p.type}</span>}
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">{p.host}:{p.port}</span>
                    </div>
                    {p.isActive && <Check size={14} className="text-emerald-400" />}
                  </div>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-purple-900/10 flex justify-between">
                <span className="text-[9px] text-gray-500 font-mono text-left">Generates TOML routing maps</span>
                <span className="text-[9px] text-purple-400 hover:underline cursor-pointer" onClick={() => setShowLocationPopover(false)}>Close</span>
              </div>
            </div>
          )}
        </div>

        {/* Download Manager popover controller */}
        <div className="relative">
          <button 
            onClick={() => setShowDownloadsPopover(!showDownloadsPopover)}
            className="p-1.5 bg-[#14141a] hover:bg-[#1e1e28] text-gray-400 hover:text-purple-300 border border-purple-950/50 rounded-lg relative"
            title="Download Manager (Ctrl+D)"
          >
            <Download size={14} />
            {downloads.some(d => d.status === "downloading") && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            )}
          </button>

          {showDownloadsPopover && (
            <div className="absolute top-[34px] right-0 z-50 w-72 bg-[#121216] border border-purple-900/40 rounded-xl shadow-2xl p-3 text-xs text-gray-200">
              <div className="flex items-center justify-between border-b border-purple-900/15 pb-1.5 mb-2">
                <span className="font-bold text-purple-300 flex items-center gap-1"><Download size={13} /> Downloads</span>
                <button 
                  onClick={() => setDownloads([])}
                  className="text-[9px] text-gray-500 hover:text-gray-300 font-mono"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {downloads.length > 0 ? (
                  downloads.map((d) => (
                    <div key={d.id} className="bg-[#181822] border border-purple-950/50 p-2 rounded text-[11px] flex flex-col gap-1.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-300 truncate w-3/4">{d.filename}</span>
                        <span className={`text-[8px] px-1 rounded font-mono ${
                          d.status === "completed" ? "bg-emerald-950/80 text-emerald-400" : "bg-purple-950 text-purple-300"
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      
                      {d.status === "downloading" ? (
                        <div>
                          <div className="w-full bg-[#101014] h-1.5 rounded overflow-hidden">
                            <div 
                              className="bg-purple-500 h-full transition-all duration-300" 
                              style={{ width: `${(d.receivedBytes / d.sizeBytes) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
                            <span>{Math.round(d.receivedBytes / 1024 / 1024)}MB / {Math.round(d.sizeBytes / 1024 / 1024)}MB</span>
                            <span>{d.speedKbps > 1024 ? `${(d.speedKbps / 1024).toFixed(1)} MB/s` : `${d.speedKbps} KB/s`}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                          <span>Size: {(d.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                          <span className="text-purple-400 hover:underline cursor-pointer">Open Folder</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 font-mono">
                    No active downloads in history
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ADW TAB BAR: Reorderable Tabs with Loading State & Custom Animations */}
      <div className="bg-[#141419] border-b border-purple-950 px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar">
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => {
            const isDiscarded = tab.isDiscarded;
            return (
              <motion.div
                key={tab.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleActivateTab(tab.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border shrink-0 ${
                  tab.isActive 
                    ? "bg-[#1e1e24] text-purple-300 border-purple-900/40 shadow-md font-semibold" 
                    : "bg-[#101015]/60 text-gray-400 border-transparent hover:bg-[#1a1a20]/80 hover:text-gray-200"
                }`}
                style={{ width: "172px" }}
              >
                {/* Simulated favicon */}
                <span className="text-xs shrink-0 select-none">
                  {isDiscarded ? "❄️" : tab.icon.startsWith("http") ? <img src={tab.icon} alt="ico" className="w-3.5 h-3.5 rounded" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : tab.icon}
                </span>

                <div className="flex-1 truncate pr-1 select-none flex flex-col items-start leading-none gap-0.5">
                  <span className="truncate w-full text-left">{tab.title}</span>
                  <span className="text-[8px] font-mono text-gray-500 truncate w-full text-left">
                    {isDiscarded ? "Discarded (Safe)" : `${tab.memoryUsageMb.toFixed(1)} MB`}
                  </span>
                </div>

                <button 
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="p-0.5 hover:bg-purple-950/40 rounded-full text-gray-500 hover:text-purple-400 opacity-20 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <X size={10} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <button 
          onClick={() => handleCreateTab()}
          className="p-1.5 bg-[#101014] hover:bg-[#1f1f2a] border border-purple-950/40 text-gray-400 hover:text-purple-300 rounded-lg transition-transform hover:scale-105"
          title="Open New Tab (Ctrl+T)"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* CORE WEBVIEW PREVIEW OVERLAY: Live Interactive Site Renders Context */}
      <div className="flex-1 bg-[#202029] relative overflow-hidden flex flex-col min-h-[380px]">
        
        {activeTab.isDiscarded ? (
          /* AUTO-DISCARD FLAGGED CONTAINER VIEW */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#111116] border border-purple-950/30">
            <div className="relative mb-4">
              <Cpu className="text-gray-500 w-16 h-16 animate-pulse" />
              <span className="absolute -top-1 -right-1 text-2xl">❄️</span>
            </div>
            <h3 className="text-lg font-bold text-purple-300 font-mono mb-1">Tab Auto-Discarded</h3>
            <p className="text-gray-400 max-w-sm text-sm mb-4">
              Veil's background <span className="text-purple-400 font-semibold font-mono">Resource Saver</span> task suspended this tab configuration after 5 minutes of idle state, releasing <span className="text-purple-300 font-mono bg-purple-950/30 px-1 rounded">{activeTab.memoryUsageMb + 40}MB RAM</span>.
            </p>
            <button 
              onClick={() => handleActivateTab(activeTab.id)}
              className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold font-mono px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 hover:shadow-purple-900/30"
            >
              <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} /> Restore active memory footprint
            </button>
          </div>
        ) : activeTab.url.includes("hackernews.ycombinator.com") ? (
          
          /* VIEW A: HARDENED HACKER NEWS PREVIEW */
          <div className="flex-1 bg-[#101014] p-5 overflow-y-auto">
            <div className="max-w-2xl mx-auto flex flex-col h-full bg-[#14141b] rounded-xl border border-purple-950/20 shadow-md">
              <div className="bg-orange-600/10 px-4 py-3 border-b border-orange-500/20 rounded-t-xl flex items-center gap-2 justify-between">
                <span className="text-orange-500 font-bold border-2 border-orange-500 px-1 font-mono leading-none">Y</span>
                <span className="font-bold text-xs text-orange-200">Hacker News discuss (Secure Sandbox)</span>
                <span className="text-[10px] font-mono text-gray-500">HN RSS V3 Verified</span>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="border border-purple-950/40 p-3 rounded-lg hover:border-purple-800/40 bg-[#16161f]/80 transition-colors">
                  <div className="flex gap-2">
                    <span className="text-[11px] font-mono text-purple-400">1.</span>
                    <div>
                      <h4 className="font-bold text-sm text-gray-200 leading-snug">Show HN: Veil - Privacy browser built with GTK4 and WebKit WinCairo</h4>
                      <div className="text-[10px] font-mono text-gray-500 mt-1 flex gap-2">
                        <span>by rust_dev</span>
                        <span>·</span>
                        <span>4 hours ago</span>
                        <span>·</span>
                        <span className="text-purple-400 hover:underline cursor-pointer">182 comments</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5 bg-[#101015] border border-purple-950/20 p-2.5 rounded text-[11px] italic text-purple-300">
                    "I wanted a real WebKit option on Windows that wasn't tied to Apple or Microsoft store builds. By forcing hardware pipelines with zero-copy rasterization, Veil outperforms Edge on cold restarts while consuming only 62MB RAM baseline..."
                  </div>
                </div>

                <div className="border border-purple-950/40 p-3 rounded-lg hover:border-purple-800/40 bg-[#16161f]/80 transition-colors">
                  <div className="flex gap-2">
                    <span className="text-[11px] font-mono text-purple-400">2.</span>
                    <div>
                      <h4 className="font-bold text-sm text-gray-200 leading-snug">Why we should avoid Chromium monopolies on the modern Web</h4>
                      <div className="text-[10px] font-mono text-gray-500 mt-1 flex gap-2">
                        <span>by we_want_speed</span>
                        <span>·</span>
                        <span>8 hours ago</span>
                        <span>·</span>
                        <span className="text-purple-400 hover:underline cursor-pointer">410 comments</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-purple-950/40 p-3 rounded-lg hover:border-purple-800/40 bg-[#16161f]/80 transition-colors">
                  <div className="flex gap-2">
                    <span className="text-[11px] font-mono text-purple-400">3.</span>
                    <div>
                      <h4 className="font-bold text-sm text-gray-200 leading-snug">WebKit Cairo Win64 Builds for Windows Desktop Integration</h4>
                      <div className="text-[10px] font-mono text-gray-500 mt-1 flex gap-2">
                        <span>by msvc_master</span>
                        <span>·</span>
                        <span>12 hours ago</span>
                        <span>·</span>
                        <span className="text-purple-400 hover:underline cursor-pointer">67 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : activeTab.url.includes("coveryourtracks.eff.org") ? (
          
          /* VIEW B: COVERYOURTRACKS TEST SANDBOX WITH INTERACTIVE CANVAS NOISE GENERATOR */
          <div className="flex-1 bg-[#101317] p-5 overflow-y-auto">
            <div className="max-w-2xl mx-auto bg-[#14181f] rounded-xl border border-purple-900/10 p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-purple-900/30 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-gray-200 text-lg flex items-center gap-1.5 leading-none">
                    <ShieldAlert className="text-purple-400" />
                    Cover Your Tracks API
                  </h3>
                  <p className="text-gray-500 text-[10px] uppercase font-mono mt-0.5">Dynamic Device Unique Fingerprint Audit</p>
                </div>
                <button
                  onClick={() => setCanvasColorSeed(prev => (prev + 30) % 360)}
                  className="bg-purple-900 hover:bg-purple-800 text-white rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={11} className="animate-pulse" /> Re-render context
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-[#1c222c] border border-purple-950/50 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-[11px] font-mono font-bold text-purple-300">HTML5 CANVAS RENDER ACCELERATOR</span>
                  <div className="flex justify-center my-1 bg-[#090b0e] p-2 rounded border border-purple-950/20">
                    <canvas 
                      ref={canvasRef} 
                      width={240} 
                      height={120} 
                      className="rounded shadow-inner select-none"
                    />
                  </div>
                  <div className="text-[10px] leading-relaxed text-gray-400 mt-0.5">
                    Canvas rendering uses hardware anti-aliasing. Unsafe browsers allow trackers to convert pixels into distinct GPU hashing identifiers.
                  </div>
                </div>

                <div className="bg-[#1c222c] border border-purple-950/50 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-purple-300 block mb-2">VEIL ACTIVE SECURITY OVERVIEW</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs border-b border-purple-900/10 pb-1">
                        <span className="text-gray-400 font-medium">Canvas Entropy Block:</span>
                        <span className={preferences.canvasNoiseEnabled ? "text-emerald-400 font-bold" : "text-amber-500 font-medium"}>
                          {preferences.canvasNoiseEnabled ? "[ ACTIVE JITTER ]" : "[ RETURNING RAW ]"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs border-b border-purple-900/10 pb-1">
                        <span className="text-gray-400 font-medium">User-Agent Spoofing:</span>
                        <span className="text-purple-300 font-mono text-[10px] truncate max-w-[130px]" title={preferences.userAgentOverride}>
                          {preferences.userAgentOverride.includes("Chrome") ? "Windows Chrome" : "Default GTK"}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs border-b border-purple-900/10 pb-1">
                        <span className="text-gray-400 font-medium">WebAudio Protection:</span>
                        <span className="text-emerald-400 font-bold">[ FREQUENCY CLOAKED ]</span>
                      </div>

                      <div className="flex justify-between text-xs pb-1">
                        <span className="text-gray-400 font-medium">Tracking Status:</span>
                        <span className="px-1.5 py-0.2 bg-purple-900/40 text-purple-200 outline border-purple-900 rounded font-bold text-[10px]">
                          PROTECTED (NOISE ACTIVE)
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onUpdatePreferences({
                        ...preferences,
                        canvasNoiseEnabled: !preferences.canvasNoiseEnabled
                      });
                      addLog(`Canvas noise injection toggled: ${!preferences.canvasNoiseEnabled ? 'ON' : 'OFF'}`, "INFO", "Privacy");
                    }}
                    className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      preferences.canvasNoiseEnabled 
                        ? "bg-[#14281a] hover:bg-[#1a3823] text-emerald-300 border-emerald-900/40" 
                        : "bg-purple-900 hover:bg-purple-800 text-white border-purple-800"
                    }`}
                  >
                    {preferences.canvasNoiseEnabled ? "Disable Shield (Leak Raw Canvas)" : "Enable Veil Canvas Armor"}
                  </button>
                </div>
              </div>

              {/* Console log outputs demonstrating injection hooks */}
              <div className="bg-[#0b0c10] border border-purple-950/20 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-gray-500 block mb-1">CONSOLE ENGINE INJECTION DEBUG LOGS</span>
                <div className="font-mono text-[11px] text-purple-400 space-y-1">
                  <div>[00:01:42] Injecting script hook: CanvasRenderingContext2D.prototype.getImageData</div>
                  <div>[00:01:42] Intercepted read hook on 2D context. Introducing gray jitter offset (+0.02% scale)</div>
                  {preferences.canvasNoiseEnabled ? (
                    <div className="text-emerald-400 font-bold animate-pulse">[Active Shield] Canvas read obfuscated! Scrambled entropy output returning value offset index.</div>
                  ) : (
                    <div className="text-amber-500 font-bold">[WARN] Raw canvas entropy read allowed. Browser profiling risk high!</div>
                  )}
                </div>
              </div>

            </div>
          </div>

        ) : activeTab.url.includes("acid3.acidtests.org") ? (
          
          /* VIEW C: SYSTEM ACID3 PREVIEW */
          <div className="flex-1 bg-[#fff] text-black p-6 flex flex-col items-center justify-center font-sans">
            <div className="max-w-md w-full border border-gray-300 bg-white p-5 shadow-lg rounded">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Acid3 Rendering Engine Benchmark</span>
              <div className="border border-red-500/10 p-4 mb-4 rounded bg-red-50/20 flex flex-col items-center justify-center">
                <div className="text-7xl font-sans font-extrabold text-[#d32f2f] tracking-tighter">100/100</div>
                <div className="text-gray-500 text-xs font-bold mt-2 uppercase font-mono tracking-wider">Passes DOM3, SVG, ECMAScript checks</div>
              </div>
              
              <div className="h-2 bg-[#d32f2f] w-full rounded-full mb-3" />
              
              <div className="space-y-1 text-[10.5px] text-gray-600 font-mono">
                <div>✓ WebKit core parsing compliance: compliant</div>
                <div>✓ XML Parsing and CSS Selectors level 3 compilation: pass</div>
                <div>✓ Dynamic SVG container bounds tracking: pass</div>
                <div>✓ WinCairo Direct2D rasterization speed: 60fps locked</div>
              </div>
            </div>
          </div>

        ) : activeTab.url.includes("html5test.com") ? (
          
          /* VIEW D: HTML5TEST SCORE PREVIEW */
          <div className="flex-1 bg-[#151c24] text-gray-200 p-6 overflow-y-auto font-sans">
            <div className="max-w-xl mx-auto bg-[#1b2530] rounded-xl border border-blue-900/10 p-5">
              <div className="flex justify-between items-center border-b border-blue-900/20 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-[#4a90e2] text-lg">HTML5test.com Suite</h3>
                  <p className="text-gray-500 text-[10px]">Browser Web Standards Compliance Analyzer</p>
                </div>
                <div className="bg-[#4a90e2]/15 text-[#4a90e2] border border-blue-900 px-3 py-1 text-2xl font-black font-mono rounded-lg">518/555</div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                WebKit6 core fully supports modern ES2022+ type operations, flex grids, nested styling engines, and system codecs bundled via <span className="font-mono text-purple-300">GStreamer</span>.
              </p>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between border-b border-gray-800 pb-1 text-emerald-400 font-medium">
                  <span>✓ ES2022 Class private definitions:</span>
                  <span>Supported (45/45)</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1 text-emerald-400 font-medium">
                  <span>✓ Layout grid & Aspect Ratio properties:</span>
                  <span>Supported (30/30)</span>
                </div>
                <div className="flex justify-between border-b border-gray-850 pb-1 text-emerald-400 font-medium">
                  <span>✓ WebGL Core & Hardware accelerated shaders:</span>
                  <span>Supported (25/25)</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>✗ Widevine CDM Encrypted Media (DRM):</span>
                  <span>Requires User Authorization (Manual Plugin)</span>
                </div>
              </div>
            </div>
          </div>

        ) : (
          
          /* VIEW E: FALLBACK / INTRO SEARCH RESULTS VIEW */
          <div className="flex-1 bg-gradient-to-br from-[#121217] to-[#121422] p-6 flex flex-col items-center justify-center font-sans text-center">
            <div className="w-20 h-20 bg-purple-950/40 border-2 border-purple-800/40 rounded-full flex items-center justify-center text-purple-300 shadow-xl mb-4 relative hover:scale-105 transition-transform duration-300">
              <Sparkles size={36} className="text-purple-400 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black font-black text-[9px] px-1.5 rounded-full uppercase py-0.5">Veil</div>
            </div>
            
            <h1 className="text-3xl font-extrabold font-mono tracking-tight text-white mb-2">Veil Sandbox</h1>
            <p className="text-gray-400 max-w-md text-xs leading-relaxed mb-6">
              Enter any URL or type keywords above to see the simulated performance and anti-tracking engine in motion. Try browsing to test cases:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl w-full">
              {[
                { label: "Acid3 Web Test", url: "https://acid3.acidtests.org" },
                { label: "Hacker News Discussions", url: "https://hackernews.ycombinator.com" },
                { label: "HTML5 Test Score", url: "https://html5test.com" },
                { label: "EFF Obfuscation Test", url: "https://coveryourtracks.eff.org" }
              ].map((site, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(site.url)}
                  className="bg-[#181822]/70 hover:bg-purple-950/20 text-gray-300 border border-purple-950/50 hover:border-purple-600/50 p-2.5 rounded-xl transition-all text-xs font-medium focus:ring-1 focus:ring-purple-500"
                >
                  <div className="font-bold truncate text-[11px] font-mono">{site.label}</div>
                  <div className="text-[9px] text-gray-500 font-mono mt-0.5 truncate">{site.url.replace("https://", "")}</div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-purple-900/10 flex items-center gap-4 text-[11px] text-gray-500 font-mono">
              <span className="flex items-center gap-1"><Shield size={12} className="text-purple-400 font-semibold" /> Tracking Blocker Shield Default Active</span>
              <span>·</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-purple-300" onClick={handleStartSimDownload}><Download size={12} /> Test Download File</span>
            </div>
          </div>

        )}

        {/* WEB INSPECTOR / CONSOLE OVERLAY TOGGLE BUTTON & INTERFACE PANEL */}
        <div className="absolute bottom-2.5 right-2.5 z-40">
          <button 
            onClick={() => setInspectorOpen(!inspectorOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090b0e] hover:bg-purple-950/30 border border-purple-950/60 rounded-lg text-[11px] font-mono font-bold text-gray-400 hover:text-purple-300 shadow-lg transition-transform hover:scale-105"
            title="Toggle Web Inspector (Ctrl+Shift+I)"
          >
            <Terminal size={12} /> Console: {inspectorOpen ? "HIDE" : "SHOW"}
          </button>
        </div>

        {inspectorOpen && (
          <div className="h-44 bg-[#090b0e] border-t border-purple-950/60 flex flex-col font-mono text-[11px]">
            <div className="bg-[#12141a] px-3.5 py-1.5 border-b border-purple-950/30 flex items-center justify-between select-none shrink-0">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveInspectorTab("console")}
                  className={`font-bold transition-colors ${activeInspectorTab === "console" ? "text-purple-300 border-b-2 border-purple-500 pb-0.5" : "text-gray-500 hover:text-gray-300"}`}
                >
                  JavaScript Console
                </button>
                <button 
                  onClick={() => setActiveInspectorTab("network")}
                  className={`font-bold transition-colors ${activeInspectorTab === "network" ? "text-purple-300 border-b-2 border-purple-500 pb-0.5" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Network Headers Monitor
                </button>
              </div>
              <button onClick={() => setInspectorOpen(false)} className="text-gray-500 hover:text-gray-300">
                <X size={12} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 text-gray-400 bg-[#090b0d]">
              {activeInspectorTab === "console" ? (
                <>
                  <div className="text-gray-500">[System] Initializing WebKit JS Exec context (ES2022 standard verified)</div>
                  <div className="text-purple-400">[Injection] Custom User Rules for Canvas obf loaded: AtDocumentStart</div>
                  <div className="text-purple-400">[DNT] User preference active: Emitting "DNT: 1" header block</div>
                  <div className="text-gray-500">[Cookie] AcceptPolicy: BlockThirdPartyActive</div>
                  {preferences.canvasNoiseEnabled ? (
                    <div className="text-emerald-400">[Shield] prototype.getImageData intercepts: Injecting random high freq seed #{canvasColorSeed}</div>
                  ) : (
                    <div className="text-amber-500">[ALERT] prototype.getImageData returns raw canvas: Unique fingerprint generation vector is vulnerable.</div>
                  )}
                  {activeTab.trackersBlocked.map((tr, idx) => (
                    <div key={idx} className="text-purple-300">
                      [Blocker] Auto quarantined URL trigger matching filter store rules: <span className="text-purple-500">{tr.url}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="space-y-1.5">
                  <div className="bg-[#111] p-2 rounded border border-purple-950/10">
                    <span className="text-purple-300 font-bold block mb-1">Outgoing HTTP/S Client Headers Packet:</span>
                    <div className="grid grid-cols-[100px_1fr] text-[10px] gap-x-2 text-gray-300 font-mono">
                      <span className="text-gray-500">GET:</span> <span className="text-gray-200">{activeTab.url}</span>
                      <span className="text-gray-500">User-Agent:</span> <span className="text-purple-300 break-all">{preferences.userAgentOverride}</span>
                      <span className="text-gray-500">DNT:</span> <span className="text-emerald-400 font-bold">1 (Do Not Track Active)</span>
                      <span className="text-gray-500">Sec-Ch-Ua:</span> <span className="text-gray-400">"Not_A Brand";v="8", "Chromium";v="120"</span>
                      <span className="text-gray-500">Proxy-Route:</span> <span className="text-emerald-400">{activeProxy.id === "direct" ? "None" : `${activeProxy.type} -> ${activeProxy.host}:${activeProxy.port}`}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
