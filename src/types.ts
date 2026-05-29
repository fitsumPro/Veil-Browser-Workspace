/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
  description: string;
}

export interface ProxyProfile {
  id: string;
  name: string;
  host: string;
  port: number;
  type: "SOCKS5" | "HTTP" | "HTTPS";
  countryCode: string;
  username?: string;
  password?: string;
  isActive: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS" | "SECURITY";
  module: "Engine" | "UI" | "Privacy" | "Proxy" | "Task" | "Network";
  message: string;
}

export interface SimulatedTab {
  id: string;
  title: string;
  url: string;
  icon: string;
  isPrivate: boolean;
  isActive: boolean;
  isLoaded: boolean;
  trackersBlocked: Array<{ name: string; url: string; category: "analytics" | "advertising" | "social" }>;
  memoryUsageMb: number;
  lastInteractionTime: number; // For Idle auto-discarding / Resource Saver
  isThrottled: boolean;
  isDiscarded: boolean;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  receivedBytes: number;
  status: "downloading" | "paused" | "completed" | "cancelled";
  speedKbps: number;
  path: string;
}

export interface BrowserPreferences {
  hardwareAcceleration: boolean;
  resourceSaverEnabled: boolean;
  autoDiscardEnabled: boolean;
  autoDiscardTimeoutMinutes: number;
  httpsOnlyMode: boolean;
  doNotTrack: boolean;
  userAgentOverride: string;
  canvasNoiseEnabled: boolean;
  webAudioProtection: boolean;
  blockThirdPartyCookies: boolean;
  clearOnExitCookies: boolean;
  clearOnExitCache: boolean;
  clearOnExitHistory: boolean;
  webInspectorEnabled: boolean;
  searchEngine: "DuckDuckGo" | "Brave Search" | "Mullvad Leta" | "SearXNG";
  homePage: string;
  fontScalePercentage: number;
  customCss: string;
}
