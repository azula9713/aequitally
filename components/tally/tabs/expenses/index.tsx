import { useQuery } from "convex/react";
import { Plus, Receipt } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Doc } from "@/convex/_generated/dataModel";
import { getParticipantName } from "@/lib/helpers/tally.helper";

import ExpenseModal from "../../modals/expense/modal";

import ExpenseDetails from "./expense-details";
import SearchExpenses from "./search-expenses";
import SortExpenses from "./sort-expenses";
import DeleteExpenseModal from "../../modals/delete-expense/modal";
import EditExpenseConfirmationModal from "../../modals/edit-expense-confirmation/modal";

type Props = {
  tally: Doc<"tallies">;
  setAddExpenseOpen: (open: boolean) => void;
  onCreateExpenseWithDefaults?: (defaultPaidBy: string) => void;
  userId?: string;
};

export default function ExpensesTab({
  tally,
  setAddExpenseOpen,
  onCreateExpenseWithDefaults,
  userId,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState<"participant" | "date" | "none">(
    "participant"
  );
  const [sortBy, setSortBy] = useState<
    "amount" | "participants" | "date" | "description"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteExpenseOpen, setDeleteExpenseOpen] = useState(false);
  const [editingExpenseOpen, setEditingExpenseOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<
    Doc<"tallies">["expenses"][number] | null
  >(null);

  // Query to check if the selected expense has settled settlements

  const openDeleteExpense = (expense: Doc<"tallies">["expenses"][number]) => {
    setSelectedExpense(expense);
    setDeleteExpenseOpen(true);
  };

  const openEditExpense = (expense: Doc<"tallies">["expenses"][number]) => {
    setSelectedExpense(expense);
    // Check if expense has settled settlements first
    // This will trigger the hasSettledSettlements query
    // The useEffect will handle showing either the confirmation dialog or allowing the edit
  };

  // Handle the edit confirmation logic
  useEffect(() => {
    if (
      selectedExpense &&
      !editingExpenseOpen &&
      !confirmEditOpen &&
      !deleteExpenseOpen
    ) {
      // Allow direct editing for expenses without settled settlements
      setEditingExpenseOpen(true);
    }
  }, [selectedExpense, editingExpenseOpen, confirmEditOpen, deleteExpenseOpen]);

  const handleCreateNewExpense = () => {
    setConfirmEditOpen(false);
    // Use the callback to create a new expense with the defaultPaidBy from the blocked expense
    if (selectedExpense && onCreateExpenseWithDefaults) {
      onCreateExpenseWithDefaults(selectedExpense.paidBy);
    } else {
      // Fallback to regular add expense
      setAddExpenseOpen(true);
    }
    setSelectedExpense(null);
  };

  const handleCancelEdit = () => {
    setConfirmEditOpen(false);
    setSelectedExpense(null);
  };

  const filteredExpenses = useMemo(() => {
    if (!searchTerm.trim()) return tally.expenses;

    return tally.expenses.filter(
      (expense) =>
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getParticipantName(expense.paidBy, tally)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [tally.expenses, searchTerm, tally]);

  const compareExpenses = (
    a: Doc<"tallies">["expenses"][number],
    b: Doc<"tallies">["expenses"][number]
  ) => {
    let cmp = 0;
    switch (sortBy) {
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "participants":
        cmp = a.shareBetween.length - b.shareBetween.length;
        break;
      case "date":
        cmp = (a.date || "").localeCompare(b.date || "");
        break;
      case "description":
        cmp = (a.description || "").localeCompare(b.description || "");
        break;
      default:
        cmp = 0;
    }
    return sortOrder === "asc" ? cmp : -cmp;
  };

  const groupedEntries = useMemo(() => {
    const list = filteredExpenses.slice().sort(compareExpenses);
    if (groupBy === "none") {
      return [["All expenses", list]] as [string, typeof list][];
    }
    const map = list.reduce<Record<string, typeof list>>((acc, e) => {
      const key =
        groupBy === "participant"
          ? getParticipantName(e.paidBy, tally)
          : new Date(e.date || new Date()).toLocaleDateString();
      acc[key] = acc[key] ? [...acc[key], e] : [e];
      return acc;
    }, {});
    // Sort groups alphabetically; for date grouping, rely on Date parse from label as fallback
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredExpenses, groupBy, sortBy, sortOrder, tally]);

  return (
    <TabsContent value="expenses" className="mt-4">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row items-start md:items-center justify-between">
            <div>
              <CardTitle className="text-base tracking-tight">
                Expenses
              </CardTitle>
              <CardDescription className="mt-0.5">
                {filteredExpenses.length !== tally.expenses.length
                  ? `${filteredExpenses.length} of ${tally.expenses.length} expenses`
                  : `Grouped by ${groupBy}`}
              </CardDescription>
            </div>
            <SortExpenses
              {...{
                groupBy,
                setGroupBy,
                sortBy,
                setSortBy,
                sortOrder,
                setSortOrder,
              }}
            />
          </div>
          {tally.expenses.length > 5 && (
            <SearchExpenses {...{ searchTerm, setSearchTerm }} />
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredExpenses.length === 0 && searchTerm.trim() ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No expenses found matching "{searchTerm}"
              </p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-10">
              <Receipt className="mx-auto text-muted-foreground size-10 mb-3" />
              <div className="space-y-1">
                <h3 className="font-medium text-base">No expenses yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start by adding your first expense
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setAddExpenseOpen(true)}
                className="mt-4"
              >
                <Plus className="mr-2 size-4" />
                Add Expense
              </Button>
            </div>
          ) : (
            groupedEntries.map(([group, list]) => (
              <div key={group} className="space-y-3">
                <Badge className="sticky top-0 z-10">{group}</Badge>
                <div className="space-y-3">
                  {list.map((expense) => {
                    const payer = getParticipantName(expense.paidBy, tally);
                    const sharedCount = expense.shareBetween.length;
                    const perHead = expense.amount / (sharedCount || 1);
                    return (
                      <ExpenseDetails
                        {...{
                          expense,
                          perHead,
                          payer,
                          sharedCount,
                          openEditExpense: () => openEditExpense(expense),
                          openDeleteExpense: () => openDeleteExpense(expense),
                        }}
                        key={expense.id}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      {selectedExpense && (
        <DeleteExpenseModal
          {...{
            open: deleteExpenseOpen,
            setOpen: (o) => {
              setDeleteExpenseOpen(o);
              if (!o) setSelectedExpense(null);
            },
            tally,
            expense: selectedExpense,
            userId,
          }}
        />
      )}
      {selectedExpense && (
        <ExpenseModal
          {...{
            addExpenseOpen: editingExpenseOpen,
            setAddExpenseOpen: (o) => {
              setEditingExpenseOpen(o);
              if (!o) setSelectedExpense(null);
            },
            editingExpense: true,
            tally,
            userId,
            expense: selectedExpense,
          }}
        />
      )}
      {selectedExpense && (
        <EditExpenseConfirmationModal
          open={confirmEditOpen}
          setOpen={(open) => {
            setConfirmEditOpen(open);
            if (!open) {
              handleCancelEdit();
            }
          }}
          expense={selectedExpense}
          onCreateNew={handleCreateNewExpense}
        />
      )}
    </TabsContent>
  );
}
