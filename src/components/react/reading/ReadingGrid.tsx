"use client";

import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { AnimatePresence, motion } from "motion/react";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: "reading" | "read" | "want" | "stopped";
  rating?: number;
  startDate?: string;
  finishDate?: string;
  notes?: string;
  tags?: string[];
}

interface Labels {
  currentlyReading: string;
  finished: string;
  wantToRead: string;
  stopped: string;
  close: string;
}

interface Props {
  books: Book[];
  lang: string;
  labels: Labels;
}

function BookCard({
  book,
  caption,
  onSelect,
}: {
  book: Book;
  caption: string;
  onSelect: (book: Book) => void;
}) {
  return (
    <motion.div
      layoutId={`cover-${book.id}`}
      onClick={() => onSelect(book)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(book);
      }}
      role="button"
      tabIndex={0}
      style={{ borderRadius: 12 }}
      className="card-link cursor-pointer rounded-lg p-3 bg-white/50"
    >
      <div className="relative rounded-lg overflow-hidden w-full mb-3 aspect-2/3">
        <motion.img
          layoutId={`image-${book.id}`}
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>
      <motion.h3
        layoutId={`title-${book.id}`}
        className="text-blue-800 text-sm font-medium leading-5 line-clamp-2"
      >
        {book.title}
      </motion.h3>
      <p className="text-blue-800/70 text-xs mt-1 line-clamp-1">{caption}</p>
    </motion.div>
  );
}

export default function ReadingGrid({ books, lang, labels }: Props) {
  const [active, setActive] = useState<Book | null>(null);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setActive(null));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function formatDate(date?: string) {
    if (!date) return "";
    return new Date(date).toLocaleDateString(lang, {
      year: "numeric",
      month: "short",
    });
  }

  const currentlyReading = books.filter((b) => b.status === "reading");
  const finished = books
    .filter((b) => b.status === "read")
    .sort((a, b) => (b.finishDate ?? "").localeCompare(a.finishDate ?? ""));
  const stopped = books.filter((b) => b.status === "stopped");
  const wantToRead = books.filter((b) => b.status === "want");

  return (
    <div>
      {currentlyReading.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-medium text-blue-800 mb-6">{labels.currentlyReading}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} caption={book.author} onSelect={setActive} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-16">
        <h2 className="text-xl font-medium text-blue-800 mb-6">{labels.finished}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {finished.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              caption={formatDate(book.finishDate)}
              onSelect={setActive}
            />
          ))}
        </div>
      </section>

      {stopped.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-medium text-blue-800 mb-6">{labels.stopped}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {stopped.map((book) => (
              <BookCard key={book.id} book={book} caption={book.author} onSelect={setActive} />
            ))}
          </div>
        </section>
      )}

      {wantToRead.length > 0 && (
        <section>
          <h2 className="text-xl font-medium text-blue-800 mb-6">{labels.wantToRead}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {wantToRead.map((book) => (
              <BookCard key={book.id} book={book} caption={book.author} onSelect={setActive} />
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-blue-950/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              ref={ref}
              layoutId={`cover-${active.id}`}
              style={{ borderRadius: 16 }}
              className="bg-[#fff8f1] w-full max-w-md p-6 shadow-lg flex gap-5 border border-solid border-blue-200"
            >
              <motion.img
                layoutId={`image-${active.id}`}
                src={active.cover}
                alt={active.title}
                className="w-28 aspect-2/3 shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <motion.h3
                  layoutId={`title-${active.id}`}
                  className="text-blue-800 text-lg font-medium leading-6"
                >
                  {active.title}
                </motion.h3>
                <p className="text-blue-800/70 text-sm mt-1">{active.author}</p>
                {active.rating && (
                  <p className="text-orange-400 text-sm mt-2" aria-label={`${active.rating} / 5`}>
                    {"★".repeat(active.rating)}
                    {"☆".repeat(5 - active.rating)}
                  </p>
                )}
                <p className="text-blue-800/70 text-xs mt-2">
                  {active.status === "reading" && labels.currentlyReading}
                  {active.status === "read" && formatDate(active.finishDate)}
                  {active.status === "want" && labels.wantToRead}
                  {active.status === "stopped" && labels.stopped}
                </p>
                {active.tags && active.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {active.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-blue-800/80 text-xs px-2 py-0.5 bg-blue-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {active.notes && (
                  <p className="text-blue-800/80 text-sm mt-4 leading-5">{active.notes}</p>
                )}
                <button
                  onClick={() => setActive(null)}
                  className="mt-4 text-xs text-blue-800/60 hover:text-blue-800 transition-colors"
                >
                  {labels.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
