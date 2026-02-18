import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Armchair,
  MapPinned,
  Brain,
  Bell,
  XCircle,
  CheckCircle,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

interface ProblemSolutionPair {
  problem: string;
  solution: string;
  solutionTitle: string;
  icon: LucideIcon;
}

const pairs: ProblemSolutionPair[] = [
  {
    problem: 'Overcrowded and unmanaged buses',
    solutionTitle: 'Seat Reservation',
    solution: 'Seat reservation system with capacity control — reserve your seat in advance and never stand again.',
    icon: Armchair,
  },
  {
    problem: 'Unfair seat allocation — first come, only served',
    solutionTitle: 'Smart Allocation',
    solution: 'Smart bus allocation based on demand & fairness — AI-powered assignment that works for everyone.',
    icon: Brain,
  },
  {
    problem: 'No visibility on routes, stops, or schedules',
    solutionTitle: 'Route Visibility',
    solution: 'Route & stop visibility with clear map view — see every route, stop, and timing at a glance.',
    icon: MapPinned,
  },
  {
    problem: 'Poor communication between admins, drivers, and passengers',
    solutionTitle: 'Instant Reporting',
    solution: 'Instant reporting & real-time notifications — everyone stays informed, every step of the way.',
    icon: Bell,
  },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0}
            className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4"
          >
            What This Project Is About
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-900 leading-tight"
          >
            Solving Real Transport
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Problems with Smart Solutions
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={2}
            className="mt-6 text-lg text-slate-500 leading-relaxed"
          >
            From overcrowded buses to last-minute cancellations — we've seen it all.
            Fleetmark tackles these pain points head-on with a suite of powerful features.
          </motion.p>
        </div>

        {/* Problem → Solution Pairs */}
        <div className="space-y-6">
          {pairs.map((pair, index) => (
            <motion.div
              key={pair.solutionTitle}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={index + 3}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary-100/40 hover:border-primary-200 transition-all duration-300"
            >
              <div className="grid md:grid-cols-[1fr_auto_1fr] items-stretch">
                {/* Problem — Left Side */}
                <div className="flex items-start gap-4 p-6 lg:p-8">
                  <div className="w-11 h-11 rounded-xl bg-danger-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-danger-500" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-red-50 text-danger-500 text-xs font-semibold uppercase tracking-wider mb-2">
                      Problem
                    </span>
                    <p className="text-slate-700 font-medium leading-relaxed">{pair.problem}</p>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="hidden md:flex items-center justify-center px-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-8 bg-gradient-to-b from-danger-500/30 to-success-500/30" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-danger-500/10 to-success-500/10 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-success-500/30 to-danger-500/30" />
                  </div>
                </div>

                {/* Mobile Arrow */}
                <div className="flex md:hidden items-center justify-center py-1">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-gradient-to-r from-danger-500/30 to-success-500/30" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-danger-500/10 to-success-500/10 border border-slate-200 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div className="h-px w-8 bg-gradient-to-r from-success-500/30 to-danger-500/30" />
                  </div>
                </div>

                {/* Solution — Right Side */}
                <div className="flex items-start gap-4 p-6 lg:p-8 bg-success-500/[0.02] rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl">
                  <div className="w-11 h-11 rounded-xl bg-success-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-success-500 text-xs font-semibold uppercase tracking-wider mb-2">
                      Solution
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      <span className="font-semibold text-primary-900">{pair.solutionTitle}:</span>{' '}
                      {pair.solution}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
