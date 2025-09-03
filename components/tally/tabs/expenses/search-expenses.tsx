import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = {
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
};

export default function SearchExpenses({ searchTerm, setSearchTerm }: Props) {
	return (
		<div className="relative mt-3">
			<Search
				className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"
				aria-hidden
			/>
			<Input
				placeholder="Search expenses or participants..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="pl-10 rounded-lg shadow-xs focus-visible:ring-2"
				aria-label="Search expenses or participants"
			/>
		</div>
	);
}
