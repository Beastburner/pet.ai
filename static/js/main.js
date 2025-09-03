// Simplified Working PetPsych AI JavaScript
console.log('🧠 PetPsych AI JavaScript Loading...');

// Global variables
let analysisInProgress = false;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing...');
    initializeApp();
});

function initializeApp() {
    // Initialize form handlers
    setupFormHandlers();

    // Initialize tooltips
    initializeTooltips();

    // Setup camera if available
    setupCameraHandlers();

    console.log('✅ PetPsych AI initialized successfully');
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function setupFormHandlers() {
    const petForm = document.getElementById('petForm');
    const cameraForm = document.getElementById('cameraForm');

    if (petForm) {
        petForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Pet form submitted');
            submitForm(this);
        });
    }

    if (cameraForm) {
        cameraForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📹 Camera form submitted');
            submitForm(this);
        });
    }

    // New analysis button
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', function() {
            console.log('🔄 New analysis requested');
            resetForNewAnalysis();
        });
    }

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            console.log('📥 Download requested');
            downloadReport();
        });
    }
}

async function submitForm(form) {
    if (analysisInProgress) {
        showNotification('Analysis already in progress...', 'warning');
        return;
    }

    // Validate form
    if (!validateForm(form)) {
        return;
    }

    analysisInProgress = true;

    try {
        // Show loading
        showLoader();
        hideTabContent();

        // Prepare form data
        const formData = new FormData(form);

        console.log('📤 Sending analysis request...');

        // Send request
        const response = await fetch('/analyze_behavior', {
            method: 'POST',
            body: formData
        });

        console.log('📥 Response received:', response.status);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('📊 Analysis result received:', result.success);

        // Display results
        displayResults(result);

    } catch (error) {
        console.error('💥 Analysis failed:', error);
        showNotification('Analysis failed: ' + error.message, 'error');
        showTabContent();
    } finally {
        hideLoader();
        analysisInProgress = false;
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
    }

    return isValid;
}

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'block';
        console.log('⏳ Loader shown');
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
        console.log('✅ Loader hidden');
    }
}

function hideTabContent() {
    const tabContent = document.getElementById('tabContent');
    if (tabContent) {
        tabContent.style.display = 'none';
        console.log('📝 Form hidden');
    }
}

function showTabContent() {
    const tabContent = document.getElementById('tabContent');
    if (tabContent) {
        tabContent.style.display = 'block';
        console.log('📝 Form shown');
    }
}

function displayResults(result) {
    console.log('🎨 Displaying results...');

    if (result.success) {
        // Get or create results container
        let resultsContainer = document.getElementById('resultsContainer');

        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'resultsContainer';

            const mainContainer = document.querySelector('.container.my-5 .row .col-lg-10');
            if (mainContainer) {
                mainContainer.appendChild(resultsContainer);
            }
        }

        // Format analysis text
        const formattedAnalysis = formatAnalysisText(result.analysis);

        // Create results HTML
        resultsContainer.innerHTML = `
            <div class="analysis-result" style="
                background: white;
                border-radius: 20px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                margin-top: 2rem;
                overflow: hidden;
                border-top: 4px solid #0FA3D4;
                display: block;
            ">
                <div class="analysis-header" style="
                    background: linear-gradient(135deg, #f1f5f9 0%, white 100%);
                    padding: 2rem;
                    text-align: center;
                    border-bottom: 1px solid #e2e8f0;
                ">
                    <div style="
                        width: 64px;
                        height: 64px;
                        background: linear-gradient(135deg, #00D4AA, #0FA3D4);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        margin: 0 auto 1rem;
                        font-size: 1.5rem;
                    ">
                        <i class="fas fa-brain"></i>
                    </div>
                    <h3 style="color: #1e3a5f; margin-bottom: 0.5rem; font-weight: 700;">
                        Pet Psychology Analysis Report
                    </h3>
                    <p style="color: #64748b; margin: 0; font-size: 0.95rem;">
                        AI-powered behavioral insights and recommendations
                    </p>
                </div>

                <div class="analysis-content" style="
                    padding: 2rem;
                    line-height: 1.8;
                    font-size: 1.05rem;
                    color: #334155;
                ">
                    ${formattedAnalysis}

                    <div style="
                        display: flex;
                        gap: 1rem;
                        margin-top: 2rem;
                        justify-content: center;
                        flex-wrap: wrap;
                    ">
                        <button onclick="resetForNewAnalysis()" style="
                            background: linear-gradient(135deg, #00D4AA, #0FA3D4);
                            color: white;
                            border: none;
                            padding: 0.875rem 2rem;
                            border-radius: 12px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'"
                        onmouseout="this.style.transform='translateY(0)'">
                            <i class="fas fa-plus"></i> New Analysis
                        </button>

                        <button onclick="downloadReport()" style="
                            background: #f1f5f9;
                            color: #1e3a5f;
                            border: 2px solid #e2e8f0;
                            padding: 0.875rem 2rem;
                            border-radius: 12px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'"
                        onmouseout="this.style.transform='translateY(0)'">
                            <i class="fas fa-download"></i> Download Report
                        </button>
                    </div>
                </div>

                <div style="
                    background: #f8fafc;
                    padding: 1rem;
                    text-align: center;
                    color: #64748b;
                    font-size: 0.875rem;
                    border-top: 1px solid #e2e8f0;
                ">
                    Analysis completed: ${result.timestamp}
                </div>
            </div>
        `;

        // Scroll to results
        setTimeout(() => {
            resultsContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);

        showNotification('🧠 Analysis completed successfully!', 'success');
        console.log('✅ Results displayed successfully');

    } else {
        console.error('❌ Analysis failed:', result.error);
        showNotification('Analysis failed: ' + result.error, 'error');
        showTabContent();
    }
}

function formatAnalysisText(text) {
    if (!text) return '<p>No analysis content received.</p>';

    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0FA3D4; font-weight: 600;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="color: #64748b;">$1</em>')
        .replace(/\n\n/g, '</p><p style="margin-bottom: 1.5rem;">')
        .replace(/\n/g, '<br>')
        .replace(/^(.+)$/, '<p style="margin-bottom: 1.5rem;">$1</p>')
        .replace(/(\d+\.\s*)(.*?):/g, '<h4 style="color: #0FA3D4; margin: 2rem 0 1rem; font-weight: 600;"><i class="fas fa-brain" style="margin-right: 0.5rem;"></i>$1$2:</h4>');
}

function resetForNewAnalysis() {
    console.log('🔄 Resetting for new analysis...');

    // Remove results
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.remove();
    }

    // Show form
    showTabContent();

    // Reset forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showNotification('Ready for new analysis 🚀', 'info');
}

function downloadReport() {
    console.log('📥 Downloading report...');

    try {
        const analysisContent = document.querySelector('.analysis-content');
        if (!analysisContent) {
            showNotification('No analysis to download', 'error');
            return;
        }

        const content = analysisContent.textContent;
        const timestamp = new Date().toISOString().slice(0,10);
        const filename = `petpsych-analysis-${timestamp}.txt`;

        const reportContent = `PetPsych AI - Behavioral Analysis Report
${'='.repeat(50)}

${content}

${'='.repeat(50)}
Generated by PetPsych AI
Powered by Gemini 1.5 Pro • © 2025 PetPsych AI`;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('📥 Report downloaded successfully!', 'success');

    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed. Please try again.', 'error');
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);

    // Remove existing notifications
    const existing = document.querySelectorAll('.temp-notification');
    existing.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'temp-notification';

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 15px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        max-width: 350px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        background: ${colors[type]};
        transform: translateX(100px);
        opacity: 0;
        transition: all 0.3s ease;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Camera functionality (simplified)
function setupCameraHandlers() {
    // Basic camera setup - can be enhanced later
    console.log('📹 Camera handlers initialized');
}

// Global functions for onclick handlers
window.resetForNewAnalysis = resetForNewAnalysis;
window.downloadReport = downloadReport;

console.log('🎉 PetPsych AI JavaScript fully loaded!');
