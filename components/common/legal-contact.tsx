import Link from "next/link";

import { Button } from "../ui/button";
import { UrlObject } from "url";

type Props = {
	primaryLink?: UrlObject;
	primaryText?: string;
	secondaryLink?: UrlObject;
	secondaryText?: string;
};

export default function LegalContact({
	primaryLink,
	primaryText,
	secondaryLink,
	secondaryText,
}: Props) {
	return (
		<div className="flex flex-col sm:flex-row gap-4">
			{primaryLink && primaryText && (
				<Button asChild className="w-full sm:w-auto" variant="default">
					<Link href={primaryLink}>{primaryText}</Link>
				</Button>
			)}
			{secondaryLink && secondaryText && (
				<Button asChild className="w-full sm:w-auto" variant="default">
					<Link href={secondaryLink}>{secondaryText}</Link>
				</Button>
			)}
		</div>
	);
}
