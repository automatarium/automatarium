// Used https://svg2jsx.com/ for SVG conversion and made similar to FSA.js
const PDA = () => (
  <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="go1061815559"
      fontFamily="sans-serif"
      version="1.1"
      viewBox="34 -1.167 302 172.167"
      style={{
        backgroundSize: 30,
        backgroundPosition: 0,
        backgroundColor: "white",
        PrimaryH: "0",
        PrimaryS: "63%",
        PrimaryL: "48%",
      }}
    >
      <defs>
        <marker
          id="standard-arrow-head"
          markerHeight="30"
          markerUnits="strokeWidth"
          markerWidth="30"
          orient="auto"
          refX="29"
          refY="15"
        >
          <path fill="#111" d="M29 15l-7.208-3.471v6.942z"></path>
        </marker>
        <marker
          markerHeight="30"
          markerUnits="strokeWidth"
          markerWidth="30"
          orient="auto"
          refX="29"
          refY="15"
        >
          <path fill="#111" d="M29 15l-7.208-3.471v6.942z"></path>
        </marker>
        <marker
          markerHeight="30"
          markerUnits="strokeWidth"
          markerWidth="30"
          orient="auto"
          refX="29"
          refY="15"
        >
          <path stroke="#111" d="M29 15l-7.208-3.471M29 15l-7.208 3.471"></path>
        </marker>
      </defs>
      <path fill="none" stroke="#111" d="M75 120L55 95 55 145z"></path>
      <path
        fill="none"
        stroke="#111"
        markerEnd="url(#standard-arrow-head)"
        d="M135 120h120"
      ></path>
      <path
        id="0105120285120-text"
        fill="none"
        stroke="none"
        d="M135 120h120"
      ></path>
      <path
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        d="M135 120h120"
      ></path>
      <text
        fill="#111"
        alignmentBaseline="central"
        dy="-5"
        textAnchor="middle"
        style={{
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
          userSelect: "none",
        }}
      >
        <textPath startOffset="50%" xlinkHref="#0105120285120-text">
          λ,λ;λ
        </textPath>
      </text>
      <path
        fill="none"
        stroke="#111"
        markerEnd="url(#standard-arrow-head)"
        d="M90.008 94.014Q105-10 119.992 94.014"
      ></path>
      <path
        fill="none"
        stroke="none"
        d="M90.008 94.014Q105-10 119.992 94.014"
      ></path>
      <path
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        d="M90.008 94.014Q105-10 119.992 94.014"
      ></path>
      <text
        x="105"
        y="33.333"
        fill="#111"
        alignmentBaseline="central"
        dy="-5"
        textAnchor="middle"
        style={{
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
          userSelect: "none",
        }}
      >
        a,λ;X
      </text>
      <g>
        <path
          fill="none"
          stroke="#111"
          markerEnd="url(#standard-arrow-head)"
          d="M270.008 94.014Q285-10 299.992 94.014"
        ></path>
        <path
          fill="none"
          stroke="none"
          d="M270.008 94.014Q285-10 299.992 94.014"
        ></path>
        <path
          fill="none"
          stroke="transparent"
          strokeWidth="20"
          d="M270.008 94.014Q285-10 299.992 94.014"
        ></path>
        <text
          x="285"
          y="33.333"
          fill="#111"
          alignmentBaseline="central"
          dy="-5"
          textAnchor="middle"
          style={{
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
            userSelect: "none",
          }}
        >
          b,X;λ
        </text>
      </g>
      <g transform="translate(105 120)">
        <circle r="30" fill="hsl(0, 63%, 75%)" stroke="#111"></circle>
        <text
          fill="#111"
          alignmentBaseline="central"
          textAnchor="middle"
          style={{
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
            userSelect: "none",
          }}
        >
          q0
        </text>
      </g>
      <g transform="translate(285 120)">
        <circle r="30" fill="hsl(0, 63%, 75%)" stroke="#111"></circle>
        <circle r="25" fill="hsl(0, 63%, 75%)" stroke="#111"></circle>
        <text
          fill="#111"
          alignmentBaseline="central"
          textAnchor="middle"
          style={{
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
            userSelect: "none",
          }}
        >
          q1
        </text>
      </g>
    </svg>
)

export default PDA;