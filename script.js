class MemorialGenerator {
  constructor() {
    this.canvas = document.getElementById("memorialCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.form = document.getElementById("memorialForm");
    this.downloadBtn = document.getElementById("downloadBtn");
    this.portraitFile = null;
    this.debounceTimer = null;

    this.setupEventListeners();
    this.setCanvasSize();
    this.initializePreview();
  }

  setCanvasSize() {
    // Set canvas size for high quality output with larger portrait
    this.canvas.width = 900;
    this.canvas.height = 1200;
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.generateMemorial();
    });

    this.downloadBtn.addEventListener("click", () => {
      this.downloadImage();
    });

    // Add live preview listeners for all form inputs
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      if (input.type === "file") {
        input.addEventListener("change", (e) => {
          this.portraitFile = e.target.files[0];
          this.updatePreview();
        });
      } else {
        input.addEventListener("input", () => {
          this.debouncedUpdatePreview();
        });
      }
    });
  }

  initializePreview() {
    // Draw initial preview with placeholder data
    this.updatePreview();
  }

  debouncedUpdatePreview() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.updatePreview();
    }, 300); // 300ms delay to prevent excessive redraws
  }

  async updatePreview() {
    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);

      // Use portrait file if available
      if (this.portraitFile) {
        data.portrait = this.portraitFile;
      }

      await this.drawMemorial(data);
    } catch (error) {
      console.error("Error updating preview:", error);
    }
  }

  async generateMemorial() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitBtn = this.form.querySelector(".generate-btn");
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Generating...';
    submitBtn.disabled = true;

    try {
      await this.drawMemorial(data);
      this.downloadBtn.style.display = "block";
    } catch (error) {
      console.error("Error generating memorial:", error);
      alert("Error generating memorial. Please try again.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  async drawMemorial(data) {
    const ctx = this.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw watermark pattern
    this.drawWatermarkPattern();

    // Draw title at the very top
    this.drawTitle(data);

    // Draw portrait
    if (data.portrait && data.portrait.size > 0) {
      await this.drawPortrait(data.portrait);
    } else {
      this.drawPortraitPlaceholder();
    }

    // Draw text content
    this.drawTextContent(data);

    // Draw final watermark overlay
    this.drawWatermarkOverlay();
  }

  drawTitle(data) {
    const ctx = this.ctx;

    // Draw title at the very top
    ctx.font = "bold 48px Noto Sans Gujarati";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    const title = data.title || "દુઃખદ અવસાન";
    ctx.fillText(title, this.canvas.width / 2, 60);
  }

  drawWatermarkPattern() {
    const ctx = this.ctx;
    const patternSize = 200;
    const spacing = 150;

    ctx.save();
    ctx.globalAlpha = 0.1;

    for (let x = 0; x < this.canvas.width + patternSize; x += spacing) {
      for (let y = 0; y < this.canvas.height + patternSize; y += spacing) {
        this.drawWatermarkSymbol(x, y, patternSize);
      }
    }

    ctx.restore();
  }

  drawWatermarkSymbol(x, y, size) {
    const ctx = this.ctx;

    // Draw circular logo
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 4, 0, 2 * Math.PI);
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw "PRAJAPATI IT CELL" text
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.fillText("PRAJAPATI IT CELL", x + size / 2, y + size / 2 + 5);

    // Draw Gujarati text
    ctx.font = "bold 10px Noto Sans Gujarati";
    ctx.fillText("અવસાન નોંધ", x + size / 2, y + size / 2 + 20);

    // Draw contact info
    ctx.font = "8px Arial";
    ctx.fillText("99139 92304", x + size / 2, y + size / 2 + 35);
    ctx.fillText("9998674741", x + size / 2, y + size / 2 + 45);
  }

  drawPortraitPlaceholder() {
    const ctx = this.ctx;

    // Portrait dimensions and position - rectangular and larger, positioned below title
    const portraitWidth = 400;
    const portraitHeight = 500;
    const portraitX = (this.canvas.width - portraitWidth) / 2;
    const portraitY = 120; // Moved down to accommodate title at top

    // Draw portrait background rectangle
    ctx.save();
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(portraitX - 5, portraitY - 5, portraitWidth + 10, portraitHeight + 10);
    ctx.restore();

    // Draw placeholder rectangle
    ctx.save();
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(portraitX, portraitY, portraitWidth, portraitHeight);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 3;
    ctx.strokeRect(portraitX, portraitY, portraitWidth, portraitHeight);
    ctx.restore();

    // Draw placeholder text
    ctx.save();
    ctx.font = "bold 18px Noto Sans Gujarati";
    ctx.fillStyle = "#999";
    ctx.textAlign = "center";
    ctx.fillText("ફોટો અપલોડ કરો", portraitX + portraitWidth / 2, portraitY + portraitHeight / 2);
    ctx.restore();
  }

  async drawPortrait(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const ctx = this.ctx;

        // Portrait dimensions and position - rectangular and larger, positioned below title
        const portraitWidth = 400;
        const portraitHeight = 500;
        const portraitX = (this.canvas.width - portraitWidth) / 2;
        const portraitY = 120; // Moved down to accommodate title at top

        // Draw portrait background rectangle
        ctx.save();
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(portraitX - 5, portraitY - 5, portraitWidth + 10, portraitHeight + 10);
        ctx.restore();

        // Draw portrait image
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(portraitX, portraitY, portraitWidth, portraitHeight);
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 3;
        ctx.strokeRect(portraitX, portraitY, portraitWidth, portraitHeight);

        // Calculate aspect ratio to fit image properly
        const aspectRatio = img.width / img.height;
        let drawWidth = portraitWidth;
        let drawHeight = portraitHeight;

        if (aspectRatio > portraitWidth / portraitHeight) {
          drawHeight = portraitWidth / aspectRatio;
        } else {
          drawWidth = portraitHeight * aspectRatio;
        }

        const drawX = portraitX + (portraitWidth - drawWidth) / 2;
        const drawY = portraitY + (portraitHeight - drawHeight) / 2;

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();

        resolve();
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  drawTextContent(data) {
    const ctx = this.ctx;
    let yPosition = 660; // Increased space between portrait and text content

    // Deceased name and age (title is now drawn separately at top)
    ctx.font = "bold 32px Noto Sans Gujarati";
    const deceasedName = data.deceasedName || "નામ દાખલ કરો";
    const age = data.age || "વય";
    const prefix = data.prefix || "સ્વ.";
    const nameText = `${prefix}${deceasedName} ઉ.વર્ષ ${age}`;
    ctx.fillText(nameText, this.canvas.width / 2, yPosition);
    yPosition += 50;

    // Address - split into multiple lines if needed
    ctx.font = "bold 24px Noto Sans Gujarati";
    const address = data.address || "સરનામું દાખલ કરો";
    const addressText = `હાલ.${address}`;

    // Split address into multiple lines if it's too long
    const addressLines = this.splitAddressIntoLines(addressText, this.canvas.width - 100);
    addressLines.forEach((line, index) => {
      ctx.fillText(line, this.canvas.width / 2, yPosition + index * 30);
    });
    yPosition += addressLines.length * 30 + 20;

    // Vatan information
    if (data.vatanGaam || data.vatanTaluko || data.vatanJillo) {
      ctx.font = "bold 24px Noto Sans Gujarati";
      let vatanText = "ગામ: ";
      if (data.vatanGaam) vatanText += data.vatanGaam;
      if (data.vatanTaluko) vatanText += ` તા.${data.vatanTaluko}`;
      if (data.vatanJillo) vatanText += ` જી.${data.vatanJillo}`;
      this.drawWrappedText(vatanText, this.canvas.width / 2, yPosition, this.canvas.width - 100);
      yPosition += 50;
    }

    // Date of demise
    ctx.font = "bold 24px Noto Sans Gujarati";
    if (data.deathDate) {
      const deathDate = new Date(data.deathDate);
      const formattedDeathDate = deathDate.toLocaleDateString("en-GB");
      const deathText = `તા.${formattedDeathDate} ના રોજ અવસાન થયેલ છે`;
      ctx.fillText(deathText, this.canvas.width / 2, yPosition);
    } else {
      ctx.fillText("તા.____ ના રોજ અવસાન થયેલ છે", this.canvas.width / 2, yPosition);
    }
    yPosition += 50;

    // Funeral details
    ctx.font = "bold 24px Noto Sans Gujarati";
    // Build funeral details string by adding as and when available
    let funeralParts = [];
    let hasAnyFuneralDetail = false;

    // Date
    if (data.funeralDate) {
      const funeralDate = new Date(data.funeralDate);
      const formattedFuneralDate = funeralDate.toLocaleDateString("en-GB");
      funeralParts.push(`તા. ${formattedFuneralDate}`);
      hasAnyFuneralDetail = true;
    } else {
      funeralParts.push("તા.____");
    }

    // Time
    if (data.funeralTime) {
      const formattedTime = this.formatTimeWithPeriod(data.funeralTime);
      funeralParts.push(`ના રોજ ${formattedTime} કલાકે`);
      hasAnyFuneralDetail = true;
    } else {
      funeralParts.push("ના રોજ ____ કલાકે");
    }

    // Location
    if (data.funeralLocation) {
      funeralParts.push(data.funeralLocation + " જશે");
      hasAnyFuneralDetail = true;
    } else {
      funeralParts.push("સ્મશાન ભૂમિ જશે");
    }

    const funeralText = `જેમની સ્મશાનયાત્રા ${funeralParts.join(" ")}`;
    this.drawWrappedText(funeralText, this.canvas.width / 2, yPosition, this.canvas.width - 100);
    yPosition += 50; // One line space above li.

    // Contact information
    ctx.font = "bold 22px Noto Sans Gujarati";
    if (data.contactName1 && data.contactPhone1) {
      // "લી:" on its own line
      ctx.fillText("લી:", this.canvas.width / 2, yPosition);
      yPosition += 35;
      // Name and phone on the same line below
      const contact1Text = `${data.contactName1} ${data.contactPhone1}`;
      ctx.fillText(contact1Text, this.canvas.width / 2, yPosition);
      yPosition += 40;
    } else if (data.contactName1 || data.contactPhone1) {
      // "લી:" on its own line
      ctx.fillText("લી:", this.canvas.width / 2, yPosition);
      yPosition += 35;
      // Name and phone on the same line below
      const contact1Text = `${data.contactName1 || "નામ"} ${data.contactPhone1 || "ફોન"}`;
      ctx.fillText(contact1Text, this.canvas.width / 2, yPosition);
      yPosition += 40;
    }

    if (data.contactName2 && data.contactPhone2) {
      const contact2Text = `${data.contactName2} ${data.contactPhone2}`;
      ctx.fillText(contact2Text, this.canvas.width / 2, yPosition);
      yPosition += 40;
    } else if (data.contactName2 || data.contactPhone2) {
      const contact2Text = `${data.contactName2 || "નામ"} ${data.contactPhone2 || "ફોન"}`;
      ctx.fillText(contact2Text, this.canvas.width / 2, yPosition);
      yPosition += 40;
    }

    if (data.contactName3 && data.contactPhone3) {
      const contact3Text = `${data.contactName3} ${data.contactPhone3}`;
      ctx.fillText(contact3Text, this.canvas.width / 2, yPosition);
      yPosition += 30; // Minimal space after contacts
    } else if (data.contactName3 || data.contactPhone3) {
      const contact3Text = `${data.contactName3 || "નામ"} ${data.contactPhone3 || "ફોન"}`;
      ctx.fillText(contact3Text, this.canvas.width / 2, yPosition);
      yPosition += 30; // Minimal space after contacts
    }

    // Condolence message
    ctx.font = "bold 20px Noto Sans Gujarati";
    const condolenceText =
      data.shraddhanjaliNote ||
      "સદૃગત આત્માને પરમકૃપાળુ પરમાત્મા ચિર:શાંન્તિ અર્પે એવી ભાવપુર્વક શ્રદ્ધાંજલિ";
    this.drawWrappedText(condolenceText, this.canvas.width / 2, yPosition, this.canvas.width - 100);

    // Prajapati IT Cell at the very bottom of the canvas
    const bottomY = this.canvas.height - 40; // Position near bottom with some margin

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText("🙏 Prajapati IT Cell 🙏", this.canvas.width / 2, bottomY - 20);

    // Gujarati text below
    ctx.font = "bold 16px Noto Sans Gujarati";
    // ctx.fillText("પ્રજાપતિ આઈ.ટી. સેલ", this.canvas.width / 2, bottomY);
  }

  formatTimeWithPeriod(timeString) {
    // Parse time string (format: HH:MM)
    const [hours, minutes] = timeString.split(":").map(Number);

    // Convert to 12-hour format
    let displayHours = hours;
    let period = "";

    if (hours === 0) {
      displayHours = 12;
      period = "સવારે";
    } else if (hours < 12) {
      period = "સવારે";
    } else if (hours === 12) {
      period = "બપોરે";
    } else if (hours > 12 && hours < 16) {
      displayHours = hours - 12;
      period = "બપોરે";
    } else {
      displayHours = hours - 12;
      period = "સાંજે";
    }

    // Format minutes with leading zero if needed
    const displayMinutes = minutes.toString().padStart(2, "0");

    return `${period} ${displayHours}:${displayMinutes}`;
  }

  splitAddressIntoLines(text, maxWidth) {
    const ctx = this.ctx;
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    const maxWordsPerLine = 6; // Maximum 6 words per line
    const maxLines = 6; // Allow more lines since we're limiting words per line

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + (currentLine ? " " : "") + words[i];
      const metrics = ctx.measureText(testLine);
      const currentWordCount = currentLine.split(" ").filter((word) => word.length > 0).length;

      // If adding this word exceeds width OR we've reached max words per line, start new line
      if ((metrics.width > maxWidth && currentLine) || currentWordCount >= maxWordsPerLine) {
        lines.push(currentLine);
        currentLine = words[i];

        // If we've reached max lines, put remaining words in the last line
        if (lines.length >= maxLines - 1) {
          const remainingWords = words.slice(i + 1);
          if (remainingWords.length > 0) {
            currentLine += " " + remainingWords.join(" ");
          }
          break;
        }
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  drawWrappedText(text, x, y, maxWidth) {
    const ctx = this.ctx;
    const words = text.split(" ");
    let line = "";
    let lineY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, lineY);
        line = words[n] + " ";
        lineY += 35; // Increased line spacing for larger fonts
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, lineY);
  }

  drawWatermarkOverlay() {
    const ctx = this.ctx;

    // Draw diagonal watermark in bottom right
    ctx.save();
    ctx.translate(this.canvas.width - 200, this.canvas.height - 100);
    ctx.rotate(-Math.PI / 6);
    ctx.globalAlpha = 0.3;

    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#666";
    // ctx.fillText("Prajapati IT cell પ્રજાપતિ અવસાનનોંધ RZ", 0, 0);

    ctx.restore();
  }

  downloadImage() {
    const link = document.createElement("a");
    link.download = `memorial-notice-${Date.now()}.png`;
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MemorialGenerator();
});
