"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { MenuItem } from "@/types";
import { saveMenu, uploadPhoto, useStalls } from "@/lib/menus";
export default function PortalPage() {
  const stalls = useStalls();
  const [stallId, setStallId] = useState("stall-01");
  const stall = stalls.find(s => s.id === stallId)!;
  return <main className="owner-portal max-w-5xl mx-auto px-4 pt-5 pb-8 sm:p-8 space-y-5 sm:space-y-6">
    <header className="flex flex-wrap justify-between items-center gap-3 border-b border-line pb-4 sm:pb-6"><BrandLogo size="md" /><Link href="/" className="inline-flex min-h-11 items-center rounded-lg border border-line px-3 text-sm font-semibold text-accent">View public menus</Link></header>
    <div><p className="text-accent">Stall owner portal</p><h1 className="text-2xl sm:text-3xl font-semibold mt-2">Make your menu your own</h1><p className="text-muted mt-2">Update dishes, upload photos, and arrange your menu.</p></div>
    <p className="rounded-xl bg-accent-soft p-4 text-sm">Demo workspace: changes are saved in this browser only. Stall selection is a preview, without owner sign-in or cross-device publishing.</p>
    <label className="block font-semibold">Your stall<select className="block mt-2 w-full rounded-xl border border-line bg-surface p-3" value={stallId} onChange={e => setStallId(e.target.value)}>{stalls.map(s => <option key={s.id} value={s.id}>{s.stall_number} · {s.name}</option>)}</select></label>
    <MenuEditor key={stallId} stallId={stallId} menu={stall.menu} />
  </main>;
}
function MenuEditor({ stallId, menu }: { stallId: string; menu: MenuItem[] }) {
  const [draft, setDraft] = useState<MenuItem[] | null>(null);
  const items = draft ?? menu;
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const patch = (id: string, change: Partial<MenuItem>) => { setDraft(current => (current ?? menu).map(item => item.id === id ? { ...item, ...change } : item)); setMessage(""); };
  const move = (index: number, direction: number) => {
    const next = [...items]; const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]]; setDraft(next); setMessage("");
  };
  return <form onSubmit={e => {
    e.preventDefault();
    if (items.some(i => !i.name.trim() || !Number.isFinite(i.price) || i.price < 0)) { setMessage("Enter a dish name and valid price for every item."); return; }
    try { saveMenu(stallId, items.map(i => ({ ...i, name: i.name.trim() }))); setDraft(null); setMessage("Menu saved. Your public menu is updated in this browser."); }
    catch { setMessage("Could not save. Browser storage may be full or unavailable. Remove some photos and try again."); }
  }} className="space-y-5">
    <div className="flex flex-wrap justify-between items-center gap-3"><h2 className="text-xl font-semibold">Photo menu · {items.length} dishes</h2><button type="button" className="border border-line rounded-lg px-4 py-2" onClick={() => { setDraft([...items, { id: crypto.randomUUID(), stall_id: stallId, name: "", description: "", category: "Main", price: 0, image_url: "", is_available: true }]); setMessage(""); }}>Add dish</button></div>
    <p className="text-sm text-muted">Move dishes up or down to rearrange their photos and menu cards. Save when ready.</p>
    {items.length === 0 && <p>No dishes yet. Add your first dish.</p>}
    <div className="grid min-w-0 gap-5 md:grid-cols-2">{items.map((item, index) => <article key={item.id} className="min-w-0 bg-surface border border-line rounded-2xl p-4 space-y-4">
      <div className="relative aspect-[16/10] sm:aspect-auto sm:h-48 rounded-xl overflow-hidden bg-surface-subtle flex items-center justify-center">{item.image_url ? <Image src={item.image_url} alt={item.name || "Dish photo"} fill unoptimized className="object-cover" /> : <span className="text-muted">Upload a dish photo</span>}</div>
      <label className="block text-sm">Dish photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className="block w-full min-w-0 mt-2 rounded-xl border border-line p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-accent-soft file:px-3 file:py-3 file:font-semibold file:text-accent" onChange={async e => {
        const file = e.target.files?.[0]; e.target.value = ""; if (!file) return;
        setBusy(true); try { patch(item.id, { image_url: await uploadPhoto(file) }); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not upload photo."); } finally { setBusy(false); }
      }} /></label>
      {item.image_url && <button type="button" className="text-sm text-accent" onClick={() => patch(item.id, { image_url: "" })}>Remove photo</button>}
      <label className="block text-sm">Dish name<input required maxLength={120} value={item.name} onChange={e => patch(item.id, { name: e.target.value })} className="block w-full border border-line rounded-lg p-2 mt-1" /></label>
      <label className="block text-sm">Description<textarea rows={3} maxLength={1000} value={item.description} onChange={e => patch(item.id, { description: e.target.value })} className="block w-full border border-line rounded-lg p-2 mt-1" /></label>
      <div className="grid grid-cols-2 gap-3"><label className="text-sm">Price (RM)<input required type="number" inputMode="decimal" min="0" max="99999" step="0.01" value={Number.isNaN(item.price) ? "" : item.price} onChange={e => patch(item.id, { price: e.target.valueAsNumber })} className="block w-full border border-line rounded-lg p-2 mt-1" /></label><label className="text-sm">Category<input required value={item.category} onChange={e => patch(item.id, { category: e.target.value })} className="block w-full border border-line rounded-lg p-2 mt-1" /></label></div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm menu-toggles"><label><input type="checkbox" checked={item.is_available} onChange={e => patch(item.id, { is_available: e.target.checked })} /> Available</label><label><input type="checkbox" checked={!!item.is_signature} onChange={e => patch(item.id, { is_signature: e.target.checked })} /> Signature dish</label></div>
      <div className="grid grid-cols-3 gap-2 border-t border-line pt-3 text-sm menu-actions"><button type="button" disabled={index === 0 || busy} aria-label={`Move up ${item.name || "dish"}`} onClick={() => move(index, -1)} className="rounded-lg border border-line px-1 disabled:opacity-40">Move up</button><button type="button" disabled={index === items.length - 1 || busy} aria-label={`Move down ${item.name || "dish"}`} onClick={() => move(index, 1)} className="disabled:opacity-40">Move down</button><button type="button" disabled={busy} className="rounded-lg border border-red-100 text-red-700 px-1" onClick={() => { if (window.confirm("Delete this dish? Save the menu to apply this change.")) { setDraft(items.filter(i => i.id !== item.id)); setMessage(""); } }}>Delete dish</button></div>
    </article>)}</div>
    <div className="menu-save-bar sticky bottom-0 sm:bottom-3 bg-surface/95 backdrop-blur-md border border-line rounded-xl p-3 sm:p-4 shadow-sm grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-4"><button disabled={busy} type="submit" className="bg-accent text-white rounded-lg px-5 py-3 disabled:opacity-40">{busy ? "Processing photo…" : "Save menu"}</button><button type="button" disabled={busy || draft === null} onClick={() => { setDraft(null); setMessage(""); }} className="text-sm rounded-lg px-2 disabled:opacity-40">Discard changes</button><p role="status" className="col-span-2 text-sm break-words empty:hidden">{message || (draft ? "Unsaved changes" : "")}</p></div>
  </form>;
}
