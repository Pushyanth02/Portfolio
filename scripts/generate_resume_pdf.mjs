import { PDFDocument, rgb, StandardFonts, PDFName, PDFString } from "pdf-lib";
import fs from "fs";
import path from "path";

async function createResume() {
  const pdfDoc = await PDFDocument.create();
  // Standard A4 dimensions: 595.28 x 841.89 pt
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Exact serif fonts matching the screenshot
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Colors
  const navy = rgb(0.12, 0.22, 0.42); // Section titles & header name
  const dark = rgb(0.15, 0.15, 0.17); // Body text
  const blue = rgb(0.1, 0.35, 0.72); // Links
  const lineGrey = rgb(0.7, 0.7, 0.72); // Divider line

  const leftMargin = 36;
  const rightMargin = width - 36;
  const contentWidth = rightMargin - leftMargin;

  let y = height - 42;

  // Helper to add clickable PDF link annotations
  function addLink(url, x, linkY, w, h) {
    try {
      const linkAnnot = page.doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, linkY - 1, x + w, linkY + h],
        Border: [0, 0, 0],
        C: [0, 0, 0],
        A: {
          Type: "Action",
          S: "URI",
          URI: PDFString.of(url),
        },
      });
      const linkRef = page.doc.context.register(linkAnnot);
      let annots = page.node.Annots();
      if (!annots) {
        annots = page.doc.context.obj([]);
        page.node.set(PDFName.of("Annots"), annots);
      }
      annots.push(linkRef);
    } catch {
      // Annotations optional
    }
  }

  function drawUnderlinedLink(text, x, curY, size, font, color, url) {
    page.drawText(text, { x, y: curY, size, font, color });
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawLine({
      start: { x, y: curY - 1.2 },
      end: { x: x + textWidth, y: curY - 1.2 },
      thickness: 0.6,
      color,
    });
    if (url) {
      addLink(url, x, curY, textWidth, size);
    }
    return textWidth;
  }

  // ==================== HEADER ====================
  // Name (centered)
  const nameStr = "PUSHYANTH REDDY";
  const nameSize = 20;
  const nameWidth = fontBold.widthOfTextAtSize(nameStr, nameSize);
  page.drawText(nameStr, {
    x: (width - nameWidth) / 2,
    y: y,
    size: nameSize,
    font: fontBold,
    color: navy,
  });
  y -= 16;

  // Contact Info Line (centered)
  // +91-6363121593 • pushyanth2008@gmail.com • LinkedIn • GitHub • Portfolio
  const contactParts = [
    { text: "+91-6363121593", isLink: false },
    { text: " • ", isLink: false },
    { text: "pushyanth2008@gmail.com", isLink: false },
    { text: " • ", isLink: false },
    { text: "LinkedIn", isLink: true, url: "https://www.linkedin.com/in/pushyanth-reddy" },
    { text: " • ", isLink: false },
    { text: "GitHub", isLink: true, url: "https://github.com/Pushyanth02" },
    { text: " • ", isLink: false },
    { text: "Portfolio", isLink: true, url: "https://pushyanth02.github.io/Portfolio/" },
  ];

  const subSize = 9.5;
  let totalSubW = 0;
  for (const part of contactParts) {
    const f = part.isLink ? fontRegular : fontRegular;
    totalSubW += f.widthOfTextAtSize(part.text, subSize);
  }

  let subX = (width - totalSubW) / 2;
  for (const part of contactParts) {
    if (part.isLink) {
      const w = drawUnderlinedLink(part.text, subX, y, subSize, fontRegular, blue, part.url);
      subX += w;
    } else {
      page.drawText(part.text, { x: subX, y, size: subSize, font: fontRegular, color: dark });
      subX += fontRegular.widthOfTextAtSize(part.text, subSize);
    }
  }
  y -= 14;

  // Horizontal section divider helper
  function drawSectionHeader(title) {
    y -= 4;
    page.drawText(title.toUpperCase(), {
      x: leftMargin,
      y: y,
      size: 10,
      font: fontBold,
      color: navy,
    });
    y -= 4;
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: rightMargin, y },
      thickness: 0.6,
      color: lineGrey,
    });
    y -= 12;
  }

  // Multi-line bullet points drawer
  function drawBullet(text, indent = 12, fontSize = 8.8, lineSpacing = 11.5) {
    const bulletSymbol = "•";
    page.drawText(bulletSymbol, {
      x: leftMargin + 2,
      y: y,
      size: fontSize,
      font: fontRegular,
      color: dark,
    });

    let curX = leftMargin + indent;
    const words = text.trim().split(/\s+/);
    let line = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      const testWidth = fontRegular.widthOfTextAtSize(testLine, fontSize);
      const availableWidth = rightMargin - curX;

      if (testWidth > availableWidth && line !== "") {
        page.drawText(line, { x: curX, y, size: fontSize, font: fontRegular, color: dark });
        y -= lineSpacing;
        curX = leftMargin + indent;
        line = words[i];
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, { x: curX, y, size: fontSize, font: fontRegular, color: dark });
      y -= lineSpacing;
    }
  }

  // ==================== 1. PROFESSIONAL SUMMARY ====================
  drawSectionHeader("PROFESSIONAL SUMMARY");
  const summaryText =
    "Frontend-focused Software Engineer building local-first, client-side applications in TypeScript, Next.js, and React — including multi-format document parsing, real-time streaming UIs, and offline-capable state architectures. Comfortable with C/C++ fundamentals and relational databases; currently extending into backend API development and LLM-integrated systems.";

  const sumWords = summaryText.split(/\s+/);
  let sumLine = "";
  for (let i = 0; i < sumWords.length; i++) {
    const testLine = sumLine ? `${sumLine} ${sumWords[i]}` : sumWords[i];
    const testW = fontRegular.widthOfTextAtSize(testLine, 8.8);
    if (testW > contentWidth && sumLine !== "") {
      page.drawText(sumLine, { x: leftMargin, y, size: 8.8, font: fontRegular, color: dark });
      y -= 11.5;
      sumLine = sumWords[i];
    } else {
      sumLine = testLine;
    }
  }
  if (sumLine) {
    page.drawText(sumLine, { x: leftMargin, y, size: 8.8, font: fontRegular, color: dark });
    y -= 11.5;
  }
  y -= 4;

  // ==================== 2. TECHNICAL SKILLS ====================
  drawSectionHeader("TECHNICAL SKILLS");
  const skillsData = [
    { label: "Languages:", val: "TypeScript, JavaScript, Python, C, C++, SQL" },
    { label: "Frontend:", val: "Next.js, React, Tailwind CSS, Zustand, HTML5, CSS3" },
    { label: "Client/Browser Systems:", val: "IndexedDB, Web Audio API, Server-Sent Events, Zod (schema validation)" },
    { label: "Tools:", val: "Git, GitHub, GitHub Actions (CI/CD), Vercel, VS Code" },
  ];

  for (const s of skillsData) {
    page.drawText(s.label, { x: leftMargin, y, size: 8.8, font: fontBold, color: dark });
    const labelW = fontBold.widthOfTextAtSize(s.label, 8.8) + 4;
    page.drawText(s.val, { x: leftMargin + labelW, y, size: 8.8, font: fontRegular, color: dark });
    y -= 11.8;
  }
  y -= 4;

  // ==================== 3. PROJECTS ====================
  drawSectionHeader("PROJECTS");

  const projects = [
    {
      title: "Lemniscate",
      tech: "TypeScript, Next.js, IndexedDB, Zod, Web APIs",
      githubUrl: "https://github.com/Pushyanth02/Lemniscate",
      liveUrl: "https://lemniscate02.vercel.app/",
      date: "Apr 2024 – Aug 2026",
      bullets: [
        "Built a local-first document processor supporting 7 file formats (PDF, EPUB, DOCX) using pdf.js and JSZip for entirely client-side parsing, with no data ever leaving the browser.",
        "Consumed a token-streaming API via Server-Sent Events, rendering incremental UI updates in real time and validating every streamed payload against runtime Zod schemas to guarantee structural integrity.",
        "Implemented an on-device extractive summarization pipeline and an IndexedDB caching layer with hash-based keys for persistent, offline-capable document storage.",
      ],
    },
    {
      title: "Dungeoncore Necromancer",
      tech: "Next.js, React, TypeScript, Zustand",
      githubUrl: "https://github.com/Pushyanth02/Dungeoncore-Necromancer",
      liveUrl: "https://pushyanth02.github.io/Dungeoncore-Necromancer/",
      date: "Jun 2026 – Aug 2026",
      bullets: [
        "Developed a responsive web reading platform featuring a unified command palette with client-side fuzzy search for low-latency query matching.",
        "Engineered a procedural audio synthesis engine using the Web Audio API to generate real-time dynamic soundscapes, eliminating external audio assets and reducing payload size.",
        "Shipped a static-exported reading platform meeting WCAG AA accessibility standards (focus trapping, ARIA live regions), deployed via GitHub Actions CI/CD to GitHub Pages.",
      ],
    },
    {
      title: "Archmage",
      tech: "Next.js, TypeScript, Tailwind CSS",
      githubUrl: "https://github.com/Pushyanth02/Archmage",
      liveUrl: "https://pushyanth02.github.io/Archmage/",
      date: "Jan 2026 – Aug 2026",
      bullets: [
        "Engineered a browser-based arcade roguelike featuring 50 structured waves, 5 biomes, dynamically shuffled tyrants, endless progression, and responsive real-time gameplay systems.",
        "Designed deterministic gameplay mechanics in TypeScript, including seeded RNG, scaling difficulty curves, multi-element spell resonances, weighted reward cycling, and state-driven enemy/boss behaviour.",
        "Implemented persistent meta-progression, accessibility controls, HUD systems, and synthesized dynamic audio using the Web Audio API, delivering a fully client-side gameplay experience without accounts or backend services.",
      ],
    },
  ];

  for (const proj of projects) {
    let curX = leftMargin;

    // Title Bold
    page.drawText(proj.title, { x: curX, y, size: 9.2, font: fontBold, color: dark });
    curX += fontBold.widthOfTextAtSize(proj.title, 9.2);

    // Tech stack italic / regular
    const sepStr = " | ";
    page.drawText(sepStr, { x: curX, y, size: 8.8, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(sepStr, 8.8);

    page.drawText(proj.tech, { x: curX, y, size: 8.8, font: fontItalic, color: dark });
    curX += fontItalic.widthOfTextAtSize(proj.tech, 8.8);

    page.drawText(sepStr, { x: curX, y, size: 8.8, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(sepStr, 8.8);

    // GitHub link
    const ghW = drawUnderlinedLink("GitHub", curX, y, 8.8, fontBold, blue, proj.githubUrl);
    curX += ghW;

    page.drawText(sepStr, { x: curX, y, size: 8.8, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(sepStr, 8.8);

    // Live link
    drawUnderlinedLink("Live", curX, y, 8.8, fontBold, blue, proj.liveUrl);

    // Date on right
    const dateW = fontRegular.widthOfTextAtSize(proj.date, 8.8);
    page.drawText(proj.date, { x: rightMargin - dateW, y, size: 8.8, font: fontRegular, color: dark });
    y -= 12;

    // Bullets
    for (const b of proj.bullets) {
      drawBullet(b);
    }
    y -= 3;
  }

  // ==================== 4. EDUCATION ====================
  drawSectionHeader("EDUCATION");

  // LPU
  {
    page.drawText("Lovely Professional University", {
      x: leftMargin,
      y,
      size: 9.2,
      font: fontBold,
      color: dark,
    });
    const loc1 = "Phagwara, Punjab";
    const loc1W = fontRegular.widthOfTextAtSize(loc1, 8.8);
    page.drawText(loc1, { x: rightMargin - loc1W, y, size: 8.8, font: fontRegular, color: dark });
    y -= 11.5;

    const deg1 = "Bachelor of Technology in Computer Science and Engineering | CGPA: 7.98";
    page.drawText(deg1, { x: leftMargin, y, size: 8.8, font: fontItalic, color: dark });
    const date1 = "Aug 2025 – May 2029";
    const date1W = fontRegular.widthOfTextAtSize(date1, 8.8);
    page.drawText(date1, { x: rightMargin - date1W, y, size: 8.8, font: fontRegular, color: dark });
    y -= 14;
  }

  // Christ Academy
  {
    page.drawText("Christ Academy Junior College", {
      x: leftMargin,
      y,
      size: 9.2,
      font: fontBold,
      color: dark,
    });
    const loc2 = "Bangalore, Karnataka";
    const loc2W = fontRegular.widthOfTextAtSize(loc2, 8.8);
    page.drawText(loc2, { x: rightMargin - loc2W, y, size: 8.8, font: fontRegular, color: dark });
    y -= 11.5;

    const deg2 = "Pre-University Course (12th Grade) – Science & Mathematics | Percentage: 86.0%";
    page.drawText(deg2, { x: leftMargin, y, size: 8.8, font: fontItalic, color: dark });
    const date2 = "May 2023 – Mar 2025";
    const date2W = fontRegular.widthOfTextAtSize(date2, 8.8);
    page.drawText(date2, { x: rightMargin - date2W, y, size: 8.8, font: fontRegular, color: dark });
    y -= 12;
  }

  // ==================== 5. CERTIFICATIONS & TECHNICAL TRAINING ====================
  drawSectionHeader("CERTIFICATIONS & TECHNICAL TRAINING");

  const certsList = [
    {
      title: "Computer Programming in C — iamneo",
      certText: "Certificate",
      certUrl: "https://github.com/Pushyanth02",
      date: "Jan 2026 – May 2026",
    },
    {
      title: "Data Analytics Essentials — Cisco",
      certText: "Certificate",
      certUrl: "https://github.com/Pushyanth02",
      date: "Feb 2026",
    },
    {
      title: "GitHub Foundations — Datacamp & GitHub",
      certText: "Certificate",
      certUrl: "https://github.com/Pushyanth02",
      date: "Mar 2026",
    },
  ];

  for (const c of certsList) {
    page.drawText("•", { x: leftMargin + 2, y, size: 8.8, font: fontRegular, color: dark });
    let curX = leftMargin + 12;

    page.drawText(c.title, { x: curX, y, size: 8.8, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(c.title, 8.8);

    const midStr = " | ";
    page.drawText(midStr, { x: curX, y, size: 8.8, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(midStr, 8.8);

    const cW = drawUnderlinedLink(c.certText, curX, y, 8.8, fontBold, blue, c.certUrl);
    curX += cW;

    const dotStr = " · " + c.date;
    page.drawText(dotStr, { x: curX, y, size: 8.8, font: fontRegular, color: dark });

    y -= 12.5;
  }

  const pdfBytes = await pdfDoc.save();
  const outPath1 = path.join("public", "Pushyanth_Reddy_Resume.pdf");
  const outPath2 = path.join("public", "resume.pdf");

  fs.writeFileSync(outPath1, pdfBytes);
  fs.writeFileSync(outPath2, pdfBytes);
  console.log("Generated:", outPath1, outPath2, `Final y: ${y.toFixed(2)} (bottom space remaining: ${y.toFixed(2)}pt)`);
}

createResume().catch(console.error);
