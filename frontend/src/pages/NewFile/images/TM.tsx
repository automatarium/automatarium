// Used https://svg2jsx.com/ for SVG conversion and manually deleted unncecessary parts/made inline to make similar to FSA.js

const TM = ({ stateFill, strokeColor }: { stateFill: string, strokeColor: string }) => {
  return (
    <svg viewBox="454 384 362 192">
      <defs>
        <marker id="standard-arrow-head" strokeWidth="2" markerHeight="30" markerUnits="strokeWidth" markerWidth="30" orient="auto" refX="29" refY="15">
          <path fill={strokeColor} d="M29 15l-7.208-3.471v6.942z" strokeWidth="2"></path>
        </marker>
        <marker strokeWidth="2" markerHeight="30" markerUnits="strokeWidth" markerWidth="30" orient="auto" refX="29" refY="15" >
          <path strokeWidth="2" fill={strokeColor} d="M29 15l-7.208-3.471v6.942z"></path>
        </marker>
        <marker strokeWidth="2" markerHeight="30" markerUnits="strokeWidth" markerWidth="30" orient="auto" refX="29" refY="15" >
          <path stroke={strokeColor} strokeWidth="2" d="M29 15l-7.208-3.471M29 15l-7.208 3.471"></path>
        </marker>
      </defs>
      <g transform="translate(525 525)">
        <circle r="30" fill={stateFill} stroke={strokeColor} strokeWidth="2.5"></circle>
      </g>
      <g transform="translate(645 435)">
        <circle r="30" fill={stateFill} stroke={strokeColor} strokeWidth="2.5"></circle>
      </g>
      <g transform="translate(765 525)" strokeWidth="2.5">
        <circle r="30" fill={stateFill} stroke={strokeColor}></circle>
        <circle r="25" fill={stateFill} stroke={strokeColor}></circle>
      </g>
      <path fill="none" stroke={strokeColor} strokeWidth="2.5" d="M495 525L475 500 475 550z" strokeLinejoin="round"/>
      <path fill="none" stroke={strokeColor} strokeWidth="2" markerEnd="url(#standard-arrow-head)" d="M549 507l72-54"/>
      <path id="0525525645435-text" fill="none" stroke="none" d="M549 507l72-54"/>
      <text fill={strokeColor} alignmentBaseline="central" dy="-12" textAnchor="middle" fontSize="1.2em">
        <textPath startOffset="50%" xlinkHref="#0525525645435-text">
          a,a;L
        </textPath>
      </text>
      <path fill="none" stroke={strokeColor} strokeWidth="2" markerEnd="url(#standard-arrow-head)" d="M669 453l72 54"/>
      <path id="0645435765525-text" fill="none" stroke="none" d="M669 453l72 54"/>
      <text fill={strokeColor} alignmentBaseline="central" dy="-12" textAnchor="middle" fontSize="1.2em">
        <textPath startOffset="50%" xlinkHref="#0645435765525-text">
          b,b;R
        </textPath>
      </text>
    </svg>
  )
}

export default TM
