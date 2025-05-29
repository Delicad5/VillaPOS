import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "../contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";

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
  const { tenantId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
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

  // Load settings from Supabase on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!tenantId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("tenant_id", tenantId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching settings:", error);

          // Create default settings if not found
          if (error.code === "PGRST116") {
            const defaultSettings = {
              tenant_id: tenantId,
              theme: "light",
              business_name: "Villa Paradise Resort",
              bank_name: "Bank Central Asia",
              account_number: "1234567890",
              account_holder: "PT Villa Paradise Indonesia",
            };

            const { error: insertError } = await supabase
              .from("settings")
              .insert(defaultSettings);

            if (insertError) {
              console.error("Error creating default settings:", insertError);
            } else {
              console.log("Default settings created successfully");
            }
          }
        }

        if (data) {
          setSettings({
            theme: (data.theme as Theme) || "light",
            businessInfo: {
              name: data.business_name || "Villa Paradise Resort",
            },
            paymentInfo: {
              bankName: data.bank_name || "Bank Central Asia",
              accountNumber: data.account_number || "1234567890",
              accountHolder:
                data.account_holder || "PT Villa Paradise Indonesia",
            },
          });

          // Apply theme to document body
          document.body.className = data.theme || "light";
        }
      } catch (error) {
        console.error("Error fetching settings from Supabase", error);
        // Use default settings
        setSettings({
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [tenantId]);

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

  const handleSaveSettings = async () => {
    if (!tenantId) {
      toast({
        title: t("settings.saveError"),
        description: "No tenant ID found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save to Supabase
      const { error } = await supabase.from("settings").upsert(
        {
          tenant_id: tenantId,
          theme: settings.theme,
          business_name: settings.businessInfo.name,
          bank_name: settings.paymentInfo.bankName,
          account_number: settings.paymentInfo.accountNumber,
          account_holder: settings.paymentInfo.accountHolder,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "tenant_id" },
      );

      if (error) throw error;

      // Apply theme immediately
      document.body.className = settings.theme;

      toast({
        title: t("settings.saveSuccess"),
        description: t("settings.saveSuccessDescription"),
      });
    } catch (error) {
      console.error("Error saving settings to Supabase", error);
      toast({
        title: t("settings.saveError"),
        description: "Failed to save settings to database.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading settings...
      </div>
    );
  }

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
