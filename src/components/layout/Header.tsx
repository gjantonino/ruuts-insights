
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFarm } from "@/context/FarmContext";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function Header({ title, subtitle, showSearch }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { searchFarms } = useFarm();

  const getPageTitle = () => {
    if (title) return title;

    const path = location.pathname;
    if (path === "/") return t("navigation.dashboard");
    if (path === "/farms") return t("navigation.farms");
    if (path.startsWith("/farms/")) return t("navigation.farmDetails");
    if (path === "/add-farm") return t("navigation.addFarm");
    if (path === "/analytics") return t("navigation.analytics");
    if (path === "/export") return t("navigation.export");
    return "";
  };

  return (
    <header className="border-b px-6 py-4 sticky top-0 z-10 bg-background mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        
        {showSearch && (
          <div className="relative hidden sm:block w-64 lg:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder={t("common.search")}
              className="pl-8 neumorph-inset dark:neumorph-dark-inset"
              onChange={(e) => searchFarms(e.target.value)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
