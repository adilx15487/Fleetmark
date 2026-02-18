import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Linkedin, Github, MessageCircle } from 'lucide-react';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import ScrollArrows from './ScrollArrows';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

interface TeamMember {
  name: string;
  role: string;
  description: string;
  photo: string;
  socials: {
    linkedin: string;
    github: string;
    whatsapp: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Adil Bourji',
    role: 'Frontend Developer',
    description: 'Crafts the entire user interface, ensuring a seamless and responsive experience across all devices.',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Adil&backgroundColor=b6e3f4&top=shortHair&facialHair=beardLight',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      whatsapp: 'https://wa.me/',
    },
  },
  {
    name: 'Mohamed Lahrech',
    role: 'Backend Developer',
    description: 'Builds the core API services, database models, and business logic powering the platform.',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mohamed&backgroundColor=c0aede&top=shortHair&facialHair=beardMedium',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      whatsapp: 'https://wa.me/',
    },
  },
  {
    name: 'Abderrahman Chakour',
    role: 'Backend Developer',
    description: 'Handles authentication, real-time notifications, and integrations with external services.',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Abderrahman&backgroundColor=d1d4f9&top=shortHair&facialHair=beardLight',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      whatsapp: 'https://wa.me/',
    },
  },
  {
    name: 'Aamir Tahtah',
    role: 'DevOps & Security',
    description: 'Manages deployment pipelines, infrastructure, and ensures the platform stays secure and reliable.',
    photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aamir&backgroundColor=ffd5dc&top=shortHair&facialHair=beardMedium',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      whatsapp: 'https://wa.me/',
    },
  },
];

const WhoWeAre = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollRef, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll();

  return (
    <section id="about" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0}
            className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4"
          >
            Who We Are
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-900 leading-tight"
          >
            Meet the Team Behind
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Fleetmark
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={2}
            className="mt-6 text-lg text-slate-500 leading-relaxed"
          >
            We're a focused team of developers and engineers who came together to solve
            real transportation challenges for schools, universities, and enterprises.
            From frontend to backend to infrastructure — every piece is built with care.
          </motion.p>
        </div>

        {/* Team Cards — Horizontal Scroll */}
        <div className="relative group/scroll">
          <ScrollArrows
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={() => scrollBy('left')}
            onScrollRight={() => scrollBy('right')}
          />

          <div
            ref={scrollRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={index + 3}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 text-center hover:shadow-xl hover:shadow-primary-100/50 hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 snap-start shrink-0 w-[85%] sm:w-[45%] lg:w-[calc((100%-6rem)/4)]"
              >
              {/* Profile Photo */}
              <div className="relative mx-auto mb-5 w-24 h-24">
                <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-primary-100 group-hover:border-accent-400 transition-colors duration-300 shadow-lg shadow-primary-100/30">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-success-500 border-2 border-white rounded-full" />
              </div>

              {/* Name & Role */}
              <h3 className="text-lg font-bold text-primary-900 mb-1">{member.name}</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold mb-3">
                {member.role}
              </span>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{member.description}</p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all duration-200 hover:shadow-md"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#24292F] hover:text-white transition-all duration-200 hover:shadow-md"
                  aria-label={`${member.name} GitHub`}
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={member.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white transition-all duration-200 hover:shadow-md"
                  aria-label={`${member.name} WhatsApp`}
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
