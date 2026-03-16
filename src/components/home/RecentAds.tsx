'use client';

import { motion } from 'framer-motion';
import AdCard from '@/components/ads/AdCard';
import Link from 'next/link';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number | null;
  images: string;
  city: string;
  views: number;
  isPremium: boolean;
  isFeatured: boolean;
  createdAt: Date | string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface RecentAdsProps {
  ads: Ad[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RecentAds({ ads }: RecentAdsProps) {
  return (
    <section className="mt-6 mb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Annonces récentes</h2>
        <Link href="/categories" className="text-sm text-orange-500 font-medium">
          Voir tout →
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        {ads.map((ad) => (
          <motion.div key={ad.id} variants={itemVariants}>
            <AdCard ad={ad} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
