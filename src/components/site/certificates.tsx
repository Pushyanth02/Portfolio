import { memo } from "react";
import { SectionBadge } from "./section-icons";
import CertRevealView from "./cert-reveal-view";
import { assetUrl } from "@/lib/utils";

/**
 * Certificates — the section that replaced "Side Quests".
 *
 * The rows are rendered by the Originkit "Hover Image Reveal" component
 * (wrapped in a thin responsive shell): moving through the certificate
 * names floats a cursor-following image window that switches to the
 * matching certificate (spring motion + stacked sliding panes, exactly as
 * Originkit ships it). Row texts stay intentionally short — the component
 * renders each row with `whiteSpace: pre` (one unwrapped line); the long
 * official titles + issuers live only in the image alt text (reference
 * metadata in the CERTS records below — no rendered name/detail list, the
 * reveal images ARE the certificates).
 *
 * The reveal window fits the WHOLE certificate (`contain` over a paper
 * back) and is bounds-clamped inside the stage, so hovering the first or
 * last row never clips it — and on hover-less devices a tap on a row
 * opens the same window at the tap point. The certificate images are the
 * viewer: the student surface carries NO outbound pdf links (the dev
 * universe keeps its terminal `ls ~/certs` links). The dev universe
 * renders its own terminal skin over the same Originkit component
 * (dev-certificates.tsx).
 */

export type Cert = {
  /** Short row text shown in the reveal list (Originkit `text`). */
  text: string;
  /** Rendered certificate image (Originkit `image.src`). */
  src: string;
  /** Full official title (reference metadata; surfaces via `alt`). */
  title: string;
  /** Issuing organization (reference metadata). */
  issuer: string;
  /** Full certificate PDF (Originkit `link` — used by the dev universe). */
  link: string;
  alt: string;
};

export const CERTS: Cert[] = [
  {
    text: "Data Analytics",
    src: "/art/certs/cisco-data-analytics.webp",
    title: "Data Analytics Essentials",
    issuer: "Cisco Networking Academy",
    link: "/art/certs/cisco-data-analytics.pdf",
    alt: "Cisco Networking Academy certificate: Data Analytics Essentials",
  },
  {
    text: "Cyber Security",
    src: "/art/certs/infosys-cyber-security.webp",
    title: "Introduction to Cyber Security",
    issuer: "Infosys Springboard",
    link: "/art/certs/infosys-cyber-security.pdf",
    alt: "Infosys certificate: Introduction to Cyber Security",
  },
  {
    text: "C Programming",
    src: "/art/certs/c-certificate.webp",
    title: "Computer Programming (C) — Certificate of Appreciation",
    issuer: "iamneo · an NIIT venture",
    link: "/art/certs/c-certificate.pdf",
    alt: "iamneo (NIIT venture) certificate of appreciation: Computer Programming in C",
  },
  {
    text: "Intermediate Git",
    src: "/art/certs/git-intermediate.webp",
    title: "Intermediate Git",
    issuer: "DataCamp",
    link: "/art/certs/git-intermediate.pdf",
    alt: "DataCamp certificate: Intermediate Git",
  },
  {
    text: "Introduction to Git",
    src: "/art/certs/git-introduction.webp",
    title: "Introduction to Git",
    issuer: "DataCamp",
    link: "/art/certs/git-introduction.pdf",
    alt: "DataCamp certificate: Introduction to Git",
  },
];

/** Originkit `items` shape (itemCount + item1..item6) built from CERTS.
 *  Student rows are plain hover/tap targets — no `link`, so nothing in the
 *  student surface opens the pdfs. */
export function certItems(): Record<string, unknown> {
  const items: Record<string, unknown> = {
    itemCount: CERTS.length,
  };
  CERTS.forEach((c, i) => {
    items[`item${i + 1}`] = {
      text: c.text,
      image: { src: assetUrl(c.src), alt: c.alt },
    };
  });
  return items;
}

export const Certificates = memo(function Certificates() {
  return (
    <section className="sec certs" id="certs">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="certs" />
        </div>
        <p className="kicker reveal">the paper trail</p>
        <h2 className="h2">
          <span className="lm">
            <span className="lm-in">Certificates.</span>
          </span>
        </h2>

        {/* Originkit Hover Image Reveal (responsive shell) — hover a name
            and the whole certificate floats after the cursor; on touch, tap
            a row and it opens at the tap point */}
        <div className="cert-reveal reveal">
          <CertRevealView
            items={certItems()}
            baseWidth={330}
            baseHeight={232}
            viewportMargin={64}
            align="center"
            rowGap={22}
            rounded={14}
            offsetX={110}
            followStrength={5}
            imageFit="contain"
            imageBackgroundColor="#FDFAF2"
            font={{
              fontFamily: "var(--disp)",
              fontWeight: 700,
              fontSize: "clamp(1.45rem, 5.4vw, 3.1rem)",
              lineHeight: "1.12em",
              letterSpacing: "-0.018em",
              textAlign: "center",
            }}
            textColor="#FBF6EC"
            dimColor="rgba(244, 241, 228, 0.5)"
            backgroundColor="transparent"
          />
        </div>

        <p className="cert-hint reveal" aria-hidden="true">
          hover — or tap — a name to meet the certificate
        </p>
      </div>
    </section>
  );
});
