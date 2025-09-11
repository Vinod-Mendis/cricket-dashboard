/** @format */

export function getTextColor(bgColor: string): "text-black" | "text-white" {
  // Remove "#" if present
  const hex = bgColor.replace("#", "");

  if (hex.length !== 6) {
    throw new Error("Invalid hex color. Use format #RRGGBB");
  }

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate brightness using YIQ formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "text-black" : "text-white";
}
