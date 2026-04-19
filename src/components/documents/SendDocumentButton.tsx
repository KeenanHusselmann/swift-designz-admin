"use client";

import { useState, useRef } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { sendDocumentAction } from "@/app/(dashboard)/documents/actions";
import { getTemplateLabelMap } from "@/lib/document-templates";
import { useToast } from "@/components/ui/ToastProvider";

const TEMPLATE_LABELS = getTemplateLabelMap();

interface SendDocumentButtonProps {
  clientId: string;
  clientEmail: string;
  template: string;
}

export default function SendDocumentButton({
  clientId,
  clientEmail,
  template,
}: SendDocumentButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  const templateLabel = TEMPLATE_LABELS[template] ?? template;
  const defaultSubject = `Your ${templateLabel} from Swift Designz`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    toast.loading("Sending email...");
    const formData = new FormData(e.currentTarget);
    const result = await sendDocumentAction(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Email sent!");
      setOpen(false);
      formRef.current?.reset();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-foreground border border-border hover:border-teal rounded-lg transition-colors"
      >
        <Send className="h-3 w-3" />
        Send
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-sm font-semibold text-foreground mb-1">Send {templateLabel}</h2>
            <p className="text-xs text-gray-500 mb-5">Deliver this document directly to a client via email.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="client_id" value={clientId} />
              <input type="hidden" name="template" value={template} />

              <div>
                <label className="block text-xs text-gray-400 mb-1">To</label>
                <input
                  name="recipient_email"
                  type="email"
                  defaultValue={clientEmail}
                  required
                  className="w-full px-3 py-2 bg-[#111] border border-border rounded-lg text-sm text-foreground placeholder-gray-600 focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Subject</label>
                <input
                  name="subject"
                  type="text"
                  defaultValue={defaultSubject}
                  required
                  className="w-full px-3 py-2 bg-[#111] border border-border rounded-lg text-sm text-foreground placeholder-gray-600 focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Personal message <span className="text-gray-600">(optional)</span></label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Add a short note…"
                  className="w-full px-3 py-2 bg-[#111] border border-border rounded-lg text-sm text-foreground placeholder-gray-600 focus:outline-none focus:border-teal resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-foreground border border-border rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-teal hover:bg-teal-hover text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="h-3.5 w-3.5" /> Send Email</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
