import { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  RefreshCw,
  FileText,
  Plus,
  Printer,
  Send,
} from 'lucide-react';
import { supabase, type ContactRequest } from '../lib/supabase';
import logoEntreprise from '../../image/logo_entreprise.jpeg';

const statusConfig = {
  new: { label: 'Nouveau', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  read: { label: 'Lu', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  treated: { label: 'Traité', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
};

type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

type QuoteDraft = {
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyNif: string;
  companyRccm: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  subject: string;
  paymentTerms: string;
  executionDelay: string;
  discount: number;
  taxRate: number;
  notes: string;
  clauses: string;
  companySignatory: string;
  clientSignatory: string;
  signPlace: string;
  signDate: string;
  items: QuoteItem[];
};

const defaultClauses =
  '1. Le present devis constitue une proposition contractuelle valable jusqu\'a la date de validite indiquee.\n' +
  '2. Toute execution de travaux demarre apres acceptation ecrite du client et versement de l\'acompte convenu.\n' +
  '3. Les delais peuvent etre ajustes en cas de force majeure ou de modification du perimetre.\n' +
  '4. Toute prestation supplementaire fera l\'objet d\'un avenant chiffre et valide par les parties.\n' +
  '5. Le client s\'engage a respecter les clauses contractuelles, les echeances de paiement et les conditions d\'acces au chantier.\n' +
  '6. En cas de retard de paiement, des penalites peuvent etre appliquees conformement a la reglementation en vigueur.';

const quoteFieldClass =
  'w-full border-0 border-b border-slate-300 rounded-none px-0 py-1.5 text-sm text-slate-800 bg-transparent focus:border-cyan-600 focus:ring-0 outline-none';

const quoteTextareaClass =
  'w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 bg-transparent focus:border-cyan-600 focus:ring-0 outline-none';

const generateFallbackQuoteNumber = (date: Date) => {
  const year = date.getFullYear();
  const suffix = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`.padStart(6, '0');
  return `DV-${year}-${suffix}`;
};

const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createQuoteDraft = (request?: ContactRequest): QuoteDraft => {
  const now = new Date();
  const valid = new Date(now);
  valid.setDate(valid.getDate() + 15);

  return {
    quoteNumber: generateFallbackQuoteNumber(now),
    issueDate: formatDateForInput(now),
    validUntil: formatDateForInput(valid),
    companyName: 'SOCIETE TELICO FROID DE GUINEE',
    companyAddress: 'Sonfonia T7, Conakry, Guinee',
    companyPhone: '+224 613 51 76 53 / +224 662 73 20 38',
    companyEmail: 'telicofroid.sarlu@gmail.com',
    companyNif: '102639457',
    companyRccm: 'GN.TCC.2026.B.02875',
    clientName: request?.name ?? '',
    clientAddress: '',
    clientPhone: request?.phone ?? '',
    clientEmail: request?.email ?? '',
    subject: request?.subject?.trim() || 'Demande de devis',
    paymentTerms: 'Acompte 50% a la commande, solde 50% a la reception.',
    executionDelay: 'Delai indicatif: 3 a 7 jours ouvrables apres validation.',
    discount: 0,
    taxRate: 18,
    notes: request?.message ?? '',
    clauses: defaultClauses,
    companySignatory: 'Direction TELICO FROID',
    clientSignatory: request?.name ?? 'Le Client',
    signPlace: 'Conakry',
    signDate: formatDateForInput(now),
    items: [
      {
        id: crypto.randomUUID(),
        description: request?.subject?.trim() || 'Prestation de climatisation',
        quantity: 1,
        unit: 'Forfait',
        unitPrice: 0,
      },
    ],
  };
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'GNF',
    maximumFractionDigits: 0,
  }).format(amount);

export default function RequestsManager() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'quote'>('all');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quote, setQuote] = useState<QuoteDraft>(() => createQuoteDraft());
  const [mailWarning, setMailWarning] = useState('');
  const [quoteNumberWarning, setQuoteNumberWarning] = useState('');
  const quotePrintRef = useRef<HTMLElement | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: ContactRequest['status']) => {
    await supabase.from('contact_requests').update({ status }).eq('id', id);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (selected?.id === id) setSelected((s) => s && { ...s, status });
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Supprimer cette demande ?')) return;
    await supabase.from('contact_requests').delete().eq('id', id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openQuoteBuilder = async (request: ContactRequest) => {
    const draft = createQuoteDraft(request);
    setQuote(draft);
    setQuoteOpen(true);
    setMailWarning('');
    setQuoteNumberWarning('');

    const { data, error } = await supabase.rpc('get_next_quote_number');

    if (!error && typeof data === 'string' && data.trim()) {
      setQuote((prev) => ({ ...prev, quoteNumber: data }));
      return;
    }

    setQuoteNumberWarning('Numérotation globale indisponible: appliquez la migration Supabase du compteur de devis pour garantir la sequence entre tous les admins.');
  };

  const updateItem = (id: string, patch: Partial<QuoteItem>) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const addItem = () => {
    setQuote((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          description: '',
          quantity: 1,
          unit: 'Unite',
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((item) => item.id !== id) : prev.items,
    }));
  };

  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = Math.max(0, quote.discount || 0);
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableBase * ((quote.taxRate || 0) / 100);
  const total = taxableBase + taxAmount;

  const printQuote = async () => {
    if (!quotePrintRef.current) {
      return;
    }

    const printableNode = quotePrintRef.current.cloneNode(true) as HTMLElement;

    printableNode.querySelectorAll('input, textarea').forEach((field) => {
      const replacement = document.createElement(field.tagName === 'TEXTAREA' ? 'div' : 'span');
      replacement.className = field.className;
      replacement.textContent = (field as HTMLInputElement | HTMLTextAreaElement).value || ' ';
      replacement.setAttribute('style', 'display:block; white-space:pre-wrap; min-height:1.25rem;');
      field.replaceWith(replacement);
    });

    printableNode.querySelectorAll('.no-print').forEach((node) => node.remove());

    const printWindow = window.open('', '_blank', 'width=1024,height=900');

    if (!printWindow) {
      alert('Impossible d\'ouvrir la fenetre d\'impression. Verifiez si le navigateur bloque les popups.');
      return;
    }

    const inheritedStyles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((node) => node.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <title>${quote.quoteNumber}</title>
          ${inheritedStyles}
          <style>
            @page { size: A4; margin: 12mm; }
            html, body { margin: 0; padding: 0; background: #fff; color: #0f172a; font-family: Arial, Helvetica, sans-serif; }
            body { font-size: 12px; line-height: 1.45; }
            .quote-print-root { width: 100%; max-width: none; margin: 0; padding: 0; box-shadow: none; border-radius: 0; }
            .quote-print-root * { box-sizing: border-box; }
            .quote-print-root table { width: 100%; border-collapse: collapse; }
            .quote-print-root th, .quote-print-root td { border-color: #cbd5e1; }
            .quote-print-root section, .quote-print-root header, .quote-print-root tr { break-inside: avoid; page-break-inside: avoid; }
            .quote-print-root input, .quote-print-root textarea, .quote-print-root span, .quote-print-root div { font: inherit; color: inherit; }
            .quote-print-root img { display: block; max-width: 100%; }
          </style>
        </head>
        <body>
          ${printableNode.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();

    const waitForImages = Array.from(printWindow.document.images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    );

    const waitForStylesheets = Array.from(
      printWindow.document.querySelectorAll('link[rel="stylesheet"]')
    ).map(
      (link) =>
        new Promise<void>((resolve) => {
          const stylesheetLink = link as HTMLLinkElement;
          if (stylesheetLink.sheet) {
            resolve();
            return;
          }
          stylesheetLink.onload = () => resolve();
          stylesheetLink.onerror = () => resolve();
        })
    );

    await Promise.all([...waitForImages, ...waitForStylesheets]);

    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const sendQuoteDirect = () => {
    setMailWarning('');

    const recipientEmail = quote.clientEmail.trim();

    if (!recipientEmail) {
      alert('Veuillez renseigner l\'email du client avant l\'envoi.');
      return;
    }

    const subject = `Devis ${quote.quoteNumber} - ${quote.companyName}`;
    const body = [
      `Bonjour ${quote.clientName || 'Madame, Monsieur'},`,
      '',
      `Veuillez trouver votre devis ${quote.quoteNumber}.`,
      `Objet: ${quote.subject}`,
      `Total TTC: ${formatCurrency(total)}`,
      `Validite: ${quote.validUntil}`,
      '',
      `Cordialement,`,
      `${quote.companyName}`,
      `${quote.companyPhone}`,
      `${quote.companyEmail}`,
      '',
      'Le detail complet est disponible sur le PDF joint.',
    ].join('\n');

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const counts = {
    new: requests.filter((r) => r.status === 'new').length,
    read: requests.filter((r) => r.status === 'read').length,
    treated: requests.filter((r) => r.status === 'treated').length,
  };

  const isQuoteRequest = (request: ContactRequest) =>
    !request.subject?.trim() || request.subject.toLowerCase().includes('devis');

  const visibleRequests =
    filter === 'quote' ? requests.filter((request) => isQuoteRequest(request)) : requests;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(Object.entries(counts) as [ContactRequest['status'], number][]).map(([status, count]) => (
          <div key={status} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <p className="text-gray-400 text-sm">{statusConfig[status].label}</p>
            <p className="text-3xl font-black text-white">{count}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Demandes de devis ({visibleRequests.length})</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('quote')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filter === 'quote'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-800 text-gray-400 border-slate-700 hover:text-white'
            }`}
          >
            Devis
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filter === 'all'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-800 text-gray-400 border-slate-700 hover:text-white'
            }`}
          >
            Toutes
          </button>
          <button onClick={load} className="text-gray-400 hover:text-cyan-400 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : visibleRequests.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucune demande disponible pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-slate-800 rounded-2xl p-5 border transition-all cursor-pointer hover:border-cyan-500/40 ${
                req.status === 'new' ? 'border-blue-500/40' : 'border-slate-700'
              }`}
              onClick={() => {
                setSelected(req);
                if (req.status === 'new') updateStatus(req.id, 'read');
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white font-semibold">{req.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[req.status].color}`}
                    >
                      {statusConfig[req.status].label}
                    </span>
                    {req.subject && (
                      <span className="text-cyan-400 text-xs">{req.subject}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1 truncate">{req.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-gray-500 text-xs">{fmt(req.created_at)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRequest(req.id);
                    }}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-slate-800 rounded-3xl max-w-lg w-full border border-slate-600 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">{selected.name}</h3>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${statusConfig[selected.status].color}`}
              >
                {statusConfig[selected.status].label}
              </span>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              {selected.email && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <a href={`mailto:${selected.email}`} className="hover:text-cyan-400">
                    {selected.email}
                  </a>
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <a href={`tel:${selected.phone}`} className="hover:text-cyan-400">
                    {selected.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4 text-cyan-400" />
                {fmt(selected.created_at)}
              </div>
              {selected.subject && (
                <p className="text-cyan-400 font-semibold">{selected.subject}</p>
              )}
            </div>

            <div className="bg-slate-700 rounded-xl p-4 mb-6">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openQuoteBuilder(selected)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-sm font-semibold hover:bg-cyan-500/25 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Creer un devis
              </button>
              {(['new', 'read', 'treated'] as ContactRequest['status'][]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selected.status === s
                      ? `border ${statusConfig[s].color}`
                      : 'bg-slate-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {s === 'treated' && <CheckCircle className="w-4 h-4" />}
                  {s === 'read' && <Eye className="w-4 h-4" />}
                  {statusConfig[s].label}
                </button>
              ))}
              <button
                onClick={() => deleteRequest(selected.id)}
                className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-semibold hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {quoteOpen && (
        <div
          className="print-overlay fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-auto"
          onClick={() => setQuoteOpen(false)}
        >
          <div
            className="print-container max-w-6xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="no-print flex items-center justify-between mb-3">
              <h3 className="text-xl font-black text-white">Edition du devis</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuoteOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-600 text-gray-300 hover:text-white"
                >
                  Fermer
                </button>
                <button
                  onClick={sendQuoteDirect}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Envoyer direct
                </button>
                <button
                  onClick={printQuote}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer / PDF
                </button>
              </div>
            </div>

            {mailWarning && <p className="no-print mb-2 text-xs text-amber-200">{mailWarning}</p>}
            {quoteNumberWarning && <p className="no-print mb-2 text-xs text-rose-200">{quoteNumberWarning}</p>}

            <article ref={quotePrintRef} className="quote-print-root bg-white text-slate-900 rounded-lg p-6 sm:p-10 shadow-2xl max-w-[210mm] mx-auto">
              <header className="pb-5 mb-6 border-b-2 border-slate-800">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={logoEntreprise}
                      alt="Logo entreprise"
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs tracking-[0.22em] font-semibold text-slate-500">STFG</p>
                      <h2 className="text-3xl font-black text-slate-900 leading-tight">DEVIS</h2>
                      <p className="text-sm text-slate-600 mt-1">Climatisation, ventilation et isolation thermique</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full md:w-[320px]">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">
                      Numero
                      <input
                        className={quoteFieldClass}
                        value={quote.quoteNumber}
                        onChange={(e) => setQuote((prev) => ({ ...prev, quoteNumber: e.target.value }))}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-[11px] uppercase tracking-wider text-slate-500">
                        Emission
                        <input
                          type="date"
                          className={quoteFieldClass}
                          value={quote.issueDate}
                          onChange={(e) => setQuote((prev) => ({ ...prev, issueDate: e.target.value }))}
                        />
                      </label>
                      <label className="text-[11px] uppercase tracking-wider text-slate-500">
                        Validite
                        <input
                          type="date"
                          className={quoteFieldClass}
                          value={quote.validUntil}
                          onChange={(e) => setQuote((prev) => ({ ...prev, validUntil: e.target.value }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </header>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-7">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-2">Entreprise</h4>
                  <div className="space-y-2">
                    <input className={quoteFieldClass} value={quote.companyName} onChange={(e) => setQuote((prev) => ({ ...prev, companyName: e.target.value }))} />
                    <input className={quoteFieldClass} value={quote.companyAddress} onChange={(e) => setQuote((prev) => ({ ...prev, companyAddress: e.target.value }))} />
                    <input className={quoteFieldClass} value={quote.companyPhone} onChange={(e) => setQuote((prev) => ({ ...prev, companyPhone: e.target.value }))} />
                    <input className={quoteFieldClass} value={quote.companyEmail} onChange={(e) => setQuote((prev) => ({ ...prev, companyEmail: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-3">
                      <input className={quoteFieldClass} value={quote.companyNif} onChange={(e) => setQuote((prev) => ({ ...prev, companyNif: e.target.value }))} placeholder="NIF" />
                      <input className={quoteFieldClass} value={quote.companyRccm} onChange={(e) => setQuote((prev) => ({ ...prev, companyRccm: e.target.value }))} placeholder="RCCM" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-2">Client</h4>
                  <div className="space-y-2">
                    <input className={quoteFieldClass} value={quote.clientName} onChange={(e) => setQuote((prev) => ({ ...prev, clientName: e.target.value }))} placeholder="Nom client" />
                    <input className={quoteFieldClass} value={quote.clientAddress} onChange={(e) => setQuote((prev) => ({ ...prev, clientAddress: e.target.value }))} placeholder="Adresse client" />
                    <input className={quoteFieldClass} value={quote.clientPhone} onChange={(e) => setQuote((prev) => ({ ...prev, clientPhone: e.target.value }))} placeholder="Telephone" />
                    <input className={quoteFieldClass} value={quote.clientEmail} onChange={(e) => setQuote((prev) => ({ ...prev, clientEmail: e.target.value }))} placeholder="Email" />
                  </div>
                </div>
              </section>

              <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="md:col-span-2 text-[11px] uppercase tracking-wider text-slate-500">
                  Objet du devis
                  <input className={quoteFieldClass} value={quote.subject} onChange={(e) => setQuote((prev) => ({ ...prev, subject: e.target.value }))} />
                </label>
                <label className="text-[11px] uppercase tracking-wider text-slate-500">
                  Delai d'execution
                  <input className={quoteFieldClass} value={quote.executionDelay} onChange={(e) => setQuote((prev) => ({ ...prev, executionDelay: e.target.value }))} />
                </label>
              </section>

              <section className="mb-7">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600">Detail des prestations</h4>
                  <button
                    onClick={addItem}
                    className="no-print px-2.5 py-1 rounded-md border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="text-left px-3 py-2">Designation</th>
                        <th className="text-left px-3 py-2 w-16">Qté</th>
                        <th className="text-left px-3 py-2 w-24">Unité</th>
                        <th className="text-right px-3 py-2 w-36">P.U</th>
                        <th className="text-right px-3 py-2 w-36">Montant</th>
                        <th className="no-print px-2 py-2 w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item) => {
                        const amount = item.quantity * item.unitPrice;
                        return (
                          <tr key={item.id} className="border-t border-slate-200 align-top">
                            <td className="px-3 py-1.5">
                              <input className={quoteFieldClass} value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
                            </td>
                            <td className="px-2 py-1.5">
                              <input type="number" min={1} className={quoteFieldClass} value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: Math.max(1, Number(e.target.value) || 1) })} />
                            </td>
                            <td className="px-2 py-1.5">
                              <input className={quoteFieldClass} value={item.unit} onChange={(e) => updateItem(item.id, { unit: e.target.value })} />
                            </td>
                            <td className="px-2 py-1.5">
                              <input type="number" min={0} className={quoteFieldClass} value={item.unitPrice} onChange={(e) => updateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })} />
                            </td>
                            <td className="px-3 py-2 text-right font-semibold">{formatCurrency(amount)}</td>
                            <td className="no-print px-2 py-2 text-center">
                              <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-500" title="Supprimer la ligne">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-7">
                <div className="md:col-span-3 space-y-4">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500 block">
                    Conditions de paiement
                    <input className={quoteFieldClass} value={quote.paymentTerms} onChange={(e) => setQuote((prev) => ({ ...prev, paymentTerms: e.target.value }))} />
                  </label>
                  <label className="text-[11px] uppercase tracking-wider text-slate-500 block">
                    Notes / Besoins du client
                    <textarea className={`${quoteTextareaClass} min-h-20`} value={quote.notes} onChange={(e) => setQuote((prev) => ({ ...prev, notes: e.target.value }))} />
                  </label>
                </div>
                <div className="md:col-span-2 border border-slate-300 p-4">
                  <div className="flex items-center justify-between text-sm py-1"><span>Sous-total</span><span className="font-semibold">{formatCurrency(subtotal)}</span></div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Remise
                      <input type="number" min={0} className={quoteFieldClass} value={quote.discount} onChange={(e) => setQuote((prev) => ({ ...prev, discount: Math.max(0, Number(e.target.value) || 0) }))} />
                    </label>
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">TVA %
                      <input type="number" min={0} className={quoteFieldClass} value={quote.taxRate} onChange={(e) => setQuote((prev) => ({ ...prev, taxRate: Math.max(0, Number(e.target.value) || 0) }))} />
                    </label>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1 mt-2"><span>Montant TVA</span><span className="font-semibold">{formatCurrency(taxAmount)}</span></div>
                  <div className="flex items-center justify-between border-t border-slate-300 mt-3 pt-2"><span className="font-bold">TOTAL TTC</span><span className="font-black text-lg">{formatCurrency(total)}</span></div>
                </div>
              </section>

              <section className="mb-7">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-2">Clauses contractuelles</h4>
                <textarea className={`${quoteTextareaClass} min-h-36`} value={quote.clauses} onChange={(e) => setQuote((prev) => ({ ...prev, clauses: e.target.value }))} />
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-2">Signature entreprise</p>
                  <input className={quoteFieldClass} value={quote.companySignatory} onChange={(e) => setQuote((prev) => ({ ...prev, companySignatory: e.target.value }))} />
                  <div className="h-16 border-b border-slate-300 mt-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-2">Signature client</p>
                  <input className={quoteFieldClass} value={quote.clientSignatory} onChange={(e) => setQuote((prev) => ({ ...prev, clientSignatory: e.target.value }))} />
                  <div className="h-16 border-b border-slate-300 mt-5" />
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-sm">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">
                  Fait a
                  <input className={quoteFieldClass} value={quote.signPlace} onChange={(e) => setQuote((prev) => ({ ...prev, signPlace: e.target.value }))} />
                </label>
                <label className="text-[11px] uppercase tracking-wider text-slate-500">
                  Date de signature
                  <input type="date" className={quoteFieldClass} value={quote.signDate} onChange={(e) => setQuote((prev) => ({ ...prev, signDate: e.target.value }))} />
                </label>
              </section>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
