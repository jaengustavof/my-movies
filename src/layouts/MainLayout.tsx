import { Header } from "../components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">{children}</main>
    </div>
  );
};
