import { Doc } from "@/convex/_generated/dataModel";
import {
  SettlementTransfer,
  getParticipantBalance,
  getParticipantName,
} from "@/lib/helpers/tally.helper";

export interface ProcessedSettlementData {
  tallyMetadata: {
    name: string;
    description: string;
    date: string;
    participantCount: number;
    expenseCount: number;
    exportDate: string;
  };
  transfers: Array<{
    fromName: string;
    toName: string;
    amount: number;
  }>;
  balances: Array<{
    name: string;
    totalPaid: number;
    totalOwed: number;
    balance: number;
    status: 'owes' | 'owed' | 'settled';
  }>;
  summary: {
    totalAmount: number;
    transferCount: number;
    largestTransfer: number;
    totalToSettle: number;
  };
}

export class SettlementCSVExportService {
  /**
   * Escapes CSV field content to handle commas, quotes, and newlines
   */
  private escapeCSVField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  /**
   * Formats currency values for CSV export
   */
  private formatCurrencyForCSV(amount: number): string {
    return amount.toFixed(2);
  }

  /**
   * Processes tally data into structured format for CSV export
   */
  private processSettlementData(
    tally: Doc<"tallies">,
    transfers: SettlementTransfer[]
  ): ProcessedSettlementData {
    const now = new Date();
    
    // Process tally metadata
    const tallyMetadata = {
      name: tally.name,
      description: tally.description || 'N/A',
      date: tally.date || 'N/A',
      participantCount: tally.participants.length,
      expenseCount: tally.expenses.length,
      exportDate: now.toISOString(),
    };

    // Process transfers
    const processedTransfers = transfers.map(transfer => ({
      fromName: getParticipantName(transfer.fromParticipantId, tally),
      toName: getParticipantName(transfer.toParticipantId, tally),
      amount: transfer.amount,
    }));

    // Process participant balances
    const balances = tally.participants.map(participant => {
      const { balance, totalPaid } = getParticipantBalance(participant.userId, tally);
      const totalOwed = tally.expenses.reduce((sum, exp) => {
        const share = exp.shareBetween.find(s => s.participantId === participant.userId);
        return sum + (share ? share.amount : 0);
      }, 0);

      let status: 'owes' | 'owed' | 'settled' = 'settled';
      if (balance > 0.01) status = 'owed';
      else if (balance < -0.01) status = 'owes';

      return {
        name: participant.name,
        totalPaid,
        totalOwed,
        balance,
        status,
      };
    });

    // Calculate summary statistics
    const totalAmount = tally.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const transferCount = transfers.length;
    const largestTransfer = transfers.length > 0 
      ? Math.max(...transfers.map(t => t.amount)) 
      : 0;
    const totalToSettle = transfers.reduce((sum, t) => sum + t.amount, 0);

    const summary = {
      totalAmount,
      transferCount,
      largestTransfer,
      totalToSettle,
    };

    return {
      tallyMetadata,
      transfers: processedTransfers,
      balances,
      summary,
    };
  }

  /**
   * Generates tally information section of CSV
   */
  private generateTallyInfoSection(data: ProcessedSettlementData): string[] {
    const { tallyMetadata } = data;
    return [
      `Tally Name,${this.escapeCSVField(tallyMetadata.name)}`,
      `Description,${this.escapeCSVField(tallyMetadata.description)}`,
      `Date,${this.escapeCSVField(tallyMetadata.date)}`,
      `Total Participants,${tallyMetadata.participantCount}`,
      `Total Expenses,${tallyMetadata.expenseCount}`,
      `Export Date,${tallyMetadata.exportDate}`,
    ];
  }

  /**
   * Generates settlement transfers section of CSV
   */
  private generateTransfersSection(data: ProcessedSettlementData): string[] {
    const { transfers } = data;
    const section = ['', 'Settlement Transfers'];
    
    if (transfers.length === 0) {
      section.push('No transfers needed - all participants are settled');
      return section;
    }

    section.push('From Participant,To Participant,Amount,Transfer Type');
    
    transfers.forEach(transfer => {
      section.push(
        `${this.escapeCSVField(transfer.fromName)},${this.escapeCSVField(transfer.toName)},${this.formatCurrencyForCSV(transfer.amount)},Settlement`
      );
    });

    return section;
  }

  /**
   * Generates participant balances section of CSV
   */
  private generateBalancesSection(data: ProcessedSettlementData): string[] {
    const { balances } = data;
    const section = [
      '',
      'Participant Balances',
      'Participant Name,Total Paid,Total Owed,Balance,Status'
    ];

    balances.forEach(balance => {
      section.push(
        `${this.escapeCSVField(balance.name)},${this.formatCurrencyForCSV(balance.totalPaid)},${this.formatCurrencyForCSV(balance.totalOwed)},${this.formatCurrencyForCSV(balance.balance)},${this.escapeCSVField(balance.status)}`
      );
    });

    return section;
  }

  /**
   * Generates summary statistics section of CSV
   */
  private generateSummarySection(data: ProcessedSettlementData): string[] {
    const { summary } = data;
    return [
      '',
      'Summary',
      `Total Amount in Tally,${this.formatCurrencyForCSV(summary.totalAmount)}`,
      `Number of Transfers,${summary.transferCount}`,
      `Largest Transfer,${this.formatCurrencyForCSV(summary.largestTransfer)}`,
      `Total to Settle,${this.formatCurrencyForCSV(summary.totalToSettle)}`,
    ];
  }

  /**
   * Generates complete CSV content for settlement data
   */
  public generateSettlementCSV(
    tally: Doc<"tallies">,
    transfers: SettlementTransfer[]
  ): string {
    const data = this.processSettlementData(tally, transfers);
    
    const csvSections = [
      this.generateTallyInfoSection(data),
      this.generateTransfersSection(data),
      this.generateBalancesSection(data),
      this.generateSummarySection(data),
    ];

    // Combine all sections
    const csvLines = csvSections.flat();
    return csvLines.join('\n');
  }

  /**
   * Generates filename for CSV export
   */
  public generateFilename(tally: Doc<"tallies">): string {
    const date = new Date().toISOString().split('T')[0];
    const safeName = tally.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    return `${safeName}-settlements-${date}.csv`;
  }

  /**
   * Triggers browser download of CSV file
   */
  public downloadCSV(csvContent: string, filename: string): void {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error('Browser does not support file downloads');
      }
    } catch (error) {
      console.error('Failed to download CSV:', error);
      throw new Error('Failed to download CSV file');
    }
  }
}

// Export singleton instance
export const csvExportService = new SettlementCSVExportService();