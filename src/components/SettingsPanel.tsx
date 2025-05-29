import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "../contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

type Theme = "light" | "dark" | "corporate-blue" | "nature-green";

interface BusinessInfo {
  name: string;
}

interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface SettingsState {
  theme: Theme;
  businessInfo: BusinessInfo;
  paymentInfo: PaymentInfo;
}

const SettingsPanel: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SettingsState>({
    theme: "light",
    businessInfo: {
      name: "Villa Paradise Resort",
    },
    paymentInfo: {
      bankName: "Bank Central Asia",
      accountNumber: "1234567890",
      accountHolder: "PT Villa Paradise Indonesia",
    },
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("villaSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error("Error parsing settings from localStorage", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("villaSettings", JSON.stringify(settings));
  }, [settings]);

  const handleThemeChange = (value: Theme) => {
    setSettings((prev) => ({
      ...prev,
      theme: value,
    }));

    // Apply theme to document body
    document.body.className = value;
  };

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [name]: value,
      },
    }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        [name]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem("villaSettings", JSON.stringify(settings));
    // Apply theme immediately
    document.body.className = settings.theme;
    toast({
      title: t("settings.saveSuccess"),
      description: t("settings.saveSuccessDescription"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("settings.title")}</h2>
        <Button onClick={handleSaveSettings}>{t("general.save")}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme">{t("settings.theme")}</Label>
              <RadioGroup
                value={settings.theme}
                onValueChange={(value) => handleThemeChange(value as Theme)}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="cursor-pointer">
                    {t("settings.lightMode")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="cursor-pointer">
                    {t("settings.darkMode")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporate-blue" id="corporate-blue" />
                  <Label htmlFor="corporate-blue" className="cursor-pointer">
                    {t("settings.corporateBlue")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nature-green" id="nature-green" />
                  <Label htmlFor="nature-green" className="cursor-pointer">
                    {t("settings.natureGreen")}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.businessInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">{t("settings.businessName")}</Label>
              <Input
                id="businessName"
                name="name"
                placeholder={t("settings.businessNamePlaceholder")}
                value={settings.businessInfo.name}
                onChange={handleBusinessInfoChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.paymentInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">{t("settings.bankName")}</Label>
              <Input
                id="bankName"
                name="bankName"
                placeholder={t("settings.bankNamePlaceholder")}
                value={settings.paymentInfo.bankName}
                onChange={handlePaymentInfoChange}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">
                {t("settings.accountNumber")}
              </Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder={t("settings.accountNumberPlaceholder")}
                value={settings.paymentInfo.accountNumber}
                onChange={handlePaymentInfoChange}
              />
            </div>
            <div>
              <Label htmlFor="accountHolder">
                {t("settings.accountHolder")}
              </Label>
              <Input
                id="accountHolder"
                name="accountHolder"
                placeholder={t("settings.accountHolderPlaceholder")}
                value={settings.paymentInfo.accountHolder}
                onChange={handlePaymentInfoChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
