import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-xs sm:text-sm"
    >
      {language === "en" ? "ID" : "EN"}
    </Button>
  );
};

export default LanguageSwitcher;
