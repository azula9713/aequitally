import { getToastIconColor, type ToastType } from "@/lib/config/toast-config";

/**
 * Toast options that exclude manual icon color management
 * Prevents manual override of icon colors to ensure consistency
 */
export interface ToastOptions {
	description?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
	classNames?: {
		toast?: string;
		title?: string;
		description?: string;
		actionButton?: string;
		cancelButton?: string;
		closeButton?: string;
		// Explicitly exclude icon to prevent manual override
		icon?: never;
	};
}

/**
 * Enhanced toast options with automatic icon color
 */
export interface EnhancedToastOptions extends Omit<ToastOptions, "classNames"> {
	classNames?: {
		toast?: string;
		title?: string;
		description?: string;
		actionButton?: string;
		cancelButton?: string;
		closeButton?: string;
		icon: string;
	};
}

/**
 * Merge user options with automatic icon color for a specific toast type
 * @param type - The toast type
 * @param options - User-provided toast options
 * @returns Enhanced options with automatic icon color
 */
export const mergeToastOptions = (
	type: ToastType,
	options: ToastOptions = {},
): EnhancedToastOptions => {
	const iconColor = getToastIconColor(type);

	return {
		...options,
		classNames: {
			...options.classNames,
			icon: iconColor,
		},
	};
};

/**
 * Create a standardized toast with automatic icon color management
 * @param type - The toast type
 * @param message - The toast message
 * @param options - Optional toast configuration
 * @returns The enhanced options ready for Sonner
 */
export const createStandardToast = (
	type: ToastType,
	message: string,
	options?: ToastOptions,
): [string, EnhancedToastOptions] => {
	return [message, mergeToastOptions(type, options)];
};
