/**
 * Toast color configuration for automatic icon color management
 * Maps toast types to their corresponding Tailwind CSS color classes
 */

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastColorConfig {
	success: string;
	error: string;
	warning: string;
	info: string;
	loading: string;
}

/**
 * Default color mappings for toast types
 * Uses design system colors that work in both light and dark themes
 */
export const TOAST_COLORS: ToastColorConfig = {
	success: "text-primary",
	error: "text-destructive",
	warning: "text-yellow-500",
	info: "text-blue-500",
	loading: "text-muted-foreground",
};

/**
 * Get icon color class for a specific toast type
 * @param type - The toast type
 * @returns The corresponding Tailwind CSS color class
 */
export const getToastIconColor = (type: ToastType): string => {
	return TOAST_COLORS[type] ?? "";
};
