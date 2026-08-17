import React, { useState, useEffect, useMemo } from 'react';

const SIZES = {
  xs: 'w-8 h-8 rounded-md',
  sm: 'w-10 h-10 rounded-lg',
  md: 'w-14 h-14 rounded-lg',
  lg: 'w-full aspect-video rounded-xl',
  hero: 'w-full aspect-video rounded-2xl',
};

/**
 * Procedure thumbnail with bulletproof fallback chain:
 * canonicalSlug -> slug -> /visuals/_default/thumb.jpg
 * Decorative only — never breaks layout if images are missing.
 */
const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ProcedureThumb({
  canonicalSlug,
  slug,
  name,
  alt = '',
  size = 'sm',
  className = '',
  glow = true,
}) {
  const candidates = useMemo(() => {
    const list = [];
    const push = (s) => {
      if (!s) return;
      const url = `/visuals/${s}/thumb.jpg`;
      if (!list.includes(url)) list.push(url);
    };
    push(canonicalSlug);
    push(slug);
    push(slugify(name));
    list.push('/visuals/_default/thumb.jpg');
    return list;
  }, [canonicalSlug, slug, name]);

  const [idx, setIdx] = useState(0);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    setIdx(0);
    setDead(false);
  }, [candidates]);

  const sizeCls = SIZES[size] || SIZES.sm;

  if (dead) {
    // Even the default failed — render a quiet placeholder chip, never break.
    return (
      <div
        className={`${sizeCls} bg-accent/10 border border-accent/20 flex-shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={candidates[idx]}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
        else setDead(true);
      }}
      className={`${sizeCls} object-cover flex-shrink-0 border border-accent/20 ${
        glow
          ? 'transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-[0_0_14px_rgba(34,211,224,0.25)]'
          : ''
      } ${className}`}
    />
  );
}
