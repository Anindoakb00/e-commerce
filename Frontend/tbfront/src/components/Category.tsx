'use client'

import Image from "next/image"
import Link from "next/link"

type CategoryProps = {
  categories: {
    title: string
    slug: string
    image: string
  }[]
}

export default function Category({ categories }: CategoryProps) {
  return (
    <section className="px-6 lg:px-20 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-white">Categories</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="flex flex-col items-center gap-3 p-4 rounded-lg bg-[#233648] hover:bg-[#324d67] transition group"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.title}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <p className="text-white font-semibold">{cat.title}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
