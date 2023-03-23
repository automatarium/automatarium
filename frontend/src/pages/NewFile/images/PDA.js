// Used https://svg2jsx.com/ for SVG conversion and manually deleted unncecessary parts/made inline to make similar to FSA.js

const PDA = ({ stateFill, strokeColor }) => {
  return (
    <svg viewBox="364 324 347 192">
      <defs>
        <marker id="standard-arrow-head" strokeWidth="2" markerHeight="30" markerUnits="2" markerWidth="30" orient="auto" refX="29" refY="15">
          <path fill={strokeColor} d="M29 15l-7.208-3.471v6.942z" strokeWidth="2"></path>
        </marker>
        <marker strokeWidth="2" markerHeight="30" markerUnits="strokeWidth" markerWidth="30" orient="auto" refX="29" refY="15" >
          <path strokeWidth="2" fill={strokeColor} d="M29 15l-7.208-3.471v6.942z"></path>
        </marker>
        <marker strokeWidth="2" markerHeight="30" markerUnits="strokeWidth" markerWidth="30" orient="auto" refX="29" refY="15" >
          <path stroke={strokeColor} strokeWidth="2" d="M29 15l-7.208-3.471M29 15l-7.208 3.471"></path>
        </marker>
      </defs>
      <g transform="translate(435 465)" strokeWidth="2.5">
        <circle r="30" fill={stateFill} stroke={strokeColor}></circle>
      </g>
      <g transform="translate(660 375)" strokeWidth="2.5">
        <circle r="30" fill={stateFill} stroke={strokeColor}></circle>
        <circle r="25" fill={stateFill} stroke={strokeColor}></circle>
      </g>
      <path fill="none" stroke={strokeColor} d="M405 465L385 440 385 490z" strokeWidth="2.5"></path>
      <path fill="none" stroke={strokeColor} markerEnd="url(#standard-arrow-head)" d="M462.854 453.858l169.292-67.716" strokeWidth="2"/>
      <path id="0435465660375-text" fill="none" stroke="none" d="M462.854 453.858l169.292-67.716"/>
      <path fill="none" stroke="transparent" strokeWidth="20" d="M462.854 453.858l169.292-67.716"/>
      <text fill={strokeColor} alignmentBaseline="central" dy="-12" textAnchor="middle" fontSize="1.5em">
        <textPath startOffset="50%" xlinkHref="#0435465660375-text">
          a,b;c
        </textPath>
      </text>
    </svg>
  )
}

export default PDA
