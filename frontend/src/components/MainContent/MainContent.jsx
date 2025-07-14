import { useEffect, useRef } from "react";
import "./MainContent.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Aos from "aos";
// import "aos/dist/aos.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const sections = [
  {
    id: 1,
    type: "horizontal",
    texts: ["Beyond", "Innovation", "Medicine"],
  },
  {
    id: 2,
    type: "vertical",
    texts: [
      "보이지 않는 곳에서 인류의 혁신을 준비합니다.",
      "현실을 꿈으로 이끄는 백일몽의 혁신 ",
    ],
  },
  {
    id: 3,
    type: "horizontal",
    texts: ["Beyond", "Innovation in", "Medicine"],
  },
];

function MainContent() {
  const sectionRefs = useRef([]);
  sectionRefs.current = [];

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  useEffect(() => {
    sectionRefs.current.forEach((section) => {
      const texts = section.querySelectorAll("h1,h2");
      texts.forEach((text, i) => {
        gsap.fromTo(
          text,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: i * 0.3,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });
  }, []);

  return (
    <>
      <main className="fullpage-container">
        {sections.map((section) => (
          <section
            key={section.id}
            className={`section section-${section.id}`}
            ref={addToRefs}
          >
            <div className="content">
              {/* section.id가 1일 경우 순차적 애니메이션을 적용합니다. */}
              {section.type === "horizontal" ? (
                <div className="horizontal-text-container">
                  <h1>{section.texts[0]}</h1>
                  <h1 className="subtitle">{section.texts[1]}</h1>
                  <h1>{section.texts[2]}</h1>
                </div>
              ) : (
                // 그 외 섹션은 기존 방식을 유지합니다.
                <div>
                  <h2>{section.texts[0]}</h2>
                  <h2>{section.texts[1]}</h2>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}

export default MainContent;
