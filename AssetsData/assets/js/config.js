// IT Asset & PM Dashboard config
// First test: keep DEMO_MODE true. Login: user / password. Data saves in browser localStorage.
// Production: set DEMO_MODE false and paste Supabase URL + anon key. Create users in Supabase Auth.
const APP_CONFIG = {
  DEMO_MODE: true,
  DEMO_USERNAME: "user",
  DEMO_PASSWORD: "password",
  SUPABASE_URL: "https://nffhnpmalprochrbnonn.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_ZxmGCBe1QbD_AdNexuFe6A_8GMWizDP",
  COMPANY_NAME: "CodeWithAbhishekDhakad",
  ASSET_TYPES: ["Laptop", "Desktop", "Printer", "Switch", "Access Point", "CCTV", "Server", "Telephone", "UPS", "Firewall", "Other"]
};
