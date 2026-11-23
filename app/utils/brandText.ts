const APPLE_BRAND_TERMS: Array<[RegExp, string]> = [
  [/\biOS\b/gi, "iOS"],
  [/\biPadOS\b/gi, "iPadOS"],
  [/\bmacOS\b/gi, "macOS"],
  [/\bwatchOS\b/gi, "watchOS"],
  [/\btvOS\b/gi, "tvOS"],
  [/\bvisionOS\b/gi, "visionOS"],
  [/\biPhone\b/gi, "iPhone"],
  [/\biPad\b/gi, "iPad"],
  [/\biMac\b/gi, "iMac"],
  [/\bMacBook\b/gi, "MacBook"],
  [/\bAirPods\b/gi, "AirPods"],
  [/\bSwiftUI\b/gi, "SwiftUI"],
  [/\bSwiftData\b/gi, "SwiftData"],
  [/\bCloudKit\b/gi, "CloudKit"],
  [/\bVoiceOver\b/gi, "VoiceOver"],
  [/\bTestFlight\b/gi, "TestFlight"],
  [/\bARKit\b/gi, "ARKit"],
  [/\bHomeKit\b/gi, "HomeKit"],
  [/\bCore Data\b/gi, "Core Data"],
  [/\bXcode\b/gi, "Xcode"],
];

/**
 * Formats an eyebrow or badge label in uppercase while preserving
 * Apple brand trademark casing (for example, "iOS APPLICATION").
 */
export function formatUppercaseLabel(text: string): string {
  let result = text.toUpperCase();
  for (const [pattern, canonical] of APPLE_BRAND_TERMS) {
    result = result.replace(pattern, canonical);
  }
  return result;
}
