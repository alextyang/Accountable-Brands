import Footer from "../(content)/footer";
import { SplashScreen } from "./splashScreen";

import { Faq } from "./(about)/faq";
import { CrowdsourcedExplainer } from "./(about)/crowdsourcedExplainer";
import { ReportExplainer } from "./(about)/reportExplainer";
import { MissionStatement } from "./(about)/missionStatement";
export default function HomePage() {
  return (
    <>
      <main className="flex flex-col items-center justify-start min-h-screen px-6 pb-16 pt-[8vh] overflow-x-hidden align-middle sm:px-16">
        <SplashScreen />

        <div
          className="flex flex-col items-center justify-start w-full text-center -mt-14">
          <MissionStatement />
          <ReportExplainer />
          <CrowdsourcedExplainer />
          <Faq />
        </div>

      </main>
      <Footer />
    </>
  );
}
