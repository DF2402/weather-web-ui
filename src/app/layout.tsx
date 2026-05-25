import '../index.css'; 
import { LocationProvider } from "./context/locationContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}