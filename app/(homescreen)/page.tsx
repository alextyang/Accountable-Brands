import { AboutSection } from "./aboutSection";
import { SplashScreen } from "./splashScreen";

export default function HomePage() {
  return (
    <main className="flex min-h-screen overflow-x-hidden flex-col items-center justify-start align-middle p-16">
      <SplashScreen />
      <AboutSection />
    </main>
  );
}
