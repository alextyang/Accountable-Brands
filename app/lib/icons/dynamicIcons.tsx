import Fuse, { FuseResult } from "fuse.js";
import icons from "@/icons.json";
import { DEBUG } from "../definitions";
import { promises as fs } from "fs";

type IndustryIcon = { name: string; path: string; viewbox?: string };
const industryIcons = icons as IndustryIcon[];
const DEFAULT_INDUSTRY_ICON: IndustryIcon = { name: "", path: "" };

type IconOverlap = {
  overlapQuery?: string;
  overlapScore?: number;
  overlapName?: string;
  overlapPath?: string;
  isIndustry: boolean;
};
type MissingIcons = {
  [query: string]: {
    overlaps: IconOverlap[];
    fallbackName?: string;
    fallbackPath?: string;
    fallbackScore?: number;
    priority: number;
    age: number;
    ignoreScore: number;
  };
};
const decoder = new TextDecoder("utf-8");
export var missingIcons: MissingIcons = {};
// loadMissingIconData();

export const LOW_SCORE_CUTOFF = 0.3;
export const HIGH_SCORE_CUTOFF = 0.1;

const fuseIndustryOptions = {
  shouldSort: true,
  includeScore: true,
  ignoreLocation: false,
  ignoreFieldNorm: true,
  useExtendedSearch: true,
  keys: ["name"],
};
const fuseProductOptions = {
  shouldSort: true,
  includeScore: true,
  ignoreLocation: true,
  ignoreFieldNorm: true,
  // useExtendedSearch: true,
  keys: ["name"],
};
const fuseIndustrySearch = new Fuse(industryIcons, fuseIndustryOptions);
const fuseProductsSearch = new Fuse(industryIcons, fuseProductOptions);

export async function ProductIcons({
  className = "",
  names,
  excludeIndustryRaw,
  pageName,
  color = "#07090F",
}: {
  className: string;
  names: string[];
  excludeIndustryRaw: string;
  pageName: string;
  color?: string;
}): Promise<React.JSX.Element[]> {
  if (DEBUG)
    console.log("[IconSearch] Searching for product icons " + names + ": ");

  missingIcons = await loadMissingIconData();

  const excludeIndustry = excludeIndustryRaw.substring(
    excludeIndustryRaw.lastIndexOf(">") + 1,
    excludeIndustryRaw.lastIndexOf("<")
  );
  const industrySearch = fuseIndustrySearch.search("\""+excludeIndustry+"\"")[0];
  const industryIcon = industrySearch && industrySearch.score && industrySearch.score < LOW_SCORE_CUTOFF ? industrySearch : undefined;
  let productIconResults: IndustryIcon[] = [];
  let savedQueries: string[] = [];
  let madeChanges = false;

  names.map((name) => {
    let iconResult = fuseProductsSearch.search(name);
    const key = name;

    const isNewSearch = !missingIcons[key] || missingIcons[key].age > 100;
    if (isNewSearch)
      missingIcons[key] = { overlaps: [], priority: 1, age: 0, ignoreScore: 0 };
    else missingIcons[key].age++;
    let tempMissingIcons: MissingIcons = {};
    tempMissingIcons[key] = {
      overlaps: [],
      priority: 1,
      age: 0,
      ignoreScore: 0,
    };

    let isProblematic = false;

    while (
      iconResult[0] &&
      (productIconResults.includes(iconResult[0].item) ||
        (industryIcon &&
          industryIcon.item &&
          industryIcon.item.name == iconResult[0].item.name))
    ) {
      if (DEBUG)
        console.log(
          "[IconSearch] Got duplicate for " +
          name +
          ": " +
          iconResult[0].item.name +
          " - " +
          iconResult[0].score
        );

      if (productIconResults.includes(iconResult[0].item)) {
        const index = productIconResults.indexOf(iconResult[0].item);
        tempMissingIcons[key].overlaps?.push({
          overlapScore: iconResult[0].score,
          overlapName: productIconResults[index].name,
          overlapPath: productIconResults[index].path,
          overlapQuery: savedQueries[index],
          isIndustry: false,
        });
        tempMissingIcons[key].priority =
          iconResult[0].score &&
            tempMissingIcons[key].priority > iconResult[0].score
            ? iconResult[0].score
            : tempMissingIcons[key].priority;
        isProblematic = true;

        iconResult.shift();
      } else if (
        industryIcon && industryIcon.item &&
        industryIcon.item.name == iconResult[0].item.name
      ) {
        const index = productIconResults.indexOf(iconResult[0].item);
        tempMissingIcons[key].overlaps?.push({
          overlapScore: iconResult[0].score,
          overlapName: industryIcon.item.name,
          overlapPath: industryIcon.item.path,
          overlapQuery: excludeIndustry,
          isIndustry: true,
        });
        tempMissingIcons[key].priority =
          iconResult[0].score &&
            tempMissingIcons[key].priority > iconResult[0].score
            ? iconResult[0].score
            : tempMissingIcons[key].priority;
        isProblematic = true;

        iconResult.shift();
      }
    }

    if (iconResult[0] && iconResult[0].score) {
      if (DEBUG)
        console.log(
          "[IconSearch] Found for " +
          name +
          ": " +
          iconResult[0].item.name +
          " - " +
          iconResult[0].score
        );
      tempMissingIcons[key].fallbackName = iconResult[0].item.name;
      tempMissingIcons[key].fallbackScore = iconResult[0].score;
      tempMissingIcons[key].fallbackPath = iconResult[0].item.path;
      if (isProblematic || iconResult[0].score > LOW_SCORE_CUTOFF)
        tempMissingIcons[key].priority = iconResult[0].score; // < 1 means fallback used; sorted by quality of fallback
      else tempMissingIcons[key].priority = 0; // 0 means first result was used.

      if (iconResult[0].score < HIGH_SCORE_CUTOFF) {
        // Possibly keep high-score icons in front
        productIconResults.push(iconResult[0].item);
        savedQueries.push(name);
      } else if (iconResult[0].score < LOW_SCORE_CUTOFF) {
        // Make sure result isn't too low-scoring
        productIconResults.push(iconResult[0].item);
        savedQueries.push(name);
      }
    } else {
      if (DEBUG) console.log("[IconSearch] Skipping " + name);
      if (tempMissingIcons[key].priority == 0)
        tempMissingIcons[key].priority = 1; // 2 means no fallback used or found
      tempMissingIcons[key].priority += 1; // > 1 means no fallback used
    }

    if (
      isNewSearch ||
      (tempMissingIcons[key].priority > missingIcons[key].priority &&
        tempMissingIcons[key].priority > missingIcons[key].ignoreScore)
    ) {
      if (DEBUG) console.log("Updating Icon Table for " + key);
      missingIcons[key] = tempMissingIcons[key];
      madeChanges = true;
    }
  });

  if (madeChanges) saveMissingIconData(missingIcons);

  return productIconResults.map((productIcon) => {
    return (
      <div key={productIcon.name} className={className + " inline icon-svg"}>
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

export function saveMissingIconData(missingIcons: MissingIcons) {
  fs.writeFile(
    "./missingIcons.json",
    JSON.stringify(missingIcons),
    "utf-8"
  );
}

export async function loadMissingIconData() {
  missingIcons = JSON.parse(
    await fs.readFile("./missingIcons.json", { encoding: "utf8" })
  );
  return missingIcons;
}

export function IndustryIcon({
  className = "",
  name = "",
  color = "#07090F",
}: {
  className: string;
  name: string;
  color?: string;
}) {
  var iconName = name.substring(name.indexOf(">") + 1, name.lastIndexOf("<"));
  const iconSearch = fuseIndustrySearch.search("\""+iconName+"\"");
  if (DEBUG)
    console.log("[IconSearch] Searching for industry icon " + iconName + ": ");
  if (DEBUG) console.log(fuseIndustrySearch.search("\""+iconName+"\""));
  const iconSearchResult = iconSearch[0] && iconSearch[0].score && iconSearch[0].score < LOW_SCORE_CUTOFF
    ? iconSearch[0].item
    : DEFAULT_INDUSTRY_ICON;

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
