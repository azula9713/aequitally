export const defaultCookiePreferences = {
	essential: true,
	analytics: true,
	marketing: true,
	preferences: true,
};

export const cookieTypes = [
	{
		name: "Essential Cookies",
		key: "essential",
		required: true,
		description:
			"These cookies are necessary for the website to function and cannot be switched off.",
		examples: [
			"Security tokens to prevent CSRF attacks",
			"User preferences for theme",
		],
	},
	{
		name: "Analytics Cookies",
		key: "analytics",
		required: false,
		description:
			"These cookies help us understand how visitors interact with our website.",
		examples: [
			"Google Analytics for usage statistics",
			"Page view tracking and user journeys",
			"Feature usage and performance metrics",
			"Error tracking and bug reports",
		],
	},
	{
		name: "Marketing Cookies",
		key: "marketing",
		required: false,
		description:
			"These cookies are used to track visitors across websites for marketing purposes.",
		examples: [
			"Social media tracking pixels",
			"Advertising campaign performance",
			"Retargeting and conversion tracking",
			"Cross-platform user identification",
		],
	},
	{
		name: "Preference Cookies",
		key: "preferences",
		required: false,
		description:
			"These cookies remember your choices and preferences to improve your experience.",
		examples: [
			"Language and region preferences",
			"Display settings and layout choices",
			"Notification preferences",
			"Recently used features and shortcuts",
		],
	},
];
