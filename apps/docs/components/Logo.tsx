import logo from "@/images/logo/logo.svg";
import logoDark from "@/images/logo/logo_dark.svg";
import logomark from "@/images/logo/logomark.svg";
import Image from "next/image";

export function Logomark(props: any) {
  return <Image src={logomark} {...props} alt="TypeflowAI Logomark" />;
}

export function Logo(props: any) {
  return (
    <div>
      <Image src={logo} {...props} alt="TypeflowAI Logo" />
    </div>
  );
}

export function LogoDark(props: any) {
  return (
    <div>
      <Image src={logoDark} {...props} alt="TypeflowAI Logo" />
    </div>
  );
}
