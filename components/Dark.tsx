'use client'
import { useTheme } from "next-themes"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Dark() {
  const path = usePathname()
  console.log(path)
  const { setTheme } = useTheme()
  return (
    <div className="w-full bg-background flex justify-center gap-4 p-4">
      {/* <Link href="/" className="border p-2 h-fit cursor-pointer border-ring">/////</Link>
      <Link href="/home" className="border p-2 h-fit cursor-pointer border-ring">Home</Link>
      <Link href="/strategy" className="border p-2 h-fit cursor-pointer border-ring">Strategy</Link> */}
      <button className="border p-2 h-fit cursor-pointer border-ring" onClick={() => setTheme("light")}>Light</button>
      <button className="border p-2 h-fit cursor-pointer border-ring" onClick={() => setTheme("dark")}>Dark</button>

      <Link href="/accessorKey" className={` ${path === '/accessorKey' ? 'bg-pink-300 text-black' : ''} border p-2 h-fit cursor-pointer border-ring`}>AccessorKey</Link>
      <Link href="/accessorFn" className={` ${path === '/accessorFn' ? 'bg-pink-300 text-black' : ''} border p-2 h-fit cursor-pointer border-ring`}>AccessorFn</Link>
      <Link href="/createColumnHelper" className={` ${path === '/createColumnHelper' ? 'bg-pink-300 text-black' : ''} border p-2 h-fit cursor-pointer border-ring`}>CreateColumnHelper</Link>
    </div>
  );
}