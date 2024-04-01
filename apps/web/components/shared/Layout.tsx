import Footer from "./Footer";
import Header from "./Header";
import MetaInformation from "./MetaInformation";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  inverted?: boolean;
}

export default function Layout({ title, description, children, inverted }: LayoutProps) {
  return (
    <div className="mx-auto w-full">
      <MetaInformation title={title} description={description} />
      <Header inverted={inverted} />
      {<main>{children}</main>}
      <Footer />
    </div>
  );
}
