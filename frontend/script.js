function initializeSliderListeners() {
    // Age slider
    document.getElementById('age').addEventListener('input', (e) => {
        document.getElementById('ageValue').textContent = Math.round(e.target.value);
    });

    // Height slider
    document.getElementById('height').addEventListener('input', (e) => {
        document.getElementById('heightValue').textContent = Math.round(e.target.value);
        updateBMI();
    });

    // Weight slider
    document.getElementById('weight').addEventListener('input', (e) => {
        document.getElementById('weightValue').textContent = Math.round(e.target.value);
        updateBMI();
    });

    // Sleep slider
    document.getElementById('sleep').addEventListener('input', (e) => {
        document.getElementById('sleepValue').textContent = parseFloat(e.target.value).toFixed(1);
    });

    // Daily Steps slider
    document.getElementById('dailySteps').addEventListener('input', (e) => {
        document.getElementById('stepsValue').textContent = Math.round(e.target.value).toLocaleString();
    });

    // Target Sleep slider
    document.getElementById('targetSleep').addEventListener('input', (e) => {
        document.getElementById('targetSleepValue').textContent = parseFloat(e.target.value).toFixed(1);
    });

    // Target Steps slider
    document.getElementById('targetSteps').addEventListener('input', (e) => {
        document.getElementById('targetStepsValue').textContent = Math.round(e.target.value).toLocaleString();
    });

    // Duration slider
    document.getElementById('duration').addEventListener('input', (e) => {
        document.getElementById('durationValue').textContent = e.target.value;
    });

    // Fasting Glucose slider
    document.getElementById('fastingGlucose').addEventListener('input', (e) => {
        document.getElementById('glucoseValue').textContent = Math.round(e.target.value);
        updateGlucoseStatus();
    });

    // HbA1c slider
    document.getElementById('hbA1c').addEventListener('input', (e) => {
        document.getElementById('hba1cValue').textContent = parseFloat(e.target.value).toFixed(1);
        updateHbA1cStatus();
    });
}

// ============================================================================
// BMI CALCULATION & STATUS
// ============================================================================
function updateBMI() {
    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);

    if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(1);
        document.getElementById('bmiNumber').textContent = bmi;

        // Determine BMI status
        let status, emoji;
        if (bmi < 18.5) {
            status = 'Underweight';
            emoji = '⚠️';
        } else if (bmi < 25) {
            status = 'Normal Weight';
            emoji = '✅';
        } else if (bmi < 30) {
            status = 'Overweight';
            emoji = '⚠️';
        } else {
            status = 'Obese';
            emoji = '🔴';
        }

        document.getElementById('bmiStatus').textContent = status;
        document.getElementById('bmiEmoji').textContent = emoji;
    }
}

// ============================================================================
// HEALTH STATUS UPDATES
// ============================================================================
function updateGlucoseStatus() {
    const glucose = parseFloat(document.getElementById('fastingGlucose').value);
    const statusEl = document.getElementById('glucoseStatus');

    let status, className;
    if (glucose < 100) {
        status = '✓ Normal';
        className = 'normal';
    } else if (glucose < 126) {
        status = '⚠ At Risk (Prediabetes)';
        className = 'warning';
    } else {
        status = '🔴 High (Diabetes)';
        className = 'high';
    }

    statusEl.textContent = status;
    statusEl.className = 'health-status ' + className;
}

function updateHbA1cStatus() {
    const hba1c = parseFloat(document.getElementById('hbA1c').value);
    const statusEl = document.getElementById('hba1cStatus');

    let status, className;
    if (hba1c < 5.7) {
        status = '✓ Normal';
        className = 'normal';
    } else if (hba1c < 6.5) {
        status = '⚠ At Risk (Prediabetes)';
        className = 'warning';
    } else {
        status = '🔴 High (Diabetes)';
        className = 'high';
    }

    statusEl.textContent = status;
    statusEl.className = 'health-status ' + className;
}

// ============================================================================
// GENDER SELECTION
// ============================================================================
function selectGender(button) {
    // Remove active class from all buttons
    document.querySelectorAll('.segmented-button').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    // Update hidden input
    document.getElementById('gender').value = button.dataset.gender;
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================
const form = document.getElementById('simulationForm');
const errorMessage = document.getElementById('errorMessage');
const outputSection = document.getElementById('outputSection');
const loadingState = document.getElementById('loadingState');
const resultsContainer = document.getElementById('resultsContainer');
const btnSpinner = document.getElementById('btnSpinner');

// ============================================================================
// PROMPT CONSTRUCTION
// ============================================================================
function constructPrompt() {
    // Calculate BMI for prompt
    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);
    const bmi = (weight / (height * height)).toFixed(1);

    // Collect form data
    const data = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        bmi: bmi,
        familyHistory: document.getElementById('familyHistory').value,
        fastingGlucose: document.getElementById('fastingGlucose').value,
        hbA1c: document.getElementById('hbA1c').value,
        sleep: document.getElementById('sleep').value,
        dailySteps: document.getElementById('dailySteps').value,
        sugarIntake: document.getElementById('sugarIntake').value,
        stressLevel: document.getElementById('stressLevel').value,
        targetSleep: document.getElementById('targetSleep').value,
        targetSteps: document.getElementById('targetSteps').value,
        targetSugarIntake: document.getElementById('targetSugarIntake').value,
        duration: document.getElementById('duration').value,
    };

    // Construct the prompt in the specified format
    const prompt = `
PATIENT_PROFILE:
Name: ${data.name}
Age: ${data.age}
Gender: ${data.gender}
BMI: ${data.bmi}
Family_History: ${data.familyHistory}

BASELINE_LAB_DATA:
Fasting_Glucose: ${data.fastingGlucose} mg/dL
HbA1c: ${data.hbA1c}%

CURRENT_LIFESTYLE:
Sleep: ${data.sleep} hours/night
Daily_Steps: ${data.dailySteps}
Sugar_Intake: ${data.sugarIntake}
Stress_Level: ${data.stressLevel}

SCENARIOS_TO_SIMULATE:
A) Current lifestyle continues unchanged
B) Sleep increased to ${data.targetSleep} hours, sugar intake reduced to ${data.targetSugarIntake}, daily steps increased to ${data.targetSteps}

SIMULATION_TIMEFRAME:
${data.duration} months

TASKS:
1. Simulate the future health risk trajectory for each scenario
2. Estimate relative change in Type 2 Diabetes risk as a percentage
3. Identify key lifestyle factors driving risk
4. Provide preventive, lifestyle-based suggestions
5. Explain reasoning using clear cause → effect logic

OUTPUT_FORMAT:
- Risk_Comparison_Table (with scenarios, risk levels, HbA1c trend, glucose trend)
- Key_Risk_Drivers (bullet list of lifestyle factors)
- Estimated_Risk_Change_Percentage (e.g., "-28% relative risk reduction")
- Cause_Effect_Explanation (explain how sleep, sugar, activity, stress affect diabetes risk)
- Simple_Summary (Explain like I am 12 - very simple language, friendly tone, no medical jargon)
`.trim();

    return prompt;
}

// ============================================================================
// FORM VALIDATION
// ============================================================================
function validateForm() {
    const requiredFields = [
        'name', 'age', 'gender', 'familyHistory',
        'height', 'weight', 'fastingGlucose', 'hbA1c',
        'sleep', 'dailySteps', 'sugarIntake', 'stressLevel',
        'targetSleep', 'targetSteps', 'targetSugarIntake', 'duration'
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value || field.value.trim() === '') {
            showError(`Please fill in: ${field.previousElementSibling?.textContent || fieldId}`);
            return false;
        }
    }

    return true;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// ============================================================================
// API COMMUNICATION
// ============================================================================
const API_BASE_URL = "https://twindex.onrender.com";
async function submitSimulation(event) {
    event.preventDefault();
    hideError();

    // Validate
    if (!validateForm()) {
        return;
    }

    // Show loading state
    outputSection.classList.remove('hidden');
    loadingState.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    btnSpinner.style.display = 'inline-block';

    // Scroll to output
    outputSection.scrollIntoView({ behavior: 'smooth' });

    try {
        // Construct prompt
        const prompt = constructPrompt();
        console.log('Constructed prompt:\n', prompt);

        // Prepare request payload
        const payload = {
            prompt: prompt
        };

        // Send to backend
        const response = await fetch(`${API_BASE_URL}/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Backend error');
        }

        const result = await response.json();
        console.log('Backend response:', result);

        if (!result || !result.result) {
            throw new Error('Invalid response format: missing result field');
        }

        // Hide loading, show results
        loadingState.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        btnSpinner.style.display = 'none';

        // Parse and display results
        displayResults(result.result);
    } catch (error) {
        console.error('Error:', error);
        btnSpinner.style.display = 'none';
        loadingState.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        showError(`Error: ${error.message}`);
    }
}

// ============================================================================
// RESULT PARSING & DISPLAY
// ============================================================================
function displayResults(rawOutput) {
    // Store raw output for debugging
    const fullResponseEl = document.getElementById('fullResponse');
    if (fullResponseEl) {
        fullResponseEl.textContent = rawOutput;
    }

    // Store report content for follow-up chat context
    storedReportContent = rawOutput;

    // Render the full markdown output
    renderMarkdownCard(rawOutput);

    // Show follow-up chat section
    const followupSection = document.getElementById('followupChatSection');
    followupSection.classList.add('visible');
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    initializeFollowupChat();

    // Render global health context
    renderGlobalHealthContext();
}

function renderMarkdownCard(markdownContent) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = ''; // Clear existing content

    // Create main card for formatted markdown
    const card = document.createElement('div');
    card.className = 'output-card output-card-summary';

    const titleEl = document.createElement('h3');
    titleEl.className = 'output-card-title';
    titleEl.textContent = '📋 Analysis Results';

    const contentEl = document.createElement('div');
    contentEl.className = 'output-card-content';
    contentEl.innerHTML = marked.parse(markdownContent);

    card.appendChild(titleEl);
    card.appendChild(contentEl);
    container.appendChild(card);

    // Add full response debug card at the end
    const debugCard = document.createElement('div');
    debugCard.className = 'output-card output-card-debug';
    debugCard.innerHTML = `
        <details>
            <summary>📋 View Raw Response</summary>
            <pre id="fullResponse" style="white-space: pre-wrap; word-wrap: break-word;"></pre>
        </details>
    `;
    container.appendChild(debugCard);
}

function formatContent(text) {
    if (!text || typeof text !== 'string') return '<p>No data available</p>';
    return marked.parse(text);
}

// ============================================================================
// MARKDOWN-STYLE FORMATTING
// ============================================================================
function formatMarkdown(text) {
    // Legacy function - routes to new formatContent
    return formatContent(text);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// RESET FUNCTIONALITY
// ============================================================================
function resetSimulation() {
    outputSection.classList.add('hidden');
    form.scrollIntoView({ behavior: 'smooth' });
}

form.addEventListener('reset', () => {
    // Reinitialize sliders to default values
    updateBMI();
    updateGlucoseStatus();
    updateHbA1cStatus();
    initializeSliderListeners();
    hideError();
});

// ============================================================================
// FORM SUBMISSION
// ============================================================================
form.addEventListener('submit', submitSimulation);

// ============================================================================
// DARK MODE FUNCTIONALITY
// ============================================================================
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'true') {
        document.documentElement.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });
}

// ============================================================================
// PDF EXPORT FUNCTIONALITY
// ============================================================================
function exportResultsToPDF() {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!resultsContainer || resultsContainer.classList.contains('hidden')) {
        alert('No results to export. Please run a simulation first.');
        return;
    }

    const element = resultsContainer;
    const opt = {
        margin: 10,
        filename: 'AI_Health_Simulation_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
}

// ============================================================================
// FOLLOW-UP CHAT FUNCTIONALITY
// ============================================================================
let storedReportContent = '';
let loadedDiseaseContext = [];

function initializeFollowupChat() {
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const imageUploadBtn = document.getElementById('imageUploadBtn');

    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    imageUploadBtn.disabled = false;
    chatInput.focus();
}

function addChatMessage(text, isUser, imageData) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'ai'}`;
    
    let messageHTML = '';
    if (imageData) {
        messageHTML = `<img src="${imageData}" alt="Prescription" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-bottom: 0.5rem;">`;
    }
    
    if (isUser) {
        messageHTML += `<div class="chat-message-content">${escapeHtml(text)}</div>`;
    } else {
        // Parse markdown for AI responses
        messageHTML += `<div class="chat-message-content chat-ai-content">${marked.parse(text)}</div>`;
    }
    
    messageDiv.innerHTML = messageHTML;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addThinkingIndicator(customText) {
    const chatMessages = document.getElementById('chatMessages');
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'chat-message ai';
    thinkingDiv.id = 'thinkingIndicator';
    const text = customText || 'Thinking...';
    thinkingDiv.innerHTML = `<div class="chat-message-content"><span class="chat-thinking">${text}</span></div>`;
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeThinkingIndicator() {
    const thinkingDiv = document.getElementById('thinkingIndicator');
    if (thinkingDiv) {
        thinkingDiv.remove();
    }
}

async function sendFollowupQuestion() {
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const question = chatInput.value.trim();

    if (!question && !uploadedImageFile) {
        return;
    }

    // Disable input while processing
    chatInput.disabled = true;
    chatSendBtn.disabled = true;
    document.getElementById('imageUploadBtn').disabled = true;

    // Add user message with image preview if present
    if (uploadedImageFile) {
        addChatMessage(question || '(Prescription Image)', true, uploadedImageBase64);
    } else {
        addChatMessage(question, true);
    }
    chatInput.value = '';

    // Show thinking indicator with prescription status
    if (uploadedImageFile) {
        addThinkingIndicator('Analyzing prescription...');
    } else {
        addThinkingIndicator();
    }

    try {
        let response;

        // If NO image uploaded - use JSON (original method)
        if (!uploadedImageFile) {
            const followupPrompt = `You are a health insight assistant providing detailed, actionable guidance based on a health simulation report.

CONTEXT - HEALTH SIMULATION REPORT:
${storedReportContent}

USER QUESTION:
${question}

RESPONSE REQUIREMENTS:
1. Answer the user's specific question with clear, cause-effect reasoning
2. Provide 3-5 key insights or takeaways relevant to their question
3. Include practical, actionable steps they can take
4. Connect insights back to their health report where relevant
5. Use simple, non-medical language
6. Structure response with clear sections and bullet points for readability
7. Add an "Impact Summary" showing how the answer connects to their diabetes/health risk
8. Include relevant lifestyle factors affected by their question

Format your response with:
- Direct Answer to their question
- Key Insights (3-5 numbered points)
- Actionable Steps
- Impact Summary
- Relevant Risk Factors Affected

Keep it informative but conversational.`;

            const payload = {
                prompt: followupPrompt
            };

            response = await fetch(`${API_BASE_URL}/simulate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
        } else {
            // If image is uploaded - use FormData (multipart)
            const followupPrompt = `You are a healthcare explanation assistant providing comprehensive, user-friendly prescription insights.
You do not provide medical diagnosis or treatment.
You only explain existing prescriptions in an educational manner.

PATIENT HEALTH CONTEXT FROM REPORT:
${storedReportContent}

USER QUESTION/CONTEXT:
${question || "Please explain the prescription in this image"}

TASK - PRESCRIPTION ANALYSIS:
A prescription image has been uploaded. Provide a comprehensive explanation including:

1. MEDICINE IDENTIFICATION
   - List each medicine/medication visible
   - Include dosage and frequency if visible

2. PURPOSE & FUNCTION
   - Explain what each medicine does in simple terms
   - Connect to their health context from the report

3. LIFESTYLE FACTORS
   - How these medicines relate to sleep, diet, activity level
   - Connection to their diabetes/health risk factors
   - Complementary lifestyle changes recommended

4. EDUCATIONAL INSIGHTS
   - How do these medicines work together?
   - Why might the doctor have prescribed this combination?
   - General educational information about the condition being treated

5. IMPORTANT REMINDERS
   - Consistency and timing tips
   - General lifestyle supportive measures
   - When to consult the doctor about concerns

RESPONSE FORMAT:
- Use clear headings for each section
- Use bullet points for readability
- Explain in simple, non-medical language
- Keep focus on education, not medical advice
- Connect to their health simulation report
- Include practical supportive recommendations

DO NOT:
- Change dosages or suggest new medicines
- Provide medical diagnosis
- Make treatment recommendations
- Replace doctor consultation
- Do NOT suggest dosage changes or new medicines
- Do NOT diagnose or prescribe

Keep explanation concise and educational.`;

            const formData = new FormData();
            formData.append('prompt', followupPrompt);
            formData.append('image', uploadedImageFile);

            response = await fetch(`${API_BASE_URL}/simulate`, {
                method: 'POST',
                body: formData
                // Don't set Content-Type header - browser will set it with boundary
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Backend error');
        }

        const result = await response.json();

        if (!result || !result.result) {
            throw new Error('Invalid response format');
        }

        // Remove thinking indicator and add AI response
        removeThinkingIndicator();
        addChatMessage(result.result, false);

        // Clear uploaded image after sending
        removeUploadedImage();

    } catch (error) {
        removeThinkingIndicator();
        addChatMessage(`Error: ${error.message}`, false);
    } finally {
        // Re-enable input
        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        document.getElementById('imageUploadBtn').disabled = false;
        chatInput.focus();
    }
}

async function loadDiseaseContext() {
    try {
        const response = await fetch('disease_context.json');
        if (!response.ok) throw new Error('Failed to load disease context');
        loadedDiseaseContext = await response.json();
    } catch (error) {
        console.error('Error loading disease context:', error);
        loadedDiseaseContext = [];
    }
}

function evaluateRelevanceRules(rules, userInputs) {
    if (!rules) return true;

    // Check min age (hard threshold)
    if (rules.min_age !== undefined) {
        if (userInputs.age < rules.min_age) return false;
    }

    // Age check passed - disease is relevant for this age group
    return true;
}

function getMatchingDiseaseContexts() {
    const userInputs = {
        age: parseInt(document.getElementById('age').value),
        bmi: parseFloat(document.getElementById('bmiNumber').textContent),
        dailySteps: parseInt(document.getElementById('dailySteps').value),
        sugarIntake: document.getElementById('sugarIntake').value,
        sleep: parseFloat(document.getElementById('sleep').value),
        stressLevel: document.getElementById('stressLevel').value
    };

    const matched = loadedDiseaseContext
        .filter(disease => evaluateRelevanceRules(disease.relevance_rules, userInputs))
        .slice(0, 3); // Max 3 cards

    return matched;
}

function formatInsight(template, disease) {
    let insight = template
        .replace('{prevalence}', disease.global_prevalence_percent)
        .replace('{threshold}', disease.relevance_rules.bmi_threshold || '25');
    return insight;
}

function renderGlobalHealthContext() {
    const matchedDiseases = getMatchingDiseaseContexts();

    if (matchedDiseases.length === 0) {
        // Hide section if no matches
        const section = document.getElementById('globalContextSection');
        section.classList.remove('visible');
        return;
    }

    const cardsContainer = document.getElementById('diseaseContextCards');
    cardsContainer.innerHTML = '';

    const diseaseIcons = {
        'T2D': '🧬',
        'CVD': '❤️',
        'HTN': '💓',
        'OB': '⚖️',
        'SLEEP': '😴'
    };

    matchedDiseases.forEach(disease => {
        const icon = diseaseIcons[disease.disease_id] || '🌍';
        const insight = formatInsight(disease.insight_template, disease);

        const card = document.createElement('div');
        card.className = 'disease-card';
        card.innerHTML = `
            <div class="disease-card-header">
                <div class="disease-card-icon">${icon}</div>
                <div class="disease-card-title">
                    <h3 class="disease-card-name">${escapeHtml(disease.disease_name)}</h3>
                    <div class="disease-card-category">${escapeHtml(disease.category)}</div>
                </div>
            </div>
            <div class="disease-prevalence">
                <span class="disease-prevalence-label">Global Prevalence:</span>
                <span class="disease-prevalence-value">${disease.global_prevalence_percent}%</span>
            </div>
            <div class="disease-insight">${escapeHtml(insight)}</div>
            <div class="disease-risk-factors">
                <div class="disease-risk-label">Key Risk Factors</div>
                <div class="disease-risk-list">
                    ${disease.key_risk_factors.map(factor => 
                        `<span class="risk-badge">${escapeHtml(factor)}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });

    // Show section
    const section = document.getElementById('globalContextSection');
    section.classList.add('visible');
}

// ============================================================================
// PRESCRIPTION IMAGE UPLOAD
// ============================================================================
let uploadedImageFile = null;
let uploadedImageBase64 = null;

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/(jpeg|png)')) {
        alert('Please upload a JPG or PNG image');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
    }

    uploadedImageFile = file;

    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImageBase64 = event.target.result;
        showImagePreview();
    };
    reader.readAsDataURL(file);
}

function showImagePreview() {
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImg = document.getElementById('imagePreview');
    previewImg.src = uploadedImageBase64;
    previewContainer.style.display = 'block';
}

function removeUploadedImage() {
    uploadedImageFile = null;
    uploadedImageBase64 = null;
    document.getElementById('imageInput').value = '';
    document.getElementById('imagePreviewContainer').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    loadDiseaseContext();
    initializeSliderListeners();
    updateBMI();
    updateGlucoseStatus();
    updateHbA1cStatus();
    
    // Initialize image input listener
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    // Add enter key listener for chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !chatInput.disabled) {
                sendFollowupQuestion();
            }
        });
    }
    
    console.log('Twindex Frontend Ready');
});

