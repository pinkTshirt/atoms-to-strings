document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('input-area');
    const outputArea = document.getElementById('output-area');
    const processBtn = document.getElementById('process-btn');
    const copyBtn = document.getElementById('copy-btn');
    const modeSelect = document.getElementById('mode-select');
    const formatSelect = document.getElementById('format-select');
    const statusBadge = document.querySelector('.badge');

    // Smooth execution simulator
    processBtn.addEventListener('click', () => {
        const rawInput = inputArea.value.trim();
        
        if (!rawInput) {
            outputArea.textContent = "Error: Input workspace is empty. Please provide content to process.";
            outputArea.className = "output-error";
            return;
        }

        statusBadge.textContent = "Processing...";
        statusBadge.style.color = "var(--accent)";

        // Small timeout simulate ultra-fast smooth computational pipeline processing
        setTimeout(() => {
            const mode = modeSelect.value;
            const format = formatSelect.value;
            
            let processedOutput = "";

            if (mode === "serialize") {
                // Mock execution matching atoms/structures to clear string configurations
                processedOutput = `// Atoms to Strings Pipeline Target [${format.toUpperCase()}]\n`;
                processedOutput += JSON.stringify({
                    timestamp: new Date().toISOString(),
                    status: "success",
                    mode: mode,
                    payload_preview: rawInput.slice(0, 30) + (rawInput.length > 30 ? "..." : ""),
                    checksum: Math.random().toString(16).substr(2, 8).toUpperCase()
                }, null, 4);
            } else {
                processedOutput = `Parsed Object successfully mapped out from explicit string content structure string.\nSource length: ${rawInput.length} parameters recognized.`;
            }

            outputArea.textContent = processedOutput;
            outputArea.className = ""; // Remove placeholder italic classes
            
            statusBadge.textContent = "Success";
            statusBadge.style.color = "var(--success)";
        }, 300);
    });

    // Native Copy Interaction
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputArea.textContent;
        if (!textToCopy || textToCopy.includes("Transformation results will appear")) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            copyBtn.style.borderColor = "var(--success)";
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.borderColor = "var(--border-color)";
            }, 1800);
        });
    });
});
