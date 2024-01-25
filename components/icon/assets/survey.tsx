import * as React from "react";

function Survyes(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.3rem"
        height="1.3rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 3v18h18"></path>
        <path d="M9 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
        <path d="M19 7m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
        <path d="M14 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
        <path d="M10.16 10.62l2.34 2.88"></path>
        <path d="M15.088 13.328l2.837 -4.586"></path>
      </svg>
    </svg>
  );
}

export default Survyes;
