import Footer from "../(content)/footer";
import { AboutSection } from "./aboutSection";
import { SplashScreen } from "./splashScreen";

export default function HomePage() {
  return (
    <>
      <main className="flex flex-col items-center justify-start min-h-screen px-6 pb-16 pt-[8vh] overflow-x-hidden align-middle sm:px-16">
        <SplashScreen />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
