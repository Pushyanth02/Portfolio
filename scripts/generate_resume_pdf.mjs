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

  // Exact color palette
  const navy = rgb(0.06, 0.15, 0.34); // Deep navy for name & section titles
  const dark = rgb(0.12, 0.12, 0.14); // Near black for text
  const blue = rgb(0.1, 0.3, 0.7); // Hyperlink blue
  const barBg = rgb(0.92, 0.94, 0.97); // Shaded section bar background

  const leftMargin = 38;
  const rightMargin = width - 38;
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
      // Annotations are optional enhancements
    }
  }

  // Helper to draw underlined text (and optionally make it clickable)
  function drawUnderlinedText(text, x, curY, size, font, color, url = "") {
    page.drawText(text, { x, y: curY, size, font, color });
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawLine({
      start: { x, y: curY - 1.5 },
      end: { x: x + textWidth, y: curY - 1.5 },
      thickness: 0.65,
      color,
    });
    if (url) {
      addLink(url, x, curY, textWidth, size);
    }
    return textWidth;
  }

  // ==================== HEADER ====================
  // Name
  page.drawText("Vulavala Pushyanth Reddy", {
    x: leftMargin,
    y: y,
    size: 21.5,
    font: fontBold,
    color: navy,
  });
  y -= 21;

  // Contact Info Row 1
  // Left: LinkedIn
  const liPrefix = "LinkedIn: ";
  page.drawText(liPrefix, { x: leftMargin, y, size: 9.2, font: fontRegular, color: dark });
  const liPrefixW = fontRegular.widthOfTextAtSize(liPrefix, 9.2);
  drawUnderlinedText(
    "Pushyanth | Linkedin",
    leftMargin + liPrefixW,
    y,
    9.2,
    fontBold,
    blue,
    "https://www.linkedin.com/in/pushyanth-reddy"
  );

  // Right: Email
  const emailVal = "pushyanth2008@gmail.com";
  const emailPrefix = "Email: ";
  const emailFullW = fontRegular.widthOfTextAtSize(emailPrefix + emailVal, 9.2);
  const emailStartX = rightMargin - emailFullW;
  page.drawText(emailPrefix, { x: emailStartX, y, size: 9.2, font: fontRegular, color: dark });
  page.drawText(emailVal, {
    x: emailStartX + fontRegular.widthOfTextAtSize(emailPrefix, 9.2),
    y,
    size: 9.2,
    font: fontRegular,
    color: dark,
  });
  y -= 14.5;

  // Contact Info Row 2
  // Left: GitHub
  const ghPrefix = "GitHub: ";
  page.drawText(ghPrefix, { x: leftMargin, y, size: 9.2, font: fontRegular, color: dark });
  const ghPrefixW = fontRegular.widthOfTextAtSize(ghPrefix, 9.2);
  drawUnderlinedText(
    "github.com/Pushyanth",
    leftMargin + ghPrefixW,
    y,
    9.2,
    fontBold,
    blue,
    "https://github.com/Pushyanth02"
  );

  // Right: Mobile
  const mobVal = "+91-6363121593";
  const mobPrefix = "Mobile: ";
  const mobFullW = fontRegular.widthOfTextAtSize(mobPrefix + mobVal, 9.2);
  const mobStartX = rightMargin - mobFullW;
  page.drawText(mobPrefix, { x: mobStartX, y, size: 9.2, font: fontRegular, color: dark });
  page.drawText(mobVal, {
    x: mobStartX + fontRegular.widthOfTextAtSize(mobPrefix, 9.2),
    y,
    size: 9.2,
    font: fontRegular,
    color: dark,
  });
  y -= 17;

  // ==================== SECTION HEADER HELPER ====================
  function drawSectionHeader(title) {
    y -= 6;
    const barHeight = 15;
    page.drawRectangle({
      x: leftMargin,
      y: y - 3,
      width: contentWidth,
      height: barHeight,
      color: barBg,
    });
    page.drawText(title.toUpperCase(), {
      x: leftMargin + 6,
      y: y + 1.5,
      size: 10,
      font: fontBold,
      color: navy,
    });
    y -= 16;
  }

  // ==================== BULLET DRAWING HELPER ====================
  function drawBullet(text, boldPrefix = "", indent = 14, fontSize = 8.9, lineSpacing = 12) {
    // Solid bullet circle
    page.drawCircle({
      x: leftMargin + indent - 7,
      y: y + 2.8,
      size: 1.5,
      color: dark,
    });

    let curX = leftMargin + indent;
    if (boldPrefix) {
      page.drawText(boldPrefix, { x: curX, y, size: fontSize, font: fontBold, color: dark });
      curX += fontBold.widthOfTextAtSize(boldPrefix, fontSize) + fontRegular.widthOfTextAtSize(" ", fontSize);
    }

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

  // ==================== 1. SKILLS SUMMARY ====================
  drawSectionHeader("Skills Summary");
  drawBullet("TypeScript, JavaScript, Python, C, C++, HTML, CSS, SQL", "Languages:");
  y -= 1;
  drawBullet("Next.js, React, Tailwind CSS", "Libraries & Frameworks:");
  y -= 1;
  drawBullet("Git, GitHub, GitHub Actions (CI/CD), Docker, Vercel, VS Code", "Tools/Platforms:");
  y -= 1;
  drawBullet("Node.js, PostgreSQL, MySQL", "Backend:");
  y -= 1;
  drawBullet(
    "Team Collaboration, Problem-Solving, Adaptability, Communication, Critical thinking, Leadership",
    "Soft Skills:"
  );

  y -= 6;

  // ==================== 2. PROJECTS ====================
  drawSectionHeader("Projects");

  // Project 1: Lemniscate
  {
    let curX = leftMargin;
    const nameW = drawUnderlinedText(
      "Lemniscate",
      curX,
      y,
      9.3,
      fontBold,
      blue,
      "https://github.com/Pushyanth02/Lemniscate"
    );
    curX += nameW;

    const mid = " | TypeScript · Next.js · IndexedDB · Zod | ";
    page.drawText(mid, { x: curX, y, size: 8.9, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(mid, 8.9);

    drawUnderlinedText("GitHub", curX, y, 8.9, fontBold, blue, "https://github.com/Pushyanth02/Lemniscate");

    const dateStr = "Nov 2025 - Aug 2026";
    const dateW = fontRegular.widthOfTextAtSize(dateStr, 8.9);
    page.drawText(dateStr, { x: rightMargin - dateW, y, size: 8.9, font: fontRegular, color: dark });
    y -= 13;

    drawBullet(
      "Built a local-first document processing web application supporting 7 file formats (including PDF, EPUB, DOCX) utilizing pdf.js and JSZip for fully client-side parsing with zero server data exposure."
    );
    y -= 1;
    drawBullet(
      "Integrated a modular AI streaming interface using Server-Sent Events (SSE) for real-time token rendering, validated by runtime Zod schemas for structured output integrity."
    );
    y -= 1;
    drawBullet(
      "Implemented an on-device extractive text summarization pipeline, integrating IndexedDB with SHA/hash-based keying for local document caching."
    );
    y -= 6;
  }

  // Project 2: Dungeoncore Necromancer
  {
    let curX = leftMargin;
    const nameW = drawUnderlinedText(
      "Dungeoncore Necromancer",
      curX,
      y,
      9.3,
      fontBold,
      blue,
      "https://github.com/Pushyanth02/Dungeoncore-Necromancer"
    );
    curX += nameW;

    const mid = " | Next.js · React · TypeScript · Zustand | ";
    page.drawText(mid, { x: curX, y, size: 8.9, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(mid, 8.9);

    drawUnderlinedText(
      "GitHub",
      curX,
      y,
      8.9,
      fontBold,
      blue,
      "https://github.com/Pushyanth02/Dungeoncore-Necromancer"
    );

    const dateStr = "June 2026 – Aug 2026";
    const dateW = fontRegular.widthOfTextAtSize(dateStr, 8.9);
    page.drawText(dateStr, { x: rightMargin - dateW, y, size: 8.9, font: fontRegular, color: dark });
    y -= 13;

    drawBullet(
      "Developed a dynamic web reading platform featuring a unified command palette (Cmd+K) with fuzzy search for low-latency client-side indexing and query matching."
    );
    y -= 1;
    drawBullet(
      "Designed a procedural audio synthesizer utilizing the Web Audio API to generate dynamic audio in real time, eliminating external media assets and optimizing initial bundle payload."
    );
    y -= 1;
    drawBullet(
      "Deployed a fully static-exported, zero-server web application adhering to WCAG AA accessibility standards (keyboard focus trapping, ARIA live regions) via GitHub Actions CI/CD."
    );
    y -= 6;
  }

  // Project 3: Luck-O-Matic 9000
  {
    let curX = leftMargin;
    const nameW = drawUnderlinedText(
      "Luck-O-Matic 9000",
      curX,
      y,
      9.3,
      fontBold,
      blue,
      "https://github.com/Pushyanth02/LuckOMatic-9000"
    );
    curX += nameW;

    const mid = " | TypeScript · Next.js · Tailwind · Web Audio API | ";
    page.drawText(mid, { x: curX, y, size: 8.9, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(mid, 8.9);

    drawUnderlinedText(
      "GitHub",
      curX,
      y,
      8.9,
      fontBold,
      blue,
      "https://github.com/Pushyanth02/LuckOMatic-9000"
    );

    const dateStr = "Jan 2026 - Aug 2026";
    const dateW = fontRegular.widthOfTextAtSize(dateStr, 8.9);
    page.drawText(dateStr, { x: rightMargin - dateW, y, size: 8.9, font: fontRegular, color: dark });
    y -= 13;

    drawBullet(
      "Engineered an interactive web application featuring dynamic state-driven progression, multi-tier inventory structures, and responsive UI components built with Tailwind CSS."
    );
    y -= 1;
    drawBullet(
      "Built a deterministic state-management engine in TypeScript using immutable reducers and time-delta calculation to process asynchronous background calculations."
    );
    y -= 1;
    drawBullet(
      "Implemented client-side data persistence utilizing Local Storage APIs, ensuring continuous state synchronization and data integrity across browser reloads."
    );
    y -= 6;
  }

  // ==================== 3. TRAINING ====================
  drawSectionHeader("Training");
  {
    let curX = leftMargin;
    const tTitle = "Computer Programming in C - iamneo";
    page.drawText(tTitle, { x: curX, y, size: 9.3, font: fontBold, color: dark });
    curX += fontBold.widthOfTextAtSize(tTitle, 9.3);

    const sep = " | ";
    page.drawText(sep, { x: curX, y, size: 8.9, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(sep, 8.9);

    drawUnderlinedText(
      "Certificate",
      curX,
      y,
      8.9,
      fontBold,
      blue,
      "https://github.com/Pushyanth02"
    );

    const dateStr = "Jan 2026 - May 2026";
    const dateW = fontRegular.widthOfTextAtSize(dateStr, 8.9);
    page.drawText(dateStr, { x: rightMargin - dateW, y, size: 8.9, font: fontRegular, color: dark });
    y -= 13;

    drawBullet(
      "Completed rigorous coursework in C covering foundational syntax, control flow, POSIX standard libraries, and structural programming patterns."
    );
    y -= 1;
    drawBullet(
      "Implemented low-level memory management solutions using explicit pointer arithmetic, dynamic heap allocation (malloc/calloc/free), and structured data layouts."
    );
    y -= 1;
    drawBullet(
      "Engineered linear data structures (linked lists, dynamic arrays) and algorithmic routines focused on pointer manipulation and time/space complexity optimization."
    );
    y -= 6;
  }

  // ==================== 4. CERTIFICATES ====================
  drawSectionHeader("Certificates");

  function drawCertItem(title, dateStr) {
    const indent = 14;
    page.drawCircle({
      x: leftMargin + indent - 7,
      y: y + 2.8,
      size: 1.5,
      color: dark,
    });

    let curX = leftMargin + indent;
    page.drawText(title, { x: curX, y, size: 8.9, font: fontBold, color: dark });
    curX += fontBold.widthOfTextAtSize(title, 8.9);

    const sep = " | ";
    page.drawText(sep, { x: curX, y, size: 8.9, font: fontRegular, color: dark });
    curX += fontRegular.widthOfTextAtSize(sep, 8.9);

    drawUnderlinedText(
      "Certificate",
      curX,
      y,
      8.9,
      fontBold,
      blue,
      "https://github.com/Pushyanth02"
    );

    const dateW = fontRegular.widthOfTextAtSize(dateStr, 8.9);
    page.drawText(dateStr, { x: rightMargin - dateW, y, size: 8.9, font: fontRegular, color: dark });
    y -= 14.5;
  }

  drawCertItem("Data Analytics Essentials by Cisco", "Feb 2026");
  drawCertItem("Introduction to Cybersecurity by Infosys", "Mar 2026");
  drawCertItem("Master Your Leadership Effectiveness Skills by Linkedin", "Nov 2025");

  y -= 4;

  // ==================== 5. EDUCATION ====================
  drawSectionHeader("Education");

  // Lovely Professional University
  {
    const indent = 14;
    page.drawCircle({
      x: leftMargin + indent - 7,
      y: y + 2.8,
      size: 1.5,
      color: dark,
    });

    const uniName = "Lovely Professional University";
    page.drawText(uniName, { x: leftMargin + indent, y, size: 9.3, font: fontBold, color: dark });
    const loc1 = "Phagwara, Punjab";
    const loc1W = fontRegular.widthOfTextAtSize(loc1, 8.9);
    page.drawText(loc1, { x: rightMargin - loc1W, y, size: 8.9, font: fontRegular, color: dark });
    y -= 12.5;

    const degree = "Bachelor of Technology - Computer Science and Engineering";
    page.drawText(degree, { x: leftMargin + indent, y, size: 8.9, font: fontRegular, color: dark });
    const date1 = "Aug 2025 - May 2029";
    const date1W = fontRegular.widthOfTextAtSize(date1, 8.9);
    page.drawText(date1, { x: rightMargin - date1W, y, size: 8.9, font: fontRegular, color: dark });
    y -= 12.5;

    page.drawText("CGPA: 7.98", { x: leftMargin + indent, y, size: 8.9, font: fontBold, color: dark });
    y -= 16;
  }

  // Christ Academy Junior College
  {
    const indent = 14;
    page.drawCircle({
      x: leftMargin + indent - 7,
      y: y + 2.8,
      size: 1.5,
      color: dark,
    });

    const collegeName = "Christ Academy Junior College";
    page.drawText(collegeName, { x: leftMargin + indent, y, size: 9.3, font: fontBold, color: dark });
    const loc2 = "Bangalore, Karnataka";
    const loc2W = fontRegular.widthOfTextAtSize(loc2, 8.9);
    page.drawText(loc2, { x: rightMargin - loc2W, y, size: 8.9, font: fontRegular, color: dark });
    y -= 12.5;

    const course = "Pre-University Course (PUC/12th)";
    page.drawText(course, { x: leftMargin + indent, y, size: 8.9, font: fontRegular, color: dark });
    const date2 = "May 2023 – Mar 2025";
    const date2W = fontRegular.widthOfTextAtSize(date2, 8.9);
    page.drawText(date2, { x: rightMargin - date2W, y, size: 8.9, font: fontRegular, color: dark });
    y -= 12.5;

    page.drawText("Percentage: 86%", { x: leftMargin + indent, y, size: 8.9, font: fontBold, color: dark });
    y -= 16;
  }

  // New Horizon High School
  {
    const indent = 14;
    page.drawCircle({
      x: leftMargin + indent - 7,
      y: y + 2.8,
      size: 1.5,
      color: dark,
    });

    const schoolName = "New Horizon High School";
    page.drawText(schoolName, { x: leftMargin + indent, y, size: 9.3, font: fontBold, color: dark });
    const loc3 = "Bangalore, Karnataka";
    const loc3W = fontRegular.widthOfTextAtSize(loc3, 8.9);
    page.drawText(loc3, { x: rightMargin - loc3W, y, size: 8.9, font: fontRegular, color: dark });
    y -= 12.5;

    const score = "Percentage: 92%";
    page.drawText(score, { x: leftMargin + indent, y, size: 8.9, font: fontBold, color: dark });
    const date3 = "May 2022 – Mar 2023";
    const date3W = fontRegular.widthOfTextAtSize(date3, 8.9);
    page.drawText(date3, { x: rightMargin - date3W, y, size: 8.9, font: fontRegular, color: dark });
  }

  const pdfBytes = await pdfDoc.save();
  const outPath1 = path.join("public", "Pushyanth_Reddy_Resume.pdf");
  const outPath2 = path.join("public", "resume.pdf");

  fs.writeFileSync(outPath1, pdfBytes);
  fs.writeFileSync(outPath2, pdfBytes);
  console.log("Generated:", outPath1, outPath2, `Final y: ${y.toFixed(2)} (bottom margin: ${y.toFixed(2)}pt)`);
}
createResume().catch(console.error);
