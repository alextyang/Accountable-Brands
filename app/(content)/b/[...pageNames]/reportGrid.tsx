"use client";

import { Icon } from "@/app/lib/icons/ui-icons";
import ActionMenu from "./actionMenu";
import { ReportPage, REPORT_TYPES } from "@/app/lib/definitions";
import {
  ForwardedRef,
  MutableRefObject,
  RefObject,
  SetStateAction,
  createRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import {
  usePathname,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

export function ReportGrid({ reports }: { reports: ReportPage[] }) {
  const params = useParams();
  const [brandName, reportName] = [
    decodeURIComponent(params.pageNames[0]),
    decodeURIComponent(params.pageNames[1]),
  ];

  const [openReport, setOpenReport] = useState(
    reports.map((report) => report.title).indexOf(brandName + "/" + reportName)
  ); // Index of currently open modal, -1 for none
  const [shouldAnimate, setShouldAnimate] = useState(
    openReport == -1 ? true : false
  );

  const [modalOriginBox, setModalOriginBox] = useState<DOMRect | undefined>(
    undefined
  ); // Save starting bounds for modal animation
  const [modalOffsetBox, setModalOffsetBox] = useState<DOMRect | undefined>(
    undefined
  ); // Save starting bounds for modal animation
  const gridRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const reportDivRefs: MutableRefObject<HTMLDivElement | null>[] = Array(
    reports.length
  ).fill(useRef(null)); // Maintain references to each potential starting div

  const duration = 300; // Modal animation duration
  const TOTAL_DURATION = 500; // Modal animation duration

  useEffect(() => {
    function navHandler(ev: PopStateEvent) {
      if (!reports) return;

      const newReportName = decodeURI(window.location.pathname.substring(3));
      const newReportIndex = reports
        .map((report) => report.title)
        .indexOf(newReportName);

      if (newReportIndex != openReport) {
        console.log("[Page] URL changed to ", window.location.pathname);
        console.log(
          "[Page] Switching index from " + openReport + " to ",
          newReportIndex
        );
        setTimeout(() => {
          setShouldAnimate(false);
          setReport(newReportIndex);
        }, 0);
      }
    }
    window.addEventListener("popstate", navHandler);

    return () => {
      window.removeEventListener("popstate", navHandler);
    };
  });

  const setReport = (index: number) => {
    console.log(
      "[Grid] " + (index != -1 ? "Opening" : "Closing") + " report ",
      index
    );

    if (index != -1)
      setModalOriginBox(getBox(reportDivRefs[index].current)); // Save corresponding bounding box
    else if (openReport != -1)
      setModalOriginBox(getBox(reportDivRefs[openReport].current)); // Save old bounding box

    setModalOffsetBox(getBox(gridRef.current)); // Save offset bounding box
    setOpenReport(index); // Save open report
    setShouldAnimate(true);
  };

  const saveNavigation = () => {
    let url = window.location.href.substring(0, window.location.href.indexOf(window.location.pathname)) + "/b/";
    if (openReport == -1) url += encodeURIComponent(brandName);
    else url += encodeURIComponent(brandName) + '/' + encodeURIComponent(reports[openReport].title.substring(reports[openReport].title.indexOf('/') + 1));

    window.history.pushState(null, "", url);
    console.log("[Page] Shallow nav-ed to ", url);
  };

  const getBox = (div: HTMLDivElement | null) => {
    if (div == null) return undefined;
    const box = div?.getBoundingClientRect();
    return new DOMRect(box.left, box.top, box.width, box.height);
  };

  return (
    <div className="h-full underline-links">
      <div
        ref={gridRef}
        className="relative flex flex-row flex-wrap h-full mt-1 -m-2 justify-stretch"
      >
        {" "}
        {/* Report Grid */}
        {reports.map((report, index) => {
          return (
            <ReportItemForwarded
              key={index}
              report={report}
              ref={reportDivRefs[index]}
              index={index}
              openReport={openReport}
              setOpenReport={setReport}
            ></ReportItemForwarded>
          );
        })}
        <div className="h-48 grow">
          {" "}
          <div className="w-full"></div>{" "}
        </div>
        <div className={shouldAnimate ? "" : "hidden"}>
          <Transition
            in={openReport != -1}
            timeout={duration}
            onEntering={() => saveNavigation()}
            onExiting={() => saveNavigation()}
          >
            {(state) => (
              <div>
                <AnimatedReportModal
                  duration={duration}
                  state={state}
                  report={reports[openReport]}
                  setOpenReport={setReport}
                  modalOffsetBox={modalOffsetBox}
                  modalOriginBox={modalOriginBox}
                />
                {reports[openReport] ? (
                  <div className="">
                    <Icon
                      name="close"
                      className="z-20 !block fixed top-2 right-4 xl:top-6 xl:right-6 w-14 h-14 pointer-events-none"
                      color="rgb(216 193 172 / 0.8)"
                    />
                  </div>
                ) : (
                  ""
                )}
                {reports[openReport] ? (
                  <div
                    className="fixed top-0 bottom-0 left-0 right-0 z-10 opacity-0 cursor-pointer "
                    onClick={() => setReport(-1)}
                  ></div>
                ) : (
                  ""
                )}
              </div>
            )}
          </Transition>
        </div>
        <div className={shouldAnimate && openReport != -1 ? "hidden" : ""}>
          <StaticReportModal
            report={reports[openReport]}
            setOpenReport={(i: number) => {
              setReport(i);
            }}
          />
          {reports[openReport] ? (
            <div className="">
              <Icon
                name="close"
                className="z-20 !block fixed top-2 right-4 xl:top-6 xl:right-6 w-14 h-14 pointer-events-none"
                color="rgb(216 193 172 / 0.8)"
              />
            </div>
          ) : (
            ""
          )}
          {reports[openReport] ? (
            <div
              className="fixed top-0 bottom-0 left-0 right-0 z-10 opacity-0 cursor-pointer "
              onClick={() => {
                setReport(-1);
              }}
            ></div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

const ReportItemForwarded = forwardRef<
  HTMLDivElement,
  {
    report: ReportPage | undefined;
    openReport: number;
    index: number;
    setOpenReport: Function;
  }
>(ReportItem);

function ReportItem(
  {
    report,
    index,
    openReport,
    setOpenReport,
  }: {
    report: ReportPage | undefined;
    openReport: number;
    index: number;
    setOpenReport: Function;
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  if (!report) return "";
  const isThisReportOpen = index == openReport;

  return (
    <div
      ref={ref}
      className={
        "relative h-44 sm:h-40 md:h-44 lg:h-52 2xl:h-60 3xl:h-56 basis-full lg:basis-1/2 2xl:basis-1/3  " +
        (openReport != -1
          ? "-z-10 pointer-events-none"
          : "z-10 pointer-events-auto")
      }
    >
      {" "}
      {/* Flex Item */}
      <a
        className={
          "z-10 absolute top-0 bottom-0 right-0 left-0 opacity-0 hover:opacity-100 cursor-pointer " +
          (isThisReportOpen ? "opacity-0 " : "")
        }
        onClick={(e) => {
          setOpenReport(index);
        }}
      >
        {" "}
        {/* Link Overlay */}
        <Icon name="expand" className="absolute right-6 bottom-6 h-14 w-14" />
      </a>
      <div
        className={
          "absolute top-0 bottom-0 right-0 left-0 m-2 border-black border-6 bg-tan/60"
        }
      >
        {" "}
        {/* Visual Box */}
        <div
          className={
            "absolute top-0 bottom-2 sm:bottom-3 md:bottom-2 right-0 left-0 pl-3 pr-2.5 py-2.5 overflow-hidden"
          }
        >
          {" "}
          {/* Text cut off */}
          <div
            className={
              "float-right relative ml-32 w-14 h-14 p-1 " +
              REPORT_TYPES[report.type].color
            }
          >
            {" "}
            {/* Type Icon & Labels */}
            <Icon
              className={REPORT_TYPES[report.type].iconStyle}
              name={REPORT_TYPES[report.type].icon}
              color="#D8C1AC"
            />
            <div className="absolute top-0 text-right right-16 ">
              {" "}
              {/* Date & Type Label */}
              <p className="text-sm font-medium whitespace-nowrap ">
                {report.timeframe}
              </p>
              <p
                className={
                  "text-sm whitespace-nowrap font-medium -mt-1 " +
                  REPORT_TYPES[report.type].text
                }
              >
                {REPORT_TYPES[report.type].name}
              </p>
            </div>
          </div>
          {/* Title */}
          <div className="-mt-0">
            <p className="text-xl font-medium leading-tight tracking-tight md:text-2xl text-balance">
              {report.title.substring(report.title.indexOf("/") + 1)}
            </p>
          </div>
          {/* Content Preview */}
          <p className="text-base mt-1 ml-0.5 mr-20 line-clamp-4 sm:line-clamp-3 md:line-clamp-4 xl:line-clamp-5">
            {report.preview}
          </p>{" "}
        </div>
      </div>
    </div>
  );
}

function AnimatedReportModal({
  duration,
  state,
  report,
  setOpenReport,
  modalOriginBox,
  modalOffsetBox,
}: {
  duration: number;
  state: TransitionStatus;
  report: ReportPage | undefined;
  setOpenReport: Function;
  modalOriginBox: DOMRect | undefined;
  modalOffsetBox: DOMRect | undefined;
}) {
  if (!modalOriginBox || !modalOffsetBox || !report) return "";
  const origin = {
    top: modalOriginBox.top, // - modalOffsetBox.top,
    height: modalOriginBox.height,
    left: modalOriginBox.left, // - modalOffsetBox.left,
    width: modalOriginBox.width,
    backgroundColor: "rgba(7, 9, 15, 0)",
    opacity: "0",
  };

  return (
    <div
      style={{
        transition: `left 300ms ease-out, top 300ms ease-out, width 300ms ease-out, height 300ms ease-out, background 400ms ease-in-out`,
        transitionDelay: "0ms,0ms,0ms,0ms,300ms",
        ...origin,
        ...{
          entering: origin,
          exited: origin,
          entered: {
            top: "0px",
            height: "100%",
            left: "0px",
            width: "100%",
            opacity: "100%",
            backgroundColor: "rgba(7, 9, 15, 0.4)",
          },
          exiting: { ...origin },
          unmounted: origin,
        }[state],
      }}
      className={
        "fixed z-20 w-full h-full flex flex-col items-center justify-center content-center pointer-events-none"
      }
    >
      {report ? (
        <div
          style={{
            transition: `background-color 10ms ease-out 0ms, max-height 1000ms ease-in-out 300ms, margin-top 300ms`,
            maxWidth: "1180px",
            marginTop: "72px",
            ...{
              entering: {
                backgroundColor: "rgb(216 193 172 / 0.0)",
                flexGrow: "10",
              },
              exited: {},
              entered: {
                backgroundColor: "rgb(216 193 172 / 1)",
                flexGrow: "0.001",
                maxHeight: "100%",
              },
              exiting: {},
              unmounted: {},
            }[state],
          }}
          className={
            "report-container opacity-100 relative pointer-events-auto overflow-hidden z-30 m-2 pl-3 pr-2.5 py-2.5  border-black border-6 transition-colors max-h-44 sm:max-h-40 md:max-h-44 lg:max-h-52 2xl:max-h-60 3xl:max-h-56 bg-tan/60 xl:!mt-2"
          }
        >
          {" "}
          {/* Visual Box */}
          <div className="flex flex-col float-right">
            <div
              style={{
                transition: `margin-left 300ms,height 600ms ease-in-out 680ms`,
                ...{
                  entering: {},
                  exited: {},
                  entered: {
                    marginLeft: "0",
                    height: REPORT_TYPES[report.type].textLength,
                  },
                  exiting: {},
                  unmounted: {},
                }[state],
              }}
              className={
                "z-30 overflow-y-hidden relative ml-32 w-14 h-14 p-1 overflow-hidden " +
                REPORT_TYPES[report.type].color
              }
            >
              {" "}
              {/* Type Icon & Labels */}
              <Icon
                className={REPORT_TYPES[report.type].iconStyle + " !block "}
                name={REPORT_TYPES[report.type].icon}
                color="#D8C1AC"
              />
              <div
                style={{
                  transition: `right 300ms ease-in 0ms, opacity 300ms ease-in 0ms`,
                  ...{
                    entering: {},
                    exited: {},
                    entered: { right: "0", opacity: "0" },
                    exiting: {},
                    unmounted: {},
                  }[state],
                }}
                className="absolute top-0 z-20 text-right opacity-100 right-16 "
              >
                {" "}
                {/* Date & Type Label */}
                <p className="text-sm font-medium whitespace-nowrap ">
                  {report.timeframe}
                </p>
                <p
                  className={
                    "text-sm whitespace-nowrap font-medium -mt-1 " +
                    REPORT_TYPES[report.type].text
                  }
                >
                  {REPORT_TYPES[report.type].name}
                </p>
              </div>
              <p
                className={
                  "text-3xl whitespace-nowrap font-semibold rotate-90 mt-3.5 text-tan"
                }
              >
                {REPORT_TYPES[report.type].name}
              </p>
            </div>
            <ActionMenu
              pageName={report.title}
              pageUrlName={encodeURIComponent(report.title)}
            />
          </div>
          {/* Small->Large Title  */}
          <div
            style={{
              transition: ``,
              ...{
                entering: {},
                exited: {},
                entered: {},
                exiting: {},
                unmounted: {},
              }[state],
            }}
            className=""
          >
            <p
              style={{
                transition: `transform 350ms ease-in-out, margin-bottom 350ms ease-in-out, padding 350ms ease-in-out, opacity 0ms ease-in 800ms `,
                transformOrigin: "top left",
                ...{
                  entering: {
                    transform: "scale(1)",
                    marginBottom: "0px",
                    padding: "0 0 0 0",
                  },
                  exited: {},
                  entered: {
                    transform: "scale(1.5)",
                    marginBottom: "0px",
                    padding: "0.1rem 40% 0.5rem 0.25rem",
                    opacity: "0",
                  },
                  exiting: {},
                  unmounted: {},
                }[state],
              }}
              className="absolute -mt-0 text-xl font-medium leading-tight tracking-tight md:text-2xl h-min text-balance"
            >
              {report.title.substring(report.title.indexOf("/") + 1)}
            </p>
          </div>
          {/* White->Black Title  */}
          <div
            style={{
              transition: `clip-path 600ms ease-in-out 350ms`,
              top: "10.5px",
              marginRight: "4.7rem",
              ...{
                entering: { clipPath: "rect(0 0 100% 0)" },
                exited: {},
                entered: { clipPath: "rect(0 100% 100% 0)" },
                exiting: {},
                unmounted: {},
              }[state],
            }}
            className="absolute right-0 z-40 flex pb-1 overflow-hidden bg-black left-3"
          >
            <p className="w-full p-1 pl-2 -mt-0 text-3xl font-medium leading-tight tracking-tight md:text-4xl h-min text-tan text-balance">
              {report.title.substring(report.title.indexOf("/") + 1)}
            </p>
          </div>
          {/* Spacer Title  */}
          <p
            style={{
              top: "10.5px",
              paddingRight: "4.7rem",
            }}
            className="w-full p-1 pl-2 -mt-0 text-3xl font-medium leading-tight tracking-tight opacity-0 pointer-events-none md:text-4xl h-min text-balance"
          >
            {report.title.substring(report.title.indexOf("/") + 1)}
          </p>
          {/* Fading out Preview  */}
          <p
            style={{
              transition: `opacity 250ms ease-in-out 0ms, max-height 0ms ease-out 400ms`,
              ...{
                entering: { opacity: "100%" },
                exited: {},
                entered: { opacity: "0%", maxHeight: "0%" },
                exiting: {},
                unmounted: {},
              }[state],
            }}
            className="text-base absolute mt-1 ml-0.5 mr-20 max-h-full line-clamp-4 sm:line-clamp-3 md:line-clamp-4 xl:line-clamp-5"
          >
            {report.preview}
          </p>
          {/* Fading in Content  */}
          <div
            style={{
              transition: `opacity 300ms ease-in-out 250ms`,
              ...{
                entering: { opacity: "0%" },
                exited: {},
                entered: { opacity: "100%" },
                exiting: {},
                unmounted: {},
              }[state],
            }}
            className="report-content text-base m-2.5 mt-1 mr-16 "
          >
            {/* Dates Subheader  */}
            <div className="mt-3 -mb-4 text-base font-semibold whitespace-nowrap ">
              {report.timeframe}
            </div>
            {report.content}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function StaticReportModal({
  report,
  setOpenReport,
}: {
  report: ReportPage | undefined;
  setOpenReport: Function;
}) {
  if (!report) return "";

  return (
    <div
      style={{
        top: "0px",
        height: "100%",
        left: "0px",
        width: "100%",
        opacity: "100%",
        backgroundColor: "rgba(7, 9, 15, 0.4)",
      }}
      className={
        "fixed z-20 w-full h-full flex flex-col items-center justify-center content-center pointer-events-none"
      }
    >
      {report ? (
        <div
          style={{
            maxWidth: "1180px",
            marginTop: "72px",
            backgroundColor: "rgb(216 193 172 / 1)",
            flexGrow: "0.001",
            maxHeight: "100%",
          }}
          className={
            "report-container opacity-100 relative pointer-events-auto overflow-hidden z-30 m-2 pl-3 pr-2.5 py-2.5  border-black border-6 transition-colors max-h-44 sm:max-h-40 md:max-h-44 lg:max-h-52 2xl:max-h-60 3xl:max-h-56 bg-tan/60 xl:!mt-2"
          }
        >
          {" "}
          {/* Visual Box */}
          <div className="flex flex-col float-right">
            <div
              style={{
                marginLeft: "0",
                height: REPORT_TYPES[report.type].textLength,
              }}
              className={
                "z-30 overflow-y-hidden relative ml-32 w-14 h-14 p-1 overflow-hidden " +
                REPORT_TYPES[report.type].color
              }
            >
              {" "}
              {/* Type Icon & Labels */}
              <Icon
                className={REPORT_TYPES[report.type].iconStyle + " !block "}
                name={REPORT_TYPES[report.type].icon}
                color="#D8C1AC"
              />
              <div
                style={{ right: "0", opacity: "0" }}
                className="absolute top-0 z-20 text-right opacity-100 right-16 "
              >
                {" "}
                {/* Date & Type Label */}
                <p className="text-sm font-medium whitespace-nowrap ">
                  {report.timeframe}
                </p>
                <p
                  className={
                    "text-sm whitespace-nowrap font-medium -mt-1 " +
                    REPORT_TYPES[report.type].text
                  }
                >
                  {REPORT_TYPES[report.type].name}
                </p>
              </div>
              <p
                className={
                  "text-3xl whitespace-nowrap font-semibold rotate-90  mt-3.5 text-tan "
                }
              >
                {REPORT_TYPES[report.type].name}
              </p>
            </div>
            <ActionMenu
              pageName={report.title}
              pageUrlName={encodeURIComponent(report.title)}
            />
          </div>
          {/* White->Black Title  */}
          <div
            style={{
              top: "10.5px",
              marginRight: "4.7rem",
              clipPath: "rect(0 100% 100% 0)",
            }}
            className="absolute right-0 z-40 flex pb-1 overflow-hidden bg-black left-3"
          >
            <p className="w-full p-1 pl-2 -mt-0 text-3xl font-medium tracking-tight md:text-4xl h-min text-tan text-balance">
              {report.title.substring(report.title.indexOf("/") + 1)}
            </p>
          </div>
          {/* Spacer Title  */}
          <p
            style={{
              top: "10.5px",
              paddingRight: "4.7rem",
            }}
            className="w-full p-1 pl-2 -mt-0 text-3xl font-medium tracking-tight opacity-0 pointer-events-none md:text-4xl h-min text-balance"
          >
            {report.title.substring(report.title.indexOf("/") + 1)}
          </p>
          {/* Fading out Preview  */}
          <p
            style={{ opacity: "0%", maxHeight: "0%" }}
            className="text-base absolute mt-1 ml-0.5 mr-20 max-h-full line-clamp-4 sm:line-clamp-3 md:line-clamp-4 xl:line-clamp-5"
          >
            {report.preview}
          </p>
          {/* Fading in Content  */}
          <div
            style={{ opacity: "100%" }}
            className="report-content text-base m-2.5 mt-1 mr-16 "
          >
            {/* Dates Subheader  */}
            <div className="mt-3 -mb-4 text-base font-semibold whitespace-nowrap ">
              {report.timeframe}
            </div>
            {report.content}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
