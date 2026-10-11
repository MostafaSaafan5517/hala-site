// The Phosphor icons the site uses (regular weight, Hala's icon family), as SVG source. Content
// names an icon by its key, so the schema can refuse a name that isn't here.
import arrowUpRight from "@phosphor-icons/core/regular/arrow-up-right.svg?raw";
import barbell from "@phosphor-icons/core/regular/barbell.svg?raw";
import calendarCheck from "@phosphor-icons/core/regular/calendar-check.svg?raw";
import checkCircle from "@phosphor-icons/core/regular/check-circle.svg?raw";
import githubLogo from "@phosphor-icons/core/regular/github-logo.svg?raw";
import globe from "@phosphor-icons/core/regular/globe.svg?raw";
import info from "@phosphor-icons/core/regular/info.svg?raw";
import list from "@phosphor-icons/core/regular/list.svg?raw";
import scissors from "@phosphor-icons/core/regular/scissors.svg?raw";
import shieldCheck from "@phosphor-icons/core/regular/shield-check.svg?raw";
import stethoscope from "@phosphor-icons/core/regular/stethoscope.svg?raw";
import x from "@phosphor-icons/core/regular/x.svg?raw";

export const icons = {
  "arrow-up-right": arrowUpRight,
  barbell,
  "calendar-check": calendarCheck,
  "check-circle": checkCircle,
  "github-logo": githubLogo,
  globe,
  info,
  list,
  scissors,
  "shield-check": shieldCheck,
  stethoscope,
  x,
};

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as [IconName, ...IconName[]];
