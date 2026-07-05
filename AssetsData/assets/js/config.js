// IT Asset & PM Dashboard config
// First test: keep DEMO_MODE true. Login: user / password. Data saves in browser localStorage.
// Production: set DEMO_MODE false and paste Supabase URL + anon key. Create users in Supabase Auth.
const APP_CONFIG = {
  DEMO_MODE: false,
  DEMO_USERNAME: "user",
  DEMO_PASSWORD: "password",
  SUPABASE_URL: "https://nffhnpmalprochrbnonn.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZmhucG1hbHByb2NocmJub25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNTMxMjUsImV4cCI6MjA5ODcyOTEyNX0.6HuqRBC1MK8TZRtJL-FDFEWaXzZkB_jxIGMfPlVMSkU",
  MAIL_FUNCTION_URL: "https://nffhnpmalprochrbnonn.supabase.co/functions/v1/send-pm-email",
  NOTIFICATION_EMAIL: "adhakad484@gmail.com",
  COMPANY_NAME: "CodeWithAbhishekDhakad",
  ASSET_TYPES: ["Laptop", "Desktop", "Printer", "Switch", "Access Point", "CCTV", "Server", "Telephone", "UPS", "Firewall", "Other"]
};
