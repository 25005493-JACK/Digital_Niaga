"use client";
import { useEffect, useState } from "react";
import { ONE_MAIN_STALLS } from "@/data/oneMainStalls";
import { MenuItem } from "@/types";
const KEY = "digital_niaga_kim_seng_menus_v1";
export function readMenus(): Record<string, MenuItem[]> {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export function saveMenu(id: string, menu: MenuItem[]) {
  localStorage.setItem(KEY, JSON.stringify({ ...readMenus(), [id]: menu }));
  window.dispatchEvent(new Event("menus-updated"));
}
export function useStalls() {
  const [menus, setMenus] = useState<Record<string, MenuItem[]>>({});
  useEffect(() => {
    const update = () => setMenus(readMenus());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("menus-updated", update);
    return () => { window.removeEventListener("storage", update); window.removeEventListener("menus-updated", update); };
  }, []);
  return ONE_MAIN_STALLS.map(s => ({ ...s, menu: menus[s.id] ?? s.menu }));
}
export async function uploadPhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG, or WebP photo.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Choose a photo smaller than 10 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Photo processing unavailable.");
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  } finally { bitmap.close(); }
}
