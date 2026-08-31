import { memo } from "react";
import { CERTS, certItems } from "@/components/site/certificates";
import { SectionBadge } from "@/components/site/section-icons";
import { DevWindow } from "./dev-window";
import CertRevealView from "@/components/site/cert-reveal-view";
import { assetUrl } from "@/lib/utils";

/**
 * DevCertificates — certificates rendered in the terminal universe.
 * Same Originkit "Hover Image Reveal" component as the student surface
 * (same CERTS data, responsive shell, whole-certificate contain fit),
 * skinned as a phosphor `ls ~/certs` window: rows are the real public
 * filenames, green mono text, a glowing image window. Rows link to the
 * same certificate PDFs, so touch devices tap straight through; the
 * student surface stays link-free by request — this terminal keeps its
 * click-to-open behavior.
 */
const DEV_FILES = [
  "cisco-data-analytics.pdf",
  "infosys-cyber-security.pdf",
  "c-certificate.pdf",
  "git-intermediate.pdf",
  "git-introduction.pdf",
];

/** Originkit `items` with terminal-filename row texts. */
function devItems(): Record<string, unknown> {
  const items = certItems();
  CERTS.forEach((c, i) => {
    items[`item${i + 1}`] = {
      text: DEV_FILES[i] ?? c.text,
      image: { src: assetUrl(c.src), alt: c.alt },
      link: assetUrl(c.link),
    };
  });
  return items;
}
const DevCertificates = memo(function DevCertificates() {
  return (
    <section className="sec certs" id="certs">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="certs" />
        </div>
        <p className="kicker reveal">$ ls -1 ~/certs/*.pdf</p>
        <h2 className="h2">
          <span className="lm">
            <span className="lm-in">Certificates.</span>
          </span>
        </h2>

        <DevWindow title="certs — hover-image-reveal" prompt="ls -1 ~/certs/*.pdf">
          <div className="cert-reveal dv-cert reveal">
            <CertRevealView
              items={devItems()}
              baseWidth={300}
              baseHeight={211}
              viewportMargin={96}
              align="left"
              rowGap={14}
              rounded={6}
              offsetX={260}
              followStrength={4}
              imageFit="contain"
              imageBackgroundColor="#10161d"
              font={{
                fontFamily: "var(--mono)",
                fontWeight: 400,
                fontSize: "clamp(0.82rem, 2.6vw, 1rem)",
                lineHeight: "1.5em",
                letterSpacing: "0",
                textAlign: "left",
              }}
              textColor="#7EE787"
              dimColor="#3d5a49"
              backgroundColor="transparent"
            />
          </div>
          <p className="dv-cert-note" aria-hidden="true">
            5 files · hover a name to preview · click to open the pdf ↗
          </p>
        </DevWindow>
      </div>
    </section>
  );
});

export default DevCertificates;
export { CERTS };
