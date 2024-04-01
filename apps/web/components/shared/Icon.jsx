import { InstallationIcon } from "@/components/shared/icons/InstallationIcon";
import { LightbulbIcon } from "@/components/shared/icons/LightbulbIcon";
import { PluginsIcon } from "@/components/shared/icons/PluginsIcon";
import { PresetsIcon } from "@/components/shared/icons/PresetsIcon";
import { ThemingIcon } from "@/components/shared/icons/ThemingIcon";
import { WarningIcon } from "@/components/shared/icons/WarningIcon";
import clsx from "clsx";
import { useId } from "react";

const icons = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon,
};

const iconStyles = {
  slate: "[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]",
  amber: "[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]",
};

export function Icon({ color = "slate", icon, className, ...props }) {
  let id = useId();
  let IconComponent = icons[icon];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={clsx(className, iconStyles[color])}
      {...props}>
      <IconComponent id={id} color={color} />
    </svg>
  );
}

const gradients = {
  slate: [
    { stopColor: "#0EA5E9" },
    { stopColor: "#22D3EE", offset: ".527" },
    { stopColor: "#818CF8", offset: 1 },
  ],
  amber: [
    { stopColor: "#FDE68A", offset: ".08" },
    { stopColor: "#F59E0B", offset: ".837" },
  ],
};

export function Gradient({ color = "slate", ...props }) {
  return (
    <radialGradient cx={0} cy={0} r={1} gradientUnits="userSpaceOnUse" {...props}>
      {gradients[color].map((stop, stopIndex) => (
        <stop key={stopIndex} {...stop} />
      ))}
    </radialGradient>
  );
}

export function LightMode({ className, ...props }) {
  return <g className={clsx("dark:hidden", className)} {...props} />;
}

export function DarkMode({ className, ...props }) {
  return <g className={clsx("hidden dark:inline", className)} {...props} />;
}
