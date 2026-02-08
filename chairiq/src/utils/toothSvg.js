// Reusable Tooth SVG Components for Educational Diagrams
// Realistic tooth silhouettes with anatomically correct crown contours and root structures

/**
 * Get a realistic tooth SVG path based on variant
 * @param {Object} options - Configuration options
 * @param {string} options.variant - Type of tooth: "molar" | "premolar" | "incisor"
 * @param {number} options.x - X position (default: 200)
 * @param {number} options.y - Y position (default: 150)
 * @param {string} options.highlight - Highlight area: "pulp" | "canal" | "crownPrep" | "cavity" | "pocket" | null
 * @param {number} options.scale - Scale factor (default: 1)
 * @returns {string} SVG path elements as string
 */
export const getToothSvg = ({
  variant = 'molar',
  x = 200,
  y = 150,
  highlight = null,
  scale = 1
}) => {
  const colors = {
    enamel: '#FFFFF0',      // Ivory white for enamel
    enamelShade: '#FFF8DC', // Slightly darker ivory
    dentin: '#FAEBD7',      // Antique white for dentin
    pulp: '#FFB6C1',        // Light pink for pulp
    canal: '#FF8C00',       // Dark orange for canals
    cavity: '#8B4513',      // Saddle brown for decay
    infected: '#DC143C',    // Crimson for infection
    outline: '#8B7355',     // Medium brown outline
    root: '#D2B48C'         // Tan for roots
  };

  // MOLAR - Broad crown with 4 distinct cusps, bifurcated roots
  if (variant === 'molar') {
    // Crown with realistic cusp anatomy
    const crownPath = `
      <path d="M ${x-48*scale} ${y-12*scale}
               C ${x-46*scale} ${y-28*scale} ${x-42*scale} ${y-38*scale} ${x-32*scale} ${y-42*scale}
               L ${x-20*scale} ${y-44*scale}
               C ${x-12*scale} ${y-48*scale} ${x-6*scale} ${y-48*scale} ${x} ${y-48*scale}
               C ${x+6*scale} ${y-48*scale} ${x+12*scale} ${y-48*scale} ${x+20*scale} ${y-44*scale}
               L ${x+32*scale} ${y-42*scale}
               C ${x+42*scale} ${y-38*scale} ${x+46*scale} ${y-28*scale} ${x+48*scale} ${y-12*scale}
               L ${x+44*scale} ${y+8*scale}
               C ${x+40*scale} ${y+18*scale} ${x+32*scale} ${y+24*scale} ${x+22*scale} ${y+28*scale}
               L ${x+8*scale} ${y+32*scale}
               L ${x-8*scale} ${y+32*scale}
               L ${x-22*scale} ${y+28*scale}
               C ${x-32*scale} ${y+24*scale} ${x-40*scale} ${y+18*scale} ${x-44*scale} ${y+8*scale} Z"
            fill="${colors?.enamel}" 
            stroke="${colors?.outline}" 
            stroke-width="${2.5*scale}"/>
      
      <!-- Cusp definition lines -->
      <path d="M ${x-32*scale} ${y-42*scale} L ${x-28*scale} ${y-20*scale}"
            stroke="${colors?.enamelShade}" stroke-width="${1.5*scale}" opacity="0.6"/>
      <path d="M ${x-8*scale} ${y-46*scale} L ${x-8*scale} ${y-24*scale}"
            stroke="${colors?.enamelShade}" stroke-width="${1.5*scale}" opacity="0.6"/>
      <path d="M ${x+8*scale} ${y-46*scale} L ${x+8*scale} ${y-24*scale}"
            stroke="${colors?.enamelShade}" stroke-width="${1.5*scale}" opacity="0.6"/>
      <path d="M ${x+32*scale} ${y-42*scale} L ${x+28*scale} ${y-20*scale}"
            stroke="${colors?.enamelShade}" stroke-width="${1.5*scale}" opacity="0.6"/>
    `;

    // Dentin layer (inner tooth structure)
    const dentinPath = highlight !== 'crownPrep' ? `
      <path d="M ${x-38*scale} ${y-8*scale}
               C ${x-34*scale} ${y-22*scale} ${x-28*scale} ${y-30*scale} ${x-18*scale} ${y-32*scale}
               L ${x-8*scale} ${y-34*scale}
               C ${x-4*scale} ${y-36*scale} ${x} ${y-36*scale} ${x+4*scale} ${y-34*scale}
               L ${x+18*scale} ${y-32*scale}
               C ${x+28*scale} ${y-30*scale} ${x+34*scale} ${y-22*scale} ${x+38*scale} ${y-8*scale}
               L ${x+34*scale} ${y+6*scale}
               C ${x+28*scale} ${y+14*scale} ${x+18*scale} ${y+18*scale} ${x} ${y+20*scale}
               C ${x-18*scale} ${y+18*scale} ${x-28*scale} ${y+14*scale} ${x-34*scale} ${y+6*scale} Z"
            fill="${colors?.dentin}" 
            opacity="0.7"/>
    ` : '';

    // Pulp chamber (central nerve chamber)
    const pulpHighlight = (highlight === 'pulp' || highlight === 'canal') ? 'opacity="0.9"' : 'opacity="0.4"';
    const pulpPath = `
      <path d="M ${x-18*scale} ${y-2*scale}
               C ${x-16*scale} ${y-12*scale} ${x-8*scale} ${y-18*scale} ${x} ${y-18*scale}
               C ${x+8*scale} ${y-18*scale} ${x+16*scale} ${y-12*scale} ${x+18*scale} ${y-2*scale}
               L ${x+16*scale} ${y+10*scale}
               C ${x+12*scale} ${y+16*scale} ${x+6*scale} ${y+18*scale} ${x} ${y+18*scale}
               C ${x-6*scale} ${y+18*scale} ${x-12*scale} ${y+16*scale} ${x-16*scale} ${y+10*scale} Z"
            fill="${colors?.pulp}" 
            ${pulpHighlight}/>
    `;

    // Root canals (3 distinct canals for molar)
    const canalHighlight = highlight === 'canal' ? colors?.canal : colors?.pulp;
    const canalOpacity = highlight === 'canal' ? '1' : '0.5';
    const canalsPath = `
      <!-- Left root canal -->
      <line x1="${x-16*scale}" y1="${y+16*scale}" 
            x2="${x-18*scale}" y2="${y+62*scale}" 
            stroke="${canalHighlight}" 
            stroke-width="${5*scale}" 
            opacity="${canalOpacity}"
            stroke-linecap="round"/>
      
      <!-- Center root canal -->
      <line x1="${x}" y1="${y+16*scale}" 
            x2="${x}" y2="${y+68*scale}" 
            stroke="${canalHighlight}" 
            stroke-width="${5*scale}" 
            opacity="${canalOpacity}"
            stroke-linecap="round"/>
      
      <!-- Right root canal -->
      <line x1="${x+16*scale}" y1="${y+16*scale}" 
            x2="${x+18*scale}" y2="${y+62*scale}" 
            stroke="${canalHighlight}" 
            stroke-width="${5*scale}" 
            opacity="${canalOpacity}"
            stroke-linecap="round"/>
    `;

    // Cavity highlight (decay visualization)
    const cavityPath = highlight === 'cavity' ? `
      <path d="M ${x-12*scale} ${y-28*scale}
               C ${x-8*scale} ${y-34*scale} ${x-4*scale} ${y-36*scale} ${x} ${y-36*scale}
               C ${x+4*scale} ${y-36*scale} ${x+8*scale} ${y-34*scale} ${x+12*scale} ${y-28*scale}
               L ${x+12*scale} ${y-16*scale}
               C ${x+8*scale} ${y-10*scale} ${x+4*scale} ${y-8*scale} ${x} ${y-8*scale}
               C ${x-4*scale} ${y-8*scale} ${x-8*scale} ${y-10*scale} ${x-12*scale} ${y-16*scale} Z"
            fill="${colors?.cavity}" 
            opacity="0.8"/>
    ` : '';

    // Crown prep highlight (tooth prepared for crown)
    const crownPrepPath = highlight === 'crownPrep' ? `
      <path d="M ${x-38*scale} ${y-6*scale}
               L ${x-30*scale} ${y-20*scale}
               C ${x-22*scale} ${y-26*scale} ${x-12*scale} ${y-28*scale} ${x} ${y-28*scale}
               C ${x+12*scale} ${y-28*scale} ${x+22*scale} ${y-26*scale} ${x+30*scale} ${y-20*scale}
               L ${x+38*scale} ${y-6*scale}
               L ${x+34*scale} ${y+6*scale}
               C ${x+26*scale} ${y+14*scale} ${x+14*scale} ${y+18*scale} ${x} ${y+18*scale}
               C ${x-14*scale} ${y+18*scale} ${x-26*scale} ${y+14*scale} ${x-34*scale} ${y+6*scale} Z"
            fill="${colors?.dentin}" 
            opacity="0.6"/>
    ` : '';

    return crownPath + dentinPath + pulpPath + canalsPath + cavityPath + crownPrepPath;
  }

  // PREMOLAR - Two distinct cusps, single or bifurcated root
  if (variant === 'premolar') {
    const crownPath = `
      <path d="M ${x-38*scale} ${y-8*scale}
               C ${x-36*scale} ${y-24*scale} ${x-32*scale} ${y-34*scale} ${x-18*scale} ${y-38*scale}
               C ${x-12*scale} ${y-42*scale} ${x-6*scale} ${y-44*scale} ${x} ${y-44*scale}
               C ${x+6*scale} ${y-44*scale} ${x+12*scale} ${y-42*scale} ${x+18*scale} ${y-38*scale}
               C ${x+32*scale} ${y-34*scale} ${x+36*scale} ${y-24*scale} ${x+38*scale} ${y-8*scale}
               L ${x+34*scale} ${y+10*scale}
               C ${x+28*scale} ${y+20*scale} ${x+16*scale} ${y+24*scale} ${x} ${y+26*scale}
               C ${x-16*scale} ${y+24*scale} ${x-28*scale} ${y+20*scale} ${x-34*scale} ${y+10*scale} Z"
            fill="${colors?.enamel}" 
            stroke="${colors?.outline}" 
            stroke-width="${2.5*scale}"/>
      
      <!-- Two cusp definition -->
      <path d="M ${x-12*scale} ${y-42*scale} L ${x-12*scale} ${y-22*scale}"
            stroke="${colors?.enamelShade}" stroke-width="${1.5*scale}" opacity="0.6"/>
      <path d="M ${x+12*scale} ${y-42*scale} L ${x+12*scale} ${y-22*scale}"
            stroke="${colors?.enamelShade}" stroke-width="${1.5*scale}" opacity="0.6"/>
    `;

    const dentinPath = `
      <path d="M ${x-28*scale} ${y-6*scale}
               C ${x-24*scale} ${y-18*scale} ${x-16*scale} ${y-26*scale} ${x} ${y-28*scale}
               C ${x+16*scale} ${y-26*scale} ${x+24*scale} ${y-18*scale} ${x+28*scale} ${y-6*scale}
               L ${x+24*scale} ${y+8*scale}
               C ${x+18*scale} ${y+14*scale} ${x+8*scale} ${y+16*scale} ${x} ${y+16*scale}
               C ${x-8*scale} ${y+16*scale} ${x-18*scale} ${y+14*scale} ${x-24*scale} ${y+8*scale} Z"
            fill="${colors?.dentin}" 
            opacity="0.7"/>
    `;

    const pulpHighlight = (highlight === 'pulp' || highlight === 'canal') ? 'opacity="0.9"' : 'opacity="0.4"';
    const pulpPath = `
      <path d="M ${x-14*scale} ${y-4*scale}
               C ${x-12*scale} ${y-12*scale} ${x-6*scale} ${y-16*scale} ${x} ${y-16*scale}
               C ${x+6*scale} ${y-16*scale} ${x+12*scale} ${y-12*scale} ${x+14*scale} ${y-4*scale}
               L ${x+12*scale} ${y+8*scale}
               C ${x+8*scale} ${y+12*scale} ${x+4*scale} ${y+14*scale} ${x} ${y+14*scale}
               C ${x-4*scale} ${y+14*scale} ${x-8*scale} ${y+12*scale} ${x-12*scale} ${y+8*scale} Z"
            fill="${colors?.pulp}" 
            ${pulpHighlight}/>
    `;

    const canalHighlight = highlight === 'canal' ? colors?.canal : colors?.pulp;
    const canalsPath = `
      <line x1="${x}" y1="${y+14*scale}" 
            x2="${x}" y2="${y+58*scale}" 
            stroke="${canalHighlight}" 
            stroke-width="${5*scale}" 
            opacity="${highlight === 'canal' ? '1' : '0.5'}"
            stroke-linecap="round"/>
    `;

    return crownPath + dentinPath + pulpPath + canalsPath;
  }

  // INCISOR - Flat incisal edge, single root
  if (variant === 'incisor') {
    const crownPath = `
      <path d="M ${x-28*scale} ${y-4*scale}
               C ${x-26*scale} ${y-20*scale} ${x-24*scale} ${y-30*scale} ${x-14*scale} ${y-36*scale}
               C ${x-8*scale} ${y-40*scale} ${x-4*scale} ${y-42*scale} ${x} ${y-42*scale}
               C ${x+4*scale} ${y-42*scale} ${x+8*scale} ${y-40*scale} ${x+14*scale} ${y-36*scale}
               C ${x+24*scale} ${y-30*scale} ${x+26*scale} ${y-20*scale} ${x+28*scale} ${y-4*scale}
               L ${x+24*scale} ${y+12*scale}
               C ${x+18*scale} ${y+20*scale} ${x+10*scale} ${y+22*scale} ${x} ${y+22*scale}
               C ${x-10*scale} ${y+22*scale} ${x-18*scale} ${y+20*scale} ${x-24*scale} ${y+12*scale} Z"
            fill="${colors?.enamel}" 
            stroke="${colors?.outline}" 
            stroke-width="${2.5*scale}"/>
      
      <!-- Flat incisal edge -->
      <line x1="${x-14*scale}" y1="${y-36*scale}"
            x2="${x+14*scale}" y2="${y-36*scale}"
            stroke="${colors?.enamelShade}" stroke-width="${2*scale}" opacity="0.5"/>
    `;

    const dentinPath = `
      <path d="M ${x-20*scale} ${y-2*scale}
               C ${x-18*scale} ${y-14*scale} ${x-10*scale} ${y-22*scale} ${x} ${y-24*scale}
               C ${x+10*scale} ${y-22*scale} ${x+18*scale} ${y-14*scale} ${x+20*scale} ${y-2*scale}
               L ${x+18*scale} ${y+10*scale}
               C ${x+12*scale} ${y+14*scale} ${x+6*scale} ${y+16*scale} ${x} ${y+16*scale}
               C ${x-6*scale} ${y+16*scale} ${x-12*scale} ${y+14*scale} ${x-18*scale} ${y+10*scale} Z"
            fill="${colors?.dentin}" 
            opacity="0.7"/>
    `;

    const pulpHighlight = (highlight === 'pulp' || highlight === 'canal') ? 'opacity="0.9"' : 'opacity="0.4"';
    const pulpPath = `
      <path d="M ${x-10*scale} ${y-2*scale}
               C ${x-8*scale} ${y-10*scale} ${x-4*scale} ${y-14*scale} ${x} ${y-14*scale}
               C ${x+4*scale} ${y-14*scale} ${x+8*scale} ${y-10*scale} ${x+10*scale} ${y-2*scale}
               L ${x+8*scale} ${y+8*scale}
               C ${x+4*scale} ${y+12*scale} ${x+2*scale} ${y+14*scale} ${x} ${y+14*scale}
               C ${x-2*scale} ${y+14*scale} ${x-4*scale} ${y+12*scale} ${x-8*scale} ${y+8*scale} Z"
            fill="${colors?.pulp}" 
            ${pulpHighlight}/>
    `;

    const canalHighlight = highlight === 'canal' ? colors?.canal : colors?.pulp;
    const canalsPath = `
      <line x1="${x}" y1="${y+14*scale}" 
            x2="${x}" y2="${y+54*scale}" 
            stroke="${canalHighlight}" 
            stroke-width="${5*scale}" 
            opacity="${highlight === 'canal' ? '1' : '0.5'}"
            stroke-linecap="round"/>
    `;

    return crownPath + dentinPath + pulpPath + canalsPath;
  }

  return '';
};

/**
 * Get gum base SVG for realistic gum line rendering
 * @param {Object} options - Configuration options
 * @param {number} options.x - X position (default: 200)
 * @param {number} options.y - Y position (default: 180)
 * @param {number} options.width - Width of gum base (default: 100)
 * @param {string} options.color - Gum color (default: #FFB6C1)
 * @param {boolean} options.inflamed - Show inflamed appearance (default: false)
 * @param {string} options.pocketDepth - "normal" | "moderate" | "severe" | null
 * @returns {string} SVG path elements as string
 */
export const getGumBaseSvg = ({
  x = 200,
  y = 180,
  width = 100,
  color = '#FFB6C1',
  inflamed = false,
  pocketDepth = null
}) => {
  const gumColor = inflamed ? '#FF6B6B' : color;
  const opacity = inflamed ? 0.7 : 0.5;

  const gumPath = `
    <path d="M ${x - width/2} ${y}
             Q ${x - width/3} ${y - 10} ${x} ${y - 5}
             Q ${x + width/3} ${y - 10} ${x + width/2} ${y}
             L ${x + width/2} ${y + 40}
             Q ${x + width/3} ${y + 50} ${x} ${y + 50}
             Q ${x - width/3} ${y + 50} ${x - width/2} ${y + 40} Z"
          fill="${gumColor}"
          opacity="${opacity}"
          stroke="${inflamed ? '#DC143C' : '#C71585'}"
          stroke-width="2"/>
  `;

  // Pocket depth visualization
  let pocketPath = '';
  if (pocketDepth === 'moderate') {
    pocketPath = `
      <line x1="${x - 35}" y1="${y}" 
            x2="${x - 35}" y2="${y + 15}" 
            stroke="#DC143C" 
            stroke-width="3" 
            opacity="0.6"/>
    `;
  } else if (pocketDepth === 'severe') {
    pocketPath = `
      <line x1="${x - 35}" y1="${y}" 
            x2="${x - 35}" y2="${y + 25}" 
            stroke="#DC143C" 
            stroke-width="4" 
            opacity="0.8"/>
      <rect x="${x - 40}" y="${y + 5}" 
            width="10" height="20" 
            fill="#8B4513" 
            opacity="0.5"/>
    `;
  }

  return gumPath + pocketPath;
};

export default {
  getToothSvg,
  getGumBaseSvg
};