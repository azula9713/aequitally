import { ArrowUpDown, Calendar, ListFilter, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
  groupBy: string;
  setGroupBy: (groupBy: "participant" | "date" | "none") => void;
  sortBy: string;
  setSortBy: (
    sortBy: "amount" | "participants" | "date" | "description"
  ) => void;
  sortOrder: string;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
};

export default function SortExpenses({
  groupBy,
  setGroupBy,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-medium md:text-sm"
            aria-label="Change group by"
          >
            <ListFilter className="size-3.5" />
            {groupBy}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setGroupBy("participant")}>
            <Users className="mr-2 size-3.5" /> Participant
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGroupBy("date")}>
            <Calendar className="mr-2 size-3.5" /> Date
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGroupBy("none")}>
            None
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-medium md:text-sm"
            aria-label="Change sort by"
          >
            <ArrowUpDown className="size-3.5" />
            {sortBy} ({sortOrder})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortBy("date")}>
            Date
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("amount")}>
            Amount
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("participants")}>
            No. of participants
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("description")}>
            Description
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Toggle order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
