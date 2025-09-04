interface WebApplicationSchema {
	"@context": "https://schema.org";
	"@type": "WebApplication";
	name: string;
	description: string;
	url: string;
	applicationCategory: string;
	operatingSystem?: string;
	browserRequirements?: string;
	offers: {
		"@type": "Offer";
		price: string;
		priceCurrency: string;
		availability: string;
	};
	author: {
		"@type": "Person" | "Organization";
		name: string;
	};
	publisher: {
		"@type": "Organization";
		name: string;
		url: string;
	};
	dateCreated?: string;
	dateModified?: string;
	inLanguage: string;
	keywords: string[];
}

interface OrganizationSchema {
	"@context": "https://schema.org";
	"@type": "Organization";
	name: string;
	url: string;
	description: string;
	founder: {
		"@type": "Person";
		name: string;
	};
	foundingDate?: string;
	sameAs?: string[];
}

interface BreadcrumbSchema {
	"@context": "https://schema.org";
	"@type": "BreadcrumbList";
	itemListElement: Array<{
		"@type": "ListItem";
		position: number;
		name: string;
		item: string;
	}>;
}

export function WebApplicationStructuredData() {
	const schema: WebApplicationSchema = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "Aequitally",
		description:
			"Track and split expenses easily with friends and groups. Fair settlement calculations, real-time collaboration, and secure expense management.",
		url: "https://aequitally.vercel.app",
		applicationCategory: "FinanceApplication",
		operatingSystem: "Any",
		browserRequirements: "Modern web browser with JavaScript enabled",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
		},
		author: {
			"@type": "Person",
			name: "Solo Developer",
		},
		publisher: {
			"@type": "Organization",
			name: "Aequitally",
			url: "https://aequitally.vercel.app",
		},
		dateCreated: "2024-01-01",
		dateModified: new Date().toISOString().split("T")[0],
		inLanguage: "en-US",
		keywords: [
			"expense sharing",
			"bill splitting",
			"group expenses",
			"settlement calculator",
			"expense tracker",
			"shared expenses",
			"financial management",
			"collaborative finance",
		],
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe JSON data for structured data
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

export function OrganizationStructuredData() {
	const schema: OrganizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Aequitally",
		url: "https://aequitally.vercel.app",
		description:
			"A simple and secure expense sharing application that helps groups track and split expenses fairly.",
		founder: {
			"@type": "Person",
			name: "Solo Developer",
		},
		foundingDate: "2024",
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe JSON data for structured data
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

interface BreadcrumbProps {
	items: Array<{
		name: string;
		url: string;
	}>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbProps) {
	const schema: BreadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `https://aequitally.vercel.app${item.url}`,
		})),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe JSON data for structured data
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

interface SoftwareApplicationSchema {
	"@context": "https://schema.org";
	"@type": "SoftwareApplication";
	name: string;
	description: string;
	url: string;
	applicationCategory: string;
	operatingSystem: string;
	offers: {
		"@type": "Offer";
		price: string;
		priceCurrency: string;
	};
	aggregateRating?: {
		"@type": "AggregateRating";
		ratingValue: string;
		bestRating: string;
		worstRating: string;
		ratingCount: string;
	};
	author: {
		"@type": "Person";
		name: string;
	};
	datePublished: string;
	softwareVersion: string;
	requirements: string;
	fileSize?: string;
	screenshot?: string[];
}

export function SoftwareApplicationStructuredData() {
	const schema: SoftwareApplicationSchema = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Aequitally",
		description:
			"Free expense sharing and bill splitting web application. Track shared expenses, calculate fair settlements, and manage group finances easily.",
		url: "https://aequitally.vercel.app",
		applicationCategory: "Business/Finance",
		operatingSystem: "Web Browser",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		author: {
			"@type": "Person",
			name: "Solo Developer",
		},
		datePublished: "2024-01-01",
		softwareVersion: "1.0",
		requirements: "Modern web browser, Internet connection",
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe JSON data for structured data
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}
