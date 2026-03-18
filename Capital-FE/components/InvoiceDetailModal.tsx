import { X, Calendar, User, FileText, IndianRupee } from "lucide-react";

interface InvoiceItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string | null;
  unit_price: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

interface InvoiceDetail {
  invoice_no: string;
  invoice_date: string;
  due_date: string | null;
  status: string;
  total_amount: number;
  paid_amount: number;
  payment_terms_days: number | null;
  po_reference?: string | null;
  po_number?: string | null;
  grn_number?: string | null;
  tds_deducted?: number | null;
  customer?: {
    company_name: string;
    billing_address_line1: string;
    city: string;
    email: string;
    bank_name?: string | null;
    bank_account_no?: string | null;
    bank_ifsc?: string | null;
    bank_branch?: string | null;
  };
  vendor?: {
    company_name: string;
    billing_address_line1: string;
    city: string;
    email: string;
    bank_name?: string | null;
    bank_account_no?: string | null;
    bank_ifsc?: string | null;
    bank_branch?: string | null;
  };
  items: InvoiceItem[];
}

export default function InvoiceDetailModal({ 
  invoice, 
  onClose,
  type
}: { 
  invoice: InvoiceDetail; 
  onClose: () => void;
  type: 'receivables' | 'payables'
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const entity = type === 'receivables' ? invoice.customer : invoice.vendor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background border border-border w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Invoice Details
            </h2>
            <p className="text-sm text-foreground/40">Reference #{invoice.invoice_no}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-background rounded-sm transition-colors border border-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 mt-1 text-foreground/20" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-bold">
                    {type === 'receivables' ? 'Customer' : 'Vendor'}
                  </p>
                  <p className="text-sm font-semibold">{entity?.company_name}</p>
                  <p className="text-xs text-foreground/40">{entity?.billing_address_line1}, {entity?.city}</p>
                  <p className="text-xs text-foreground/40">{entity?.email}</p>
                </div>
              </div>
              
              {/* Bank Details Area */}
              {(entity?.bank_name || entity?.bank_account_no) && (
                <div className="p-3 bg-primary/5 rounded-sm border border-primary/10 space-y-1">
                  <p className="text-[9px] uppercase tracking-wider text-primary font-bold">Settlement Bank Info</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-foreground/40 block">Bank</span>
                      <span className="font-medium">{entity.bank_name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-foreground/40 block">A/C No</span>
                      <span className="font-medium">{entity.bank_account_no || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-foreground/40 block">IFSC</span>
                      <span className="font-medium">{entity.bank_ifsc || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-foreground/40 block">Branch</span>
                      <span className="font-medium">{entity.bank_branch || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 mt-1 text-foreground/20" />
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-bold">Timeline & Terms</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                        <span className="text-xs bg-foreground/5 px-2 py-0.5 rounded-full text-foreground/60 border border-foreground/10">
                            Issued: {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                        </span>
                        <span className="text-xs bg-error/5 px-2 py-0.5 rounded-full text-error/60 border border-error/10">
                            Due: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : 'N/A'}
                        </span>
                        {invoice.payment_terms_days && (
                            <span className="text-xs bg-accent/5 px-2 py-0.5 rounded-full text-accent/60 border border-accent/10">
                                {invoice.payment_terms_days} Days Net
                            </span>
                        )}
                    </div>
                  </div>

                  {/* References Section */}
                  <div className="grid grid-cols-2 gap-2">
                    {invoice.po_number && (
                        <div>
                            <p className="text-[9px] uppercase text-foreground/40 font-bold">PO Number</p>
                            <p className="text-xs font-medium">{invoice.po_number}</p>
                        </div>
                    )}
                    {invoice.grn_number && (
                        <div>
                            <p className="text-[9px] uppercase text-foreground/40 font-bold">GRN Ref</p>
                            <p className="text-xs font-medium">{invoice.grn_number}</p>
                        </div>
                    )}
                    {invoice.po_reference && (
                        <div>
                            <p className="text-[9px] uppercase text-foreground/40 font-bold">PO Reference</p>
                            <p className="text-xs font-medium">{invoice.po_reference}</p>
                        </div>
                    )}
                    {type === 'payables' && invoice.tds_deducted !== undefined && (
                        <div>
                            <p className="text-[9px] uppercase text-error/60 font-bold">TDS Deduction</p>
                            <p className="text-xs font-medium text-error">{formatCurrency(Number(invoice.tds_deducted))}</p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-sm border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/50 border-b border-border text-[10px] uppercase font-bold text-foreground/40">
                <tr>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-2 py-3 text-center">Qty</th>
                  <th className="px-2 py-3 text-center">Unit</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-2 py-3 text-right">CGST</th>
                  <th className="px-2 py-3 text-right">SGST</th>
                  <th className="px-2 py-3 text-right">IGST</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-background/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.item_name}</td>
                    <td className="px-2 py-3 text-center">{Number(item.quantity)}</td>
                    <td className="px-2 py-3 text-center text-xs text-foreground/40">{item.unit || '-'}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(Number(item.unit_price))}</td>
                    <td className="px-2 py-3 text-right text-[10px] text-foreground/60">{formatCurrency(Number(item.cgst))}</td>
                    <td className="px-2 py-3 text-right text-[10px] text-foreground/60">{formatCurrency(Number(item.sgst))}</td>
                    <td className="px-2 py-3 text-right text-[10px] text-foreground/60">{formatCurrency(Number(item.igst))}</td>
                    <td className="px-4 py-3 text-right font-bold">{formatCurrency(Number(item.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/40">Subtotal</span>
                <span>{formatCurrency(Number(invoice.total_amount))}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-2 text-primary">
                <span>Total Amount</span>
                <span className="flex items-center">
                   {formatCurrency(Number(invoice.total_amount))}
                </span>
              </div>
              {Number(invoice.paid_amount) > 0 && (
                <div className="flex justify-between text-xs text-accent">
                  <span>Paid to Date</span>
                  <span>- {formatCurrency(Number(invoice.paid_amount))}</span>
                </div>
              )}
               <div className="flex justify-between text-sm font-bold text-error bg-error/5 p-2 rounded-sm border border-error/10">
                <span>Balance Due</span>
                <span>{formatCurrency(Number(invoice.total_amount) - Number(invoice.paid_amount))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
