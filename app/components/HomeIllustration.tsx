export function HomeIllustration() {
  return <svg className="home-illustration" viewBox="0 0 680 510" role="img" aria-labelledby="shravan-illustration-title shravan-illustration-description">
    <title id="shravan-illustration-title">A neighbourhood issue becomes a reviewed local report</title>
    <desc id="shravan-illustration-description">A resident records a pothole near a park. A report card shows the issue reviewed and saved as a local demo.</desc>
    <defs>
      <linearGradient id="scene" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#F0F1E8"/><stop offset="1" stopColor="#E7EBDD"/></linearGradient>
      <pattern id="grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#536553" opacity=".1"/></pattern>
    </defs>
    <rect x="8" y="8" width="664" height="494" rx="28" fill="url(#scene)"/>
    <rect x="8" y="8" width="664" height="494" rx="28" fill="url(#grain)"/>
    <path d="M8 348c94-68 173-40 250-87 64-39 119-28 183 9 86 50 151 25 231-17v249H8V348Z" fill="#D8E2CE"/>
    <path d="M8 398c96-54 175-38 250-77 70-36 129-36 190 0 77 46 140 41 224 1v180H8V398Z" fill="#C5D4B9"/>
    <path d="M-10 500c89-111 191-129 285-100 71 22 127 22 193-22 69-45 132-49 222-10" fill="none" stroke="#C9BFA9" strokeWidth="78" strokeLinecap="round"/>
    <path d="M-10 500c89-111 191-129 285-100 71 22 127 22 193-22 69-45 132-49 222-10" fill="none" stroke="#F4F0E7" strokeWidth="4" strokeDasharray="13 15" strokeLinecap="round"/>
    <g className="illustration-house" transform="translate(72 236)"><path d="m0 55 68-55 68 55" fill="#A95D44"/><rect x="13" y="53" width="110" height="100" rx="5" fill="#F7F1E1"/><rect x="30" y="72" width="25" height="28" rx="3" fill="#B6C8B1"/><rect x="80" y="72" width="25" height="28" rx="3" fill="#B6C8B1"/><path d="M60 153v-43a16 16 0 0 1 32 0v43" fill="#58745B"/></g>
    <g className="illustration-house" transform="translate(234 278) scale(.76)"><path d="m0 55 68-55 68 55" fill="#B87457"/><rect x="13" y="53" width="110" height="100" rx="5" fill="#EFE4CC"/><rect x="30" y="72" width="25" height="28" rx="3" fill="#B6C8B1"/><path d="M80 153v-43a16 16 0 0 1 32 0v43" fill="#58745B"/></g>
    <g transform="translate(451 205)"><path d="M19 77V41" stroke="#776044" strokeWidth="11" strokeLinecap="round"/><circle cx="19" cy="29" r="24" fill="#79946F"/><circle cx="-2" cy="46" r="18" fill="#617F62"/><circle cx="39" cy="47" r="17" fill="#8DA27B"/></g>
    <g transform="translate(345 355)"><circle className="issue-marker" r="33" fill="#FFFDF8"/><circle r="23" fill="#A95D44"/><path d="M-11 2h22M-7-6h14M-4 10h8" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round"/></g>
    <g className="resident" transform="translate(399 340)"><circle cx="0" cy="-36" r="14" fill="#9D654B"/><path d="M-19-15Q0-28 19-15l8 51h-54l8-51Z" fill="#385F4A"/><path d="m-11 36-5 38m25-38 7 38" stroke="#344A3B" strokeWidth="10" strokeLinecap="round"/><path d="m14-10 17 16" stroke="#9D654B" strokeWidth="8" strokeLinecap="round"/><rect x="26" y="2" width="16" height="25" rx="3" fill="#263B33"/><rect x="29" y="5" width="10" height="16" rx="2" fill="#DFE8D6"/></g>
    <g className="report-float-card" transform="translate(350 48)">
      <rect width="281" height="154" rx="15" fill="#FFFEFA" stroke="#D8DED2"/>
      <circle cx="31" cy="32" r="17" fill="#E5EBDC"/><path d="M31 23c-5 0-8 4-8 9 0 6 8 14 8 14s8-8 8-14c0-5-3-9-8-9Zm0 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="#385F4A"/>
      <text x="59" y="29" className="illustration-label">LOCAL DEMO REPORT</text>
      <text x="59" y="50" className="illustration-title">Pothole near the park</text>
      <path d="M20 76h241" stroke="#E4E8DE"/>
      <circle cx="31" cy="104" r="10" fill="#E5EBDC"/><path d="m27 104 3 3 6-7" fill="none" stroke="#385F4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="51" y="101" className="illustration-label">REVIEWED BY RESIDENT</text>
      <text x="51" y="120" className="illustration-copy">Saved on this device</text>
      <rect x="194" y="94" width="66" height="27" rx="13.5" fill="#EAF0E3"/>
      <text x="227" y="112" textAnchor="middle" className="illustration-status">DEMO</text>
    </g>
  </svg>;
}
