/**
 * Twindex Frontend Script
 * Handles API communication and UI interactions
 */

const API_BASE_URL = 'http://127.0.0.1:8000';
const SIMULATE_ENDPOINT = `${API_BASE_URL}/simulate`;

// DOM Elements
const promptInput = document.getElementById('prompt-input');
const simulateBtn = document.getElementById('simulate-btn');
const spinner = document.getElementById('spinner');
const outputSection = document.getElementById('output-section');
const outputContainer = document.getElementById('output-container');
const errorSection = document.getElementById('error-section');
const errorMessage = document.getElementById('error-message');
const emptyState = document.getElementById('empty-state');

/**
 * Initialize event listeners
 */
function init() {
    simulateBtn.addEventListener('click', runSimulation);
    promptInput.addEventListener('keydown', (e) => {
        // Allow Cmd/Ctrl + Enter to submit
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            runSimulation();
        }
    });
}

/**
 * Run simulation - main function
 */
async function runSimulation() {
    const prompt = promptInput.value.trim();

    // Validation
    if (!prompt) {
        showError('Please enter your health information before running a simulation.');
        return;
    }

    if (prompt.length < 10) {
        showError('Please provide more detailed information (at least 10 characters).');
        return;
    }

    // Clear previous states
    hideError();
    hideOutput();
    hideEmptyState();

    // Show loading state
    setLoading(true);

    try {
        const response = await fetchSimulation(prompt);
        displayOutput(response.result || response.output || response.text || response.message || 'No response received');
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

/**
 * Fetch simulation from API
 * @param {string} prompt - User input
 * @returns {Promise<Object>} API response
 */
async function fetchSimulation(prompt) {
    const payload = {
        prompt: prompt
    };

    try {
        const response = await fetch(SIMULATE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorDetail = errorData.detail || errorData.message || errorData.error;
            const errorMsg = Array.isArray(errorDetail) ? errorDetail[0]?.msg : errorDetail;
            throw new Error(errorMsg || `API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                'Cannot connect to backend. Make sure the server is running at http://127.0.0.1:8000'
            );
        }
        throw error;
    }
}

/**
 * Display simulation output
 * @param {string} output - The response text from API
 */
function displayOutput(output) {
    // Format the output with better readability
    const formattedOutput = formatOutput(output);
    outputContainer.innerHTML = formattedOutput;
    showOutput();
}

/**
 * Format output text for better display
 * @param {string} text - Raw output text
 * @returns {string} HTML formatted text
 */
function formatOutput(text) {
    // Escape HTML to prevent injection
    let escaped = escapeHtml(text);

    // Convert markdown-like formatting
    // Bold: **text** or __text__
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/_(.*?)_/g, '<em>$1</em>');

    // Headers: # Header
    escaped = escaped.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    escaped = escaped.replace(/^## (.*?)$/gm, '<h2 style="margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.3rem;">$1</h2>');
    escaped = escaped.replace(/^# (.*?)$/gm, '<h2>$1</h2>');

    // Lists: - item or * item
    escaped = escaped.replace(/^\s*[-*] (.*?)$/gm, '<li>$1</li>');
    escaped = escaped.replace(/(<li>.*<\/li>)/s, '<ul style="margin-left: 1.5rem; margin-bottom: 1rem;">$1</ul>');

    // Numbered lists: 1. item
    escaped = escaped.replace(/^\s*\d+\. (.*?)$/gm, '<li>$1</li>');

    // Line breaks
    escaped = escaped.replace(/\n\n/g, '</p><p>');
    escaped = `<p>${escaped}</p>`;

    // Clean up empty paragraphs
    escaped = escaped.replace(/<p><\/p>/g, '');

    return escaped;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    outputSection.style.display = 'none';
    emptyState.style.display = 'none';
}

/**
 * Hide error message
 */
function hideError() {
    errorSection.style.display = 'none';
}

/**
 * Show output section
 */
function showOutput() {
    outputSection.style.display = 'block';
    emptyState.style.display = 'none';
    errorSection.style.display = 'none';
}

/**
 * Hide output section
 */
function hideOutput() {
    outputSection.style.display = 'none';
}

/**
 * Hide empty state
 */
function hideEmptyState() {
    emptyState.style.display = 'none';
}

/**
 * Set loading state
 * @param {boolean} isLoading - Loading state
 */
function setLoading(isLoading) {
    simulateBtn.disabled = isLoading;
    promptInput.disabled = isLoading;

    if (isLoading) {
        spinner.classList.add('active');
        simulateBtn.textContent = '';
        const textSpan = document.createElement('span');
        textSpan.className = 'button-text';
        textSpan.textContent = 'Processing...';
        simulateBtn.appendChild(textSpan);
        simulateBtn.appendChild(spinner);
    } else {
        spinner.classList.remove('active');
        simulateBtn.innerHTML = '<span class="button-text">Run Simulation</span><span class="spinner" id="spinner"></span>';
    }
}

/**
 * Reset form and UI
 */
function resetForm() {
    promptInput.value = '';
    promptInput.disabled = false;
    hideOutput();
    hideError();
    emptyState.style.display = 'block';
    setLoading(false);
    promptInput.focus();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
