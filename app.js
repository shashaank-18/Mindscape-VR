// MindScape VR Therapy Application
class MindScapeApp {
    constructor() {
        this.currentScreen = 'welcomeScreen';
        this.currentUser = null;
        this.assessmentData = {};
        this.sessionData = {};
        this.biometricInterval = null;
        this.sessionTimer = null;
        this.exerciseTimer = null;
        this.currentQuestion = 0;
        this.biometricChart = null;
        this.progressChart = null;
        
        // Application data
        this.therapyScenarios = [
            {
                id: "heights",
                name: "Height Exposure Therapy",
                description: "Premium mountain VR environments for acrophobia treatment",
                difficulty_levels: ["Base Camp", "Lower Trail", "Mid Platform", "High Ridge", "Summit Peak"],
                environments: ["Mountain Lodge", "Alpine Trail", "Viewing Platform", "Rocky Ridge", "Snow Summit"],
                duration: "15-30 minutes",
                color: "var(--color-bg-1)"
            },
            {
                id: "social",
                name: "Social Anxiety Therapy",
                description: "Interactive social scenarios for anxiety treatment",
                difficulty_levels: ["One-on-One", "Small Group", "Medium Group", "Large Audience", "Public Speaking"],
                environments: ["Job Interview", "Party Setting", "Presentation Hall", "Classroom"],
                duration: "20-40 minutes",
                color: "var(--color-bg-2)"
            },
            {
                id: "flying",
                name: "Flying Phobia Treatment",
                description: "Airplane simulation for aviophobia",
                difficulty_levels: ["Airport Visit", "Boarding", "Takeoff", "In-Flight", "Landing"],
                environments: ["Airport Terminal", "Airplane Cabin", "Cockpit View", "Window Seat"],
                duration: "25-45 minutes",
                color: "var(--color-bg-3)"
            },
            {
                id: "ptsd",
                name: "PTSD Therapy",
                description: "Controlled trauma processing environments",
                difficulty_levels: ["Safe Space", "Mild Triggers", "Moderate Exposure", "Intensive Processing"],
                environments: ["Safe Room", "Controlled Simulation", "Memory Palace", "Coping Space"],
                duration: "30-60 minutes",
                color: "var(--color-bg-4)"
            },
            {
                id: "mood",
                name: "Mood Enhancement",
                description: "Calming environments for mood improvement",
                difficulty_levels: ["Relaxation", "Mild Activity", "Engagement", "Empowerment"],
                environments: ["Beach Sunset", "Forest Clearing", "Mountain Vista", "Garden Sanctuary"],
                duration: "10-30 minutes",
                color: "var(--color-bg-5)"
            }
        ];

        this.assessmentQuestions = [
            {
                id: 1,
                question: "How often have you felt anxious in the past two weeks?",
                type: "scale",
                scale: [1, 2, 3, 4, 5],
                labels: ["Never", "Rarely", "Sometimes", "Often", "Always"]
            },
            {
                id: 2,
                question: "Which situations cause you the most anxiety?",
                type: "multiple_choice",
                options: ["Heights", "Social Situations", "Flying", "Crowded Places", "Public Speaking", "Medical Procedures"]
            },
            {
                id: 3,
                question: "How would you rate your overall mood lately?",
                type: "scale",
                scale: [1, 2, 3, 4, 5],
                labels: ["Very Poor", "Poor", "Average", "Good", "Excellent"]
            },
            {
                id: 4,
                question: "Have you experienced any traumatic events that still affect you?",
                type: "yes_no"
            },
            {
                id: 5,
                question: "How comfortable are you with virtual reality technology?",
                type: "scale",
                scale: [1, 2, 3, 4, 5],
                labels: ["Very Uncomfortable", "Uncomfortable", "Neutral", "Comfortable", "Very Comfortable"]
            }
        ];

        this.biometricData = {
            heartRate: 72,
            stressLevel: 'Low',
            skinConductance: 5,
            baselineHeartRate: 72
        };

        // Mountain VR state
        this.currentHeightLevel = 1;
        this.currentWeather = 'clear';
        this.currentTimeOfDay = 'day';
        this.safetyMode = true;
    }

    init() {
        console.log('Initializing MindScape App...');
        this.bindEvents();
        this.showScreen('welcomeScreen');
        // Delay chart initialization to ensure DOM is ready
        setTimeout(() => this.initializeCharts(), 500);
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Welcome screen - use direct element references with null checks
        const patientLoginBtn = document.getElementById('patientLogin');
        const therapistLoginBtn = document.getElementById('therapistLogin');
        
        if (patientLoginBtn) {
            patientLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Patient login clicked');
                this.handlePatientLogin();
            });
        }
        
        if (therapistLoginBtn) {
            therapistLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Therapist login clicked');
                this.handleTherapistLogin();
            });
        }

        // Assessment navigation
        const nextBtn = document.getElementById('nextQuestion');
        const prevBtn = document.getElementById('prevQuestion');
        const completeBtn = document.getElementById('completeAssessment');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
        if (completeBtn) completeBtn.addEventListener('click', () => this.completeAssessment());

        // Dashboard buttons
        const logoutBtn = document.getElementById('logoutBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettings());

        // VR Session controls
        const pauseBtn = document.getElementById('pauseSession');
        const breathingBtn = document.getElementById('breathingExercise');
        const endBtn = document.getElementById('endSession');
        const emergencyBtn = document.getElementById('emergencyStop');
        
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseSession());
        if (breathingBtn) breathingBtn.addEventListener('click', () => this.startBreathingExercise());
        if (endBtn) endBtn.addEventListener('click', () => this.endSession());
        if (emergencyBtn) emergencyBtn.addEventListener('click', () => this.emergencyStop());

        // Modal controls
        const closeExerciseBtn = document.getElementById('closeExercise');
        const startExerciseBtn = document.getElementById('startExercise');
        const skipExerciseBtn = document.getElementById('skipExercise');
        const backToDashboardBtn = document.getElementById('backToDashboard');
        const closeSettingsBtn = document.getElementById('closeSettings');
        
        if (closeExerciseBtn) closeExerciseBtn.addEventListener('click', () => this.closeExerciseModal());
        if (startExerciseBtn) startExerciseBtn.addEventListener('click', () => this.startExercise());
        if (skipExerciseBtn) skipExerciseBtn.addEventListener('click', () => this.closeExerciseModal());
        if (backToDashboardBtn) backToDashboardBtn.addEventListener('click', () => this.backToDashboard());
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => this.closeSettings());

        // Handle modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Mountain VR Controls Event Listeners (will be added when VR session starts)
        this.bindMountainVREvents();

        console.log('Events bound successfully');
    }

    bindMountainVREvents() {
        // Height level controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.height-level')) {
                const level = parseInt(e.target.closest('.height-level').dataset.level);
                this.changeHeightLevel(level);
            }
        });

        // Weather controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-weather]')) {
                this.changeWeather(e.target.dataset.weather);
            }
        });

        // Time of day controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-time]')) {
                this.changeTimeOfDay(e.target.dataset.time);
            }
        });

        // Safety mode controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-safety]')) {
                this.toggleSafetyMode(e.target.dataset.safety === 'on');
            }
        });

        // Interactive mountain elements
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cable-car')) {
                this.activateCableCar();
            } else if (e.target.closest('.mountain-lodge')) {
                this.enterMountainLodge();
            } else if (e.target.closest('.eagle')) {
                this.observeWildlife('eagle');
            }
        });
    }

    showScreen(screenId) {
        console.log(`Showing screen: ${screenId}`);
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            console.log(`Screen ${screenId} activated successfully`);
        } else {
            console.error(`Screen ${screenId} not found`);
        }
    }

    handlePatientLogin() {
        console.log('Handling patient login...');
        this.currentUser = { type: 'patient', name: 'Patient User' };
        this.showScreen('assessmentScreen');
        // Small delay to ensure screen is visible before rendering content
        setTimeout(() => this.renderAssessment(), 100);
    }

    handleTherapistLogin() {
        console.log('Handling therapist login...');
        this.currentUser = { type: 'therapist', name: 'Dr. Smith' };
        this.showScreen('dashboardScreen');
        // Small delay to ensure screen is visible before rendering content
        setTimeout(() => this.renderDashboard(), 100);
    }

    renderAssessment() {
        console.log('Rendering assessment...');
        this.currentQuestion = 0;
        this.assessmentData = {};
        this.renderCurrentQuestion();
        this.updateAssessmentProgress();
    }

    renderCurrentQuestion() {
        const container = document.getElementById('questionContainer');
        if (!container) {
            console.error('Question container not found');
            return;
        }
        
        const question = this.assessmentQuestions[this.currentQuestion];
        console.log(`Rendering question ${this.currentQuestion + 1}: ${question.question}`);
        
        let optionsHtml = '';
        
        if (question.type === 'scale') {
            optionsHtml = `
                <div class="scale-options">
                    ${question.scale.map((value, index) => `
                        <div class="scale-option" data-value="${value}">
                            <div style="font-weight: 600; margin-bottom: 4px;">${value}</div>
                            <div style="font-size: 12px;">${question.labels[index]}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'multiple_choice') {
            optionsHtml = `
                <div class="question-options">
                    ${question.options.map(option => `
                        <button class="option-button" data-value="${option}">${option}</button>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'yes_no') {
            optionsHtml = `
                <div class="question-options">
                    <button class="option-button" data-value="yes">Yes</button>
                    <button class="option-button" data-value="no">No</button>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="question active">
                <h3>Question ${this.currentQuestion + 1} of ${this.assessmentQuestions.length}</h3>
                <h3>${question.question}</h3>
                ${optionsHtml}
            </div>
        `;

        // Bind option selection events - FIXED VERSION
        container.querySelectorAll('.scale-option, .option-button').forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove previous selections
                container.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
                // Add selection to clicked option - use currentTarget instead of target
                e.currentTarget.classList.add('selected');
                // Store answer - use currentTarget instead of target
                this.assessmentData[question.id] = e.currentTarget.dataset.value;
                console.log(`Answer stored: ${question.id} = ${e.currentTarget.dataset.value}`);
                // Enable next button
                const nextBtn = document.getElementById('nextQuestion');
                if (nextBtn) nextBtn.disabled = false;
                
                // Enable complete button if it's the last question
                if (this.currentQuestion === this.assessmentQuestions.length - 1) {
                    const completeBtn = document.getElementById('completeAssessment');
                    if (completeBtn) completeBtn.disabled = false;
                }
            });
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const completeBtn = document.getElementById('completeAssessment');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        if (nextBtn) nextBtn.disabled = true;
        if (completeBtn) completeBtn.disabled = true;
        
        if (this.currentQuestion === this.assessmentQuestions.length - 1) {
            if (nextBtn) nextBtn.classList.add('hidden');
            if (completeBtn) completeBtn.classList.remove('hidden');
        } else {
            if (nextBtn) nextBtn.classList.remove('hidden');
            if (completeBtn) completeBtn.classList.add('hidden');
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.assessmentQuestions.length - 1) {
            this.currentQuestion++;
            this.renderCurrentQuestion();
            this.updateAssessmentProgress();
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderCurrentQuestion();
            this.updateAssessmentProgress();
        }
    }

    updateAssessmentProgress() {
        const progress = ((this.currentQuestion + 1) / this.assessmentQuestions.length) * 100;
        const progressBar = document.getElementById('assessmentProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    completeAssessment() {
        console.log('Assessment completed', this.assessmentData);
        // Analyze assessment and generate recommendations
        const recommendation = this.generateRecommendation();
        this.showScreen('dashboardScreen');
        setTimeout(() => this.renderDashboard(recommendation), 100);
    }

    generateRecommendation() {
        // Simple AI recommendation based on assessment
        const anxietyLevel = parseInt(this.assessmentData[1]) || 3;
        const primaryConcerns = this.assessmentData[2] || 'Social Situations';
        const mood = parseInt(this.assessmentData[3]) || 3;
        const trauma = this.assessmentData[4] === 'yes';
        
        let recommendedTherapy = null;
        
        if (trauma) {
            recommendedTherapy = this.therapyScenarios.find(s => s.id === 'ptsd');
        } else if (primaryConcerns.includes('Heights')) {
            recommendedTherapy = this.therapyScenarios.find(s => s.id === 'heights');
        } else if (primaryConcerns.includes('Flying')) {
            recommendedTherapy = this.therapyScenarios.find(s => s.id === 'flying');
        } else if (primaryConcerns.includes('Social')) {
            recommendedTherapy = this.therapyScenarios.find(s => s.id === 'social');
        } else if (mood <= 2) {
            recommendedTherapy = this.therapyScenarios.find(s => s.id === 'mood');
        } else {
            recommendedTherapy = this.therapyScenarios.find(s => s.id === 'social');
        }
        
        return recommendedTherapy;
    }

    renderDashboard(recommendedTherapy = null) {
        console.log('Rendering dashboard...');
        
        // Update user info
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.textContent = `Welcome back, ${this.currentUser.name}`;
        }

        // Render recommended therapy
        if (recommendedTherapy) {
            this.renderRecommendedTherapy(recommendedTherapy);
        } else {
            // Default recommendation for therapist login
            this.renderRecommendedTherapy(this.therapyScenarios[0]);
        }

        // Render all therapy sessions
        this.renderTherapySessions();
        
        // Update progress cards
        this.updateProgressCards();
    }

    renderRecommendedTherapy(therapy) {
        const container = document.getElementById('recommendedSession');
        if (!container) return;
        
        container.innerHTML = `
            <div class="recommendation-content">
                <div class="recommendation-info">
                    <h3>${therapy.name}</h3>
                    <p>${therapy.description}</p>
                    <p><strong>Recommended based on your assessment</strong></p>
                </div>
                <button class="btn btn--primary" onclick="window.mindScapeApp.startTherapySession('${therapy.id}')">
                    Start Session
                </button>
            </div>
        `;
    }

    renderTherapySessions() {
        const container = document.getElementById('sessionsGrid');
        if (!container) return;
        
        container.innerHTML = this.therapyScenarios.map(therapy => `
            <div class="therapy-card" onclick="window.mindScapeApp.startTherapySession('${therapy.id}')">
                <div class="therapy-card-header" style="background: ${therapy.color};">
                    <h3>${therapy.name}</h3>
                    <p>${therapy.description}</p>
                </div>
                <div class="therapy-card-body">
                    <div class="difficulty-levels">
                        ${therapy.difficulty_levels.map(level => `
                            <span class="difficulty-badge">${level}</span>
                        `).join('')}
                    </div>
                    <div class="therapy-meta">
                        <span>Duration: ${therapy.duration}</span>
                        <span>Environments: ${therapy.environments.length}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateProgressCards() {
        // This would normally fetch real data from a backend
        console.log('Updating progress cards...');
    }

    startTherapySession(scenarioId) {
        console.log(`Starting therapy session: ${scenarioId}`);
        this.sessionData = { scenarioId, startTime: new Date() };
        this.showLoadingSpinner();
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingSpinner();
            this.showScreen('vrSessionScreen');
            this.setupVREnvironment(scenarioId);
            this.startBiometricMonitoring();
        }, 2000);
    }

    setupVREnvironment(scenarioId) {
        const defaultEnv = document.getElementById('defaultVrEnvironment');
        const mountainEnv = document.getElementById('mountainVrEnvironment');

        if (scenarioId === 'heights') {
            console.log('Setting up premium mountain VR environment...');
            // Hide default environment and show mountain environment
            if (defaultEnv) defaultEnv.style.display = 'none';
            if (mountainEnv) {
                mountainEnv.classList.remove('hidden');
                this.initializeMountainEnvironment();
            }
        } else {
            console.log('Using default VR environment...');
            // Show default environment and hide mountain environment
            if (defaultEnv) defaultEnv.style.display = 'flex';
            if (mountainEnv) mountainEnv.classList.add('hidden');
        }
    }

    initializeMountainEnvironment() {
        console.log('Initializing premium mountain environment...');
        
        // Reset mountain state
        this.currentHeightLevel = 1;
        this.currentWeather = 'clear';
        this.currentTimeOfDay = 'day';
        this.safetyMode = true;

        // Update UI to reflect initial state
        this.updateHeightLevelUI();
        this.updateWeatherUI();
        this.updateTimeOfDayUI();
        this.updateSafetyModeUI();

        // Add some initial animation effects
        setTimeout(() => {
            this.showMountainWelcomeMessage();
        }, 1000);
    }

    showMountainWelcomeMessage() {
        // Create a temporary welcome message overlay
        const welcomeMessage = document.createElement('div');
        welcomeMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.95);
            padding: 2rem;
            border-radius: var(--radius-xl);
            text-align: center;
            z-index: 300;
            backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
            max-width: 400px;
            animation: fadeInUp 0.5s ease;
        `;
        
        welcomeMessage.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: var(--color-primary);">🏔️ Welcome to Mountain Heights</h3>
            <p style="margin: 0 0 1rem 0; color: var(--color-text);">You're now in a safe, controlled mountain environment.</p>
            <p style="margin: 0 0 1.5rem 0; font-size: 0.9rem; color: var(--color-text-secondary);">Use the controls to adjust your experience and progress through different height levels at your own pace.</p>
            <button class="btn btn--primary" onclick="this.parentElement.remove()" style="padding: 0.5rem 1rem;">
                Begin Journey 🚀
            </button>
        `;

        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (mountainEnv) {
            mountainEnv.appendChild(welcomeMessage);
        }
    }

    changeHeightLevel(level) {
        if (level >= 1 && level <= 5) {
            console.log(`Changing height level to: ${level}`);
            this.currentHeightLevel = level;
            this.updateHeightLevelUI();
            this.updateBiometricsForHeight(level);
            this.playHeightTransitionEffect(level);
        }
    }

    updateHeightLevelUI() {
        document.querySelectorAll('.height-level').forEach((element, index) => {
            const level = index + 1;
            if (level === this.currentHeightLevel) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    playHeightTransitionEffect(level) {
        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (!mountainEnv) return;

        // Add a subtle zoom/scale effect based on height level
        const scaleValue = 1 + (level - 1) * 0.1; // Scale from 1.0 to 1.4
        mountainEnv.style.transform = `scale(${scaleValue})`;
        
        // Adjust the "altitude feeling" with slight perspective changes
        setTimeout(() => {
            mountainEnv.style.transform = 'scale(1)';
        }, 1000);

        // Show altitude message
        this.showAltitudeMessage(level);
    }

    showAltitudeMessage(level) {
        const altitudes = ['1,200m', '1,800m', '2,400m', '3,000m', '3,600m'];
        const names = ['Base Camp', 'Lower Trail', 'Mid Platform', 'High Ridge', 'Summit Peak'];
        
        const message = document.createElement('div');
        message.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(var(--color-primary-rgb, 33, 128, 141), 0.9);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-full);
            font-weight: 500;
            z-index: 250;
            animation: slideDown 0.5s ease;
        `;
        
        message.textContent = `🏔️ ${names[level - 1]} - ${altitudes[level - 1]}`;

        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (mountainEnv) {
            mountainEnv.appendChild(message);
            setTimeout(() => message.remove(), 3000);
        }
    }

    updateBiometricsForHeight(level) {
        // Simulate realistic heart rate increase with height
        const baseHR = this.biometricData.baselineHeartRate;
        const heightStress = (level - 1) * 5; // 0-20 BPM increase
        this.biometricData.baselineHeartRate = baseHR + heightStress;
        
        console.log(`Height level ${level}: Base HR adjusted to ${this.biometricData.baselineHeartRate}`);
    }

    changeWeather(weather) {
        console.log(`Changing weather to: ${weather}`);
        this.currentWeather = weather;
        this.updateWeatherUI();
        this.applyWeatherEffects(weather);
    }

    updateWeatherUI() {
        document.querySelectorAll('[data-weather]').forEach(btn => {
            if (btn.dataset.weather === this.currentWeather) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    applyWeatherEffects(weather) {
        const weatherEffect = document.getElementById('weatherEffect');
        if (!weatherEffect) return;

        // Remove all weather classes
        weatherEffect.className = 'weather-effect';
        
        // Apply new weather effect
        switch (weather) {
            case 'misty':
                weatherEffect.classList.add('weather-mist');
                break;
            case 'snowy':
                weatherEffect.classList.add('weather-snow');
                break;
            case 'cloudy':
                // Just the base effect (no additional class)
                break;
            case 'clear':
            default:
                // Clear weather (no effect)
                break;
        }

        this.showWeatherMessage(weather);
    }

    showWeatherMessage(weather) {
        const weatherMessages = {
            clear: '☀️ Perfect clear sky conditions',
            cloudy: '☁️ Peaceful cloudy atmosphere',
            misty: '🌫️ Gentle mountain mist',
            snowy: '❄️ Beautiful snow falling'
        };

        const message = document.createElement('div');
        message.style.cssText = `
            position: absolute;
            bottom: 120px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-base);
            font-size: 0.9rem;
            z-index: 250;
            animation: fadeInUp 0.5s ease;
        `;
        
        message.textContent = weatherMessages[weather] || weatherMessages.clear;

        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (mountainEnv) {
            mountainEnv.appendChild(message);
            setTimeout(() => message.remove(), 2500);
        }
    }

    changeTimeOfDay(time) {
        console.log(`Changing time of day to: ${time}`);
        this.currentTimeOfDay = time;
        this.updateTimeOfDayUI();
        this.applyTimeOfDayEffects(time);
    }

    updateTimeOfDayUI() {
        document.querySelectorAll('[data-time]').forEach(btn => {
            if (btn.dataset.time === this.currentTimeOfDay) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    applyTimeOfDayEffects(time) {
        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (!mountainEnv) return;

        // Remove all time classes
        mountainEnv.classList.remove('time-sunrise', 'time-sunset', 'time-night');
        
        // Apply new time effect
        switch (time) {
            case 'sunrise':
                mountainEnv.classList.add('time-sunrise');
                break;
            case 'sunset':
                mountainEnv.classList.add('time-sunset');
                break;
            case 'night':
                mountainEnv.classList.add('time-night');
                break;
            case 'day':
            default:
                // Day time (default styling)
                break;
        }
    }

    toggleSafetyMode(enabled) {
        console.log(`Toggling safety mode: ${enabled}`);
        this.safetyMode = enabled;
        this.updateSafetyModeUI();
        
        if (!enabled) {
            // Show safety warning
            this.showSafetyWarning();
        }
    }

    updateSafetyModeUI() {
        document.querySelectorAll('[data-safety]').forEach(btn => {
            const isOn = btn.dataset.safety === 'on';
            if ((isOn && this.safetyMode) || (!isOn && !this.safetyMode)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    showSafetyWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(var(--color-error-rgb, 192, 21, 47), 0.95);
            color: white;
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            text-align: center;
            z-index: 350;
            max-width: 350px;
            animation: pulse 0.5s ease;
        `;
        
        warning.innerHTML = `
            <h4 style="margin: 0 0 1rem 0;">⚠️ Safety Mode Disabled</h4>
            <p style="margin: 0 0 1rem 0; font-size: 0.9rem;">You've disabled safety protocols. Please proceed with caution and use emergency stop if needed.</p>
            <button class="btn btn--sm" onclick="this.parentElement.remove()" style="background: white; color: var(--color-error); padding: 0.4rem 0.8rem;">
                I Understand
            </button>
        `;

        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (mountainEnv) {
            mountainEnv.appendChild(warning);
        }
    }

    // Interactive mountain element methods
    activateCableCar() {
        console.log('Activating cable car ride...');
        
        // Show cable car ride message and potentially change height level
        const message = document.createElement('div');
        message.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.95);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            text-align: center;
            z-index: 300;
            backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
            animation: fadeInUp 0.5s ease;
        `;
        
        message.innerHTML = `
            <h4 style="margin: 0 0 1rem 0; color: var(--color-primary);">🚡 Cable Car Ride</h4>
            <p style="margin: 0 0 1rem 0; color: var(--color-text);">Take a smooth ride to higher elevations</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn--primary" onclick="window.mindScapeApp.changeHeightLevel(${Math.min(5, this.currentHeightLevel + 1)}); this.parentElement.parentElement.remove();">
                    🔺 Go Up
                </button>
                <button class="btn btn--secondary" onclick="this.parentElement.parentElement.remove();">
                    ❌ Cancel
                </button>
            </div>
        `;

        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (mountainEnv) {
            mountainEnv.appendChild(message);
        }
    }

    enterMountainLodge() {
        console.log('Entering mountain lodge...');
        
        // Show lodge interface
        const lodge = document.createElement('div');
        lodge.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.95);
            padding: 2rem;
            border-radius: var(--radius-xl);
            text-align: center;
            z-index: 300;
            backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
            max-width: 400px;
            animation: fadeInUp 0.5s ease;
        `;
        
        lodge.innerHTML = `
            <h4 style="margin: 0 0 1rem 0; color: var(--color-primary);">🏔️ Mountain Lodge</h4>
            <p style="margin: 0 0 1rem 0; color: var(--color-text);">Welcome to the cozy mountain lodge! Take a moment to rest and prepare for your journey.</p>
            <div style="margin: 1rem 0;">
                <p style="font-size: 0.9rem; color: var(--color-text-secondary);">Current altitude: ${['1,200m', '1,800m', '2,400m', '3,000m', '3,600m'][this.currentHeightLevel - 1]}</p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn--primary" onclick="window.mindScapeApp.startBreathingExercise(); this.parentElement.parentElement.remove();">
                    🫁 Rest & Breathe
                </button>
                <button class="btn btn--secondary" onclick="this.parentElement.parentElement.remove();">
                    🚪 Continue
                </button>
            </div>
        `;

        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (mountainEnv) {
            mountainEnv.appendChild(lodge);
        }
    }

    observeWildlife(animal) {
        console.log(`Observing wildlife: ${animal}`);
        
        const wildlifeInfo = {
            eagle: {
                icon: '🦅',
                name: 'Golden Eagle',
                description: 'Watch this majestic golden eagle soar through the mountain peaks. Eagles are symbols of freedom and courage.'
            }
        };

        const info = wildlifeInfo[animal];
        if (!info) return;

        const wildlife = document.createElement('div');
        wildlife.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.95);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            text-align: center;
            z-index: 300;
            backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
            max-width: 350px;
            animation: fadeInUp 0.5s ease;
        `;
        
        wildlife.innerHTML = `
            <h4 style="margin: 0 0 1rem 0; color: var(--color-primary);">${info.icon} ${info.name}</h4>
            <p style="margin: 0 0 1rem 0; color: var(--color-text); font-size: 0.9rem;">${info.description}</p>
            <button class="btn btn--primary" onclick="this.parentElement.remove();">
                🔍 Continue Observing
            </button>
        `;

        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (mountainEnv) {
            mountainEnv.appendChild(wildlife);
            setTimeout(() => wildlife.remove(), 5000);
        }
    }

    startBiometricMonitoring() {
        console.log('Starting biometric monitoring...');
        
        this.biometricInterval = setInterval(() => {
            // Simulate realistic biometric data
            const baseHR = this.biometricData.baselineHeartRate;
            this.biometricData.heartRate = baseHR + Math.floor(Math.random() * 20 - 10);
            
            // Update UI
            const heartRateEl = document.getElementById('heartRate');
            const stressLevelEl = document.getElementById('stressLevel');
            const skinConductanceEl = document.getElementById('skinConductance');
            
            if (heartRateEl) heartRateEl.textContent = `${this.biometricData.heartRate} BPM`;
            if (stressLevelEl) {
                if (this.biometricData.heartRate > baseHR + 10) {
                    stressLevelEl.textContent = 'High';
                    stressLevelEl.parentElement.querySelector('.metric-indicator').className = 'metric-indicator danger';
                } else if (this.biometricData.heartRate > baseHR + 5) {
                    stressLevelEl.textContent = 'Medium';
                    stressLevelEl.parentElement.querySelector('.metric-indicator').className = 'metric-indicator warning';
                } else {
                    stressLevelEl.textContent = 'Low';
                    stressLevelEl.parentElement.querySelector('.metric-indicator').className = 'metric-indicator';
                }
            }
            
            if (skinConductanceEl) {
                const conductance = 3 + Math.random() * 4;
                skinConductanceEl.textContent = `${conductance.toFixed(1)} μS`;
            }
        }, 1000);
    }

    pauseSession() {
        console.log('Pausing session...');
        // Implementation for pausing session
    }

    startBreathingExercise() {
        console.log('Starting breathing exercise...');
        this.showModal('exerciseModal');
    }

    startExercise() {
        console.log('Starting breathing exercise animation...');
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instructions = document.getElementById('breathingInstructions');
        
        let phase = 'inhale';
        let cycles = 0;
        const maxCycles = 5;
        
        this.exerciseTimer = setInterval(() => {
            if (phase === 'inhale') {
                circle.classList.add('inhale');
                circle.classList.remove('exhale');
                text.textContent = 'Breathe In';
                instructions.textContent = 'Inhale slowly for 4 seconds';
                phase = 'hold';
                
                setTimeout(() => {
                    text.textContent = 'Hold';
                    instructions.textContent = 'Hold your breath for 4 seconds';
                }, 4000);
                
                setTimeout(() => {
                    phase = 'exhale';
                }, 8000);
                
            } else {
                circle.classList.add('exhale');
                circle.classList.remove('inhale');
                text.textContent = 'Breathe Out';
                instructions.textContent = 'Exhale slowly for 6 seconds';
                
                setTimeout(() => {
                    phase = 'inhale';
                    cycles++;
                    
                    if (cycles >= maxCycles) {
                        clearInterval(this.exerciseTimer);
                        this.closeExerciseModal();
                        // Show completion message
                        setTimeout(() => {
                            alert('Great job! You have completed the breathing exercise.');
                        }, 500);
                    }
                }, 6000);
            }
        }, 18000); // Full cycle: 4s in + 4s hold + 6s out + 4s pause = 18s
        
        // Start immediately
        circle.classList.add('inhale');
        text.textContent = 'Breathe In';
        instructions.textContent = 'Inhale slowly for 4 seconds';
    }

    endSession() {
        console.log('Ending session...');
        if (this.biometricInterval) {
            clearInterval(this.biometricInterval);
        }
        
        this.showModal('sessionCompleteModal');
    }

    emergencyStop() {
        console.log('Emergency stop activated!');
        if (this.biometricInterval) {
            clearInterval(this.biometricInterval);
        }
        if (this.exerciseTimer) {
            clearInterval(this.exerciseTimer);
        }
        
        this.showScreen('dashboardScreen');
    }

    closeExerciseModal() {
        if (this.exerciseTimer) {
            clearInterval(this.exerciseTimer);
        }
        this.hideModal('exerciseModal');
        
        // Reset breathing exercise elements
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instructions = document.getElementById('breathingInstructions');
        
        if (circle) {
            circle.classList.remove('inhale', 'exhale');
        }
        if (text) text.textContent = 'Breathe';
        if (instructions) instructions.textContent = 'Click "Start" to begin the breathing exercise';
    }

    backToDashboard() {
        this.hideModal('sessionCompleteModal');
        this.showScreen('dashboardScreen');
        
        // Reset VR environment
        const defaultEnv = document.getElementById('defaultVrEnvironment');
        const mountainEnv = document.getElementById('mountainVrEnvironment');
        if (defaultEnv) defaultEnv.style.display = 'flex';
        if (mountainEnv) mountainEnv.classList.add('hidden');
    }

    openSettings() {
        console.log('Opening settings...');
        this.showModal('settingsModal');
    }

    closeSettings() {
        console.log('Closing settings...');
        this.hideModal('settingsModal');
    }

    logout() {
        console.log('Logging out...');
        this.currentUser = null;
        this.assessmentData = {};
        this.sessionData = {};
        
        // Clear any running intervals
        if (this.biometricInterval) {
            clearInterval(this.biometricInterval);
        }
        if (this.exerciseTimer) {
            clearInterval(this.exerciseTimer);
        }
        
        this.showScreen('welcomeScreen');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    initializeCharts() {
        console.log('Initializing charts...');
        // Chart initialization would go here
        // For now, just log that it's ready
    }
}

// Initialize the app when the DOM is ready
let mindScapeApp;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing MindScape app...');
    mindScapeApp = new MindScapeApp();
    mindScapeApp.init();
    
    // Make globally accessible
    window.mindScapeApp = mindScapeApp;
    
    console.log('MindScape app initialized successfully');
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Already handled by DOMContentLoaded
} else {
    // DOM is already ready
    console.log('DOM already ready, initializing app immediately...');
    mindScapeApp = new MindScapeApp();
    mindScapeApp.init();
    window.mindScapeApp = mindScapeApp;
}