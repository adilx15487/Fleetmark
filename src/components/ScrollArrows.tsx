import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollArrowsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const ScrollArrows = ({ canScrollLeft, canScrollRight, onScrollLeft, onScrollRight }: ScrollArrowsProps) => (
  <>
    {/* Left Arrow */}
    <button
      onClick={onScrollLeft}
      disabled={!canScrollLeft}
      aria-label="Scroll left"
      className={`absolute left-0 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center transition-all duration-200 ${
        canScrollLeft
          ? 'opacity-100 md:opacity-0 md:group-hover/scroll:opacity-100 text-primary-700 hover:bg-primary-50 hover:border-primary-300 hover:shadow-xl cursor-pointer'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    {/* Right Arrow */}
    <button
      onClick={onScrollRight}
      disabled={!canScrollRight}
      aria-label="Scroll right"
      className={`absolute right-0 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center transition-all duration-200 ${
        canScrollRight
          ? 'opacity-100 md:opacity-0 md:group-hover/scroll:opacity-100 text-primary-700 hover:bg-primary-50 hover:border-primary-300 hover:shadow-xl cursor-pointer'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </>
);

export default ScrollArrows;
