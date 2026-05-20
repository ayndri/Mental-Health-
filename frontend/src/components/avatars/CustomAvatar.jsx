// ─── Palette options ──────────────────────────────────────────────────────────
export const SKIN_TONES    = ['#FDDCBE','#F0B98E','#D4956A','#B07040','#7A4820'];
export const HAIR_COLORS   = ['#1C1917','#5C3317','#B07840','#D4A056','#E07A5F','#E596B2','#8B68C8','#415f83'];
export const OUTFIT_COLORS = ['#415f83','#6B85A8','#E596B2','#5BA970','#8B68C8','#E07A5F','#D4A017','#6B8070'];
export const BG_COLORS     = ['#EEF2FA','#FEF0F5','#EBF6EE','#FFF8E1','#F5EEFF','#E8F4FF','#FFF0E8','#F0F5F0'];
export const HAIR_STYLE_NAMES = ['Space Bun','Panjang','Pendek','Curly','Bob','Ponytail','Undercut','Slick Back'];
export const ACCESSORY_NAMES  = ['Tidak ada','Kacamata','Bintang','Pita','Bunga'];
export const GENDER_NAMES     = ['Perempuan','Laki-laki'];
export const DEFAULT_CONFIG   = { bgColor:0, skinTone:0, hairStyle:0, hairColor:0, outfitColor:0, accessory:0, gender:0 };

// ─── Hair back layer ──────────────────────────────────────────────────────────
function HairBack({ style, color }) {
  switch (style) {
    case 0: // Space Bun - hair pulled up, minimal back
      return <ellipse cx="100" cy="70" rx="46" ry="20" fill={color}/>;
    case 1: // Long - flows far below face
      return (
        <path d="M46 104 C40 124 38 152 40 174 C42 190 58 202 100 202 C142 202 158 190 160 174 C162 152 160 124 154 104 C150 82 134 62 100 60 C66 62 50 82 46 104Z" fill={color}/>
      );
    case 2: // Short - close cap
      return (
        <path d="M54 104 C52 82 66 62 100 60 C134 62 148 82 146 104 C138 100 118 96 100 96 C82 96 62 100 54 104Z" fill={color}/>
      );
    case 3: // Curly - voluminous
      return (
        <g>
          <circle cx="100" cy="62" r="46" fill={color}/>
          <circle cx="62"  cy="78" r="30" fill={color}/>
          <circle cx="138" cy="78" r="30" fill={color}/>
          <circle cx="78"  cy="52" r="24" fill={color}/>
          <circle cx="122" cy="52" r="24" fill={color}/>
          <circle cx="100" cy="46" r="24" fill={color}/>
          <circle cx="54"  cy="104" r="18" fill={color}/>
          <circle cx="146" cy="104" r="18" fill={color}/>
        </g>
      );
    case 4: // Bob - chin length back panel
      return (
        <path d="M50 104 C46 122 46 142 50 158 C54 170 68 178 100 178 C132 178 146 170 150 158 C154 142 154 122 150 104 C146 82 132 62 100 60 C68 62 54 82 50 104Z" fill={color}/>
      );
    case 5: // Ponytail - cap + ponytail behind
      return (
        <g>
          <path d="M54 100 C52 80 66 62 100 60 C134 62 148 80 146 100Z" fill={color}/>
          <path d="M138 88 C150 96 160 118 160 146 C160 164 152 177 144 177 C136 177 130 167 132 152 C134 137 142 122 142 106 C142 96 139 90 138 88Z" fill={color}/>
          <path d="M138 88 C141 94 140 110 138 128 C136 146 133 158 131 157 C129 156 132 143 134 127 C136 111 136 96 138 88Z" fill={color} opacity="0.32"/>
        </g>
      );
    case 6: // Undercut - minimal, just top strip
      return <ellipse cx="100" cy="68" rx="44" ry="18" fill={color}/>;
    case 7: // Slick back - smooth full cap
      return (
        <path d="M52 108 C52 82 66 62 100 60 C134 62 148 82 148 108 C144 116 120 124 100 124 C80 124 56 116 52 108Z" fill={color}/>
      );
    default:
      return <ellipse cx="100" cy="72" rx="50" ry="24" fill={color}/>;
  }
}

// ─── Hair front layer ─────────────────────────────────────────────────────────
// Each style uses a closed path: outer edge goes over the head top, inner edge
// draws the natural hairline across the forehead.
function HairFront({ style, color }) {
  switch (style) {
    case 0: // Space Bun - high hairline, two buns on top
      return (
        <g>
          <path d="M62 100 C60 84 70 68 100 66 C130 68 140 84 138 100 C132 92 120 86 100 85 C80 86 68 92 62 100Z" fill={color}/>
          <circle cx="73"  cy="64" r="17" fill={color}/>
          <circle cx="127" cy="64" r="17" fill={color}/>
          <ellipse cx="68"  cy="58" rx="7" ry="5" fill="white" opacity="0.22"/>
          <ellipse cx="122" cy="58" rx="7" ry="5" fill="white" opacity="0.22"/>
          <ellipse cx="73"  cy="78" rx="8" ry="4"  fill={color}/>
          <ellipse cx="127" cy="78" rx="8" ry="4"  fill={color}/>
        </g>
      );
    case 1: // Long - natural hairline + long side strands
      return (
        <g>
          <path d="M52 102 C50 82 64 62 100 60 C136 62 150 82 148 102 C142 88 126 80 100 78 C74 80 58 88 52 102Z" fill={color}/>
          <path d="M52 102 C50 118 48 142 50 164 C51 172 54 176 57 174 C60 172 60 163 59 150 C58 135 57 118 58 104Z" fill={color}/>
          <path d="M148 102 C150 118 152 142 150 164 C149 172 146 176 143 174 C140 172 140 163 141 150 C142 135 143 118 142 104Z" fill={color}/>
          <path d="M72 76 C86 68 100 66 116 70" stroke="white" strokeWidth="2.5" fill="none" opacity="0.14" strokeLinecap="round"/>
        </g>
      );
    case 2: // Short - close-fitting cap, minimal sides
      return (
        <g>
          <path d="M56 100 C54 82 68 64 100 62 C132 64 146 82 144 100 C138 88 124 82 100 80 C76 82 62 88 56 100Z" fill={color}/>
          <path d="M56 100 C54 108 54 116 57 120 C59 122 61 120 62 116 C63 112 61 106 60 100Z" fill={color}/>
          <path d="M144 100 C146 108 146 116 143 120 C141 122 139 120 138 116 C137 112 139 106 140 100Z" fill={color}/>
        </g>
      );
    case 3: // Curly - big fluffy cloud
      return (
        <g>
          <circle cx="100" cy="58" r="46" fill={color}/>
          <circle cx="62"  cy="74" r="30" fill={color}/>
          <circle cx="138" cy="74" r="30" fill={color}/>
          <circle cx="78"  cy="50" r="24" fill={color}/>
          <circle cx="122" cy="50" r="24" fill={color}/>
          <circle cx="100" cy="44" r="24" fill={color}/>
          <circle cx="88"  cy="54" r="9"  fill={color} opacity="0.58"/>
          <circle cx="112" cy="52" r="9"  fill={color} opacity="0.58"/>
          <circle cx="74"  cy="68" r="8"  fill={color} opacity="0.58"/>
          <circle cx="126" cy="66" r="8"  fill={color} opacity="0.58"/>
        </g>
      );
    case 4: // Bob - natural hairline + straight sides to chin
      return (
        <g>
          <path d="M52 102 C50 82 64 62 100 60 C136 62 150 82 148 102 C142 88 126 80 100 78 C74 80 58 88 52 102Z" fill={color}/>
          <path d="M52 102 C50 118 50 132 52 146 C53 153 56 156 58 155 C61 154 62 148 62 142 C62 130 61 116 58 104Z" fill={color}/>
          <path d="M148 102 C150 118 150 132 148 146 C147 153 144 156 142 155 C139 154 138 148 138 142 C138 130 139 116 142 104Z" fill={color}/>
          <path d="M52 146 C66 154 82 157 100 157 C118 157 134 154 148 146 C134 156 118 160 100 160 C82 160 66 156 52 146Z" fill={color}/>
        </g>
      );
    case 5: // Ponytail - pulled-back look + visible tail on side
      return (
        <g>
          <path d="M58 100 C56 84 68 66 100 64 C132 66 144 84 142 100 C136 90 122 86 100 84 C78 86 64 90 58 100Z" fill={color}/>
          <path d="M58 100 C56 108 56 116 58 120 C60 122 62 120 63 116 C64 112 62 104 62 102Z" fill={color}/>
          <ellipse cx="140" cy="82" rx="8" ry="6" fill={color} transform="rotate(-12 140 82)"/>
          <path d="M140 86 C143 94 142 106 140 116 C138 124 136 127 134 125 C132 123 133 118 135 110 C137 100 139 92 140 86Z" fill={color}/>
        </g>
      );
    case 6: // Undercut - thick styled top, faint sides
      return (
        <g>
          <path d="M64 96 C62 78 72 62 100 60 C128 62 138 78 136 96 C130 84 118 76 100 75 C82 76 70 84 64 96Z" fill={color}/>
          <ellipse cx="100" cy="66" rx="36" ry="16" fill={color}/>
          <path d="M64 96 C62 104 62 112 64 118 C66 121 68 120 70 116 C71 112 69 104 68 98Z" fill={color} opacity="0.28"/>
          <path d="M136 96 C138 104 138 112 136 118 C134 121 132 120 130 116 C129 112 131 104 132 98Z" fill={color} opacity="0.28"/>
        </g>
      );
    case 7: // Slick back - receded hairline, combed back
      return (
        <g>
          <path d="M54 106 C52 84 66 64 100 62 C134 64 148 84 146 106 C140 92 124 86 100 84 C76 86 60 92 54 106Z" fill={color}/>
          <path d="M68 82 C84 72 100 70 116 74" stroke="white" strokeWidth="2.5" fill="none" opacity="0.2" strokeLinecap="round"/>
          <path d="M72 90 C88 80 100 78 116 82" stroke="white" strokeWidth="1.5" fill="none" opacity="0.12" strokeLinecap="round"/>
          <path d="M54 106 C52 114 52 120 55 124 C57 126 59 124 60 120 C61 116 60 110 58 106Z" fill={color}/>
          <path d="M146 106 C148 114 148 120 145 124 C143 126 141 124 140 120 C139 116 140 110 142 106Z" fill={color}/>
        </g>
      );
    default:
      return (
        <path d="M52 102 C50 82 64 62 100 60 C136 62 150 82 148 102 C142 88 126 80 100 78 C74 80 58 88 52 102Z" fill={color}/>
      );
  }
}

// ─── Accessory layer ──────────────────────────────────────────────────────────
function Accessory({ type }) {
  switch (type) {
    case 1: return (
      <g>
        <circle cx="84"  cy="114" r="13" fill="rgba(175,200,230,0.12)" stroke="#7A8FA8" strokeWidth="2.2"/>
        <circle cx="116" cy="114" r="13" fill="rgba(175,200,230,0.12)" stroke="#7A8FA8" strokeWidth="2.2"/>
        <path d="M97 114 L103 114" stroke="#7A8FA8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M71 110 L62 106" stroke="#7A8FA8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M129 110 L138 106" stroke="#7A8FA8" strokeWidth="2" strokeLinecap="round"/>
      </g>
    );
    case 2: return (
      <path d="M132 73 L134 66 L136 73 L143 75 L136 77 L134 84 L132 77 L125 75Z" fill="#FBBF24"/>
    );
    case 3: return (
      <g>
        <path d="M80 66 C72 55 60 58 62 67 C64 76 76 73 80 66Z" fill="#E596B2"/>
        <path d="M120 66 C128 55 140 58 138 67 C136 76 124 73 120 66Z" fill="#E596B2"/>
        <circle cx="100" cy="66" r="7" fill="#C97898"/>
        <circle cx="100" cy="66" r="4" fill="#F5C0D4"/>
      </g>
    );
    case 4: return (
      <g>
        <path d="M58 80 Q80 68 100 64 Q120 68 142 80" stroke="#86EFAC" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="66"  cy="76" r="8"  fill="#FEE2E2"/><circle cx="66"  cy="76" r="4.5" fill="#FCA5A5"/>
        <circle cx="82"  cy="67" r="8"  fill="#FEF3C7"/><circle cx="82"  cy="67" r="4.5" fill="#FDE68A"/>
        <circle cx="100" cy="63" r="9"  fill="#FEF0F5"/><circle cx="100" cy="63" r="5"   fill="#E596B2"/>
        <circle cx="118" cy="67" r="8"  fill="#EBF6EE"/><circle cx="118" cy="67" r="4.5" fill="#86EFAC"/>
        <circle cx="134" cy="76" r="8"  fill="#EAF0FA"/><circle cx="134" cy="76" r="4.5" fill="#93C5FD"/>
      </g>
    );
    default: return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CustomAvatar({ config = {}, size = 120 }) {
  const {
    bgColor     = 0,
    skinTone    = 0,
    hairStyle   = 0,
    hairColor   = 0,
    outfitColor = 0,
    accessory   = 0,
    gender      = 0,
  } = (typeof config === 'string' ? (() => { try { return JSON.parse(config); } catch { return {}; } })() : config) || {};

  const skin   = SKIN_TONES[skinTone]       ?? SKIN_TONES[0];
  const hair   = HAIR_COLORS[hairColor]     ?? HAIR_COLORS[0];
  const outfit = OUTFIT_COLORS[outfitColor] ?? OUTFIT_COLORS[0];
  const bg     = BG_COLORS[bgColor]         ?? BG_COLORS[0];
  const male   = gender === 1;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill={bg}/>

      {/* Body */}
      <ellipse cx="100" cy="215" rx={male ? 100 : 92} ry="72" fill={outfit}/>
      <ellipse cx="100" cy="200" rx={male ? 68 : 60}  ry="54" fill={outfit} opacity="0.65"/>

      {/* Neck */}
      <rect x={male ? 84 : 87} y="152" width={male ? 32 : 26} height="30" rx="13" fill={skin}/>

      <HairBack style={hairStyle} color={hair}/>

      {/* Ears */}
      <ellipse cx="50"  cy="122" rx="12" ry="15" fill={skin}/>
      <ellipse cx="150" cy="122" rx="12" ry="15" fill={skin}/>
      <ellipse cx="50"  cy="122" rx="6.5" ry="8.5" fill={skin} opacity="0.45"/>
      <ellipse cx="150" cy="122" rx="6.5" ry="8.5" fill={skin} opacity="0.45"/>

      {/* Face */}
      <ellipse cx="100" cy="118" rx={male ? 52 : 50} ry={male ? 52 : 54} fill={skin}/>

      {/* Cheeks */}
      <ellipse cx="70"  cy="132" rx="13" ry="9" fill="#F9A8D4" opacity={male ? 0.08 : 0.28}/>
      <ellipse cx="130" cy="132" rx="13" ry="9" fill="#F9A8D4" opacity={male ? 0.08 : 0.28}/>

      {/* Eye whites */}
      <ellipse cx="83"  cy="113" rx="10" ry="11" fill="white"/>
      <ellipse cx="117" cy="113" rx="10" ry="11" fill="white"/>

      {/* Pupils */}
      <circle cx="86"  cy="114" r="7" fill="#2C2C2C"/>
      <circle cx="120" cy="114" r="7" fill="#2C2C2C"/>

      {/* Iris shine */}
      <circle cx="88"  cy="111" r="2.8" fill="white"/>
      <circle cx="122" cy="111" r="2.8" fill="white"/>
      <circle cx="83"  cy="117" r="1.2" fill="white" opacity="0.6"/>
      <circle cx="117" cy="117" r="1.2" fill="white" opacity="0.6"/>

      {/* Eyelashes — female only */}
      {!male && <>
        <path d="M73 106 Q83 100 93 106"   stroke="#2C2C2C" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        <path d="M107 106 Q117 100 127 106" stroke="#2C2C2C" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      </>}

      {/* Eyebrows */}
      <path d="M74 100 Q83 94 92 100"    stroke={hair} strokeWidth={male ? 4.5 : 3} strokeLinecap="round" fill="none"/>
      <path d="M108 100 Q117 94 126 100" stroke={hair} strokeWidth={male ? 4.5 : 3} strokeLinecap="round" fill="none"/>

      {/* Nose */}
      <path d="M96 124 Q100 130 104 124" stroke={skin} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* Mouth */}
      {!male ? <>
        <path d="M86 138 Q100 150 114 138" stroke="#D4707A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M91 138 Q100 143 109 138" fill="#E8A0A8" opacity="0.35"/>
      </> : (
        <path d="M89 139 Q100 148 111 139" stroke="#B07080" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      )}

      <HairFront style={hairStyle} color={hair}/>
      <Accessory type={accessory}/>
    </svg>
  );
}
