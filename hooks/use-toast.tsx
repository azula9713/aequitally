import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import {
	createStandardToast,
	type ToastOptions,
} from "@/lib/utils/toast-utils";

export interface UseToastReturn {
	success: (message: string, options?: ToastOptions) => void;
	error: (message: string, options?: ToastOptions) => void;
	warning: (message: string, options?: ToastOptions) => void;
	info: (message: string, options?: ToastOptions) => void;
	loading: (message: string, options?: ToastOptions) => void;
}

export const useToast = (): UseToastReturn => {
	const success = useCallback((message: string, options?: ToastOptions) => {
		const [msg, enhancedOptions] = createStandardToast(
			"success",
			message,
			options,
		);
		sonnerToast.success(msg, enhancedOptions);
	}, []);

	const error = useCallback((message: string, options?: ToastOptions) => {
		const [msg, enhancedOptions] = createStandardToast(
			"error",
			message,
			options,
		);
		sonnerToast.error(msg, enhancedOptions);
	}, []);

	const warning = useCallback((message: string, options?: ToastOptions) => {
		const [msg, enhancedOptions] = createStandardToast(
			"warning",
			message,
			options,
		);
		sonnerToast.warning(msg, enhancedOptions);
	}, []);

	const info = useCallback((message: string, options?: ToastOptions) => {
		const [msg, enhancedOptions] = createStandardToast(
			"info",
			message,
			options,
		);
		sonnerToast.info(msg, enhancedOptions);
	}, []);

	const loading = useCallback((message: string, options?: ToastOptions) => {
		const [msg, enhancedOptions] = createStandardToast(
			"loading",
			message,
			options,
		);
		sonnerToast.loading(msg, enhancedOptions);
	}, []);

	return {
		success,
		error,
		warning,
		info,
		loading,
	};
};
