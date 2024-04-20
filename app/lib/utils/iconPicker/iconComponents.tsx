// Dynamic Icon Components, Specific for Industry/Product use case

import { Icon, IconSkip, IconTable, DEFAULT_INDUSTRY_ICON, DEBUG } from "./iconDefinitions";
import { THEME } from "../../definitions";
import { findIcon, findIcons } from "./iconSearch";



// COMPONENT: Selects multiple icons from product icon pool
export async function ProductIcons({
  className = "",
  names,
  excludeIndustryName,
  pageName,
  color = THEME.COLORS.BLACK,
}: {
  className?: string;
  names: string[];
  excludeIndustryName: string;
  pageName: string;
  color?: string;
}): Promise<React.JSX.Element[]> {
  if (DEBUG)
    console.log("\n\n[Icons] Product search: " + names);



  // Find the icon used for Industry
  const industryIcon = findIcon(excludeIndustryName); // TODO: Check Industry Table


  // Recursively find best icons
  var results: Icon[];
  if (industryIcon)
    results = await findIcons([excludeIndustryName.substring(excludeIndustryName.indexOf(">") + 1, excludeIndustryName.lastIndexOf("<")), ...names], [industryIcon.name], pageName, 1);
  else
    results = await findIcons([...names], [], pageName);

  if (DEBUG) console.log("[Icons] " + names + " = ");

  return results.map((productIcon) => {
    if (DEBUG) console.log(productIcon.name);
    return (
      <div key={productIcon.name} className={className + " inline icon-svg"} id={productIcon.name}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={productIcon.viewbox ? productIcon.viewbox : "0 -960 960 960"}
        >
          <path d={productIcon.path} fill={color} />
        </svg>
      </div>
    );
  });
}

// COMPONENT: Best icon pick for Industry
// TODO: Create Industry Icon Table
export function IndustryIcon({
  className = "",
  name = "",
  color = THEME.COLORS.BLACK,
}: {
  className: string;
  name: string;
  color?: string;
}) {
  const iconSearchResult = findIcon(name);

  return (
    <div className={className + " inline icon-svg"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={
          iconSearchResult.viewbox ? iconSearchResult.viewbox : "0 -960 960 960"
        }
      >
        <path d={iconSearchResult.path} fill={color} />
      </svg>
    </div>
  );
}
