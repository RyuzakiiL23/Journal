'use client'
import { useTheme } from "next-themes"

export default function Dark() {
  const { setTheme } = useTheme()
  return (
    <div className="w-full bg-background flex justify-center gap-4 p-4">
      <button className="border p-2 h-fit cursor-pointer border-ring" onClick={() => setTheme("light")}>Light</button>
      <button className="border p-2 h-fit cursor-pointer border-ring" onClick={() => setTheme("dark")}>Dark</button>
    </div>
  );
}