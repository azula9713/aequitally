import { useCurrency } from "@/hooks/use-currency";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export default function CurrencyPicker() {
	const { currencyCode, availableCurrencies, updateCurrency } = useCurrency();

	return (
		<div>
			<div
				key={currencyCode}
				className="flex items-center justify-center space-x-2"
			>
				<Select value={currencyCode} onValueChange={updateCurrency}>
					<SelectTrigger className="min-h-10 cursor-pointer">
						<SelectValue placeholder="Select the currency" />
					</SelectTrigger>
					<SelectContent>
						{availableCurrencies.map((currency) => (
							<SelectItem
								key={currency.code}
								value={currency.code}
								className="cursor-pointer"
							>
								<div className="flex items-center gap-2">
									{currency.symbol} {currency.code}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<span className="sr-only">{currencyCode}</span>
		</div>
	);
}
