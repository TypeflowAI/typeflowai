import Image from "next/image";
import React from "react";
import iconMap from "./components/icon-map";

interface TemplateIconComponentProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: string;
  alt?: string;
}

export const TemplateIconComponent: React.FC<TemplateIconComponentProps> = ({
  icon,
  className,
  style,
  alt = "icon",
  ...props
}) => {
  const IconComponent = iconMap[icon];

  if (IconComponent) {
    return <IconComponent className={className} style={style} />;
  }

  return (
    <div className={className} style={style} {...props}>
      <Image src={icon} alt={alt} layout="fill" />
    </div>
  );
};
