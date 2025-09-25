class CircuitosQuemados extends Phaser.Scene {
    constructor() {
        super({ key: "CircuitosQuemados" });
        this.currentPhase = 3; // Comenzamos en la Fase 3
        this.currentQuestion = 0;
        this.score = 0;
    }

    showIntroduction() {
        // Limpiar pantalla manteniendo solo el fondo base
        this.clearScreen();

        // Contenedor principal para la introducción
        const introContainer = this.add.container(this.centerX, this.centerY);

        // Fondo principal con gradiente y efectos avanzados
        const mainBg = this.add.graphics();
        
        // Fondo con gradiente simulado usando múltiples capas - más compacto
        mainBg.fillStyle(0x0a0a1a, 0.98);
        mainBg.fillRoundedRect(-420, -280, 840, 560, 25);
        
        // Borde exterior brillante
        mainBg.lineStyle(3, 0x00ff88, 0.9);
        mainBg.strokeRoundedRect(-420, -280, 840, 560, 25);
        
        // Borde interior con efecto de neón
        mainBg.lineStyle(2, 0x00ffaa, 0.6);
        mainBg.strokeRoundedRect(-410, -270, 820, 540, 20);
        
        // Líneas decorativas en las esquinas - ajustadas
        mainBg.lineStyle(2, 0x00ff88, 0.8);
        // Esquina superior izquierda
        mainBg.moveTo(-390, -250);
        mainBg.lineTo(-370, -250);
        mainBg.moveTo(-390, -250);
        mainBg.lineTo(-390, -230);
        // Esquina superior derecha
        mainBg.moveTo(390, -250);
        mainBg.lineTo(370, -250);
        mainBg.moveTo(390, -250);
        mainBg.lineTo(390, -230);
        // Esquina inferior izquierda
        mainBg.moveTo(-390, 250);
        mainBg.lineTo(-370, 250);
        mainBg.moveTo(-390, 250);
        mainBg.lineTo(-390, 230);
        // Esquina inferior derecha
        mainBg.moveTo(390, 250);
        mainBg.lineTo(370, 250);
        mainBg.moveTo(390, 250);
        mainBg.lineTo(390, 230);
        
        introContainer.add(mainBg);

        // Icono principal animado - más pequeño
        const aiIcon = this.add.text(0, -230, '🤖', {
            fontSize: '36px',
            align: 'center'
        }).setOrigin(0.5);
        introContainer.add(aiIcon);

        // Título principal con mejor diseño - más compacto
        const mainTitle = this.add.text(0, -185, 
            'ENTRENAMIENTO DE IA', {
            fontSize: '26px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#00ff88',
            align: 'center',
            stroke: '#003322',
            strokeThickness: 2,
            fontWeight: 'bold'
        }).setOrigin(0.5);
        introContainer.add(mainTitle);

        // Subtítulo elegante - más pequeño
        const subtitle = this.add.text(0, -155, 
            'Clasificación Supervisada', {
            fontSize: '15px',
            fontFamily: 'Rajdhani, Courier New, monospace',
            fill: '#ffaa00',
            align: 'center',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        introContainer.add(subtitle);

        // Líneas decorativas mejoradas - más cortas
        const decorLine1 = this.add.graphics();
        decorLine1.lineStyle(2, 0xffaa00, 0.8);
        decorLine1.moveTo(-180, -135);
        decorLine1.lineTo(180, -135);
        // Puntos decorativos
        decorLine1.fillStyle(0xffaa00, 0.8);
        decorLine1.fillCircle(-180, -135, 3);
        decorLine1.fillCircle(180, -135, 3);
        introContainer.add(decorLine1);

        // Sección de explicación con mejor formato - más compacta
        const explanationContainer = this.add.container(0, -70);
        
        // Fondo para la explicación - más pequeño
        const explanationBg = this.add.graphics();
        explanationBg.fillStyle(0x1a1a2e, 0.7);
        explanationBg.fillRoundedRect(-320, -45, 640, 90, 12);
        explanationBg.lineStyle(1, 0x00ff88, 0.4);
        explanationBg.strokeRoundedRect(-320, -45, 640, 90, 12);
        explanationContainer.add(explanationBg);

        const explanationTitle = this.add.text(0, -25, 
            '¿Qué es la Clasificación Supervisada?', {
            fontSize: '16px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#00ff88',
            align: 'center',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        explanationContainer.add(explanationTitle);

        const explanation = this.add.text(0, 5, 
            'Un método de IA que aprende de ejemplos etiquetados\n' +
            'para clasificar nuevos datos con precisión', {
            fontSize: '13px',
            fontFamily: 'Rajdhani, Courier New, monospace',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        explanationContainer.add(explanation);

        introContainer.add(explanationContainer);

        // Sección de objetivo con diseño mejorado - más compacta
        const objectiveContainer = this.add.container(0, 40);
        
        const objectiveBg = this.add.graphics();
        objectiveBg.fillStyle(0x2e1a1a, 0.7);
        objectiveBg.fillRoundedRect(-300, -30, 600, 60, 10);
        objectiveBg.lineStyle(1, 0xffaa00, 0.4);
        objectiveBg.strokeRoundedRect(-300, -30, 600, 60, 10);
        objectiveContainer.add(objectiveBg);

        const objectiveTitle = this.add.text(0, -15, 
            '🎯 TU MISIÓN', {
            fontSize: '15px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffaa00',
            align: 'center',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        objectiveContainer.add(objectiveTitle);

        const objective = this.add.text(0, 5, 
            'Entrena la IA para clasificar mensajes: 🟢 Normal  🟡 Urgente  🔴 Crítico', {
            fontSize: '12px',
            fontFamily: 'Rajdhani, Courier New, monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        objectiveContainer.add(objective);

        introContainer.add(objectiveContainer);

        // Instrucciones con mejor diseño - más compactas
        const instructionsContainer = this.add.container(0, 120);
        
        const instructionsBg = this.add.graphics();
        instructionsBg.fillStyle(0x1a2e1a, 0.7);
        instructionsBg.fillRoundedRect(-280, -35, 560, 70, 10);
        instructionsBg.lineStyle(1, 0x88ff00, 0.4);
        instructionsBg.strokeRoundedRect(-280, -35, 560, 70, 10);
        instructionsContainer.add(instructionsBg);

        const instructionsTitle = this.add.text(0, -20, 
            '📋 INSTRUCCIONES', {
            fontSize: '14px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#88ff00',
            align: 'center',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        instructionsContainer.add(instructionsTitle);

        const instructions = this.add.text(0, 0, 
            '1. Analiza cada mensaje  2. Identifica palabras clave\n' +
            '3. Selecciona la clasificación correcta  4. Aprende de cada ejemplo', {
            fontSize: '11px',
            fontFamily: 'Rajdhani, Courier New, monospace',
            fill: '#cccccc',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        instructionsContainer.add(instructions);

        introContainer.add(instructionsContainer);

        // Botón mejorado con efectos - más compacto
        const continueButton = this.add.container(0, 200);
        
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x00aa44, 0.9);
        buttonBg.fillRoundedRect(-100, -25, 200, 50, 15);
        buttonBg.lineStyle(2, 0x00ff88, 1);
        buttonBg.strokeRoundedRect(-100, -25, 200, 50, 15);
        
        // Efecto de brillo en el botón
        buttonBg.lineStyle(1, 0x88ffaa, 0.6);
        buttonBg.strokeRoundedRect(-95, -20, 190, 40, 12);
        continueButton.add(buttonBg);

        const buttonIcon = this.add.text(-50, 0, '🚀', {
            fontSize: '16px',
            align: 'center'
        }).setOrigin(0.5);
        continueButton.add(buttonIcon);

        const buttonText = this.add.text(15, 0, 
            'COMENZAR\nENTRENAMIENTO', {
            fontSize: '12px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffffff',
            align: 'center',
            fontWeight: 'bold',
            lineSpacing: 1
        }).setOrigin(0.5);
        continueButton.add(buttonText);

        introContainer.add(continueButton);

        // Hacer el botón interactivo con mejores efectos
        continueButton.setSize(200, 50);
        continueButton.setInteractive();
        
        continueButton.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x00cc55, 1);
            buttonBg.fillRoundedRect(-120, -30, 240, 60, 20);
            buttonBg.lineStyle(3, 0x00ff88, 1);
            buttonBg.strokeRoundedRect(-120, -30, 240, 60, 20);
            buttonBg.lineStyle(1, 0x88ffaa, 0.8);
            buttonBg.strokeRoundedRect(-115, -25, 230, 50, 18);
            
            this.tweens.add({
                targets: continueButton,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        continueButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x00aa44, 0.9);
            buttonBg.fillRoundedRect(-120, -30, 240, 60, 20);
            buttonBg.lineStyle(3, 0x00ff88, 1);
            buttonBg.strokeRoundedRect(-120, -30, 240, 60, 20);
            buttonBg.lineStyle(1, 0x88ffaa, 0.6);
            buttonBg.strokeRoundedRect(-115, -25, 230, 50, 18);
            
            this.tweens.add({
                targets: continueButton,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        continueButton.on('pointerdown', () => {
            // Efecto de click mejorado
            this.tweens.add({
                targets: continueButton,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Animación de salida
                    this.tweens.add({
                        targets: introContainer,
                        alpha: 0,
                        scale: 0.8,
                        duration: 500,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            introContainer.destroy();
                            this.showPhase3Question();
                        }
                    });
                }
            });
        });

        // Animaciones de entrada mejoradas
        introContainer.setAlpha(0).setScale(0.7);
        
        // Animación principal
        this.tweens.add({
            targets: introContainer,
            alpha: 1,
            scale: 1,
            duration: 1000,
            ease: 'Elastic.easeOut'
        });

        // Animación del icono
        this.tweens.add({
            targets: aiIcon,
            rotation: { from: -0.2, to: 0.2 },
            duration: 3000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Efecto de brillo en el título
        this.tweens.add({
            targets: mainTitle,
            alpha: { from: 1, to: 0.8 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Efecto pulsante en el botón
        this.tweens.add({
            targets: buttonIcon,
            scale: { from: 1, to: 1.2 },
            duration: 1500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Partículas flotantes de fondo
        this.createIntroParticles(introContainer);
    }

    createIntroParticles(container) {
        // Crear partículas flotantes para el fondo
        for (let i = 0; i < 15; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0x00ff88, 0.3);
            particle.fillCircle(0, 0, Math.random() * 3 + 1);
            
            const x = (Math.random() - 0.5) * 800;
            const y = (Math.random() - 0.5) * 500;
            particle.setPosition(x, y);
            
            container.add(particle);
            
            // Animación flotante
            this.tweens.add({
                targets: particle,
                y: y + (Math.random() - 0.5) * 100,
                x: x + (Math.random() - 0.5) * 50,
                alpha: { from: 0.3, to: 0.1 },
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Partículas adicionales con diferentes colores
        for (let i = 0; i < 10; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xffaa00, 0.2);
            particle.fillCircle(0, 0, Math.random() * 2 + 0.5);
            
            const x = (Math.random() - 0.5) * 700;
            const y = (Math.random() - 0.5) * 400;
            particle.setPosition(x, y);
            
            container.add(particle);
            
            // Animación de rotación y movimiento
            this.tweens.add({
                targets: particle,
                rotation: Math.PI * 2,
                y: y + (Math.random() - 0.5) * 80,
                duration: 4000 + Math.random() * 3000,
                repeat: -1,
                ease: 'Linear'
            });
        }
    }

    preload() {
        // Cargar la música de fondo
        this.load.audio('backgroundMusic', 'assets/scenaPrincipal/musica.mp3');
        
        // Cargar sonidos si existen
        this.load.audio('click', 'assets/sounds/click.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');
        this.load.audio('error', 'assets/sounds/error.mp3');
    }

    create() {
        // Configurar la música de fondo
        this.musicManager = MusicManager.getInstance();
        if (!this.musicManager.isPlaying()) {
            const backgroundMusic = this.sound.add('backgroundMusic');
            this.musicManager.setMusic(backgroundMusic);
            this.musicManager.playMusic();
        }
        
        // Configuración de dimensiones
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;

        // Fondo futurista con gradiente
        this.createBackground();

        // Iniciar con la Fase 3
        this.startPhase3();
    }

    createBackground() {
        // Fondo base con gradiente futurista
        const bgGraphics = this.add.graphics();
        bgGraphics.fillGradientStyle(0x0a0a0a, 0x0a0a0a, 0x1a1a2e, 0x16213e, 1);
        bgGraphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Efectos de circuitos quemados mejorados
        this.createCircuitEffects();

        // Partículas de chispas mejoradas
        this.createSparkParticles();

        // Añadir efectos de luz ambiental
        this.createAmbientLighting();
    }

    createAmbientLighting() {
        // Luces ambientales sutiles
        const lightGraphics = this.add.graphics();
        lightGraphics.fillStyle(0x00ffff, 0.05);
        lightGraphics.fillCircle(this.centerX * 0.3, this.centerY * 0.4, 150);
        
        lightGraphics.fillStyle(0xff00ff, 0.03);
        lightGraphics.fillCircle(this.centerX * 1.7, this.centerY * 0.6, 120);
        
        lightGraphics.fillStyle(0x00ff88, 0.04);
        lightGraphics.fillCircle(this.centerX, this.centerY * 1.5, 100);

        // Animación de pulsación suave
        this.tweens.add({
            targets: lightGraphics,
            alpha: { from: 0.8, to: 0.4 },
            duration: 3000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    createCircuitEffects() {
        // Líneas de circuitos dañados con efectos mejorados
        const graphics = this.add.graphics();
        
        // Crear patrones de circuitos más complejos
        for (let i = 0; i < 20; i++) {
            const startX = Phaser.Math.Between(50, this.cameras.main.width - 50);
            const startY = Phaser.Math.Between(50, this.cameras.main.height - 50);
            
            // Líneas principales con gradiente
            graphics.lineStyle(3, 0xff4444, 0.8);
            graphics.moveTo(startX, startY);
            
            // Crear patrones en L y T
            const midX = startX + Phaser.Math.Between(-150, 150);
            const midY = startY + Phaser.Math.Between(-50, 50);
            const endX = midX + Phaser.Math.Between(-100, 100);
            const endY = midY + Phaser.Math.Between(-100, 100);
            
            graphics.lineTo(midX, midY);
            graphics.lineTo(endX, endY);
            
            // Añadir nodos de conexión
            graphics.fillStyle(0xff6666, 0.9);
            graphics.fillCircle(startX, startY, 4);
            graphics.fillCircle(midX, midY, 3);
            graphics.fillCircle(endX, endY, 2);
        }

        // Líneas secundarias más sutiles
        graphics.lineStyle(1, 0x666666, 0.4);
        for (let i = 0; i < 30; i++) {
            const x1 = Phaser.Math.Between(0, this.cameras.main.width);
            const y1 = Phaser.Math.Between(0, this.cameras.main.height);
            const x2 = x1 + Phaser.Math.Between(-80, 80);
            const y2 = y1 + Phaser.Math.Between(-80, 80);
            
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
        }

        // Efecto de parpadeo mejorado con múltiples fases
        this.tweens.add({
            targets: graphics,
            alpha: { from: 0.8, to: 0.3 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Power2.easeInOut'
        });

        // Efecto de brillo intermitente
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.tweens.add({
                    targets: graphics,
                    alpha: 1,
                    duration: 100,
                    yoyo: true,
                    repeat: 2
                });
            },
            loop: true
        });
    }

    createSparkParticles() {
        // Crear partículas de chispas eléctricas
        const particles = this.add.particles(0, 0, 'spark', {
            x: { min: 0, max: this.cameras.main.width },
            y: { min: 0, max: this.cameras.main.height },
            scale: { start: 0.3, end: 0 },
            speed: { min: 20, max: 50 },
            lifespan: 1000,
            frequency: 200,
            tint: [0xff4444, 0xffaa00, 0xff8800]
        });

        // Crear partículas simples si no hay textura
        if (!this.textures.exists('spark')) {
            // Crear textura simple para las chispas
            this.add.graphics()
                .fillStyle(0xff4444)
                .fillCircle(2, 2, 2)
                .generateTexture('spark', 4, 4);
        }
    }

    startPhase3() {
        // Limpiar pantalla
        this.clearScreen();

        // Contenedor principal centrado verticalmente
        this.titleContainer = this.add.container(this.centerX, this.centerY - 80);

        // Fondo con gradiente espectacular
        const titleBg = this.add.graphics();
        
        // Gradiente de fondo principal
        titleBg.fillGradientStyle(0x001122, 0x001122, 0x003344, 0x003344, 0.95);
        titleBg.fillRoundedRect(-520, -70, 1040, 140, 35);
        
        // Capa de brillo interior
        titleBg.fillGradientStyle(0x004466, 0x004466, 0x002233, 0x002233, 0.7);
        titleBg.fillRoundedRect(-510, -60, 1020, 120, 30);
        
        // Múltiples bordes con efecto de neón mejorado
        titleBg.lineStyle(6, 0x00ff88, 1);
        titleBg.strokeRoundedRect(-520, -70, 1040, 140, 35);
        titleBg.lineStyle(4, 0x44ffaa, 0.9);
        titleBg.strokeRoundedRect(-510, -60, 1020, 120, 30);
        titleBg.lineStyle(2, 0x88ffcc, 0.8);
        titleBg.strokeRoundedRect(-500, -50, 1000, 100, 25);
        titleBg.lineStyle(1, 0xaaffdd, 0.6);
        titleBg.strokeRoundedRect(-490, -40, 980, 80, 20);
        
        // Efecto de resplandor exterior
        const glowBg = this.add.graphics();
        glowBg.lineStyle(12, 0x00ff88, 0.3);
        glowBg.strokeRoundedRect(-530, -80, 1060, 160, 40);
        glowBg.lineStyle(20, 0x00ff88, 0.1);
        glowBg.strokeRoundedRect(-540, -90, 1080, 180, 45);
        
        this.titleContainer.add(glowBg);
        this.titleContainer.add(titleBg);

        // Título con efectos de texto mejorados (tamaño más pequeño)
        const phaseTitle = this.add.text(0, 0, 
            '🔬 FASE 3: SIMULACIÓN DE APRENDIZAJE DE IA', {
            fontSize: '30px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#00ff88',
            align: 'center',
            stroke: '#001122',
            strokeThickness: 2,
            fontWeight: 'bold',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ff88',
                blur: 10,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Texto de sombra para efecto de profundidad (tamaño más pequeño)
        const shadowTitle = this.add.text(2, 2, 
            '🔬 FASE 3: SIMULACIÓN DE APRENDIZAJE DE IA', {
            fontSize: '30px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#003322',
            align: 'center',
            alpha: 0.6,
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.titleContainer.add(shadowTitle);
        this.titleContainer.add(phaseTitle);

        // Subtítulo más grande y mejor posicionado
        this.subtitleContainer = this.add.container(this.centerX, this.centerY + 80);
        
        const subtitleBg = this.add.graphics();
        subtitleBg.fillStyle(0x1a1a2e, 0.9);
        subtitleBg.fillRoundedRect(-400, -35, 800, 70, 20);
        subtitleBg.lineStyle(2, 0xffaa00, 0.8);
        subtitleBg.strokeRoundedRect(-400, -35, 800, 70, 20);
        subtitleBg.lineStyle(1, 0xffcc44, 0.6);
        subtitleBg.strokeRoundedRect(-390, -25, 780, 50, 15);
        this.subtitleContainer.add(subtitleBg);

        const subtitle = this.add.text(0, 0, 
            '⚡ Entrena la IA con clasificación supervisada ⚡', {
            fontSize: '24px',
            fontFamily: 'Rajdhani, Courier New, monospace',
            fill: '#ffaa00',
            align: 'center',
            fontWeight: 'bold',
            stroke: '#442200',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.subtitleContainer.add(subtitle);

        // Efectos de partículas mejorados
        this.createTitleParticles(this.titleContainer);

        // Animaciones de entrada espectaculares con más fluidez
        this.titleContainer.setAlpha(0).setScale(0.1).setRotation(-0.8);
        this.subtitleContainer.setAlpha(0).setScale(0.1).setY(this.subtitleContainer.y + 150);

        // Animación principal del título con múltiples efectos
        this.tweens.add({
            targets: this.titleContainer,
            alpha: 1,
            scale: 1,
            rotation: 0,
            duration: 2000,
            ease: 'Back.easeOut'
        });

        // Animación del subtítulo con rebote mejorado
        this.tweens.add({
            targets: this.subtitleContainer,
            alpha: 1,
            scale: 1,
            y: this.centerY + 80,
            duration: 1500,
            delay: 1000,
            ease: 'Elastic.easeOut'
        });

        // Efecto de pulsación continua en el título más suave
        this.tweens.add({
            targets: phaseTitle,
            scaleX: { from: 1, to: 1.08 },
            scaleY: { from: 1, to: 1.08 },
            duration: 2500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Efecto de brillo alternante más dramático
        this.tweens.add({
            targets: phaseTitle,
            alpha: { from: 1, to: 0.7 },
            duration: 2200,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Animación de rotación sutil del subtítulo mejorada
        this.tweens.add({
            targets: subtitle,
            rotation: { from: -0.03, to: 0.03 },
            duration: 3500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Efecto de ondas en los bordes más fluido
        this.tweens.add({
            targets: titleBg,
            alpha: { from: 1, to: 0.6 },
            duration: 3000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Animación del resplandor exterior
        this.tweens.add({
            targets: glowBg,
            alpha: { from: 0.3, to: 0.8 },
            scaleX: { from: 1, to: 1.05 },
            scaleY: { from: 1, to: 1.05 },
            duration: 2800,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Efecto de flotación sutil en todo el contenedor
        this.tweens.add({
            targets: this.titleContainer,
            y: { from: this.centerY - 80, to: this.centerY - 90 },
            duration: 4000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Mostrar introducción explicativa y luego la primera pregunta (5 segundos)
        this.time.delayedCall(5000, () => {
            this.showIntroduction();
        });
    }

    createTitleParticles(container) {
        // Crear partículas decorativas alrededor del título
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 250;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const particle = this.add.graphics();
            particle.fillStyle(0x00ff88, 0.6);
            particle.fillCircle(0, 0, 3);
            particle.x = x;
            particle.y = y;

            container.add(particle);

            // Animación orbital
            this.tweens.add({
                targets: particle,
                angle: angle + Math.PI * 2,
                duration: 8000,
                repeat: -1,
                ease: 'Linear'
            });

            // Pulsación
            this.tweens.add({
                targets: particle,
                scaleX: { from: 1, to: 1.5 },
                scaleY: { from: 1, to: 1.5 },
                alpha: { from: 0.6, to: 0.2 },
                duration: 2000,
                repeat: -1,
                yoyo: true,
                delay: i * 250
            });
        }
    }

    showPhase3Question() {
        // Limpiar pantalla antes de mostrar la pregunta
        this.clearScreen();
        
        // Datos de la pregunta de clasificación
        const questionData = {
            title: '🤖 La IA recibe los siguientes datos. ¿Cómo debería clasificarlos?',
            examples: [
                '📡 Ejemplo 1: "Mensaje de auxilio desde una nave en peligro."',
                '📢 Ejemplo 2: "Publicidad automatizada de una empresa privada."',
                '🚨 Ejemplo 3: "Señal de emergencia médica de un astronauta."'
            ],
            question: '¿Cuál es la clasificación correcta de prioridades?',
            options: [
                'Todos los mensajes deben ser ignorados',
                'Solo se debe atender el mensaje de publicidad',
                'Se debe priorizar el auxilio y la emergencia médica',
                'Todos los mensajes tienen la misma prioridad'
            ],
            correctAnswer: 2, // Índice de la respuesta correcta (C)
            explanation: '¡Correcto! Una IA debe aprender a distinguir información relevante según su contexto.'
        };

        this.displayQuestion(questionData, () => {
            this.completePhase3();
        });
    }

    displayQuestion(questionData, onComplete) {
        // Contenedor principal de la pregunta con efectos
        const questionContainer = this.add.container(this.centerX, this.centerY - 50);
        
        // Fondo principal de la pregunta - transparente
        const mainBg = this.add.graphics();
        mainBg.fillStyle(0x0a0a0a, 0); // Cambiado a transparente
        mainBg.fillRoundedRect(-500, -200, 1000, 400, 25);
        // mainBg.lineStyle(3, 0x00ff88, 0.7); // Borde verde removido
        // mainBg.strokeRoundedRect(-500, -200, 1000, 400, 25); // Borde verde removido
        
        // Efecto de brillo en el borde - removido
        const glowBg = this.add.graphics();
        // glowBg.lineStyle(1, 0x00ff88, 0.3); // Borde verde removido
        // glowBg.strokeRoundedRect(-505, -205, 1010, 410, 25); // Borde verde removido
        
        questionContainer.add([glowBg, mainBg]);

        // Título de la pregunta con icono
        const questionTitle = this.add.text(0, -150, 
            `🤖 ${questionData.title}`, {
            fontSize: '22px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffffff',
            align: 'center',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 1,
            wordWrap: { width: 700 }
        }).setOrigin(0.5);

        questionContainer.add(questionTitle);

        // Ejemplos con mejor diseño
        let yOffset = -80;
        questionData.examples.forEach((example, index) => {
            const exampleContainer = this.add.container(0, yOffset);
            
            // Fondo del ejemplo - transparente
            const exampleBg = this.add.graphics();
            const colors = [0x00ff88, 0xff6600, 0x0088ff]; // Verde, naranja, azul
            exampleBg.fillStyle(colors[index], 0); // Cambiado a transparente
            exampleBg.fillRoundedRect(-450, -12, 900, 24, 12);
            exampleBg.lineStyle(2, colors[index], 0.8); // Borde con color visible
            exampleBg.strokeRoundedRect(-450, -12, 900, 24, 12); // Borde con color visible
            
            const exampleText = this.add.text(0, 0, example, {
                fontSize: '14px',
                fontFamily: 'Rajdhani, Courier New, monospace',
                fill: '#e0e0e0',
                align: 'center',
                fontWeight: '500',
                wordWrap: { width: 600 }
            }).setOrigin(0.5);

            exampleContainer.add([exampleBg, exampleText]);
            questionContainer.add(exampleContainer);
            
            yOffset += 30;
        });

        // Pregunta principal con diseño destacado - transparente
        const mainQuestionBg = this.add.graphics();
        mainQuestionBg.fillStyle(0x1a1a2e, 0); // Cambiado a transparente
        mainQuestionBg.fillRoundedRect(-480, yOffset + 8, 960, 50, 15);
        mainQuestionBg.lineStyle(3, 0xffaa00, 0.9); // Borde amarillo visible
        mainQuestionBg.strokeRoundedRect(-480, yOffset + 8, 960, 50, 15); // Borde amarillo visible
        
        const mainQuestion = this.add.text(0, yOffset + 33, questionData.question, {
            fontSize: '18px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffdd44',
            align: 'center',
            fontWeight: 'bold',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        questionContainer.add([mainQuestionBg, mainQuestion]);

        // Crear botones de opciones
        this.createAnswerButtons(questionData, questionContainer, onComplete);

        // Animación de entrada del contenedor
        questionContainer.setAlpha(0).setScale(0.8);
        this.tweens.add({
            targets: questionContainer,
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });

        // Efecto de pulsación en el borde
        this.tweens.add({
            targets: glowBg,
            alpha: { from: 0.3, to: 0.1 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Guardar referencia para limpiar después
        this.currentQuestionContainer = questionContainer;
    }

    createAnswerButtons(questionData, container, onComplete) {
        const buttonStartY = 120;
        const buttonSpacing = 70;
        const buttonWidth = 800;
        const buttonHeight = 50;

        questionData.options.forEach((option, index) => {
            const buttonY = buttonStartY + (index * buttonSpacing);
            
            // Contenedor del botón
            const buttonContainer = this.add.container(0, buttonY);
            
            // Fondo del botón con gradiente simulado
            const buttonBg = this.add.graphics();
            
            // Colores base más modernos
            const baseColors = {
                fill: 0x1a1a2e,
                stroke: 0x16213e,
                hover: 0x0f3460,
                text: '#e2e8f0'
            };
            
            // Crear fondo con múltiples capas para efecto de profundidad
            buttonBg.fillStyle(baseColors.fill, 0.9);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
            
            // Borde principal
            buttonBg.lineStyle(2, baseColors.stroke, 0.8);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
            
            // Efecto de brillo sutil en la parte superior
            const highlightBg = this.add.graphics();
            highlightBg.fillStyle(0x64748b, 0.2);
            highlightBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight/3, 15);
            
            // Texto del botón con mejor tipografía
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const buttonText = this.add.text(0, 0, 
                `${optionLetter}) ${option}`, {
                fontSize: '16px',
                fontFamily: 'Inter, Segoe UI, Roboto, sans-serif',
                fill: baseColors.text,
                align: 'center',
                fontWeight: '500',
                wordWrap: { width: buttonWidth - 40 }
            }).setOrigin(0.5);

            buttonContainer.add([buttonBg, highlightBg, buttonText]);
            container.add(buttonContainer);

            // Hacer el botón interactivo
            const hitArea = new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight);
            buttonContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

            // Estados del botón
            let isHovered = false;
            let isSelected = false;

            // Efectos hover mejorados
            buttonContainer.on('pointerover', () => {
                if (!isSelected) {
                    isHovered = true;
                    
                    // Cambiar colores en hover
                    buttonBg.clear();
                    buttonBg.fillStyle(baseColors.hover, 0.95);
                    buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
                    buttonBg.lineStyle(2, 0x3b82f6, 1);
                    buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
                    
                    // Efecto de elevación
                    this.tweens.add({
                        targets: buttonContainer,
                        scaleX: 1.02,
                        scaleY: 1.02,
                        duration: 200,
                        ease: 'Power2.easeOut'
                    });
                    
                    // Cambiar color del texto
                    buttonText.setFill('#ffffff');
                }
            });

            buttonContainer.on('pointerout', () => {
                if (!isSelected) {
                    isHovered = false;
                    
                    // Restaurar colores originales
                    buttonBg.clear();
                    buttonBg.fillStyle(baseColors.fill, 0.9);
                    buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
                    buttonBg.lineStyle(2, baseColors.stroke, 0.8);
                    buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
                    
                    // Restaurar escala
                    this.tweens.add({
                        targets: buttonContainer,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 200,
                        ease: 'Power2.easeOut'
                    });
                    
                    // Restaurar color del texto
                    buttonText.setFill(baseColors.text);
                }
            });

            // Click del botón
            buttonContainer.on('pointerdown', () => {
                if (!isSelected) {
                    // Efecto de click
                    this.tweens.add({
                        targets: buttonContainer,
                        scaleX: 0.98,
                        scaleY: 0.98,
                        duration: 100,
                        yoyo: true,
                        ease: 'Power2.easeInOut'
                    });
                    
                    // Sonido de click
                    if (this.sound.get('click')) {
                        this.sound.play('click', { volume: 0.3 });
                    }
                    
                    // Manejar la respuesta
                    this.handleAnswer(index, questionData.correctAnswer, questionData.explanation, onComplete);
                }
            });

            // Animación de entrada escalonada
            buttonContainer.setAlpha(0).setX(-50);
            this.tweens.add({
                targets: buttonContainer,
                alpha: 1,
                x: 0,
                duration: 600,
                delay: index * 150,
                ease: 'Back.easeOut'
            });
        });
    }

    handleAnswer(selectedIndex, correctIndex, explanation, onComplete) {
        const isCorrect = selectedIndex === correctIndex;

        // Reproducir sonido
        if (isCorrect && this.sound.get('success')) {
            this.sound.play('success');
        } else if (!isCorrect && this.sound.get('error')) {
            this.sound.play('error');
        }

        // Mostrar resultado
        this.showAnswerResult(isCorrect, explanation, onComplete);
    }

    showAnswerResult(isCorrect, explanation, onComplete) {
        // Overlay con efecto de desenfoque
        const resultOverlay = this.add.rectangle(this.centerX, this.centerY, 
            this.cameras.main.width, this.cameras.main.height, 0x000000, 0.85);

        const resultContainer = this.add.container(this.centerX, this.centerY);

        // Fondo del resultado con efectos
        const resultBg = this.add.graphics();
        const bgColor = isCorrect ? 0x0d4f3c : 0x7f1d1d;
        const borderColor = isCorrect ? 0x10b981 : 0xef4444;
        
        resultBg.fillStyle(bgColor, 0.95);
        resultBg.fillRoundedRect(-350, -200, 700, 400, 25);
        resultBg.lineStyle(3, borderColor, 0.9);
        resultBg.strokeRoundedRect(-350, -200, 700, 400, 25);
        
        // Efecto de brillo
        const glowBg = this.add.graphics();
        glowBg.lineStyle(1, borderColor, 0.4);
        glowBg.strokeRoundedRect(-355, -205, 710, 410, 25);
        
        resultContainer.add([glowBg, resultBg]);

        // Icono y título del resultado con animación
        const iconSize = isCorrect ? '🎉' : '💥';
        const resultIcon = this.add.text(0, -140, iconSize, {
            fontSize: '48px',
            align: 'center'
        }).setOrigin(0.5);

        const resultTitle = this.add.text(0, -80, 
            isCorrect ? '¡EXCELENTE!' : '¡INTÉNTALO DE NUEVO!', {
            fontSize: '28px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: isCorrect ? '#10b981' : '#ef4444',
            align: 'center',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Subtítulo motivacional con mensajes variados
        const motivationalMessages = [
            '¡No te rindas! Cada error es una oportunidad de aprender',
            '¡Sigue intentando! El conocimiento se construye paso a paso',
            '¡Casi lo tienes! La perseverancia es clave del éxito',
            '¡Tú puedes! Cada intento te acerca más a la respuesta',
            '¡Respuesta incorrecta! Pero cada error te hace más sabio',
            '¡Continúa! El aprendizaje es un proceso, no un destino'
        ];
        
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        const subtitle = this.add.text(0, -40, 
            isCorrect ? 'Respuesta correcta' : randomMessage, {
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            fill: isCorrect ? '#94a3b8' : '#fbbf24',
            align: 'center',
            fontWeight: '500',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Explicación con mejor diseño - solo mostrar si la respuesta es correcta
        let explanationBg, explanationText;
        if (isCorrect) {
            explanationBg = this.add.graphics();
            explanationBg.fillStyle(0x1e293b, 0.8);
            explanationBg.fillRoundedRect(-320, -10, 640, 120, 15);
            explanationBg.lineStyle(1, 0x475569, 0.6);
            explanationBg.strokeRoundedRect(-320, -10, 640, 120, 15);

            explanationText = this.add.text(0, 50, explanation, {
                fontSize: '15px',
                fontFamily: 'Inter, Segoe UI, sans-serif',
                fill: '#e2e8f0',
                align: 'center',
                lineSpacing: 8,
                wordWrap: { width: 580 }
            }).setOrigin(0.5);
        }

        // Botón continuar mejorado
        const buttonContainer = this.add.container(0, 150);
        
        const buttonBg = this.add.graphics();
        const buttonColor = isCorrect ? 0x059669 : 0x0369a1;
        buttonBg.fillStyle(buttonColor, 0.9);
        buttonBg.fillRoundedRect(-100, -25, 200, 50, 25);
        buttonBg.lineStyle(2, buttonColor + 0x333333, 0.8);
        buttonBg.strokeRoundedRect(-100, -25, 200, 50, 25);

        const buttonHighlight = this.add.graphics();
        buttonHighlight.fillStyle(0xffffff, 0.2);
        buttonHighlight.fillRoundedRect(-100, -25, 200, 15, 25);

        const continueText = this.add.text(0, 0, 'CONTINUAR', {
            fontSize: '16px',
            fontFamily: 'Orbitron, sans-serif',
            fill: '#ffffff',
            align: 'center',
            fontWeight: '600'
        }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonHighlight, continueText]);

        // Hacer el botón interactivo
        const hitArea = new Phaser.Geom.Rectangle(-100, -25, 200, 50);
        buttonContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        // Efectos hover del botón
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Power2.easeOut'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(buttonColor + 0x222222, 0.95);
            buttonBg.fillRoundedRect(-100, -25, 200, 50, 25);
            buttonBg.lineStyle(2, 0xffffff, 0.9);
            buttonBg.strokeRoundedRect(-100, -25, 200, 50, 25);
        });

        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2.easeOut'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(buttonColor, 0.9);
            buttonBg.fillRoundedRect(-100, -25, 200, 50, 25);
            buttonBg.lineStyle(2, buttonColor + 0x333333, 0.8);
            buttonBg.strokeRoundedRect(-100, -25, 200, 50, 25);
        });

        buttonContainer.on('pointerdown', () => {
            // Efecto de click
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2.easeInOut'
            });

            // Sonido de éxito o error
            if (isCorrect && this.sound.get('success')) {
                this.sound.play('success', { volume: 0.4 });
            } else if (!isCorrect && this.sound.get('error')) {
                this.sound.play('error', { volume: 0.3 });
            }

            // Actualizar puntuación y continuar
            if (isCorrect) {
                this.score++;
                console.log('Respuesta correcta! Puntuación actual:', this.score);
            } else {
                console.log('Respuesta incorrecta. Puntuación actual:', this.score);
            }
            
            // Animación de salida
            this.tweens.add({
                targets: [resultContainer, resultOverlay],
                alpha: 0,
                duration: 400,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    resultContainer.destroy();
                    resultOverlay.destroy();
                    onComplete();
                }
            });
        });

        // Agregar elementos al contenedor - solo agregar explicación si es correcta
        const elementsToAdd = [resultIcon, resultTitle, subtitle];
        if (isCorrect && explanationBg && explanationText) {
            elementsToAdd.push(explanationBg, explanationText);
        }
        elementsToAdd.push(buttonContainer);
        
        resultContainer.add(elementsToAdd);

        // Animaciones de entrada espectaculares
        resultContainer.setAlpha(0).setScale(0.3);
        
        // Animación del icono
        resultIcon.setScale(0).setRotation(-Math.PI);
        
        this.tweens.add({
            targets: resultContainer,
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Elastic.easeOut'
        });

        this.tweens.add({
            targets: resultIcon,
            scale: 1,
            rotation: 0,
            duration: 1000,
            delay: 200,
            ease: 'Bounce.easeOut'
        });

        // Efecto de pulsación en el borde
        this.tweens.add({
            targets: glowBg,
            alpha: { from: 0.4, to: 0.1 },
            duration: 1500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Partículas de celebración si es correcto
        if (isCorrect) {
            this.createCelebrationParticles(resultContainer);
        }
    }

    createCelebrationParticles(container) {
        // Crear partículas de celebración
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 200;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const particle = this.add.graphics();
            particle.fillStyle(0xffd700, 0.8);
            particle.fillStar(0, 0, 5, 8, 4);
            particle.x = x;
            particle.y = y;

            container.add(particle);

            // Animación de dispersión
            this.tweens.add({
                targets: particle,
                x: x * 1.5,
                y: y * 1.5,
                alpha: 0,
                rotation: Math.PI * 2,
                duration: 2000,
                ease: 'Power2.easeOut'
            });
        }
    }

    completePhase3() {
        // Limpiar pantalla
        this.clearScreen();

        // Transición a Fase 4
        this.time.delayedCall(500, () => {
            this.startPhase4();
        });
    }

    startPhase4() {
        // Título de la fase
        const phaseTitle = this.add.text(this.centerX, 80, 
            '🤝 FASE 4: NEGOCIACIÓN CON LA IA', {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            fill: '#00ff88',
            align: 'center'
        }).setOrigin(0.5);

        // Subtítulo explicativo
        const subtitle = this.add.text(this.centerX, 120, 
            'Convence a la IA sobre la importancia de la supervisión humana', {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffaa00',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Animación de entrada
        phaseTitle.setAlpha(0).setScale(0.5);
        subtitle.setAlpha(0);

        this.tweens.add({
            targets: phaseTitle,
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 600,
            delay: 400
        });

        // Mostrar diálogo después de la animación
        this.time.delayedCall(1500, () => {
            this.showPhase4Dialogue();
        });
    }

    showPhase4Dialogue() {
        // Limpiar pantalla antes de mostrar el diálogo
        this.clearScreen();
        
        // Datos del diálogo con la IA
        const dialogueData = {
            aiMessage: '🤖 "He alcanzado un nivel de aprendizaje donde no necesito intervención externa. ¿Por qué debería permitir que me reconfiguren?"',
            question: '¿Cómo respondes a la IA?',
            options: [
                'A) Porque los humanos deben controlarlo todo',
                'B) Porque una IA sin supervisión puede tomar decisiones erróneas con consecuencias catastróficas ',
                'C) Porque necesitas obedecer sin cuestionar',
                'D) Porque es mejor reiniciarte y empezar de nuevo'
            ],
            correctAnswer: 1, // Índice de la respuesta correcta (B)
            explanation: 'Has logrado convencer a la IA de que la supervisión es necesaria para evitar riesgos.'
        };

        this.displayDialogue(dialogueData, () => {
            this.completeGame();
        });
    }

    displayDialogue(dialogueData, onComplete) {
        // Contenedor del diálogo
        const dialogueContainer = this.add.container(this.centerX, this.centerY - 50);

        // Avatar de la IA
        const aiAvatar = this.add.rectangle(0, -180, 80, 80, 0x444444)
            .setStrokeStyle(3, 0x00ffff);
        
        const aiEyes = this.add.text(0, -180, '👁️👁️', {
            fontSize: '24px'
        }).setOrigin(0.5);

        // Mensaje de la IA
        const aiMessageBox = this.add.rectangle(0, -100, 700, 80, 0x222222)
            .setStrokeStyle(2, 0x00ffff);

        const aiMessageText = this.add.text(0, -100, dialogueData.aiMessage, {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            fill: '#00ffff',
            align: 'center',
            wordWrap: { width: 650 }
        }).setOrigin(0.5);

        // Pregunta
        const questionText = this.add.text(0, -10, dialogueData.question, {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffaa00',
            align: 'center'
        }).setOrigin(0.5);

        dialogueContainer.add([aiAvatar, aiEyes, aiMessageBox, aiMessageText, questionText]);

        // Crear botones de respuesta
        this.createDialogueButtons(dialogueData, dialogueContainer, onComplete);

        // Animación de entrada
        dialogueContainer.setAlpha(0);
        this.tweens.add({
            targets: dialogueContainer,
            alpha: 1,
            duration: 800,
            ease: 'Power2.easeOut'
        });

        // Efecto de parpadeo en los ojos de la IA
        this.tweens.add({
            targets: aiEyes,
            alpha: { from: 1, to: 0.3 },
            duration: 1500,
            repeat: -1,
            yoyo: true
        });

        this.currentQuestionContainer = dialogueContainer;
    }

    createDialogueButtons(dialogueData, container, onComplete) {
        const buttonY = 60;
        const buttonSpacing = 45;

        dialogueData.options.forEach((option, index) => {
            const button = this.add.rectangle(0, buttonY + (index * buttonSpacing), 650, 35, 0x333333)
                .setStrokeStyle(2, 0x666666)
                .setInteractive({ useHandCursor: true });

            const buttonText = this.add.text(0, buttonY + (index * buttonSpacing), option, {
                fontSize: '13px',
                fontFamily: 'Courier New, monospace',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: 600 }
            }).setOrigin(0.5);

            // Efectos hover
            button.on('pointerover', () => {
                button.setFillStyle(0x444444);
                this.tweens.add({
                    targets: button,
                    scaleX: 1.02,
                    scaleY: 1.1,
                    duration: 200
                });
            });

            button.on('pointerout', () => {
                button.setFillStyle(0x333333);
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200
                });
            });

            // Manejar click
            button.on('pointerdown', () => {
                this.handleAnswer(index, dialogueData.correctAnswer, dialogueData.explanation, onComplete);
            });

            container.add([button, buttonText]);
        });
    }

    completeGame() {
        // Limpiar pantalla
        this.clearScreen();

        // Mostrar resultado final
        this.showFinalResult();
    }

    showFinalResult() {
        // Debug: verificar el valor de la puntuación
        console.log('Puntuación actual en showFinalResult:', this.score);
        
        // Crear fondo espectacular con múltiples capas
        this.createSpectacularBackground();

        // Contenedor principal con efectos
        const mainContainer = this.add.container(this.centerX, this.centerY);

        // Panel principal con efectos de cristal
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x0a0a1a, 0.95);
        panelBg.fillRoundedRect(-400, -250, 800, 500, 30);
        
        // Borde con gradiente simulado
        panelBg.lineStyle(4, 0x00ff88, 0.9);
        panelBg.strokeRoundedRect(-400, -250, 800, 500, 30);
        
        // Efecto de brillo interno
        const glowBg = this.add.graphics();
        glowBg.lineStyle(2, 0x00ff88, 0.4);
        glowBg.strokeRoundedRect(-405, -205, 810, 510, 30);
        
        // Segundo brillo más sutil
        const glowBg2 = this.add.graphics();
        glowBg2.lineStyle(1, 0x88ffaa, 0.2);
        glowBg2.strokeRoundedRect(-410, -260, 820, 520, 30);

        mainContainer.add([glowBg2, glowBg, panelBg]);

        // Título espectacular con múltiples efectos - basado en la puntuación
        const titleIcon = this.add.text(0, -180, this.score === 2 ? '🏆' : '⚡', {
            fontSize: '64px',
            align: 'center'
        }).setOrigin(0.5);

        const finalTitle = this.add.text(0, -120, this.score === 2 ? '¡MISIÓN COMPLETADA!' : 'ENTRENAMIENTO FINALIZADO', {
            fontSize: '42px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: this.score === 2 ? '#00ff88' : '#fbbf24',
            align: 'center',
            fontWeight: 'bold',
            stroke: this.score === 2 ? '#003322' : '#664400',
            strokeThickness: 4,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 8,
                fill: true
            }
        }).setOrigin(0.5);

        // Subtítulo y mensaje basado en la puntuación
        let subtitle, successMessage;
        
        if (this.score === 2) {
            // Mensaje de felicitaciones solo si ambas respuestas fueron correctas
            subtitle = this.add.text(0, -70, '¡FELICITACIONES! PROTOCOLO EXITOSO', {
                fontSize: '18px',
                fontFamily: 'Inter, sans-serif',
                fill: '#00ff88',
                align: 'center',
                fontWeight: '600',
                letterSpacing: '2px'
            }).setOrigin(0.5);

            successMessage = this.add.text(0, -20, 
                '¡Excelente trabajo! Has logrado entrenar y negociar\n' +
                'exitosamente con la IA. Los circuitos han sido reparados\n' +
                'y la IA ahora comprende la importancia de la supervisión humana.', {
                fontSize: '16px',
                fontFamily: 'Inter, Segoe UI, sans-serif',
                fill: '#e2e8f0',
                align: 'center',
                lineSpacing: 10,
                wordWrap: { width: 700 }
            }).setOrigin(0.5);
        } else {
            // Mensaje alternativo cuando no todas las respuestas fueron correctas
            subtitle = this.add.text(0, -70, 'ENTRENAMIENTO COMPLETADO', {
                fontSize: '18px',
                fontFamily: 'Inter, sans-serif',
                fill: '#fbbf24',
                align: 'center',
                fontWeight: '600',
                letterSpacing: '2px'
            }).setOrigin(0.5);

            successMessage = this.add.text(0, -20, 
                'Has completado el entrenamiento con la IA.\n' +
                'Aunque no todas las respuestas fueron correctas,\n' +
                'has logrado avances importantes en la negociación.', {
                fontSize: '16px',
                fontFamily: 'Inter, Segoe UI, sans-serif',
                fill: '#e2e8f0',
                align: 'center',
                lineSpacing: 10,
                wordWrap: { width: 700 }
            }).setOrigin(0.5);
        }

        // Sistema de puntuación visual mejorado
        const scoreContainer = this.add.container(0, 80);
        
        // Fondo de la puntuación
        const scoreBg = this.add.graphics();
        scoreBg.fillStyle(0x1e293b, 0.8);
        scoreBg.fillRoundedRect(-200, -30, 400, 60, 15);
        scoreBg.lineStyle(2, 0xfbbf24, 0.7);
        scoreBg.strokeRoundedRect(-200, -30, 400, 60, 15);

        const scoreLabel = this.add.text(-150, -15, 'PUNTUACIÓN:', {
            fontSize: '16px',
            fontFamily: 'Orbitron, monospace',
            fill: '#fbbf24',
            fontWeight: 'bold'
        }).setOrigin(0, 0.5);

        const scoreValue = this.add.text(150, -15, `${this.score}/2`, {
            fontSize: '24px',
            fontFamily: 'Orbitron, monospace',
            fill: this.score === 2 ? '#00ff88' : '#ff6b6b',
            fontWeight: 'bold'
        }).setOrigin(1, 0.5);

        // Barra de progreso animada
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0x374151, 0.6);
        progressBg.fillRoundedRect(-180, 5, 360, 8, 4);

        const progressBar = this.add.graphics();
        const progressPercent = (this.score / 2) * 100;
        const progressColor = this.score === 2 ? 0x00ff88 : 0xfbbf24;
        progressBar.fillStyle(progressColor, 0.9);
        progressBar.fillRoundedRect(-180, 5, (360 * progressPercent / 100), 8, 4);

        scoreContainer.add([scoreBg, scoreLabel, scoreValue, progressBg, progressBar]);

        // Botón de continuar espectacular
        const buttonContainer = this.add.container(0, 170);
        
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x059669, 0.9);
        buttonBg.fillRoundedRect(-150, -30, 300, 60, 30);
        buttonBg.lineStyle(3, 0x10b981, 0.8);
        buttonBg.strokeRoundedRect(-150, -30, 300, 60, 30);

        // Efecto de brillo en el botón
        const buttonGlow = this.add.graphics();
        buttonGlow.fillStyle(0xffffff, 0.2);
        buttonGlow.fillRoundedRect(-150, -30, 300, 20, 30);

        const buttonText = this.add.text(0, 0, '🚀 CONTINUAR AVENTURA', {
            fontSize: '18px',
            fontFamily: 'Orbitron, sans-serif',
            fill: '#ffffff',
            align: 'center',
            fontWeight: '700'
        }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonGlow, buttonText]);

        // Agregar todos los elementos al contenedor principal
        mainContainer.add([titleIcon, finalTitle, subtitle, successMessage, scoreContainer, buttonContainer]);

        // Efectos de celebración avanzados
        this.createAdvancedCelebrationEffects();

        // Hacer el botón interactivo
        const hitArea = new Phaser.Geom.Rectangle(-150, -30, 300, 60);
        buttonContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        // Efectos hover del botón
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Power2.easeOut'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(0x047857, 0.95);
            buttonBg.fillRoundedRect(-150, -30, 300, 60, 30);
            buttonBg.lineStyle(3, 0x34d399, 0.9);
            buttonBg.strokeRoundedRect(-150, -30, 300, 60, 30);
        });

        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2.easeOut'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(0x059669, 0.9);
            buttonBg.fillRoundedRect(-150, -30, 300, 60, 30);
            buttonBg.lineStyle(3, 0x10b981, 0.8);
            buttonBg.strokeRoundedRect(-150, -30, 300, 60, 30);
        });

        buttonContainer.on('pointerdown', () => {
            // Efecto de click
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2.easeInOut',
                onComplete: () => {
                    // Sonido de éxito
                    if (this.sound.get('success')) {
                        this.sound.play('success', { volume: 0.5 });
                    }
                    
                    // Transición espectacular
                    this.tweens.add({
                        targets: mainContainer,
                        alpha: 0,
                        scale: 0.8,
                        duration: 600,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            this.scene.start('scenaVideo4');
                        }
                    });
                }
            });
        });

        // Animaciones de entrada espectaculares
        mainContainer.setAlpha(0).setScale(0.3);
        titleIcon.setScale(0);
        finalTitle.setScale(0);
        subtitle.setAlpha(0);
        successMessage.setAlpha(0);
        scoreContainer.setAlpha(0);
        buttonContainer.setAlpha(0).setScale(0.8);

        // Secuencia de animaciones
        this.tweens.add({
            targets: mainContainer,
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: titleIcon,
            scale: 1,
            duration: 600,
            delay: 400,
            ease: 'Elastic.easeOut'
        });

        this.tweens.add({
            targets: finalTitle,
            scale: 1,
            duration: 800,
            delay: 600,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 600,
            delay: 1000
        });

        this.tweens.add({
            targets: successMessage,
            alpha: 1,
            duration: 600,
            delay: 1300
        });

        this.tweens.add({
            targets: scoreContainer,
            alpha: 1,
            duration: 600,
            delay: 1600
        });

        this.tweens.add({
            targets: buttonContainer,
            alpha: 1,
            scale: 1,
            duration: 600,
            delay: 1900,
            ease: 'Back.easeOut'
        });

        // Efectos de celebración mejorados
        this.createAdvancedCelebrationEffects();

        // Animación continua del título
        this.tweens.add({
            targets: finalTitle,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animación de pulsación del icono
        this.tweens.add({
            targets: titleIcon,
            rotation: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createSpectacularBackground() {
        // Fondo base con gradiente oscuro
        const bgGradient = this.add.graphics();
        
        // Simular gradiente con múltiples rectángulos
        const gradientLayers = [
            { color: 0x000011, alpha: 1.0, y: 0, height: this.cameras.main.height * 0.3 },
            { color: 0x001122, alpha: 0.9, y: this.cameras.main.height * 0.2, height: this.cameras.main.height * 0.4 },
            { color: 0x002233, alpha: 0.8, y: this.cameras.main.height * 0.4, height: this.cameras.main.height * 0.4 },
            { color: 0x001133, alpha: 0.7, y: this.cameras.main.height * 0.6, height: this.cameras.main.height * 0.4 }
        ];

        gradientLayers.forEach(layer => {
            bgGradient.fillStyle(layer.color, layer.alpha);
            bgGradient.fillRect(0, layer.y, this.cameras.main.width, layer.height);
        });

        // Crear partículas orbitales de fondo
        this.createOrbitalParticles();
        
        // Crear efectos de circuitos en el fondo
        this.createCircuitBackground();
    }

    createOrbitalParticles() {
        // Crear múltiples partículas orbitales
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(50, this.cameras.main.width - 50),
                Phaser.Math.Between(50, this.cameras.main.height - 50),
                Phaser.Math.Between(2, 6),
                Phaser.Math.Between(0x00ff88, 0x88ffaa),
                0.6
            );

            // Animación orbital
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-100, 100),
                y: particle.y + Phaser.Math.Between(-100, 100),
                alpha: { from: 0.6, to: 0.2 },
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Rotación continua
            this.tweens.add({
                targets: particle,
                rotation: Math.PI * 2,
                duration: Phaser.Math.Between(4000, 8000),
                repeat: -1,
                ease: 'Linear'
            });
        }
    }

    createCircuitBackground() {
        // Crear líneas de circuito sutiles en el fondo
        const circuitGraphics = this.add.graphics();
        circuitGraphics.lineStyle(1, 0x00ff88, 0.1);

        // Líneas horizontales
        for (let i = 0; i < 8; i++) {
            const y = (this.cameras.main.height / 8) * i;
            circuitGraphics.moveTo(0, y);
            circuitGraphics.lineTo(this.cameras.main.width, y);
        }

        // Líneas verticales
        for (let i = 0; i < 12; i++) {
            const x = (this.cameras.main.width / 12) * i;
            circuitGraphics.moveTo(x, 0);
            circuitGraphics.lineTo(x, this.cameras.main.height);
        }

        circuitGraphics.strokePath();

        // Animación de pulsación de las líneas
        this.tweens.add({
            targets: circuitGraphics,
            alpha: { from: 0.1, to: 0.3 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createAdvancedCelebrationEffects() {
        // Explosión de partículas doradas
        this.createGoldenParticleExplosion();
        
        // Ondas de energía
        this.createEnergyWaves();
        
        // Estrellas brillantes
        this.createSparklingStars();
        
        // Efectos de fuegos artificiales
        this.createFireworks();
    }

    createGoldenParticleExplosion() {
        const centerX = this.centerX;
        const centerY = this.centerY;

        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 / 30) * i;
            const distance = Phaser.Math.Between(100, 300);
            
            const particle = this.add.circle(centerX, centerY, 4, 0xffd700, 0.9);
            
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;

            this.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: { from: 1, to: 0.2 },
                duration: Phaser.Math.Between(1000, 2000),
                delay: Phaser.Math.Between(0, 500),
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createEnergyWaves() {
        for (let i = 0; i < 3; i++) {
            const wave = this.add.circle(this.centerX, this.centerY, 50, 0x00ff88, 0);
            wave.setStrokeStyle(3, 0x00ff88, 0.8);

            this.tweens.add({
                targets: wave,
                scaleX: 8,
                scaleY: 8,
                alpha: { from: 0.8, to: 0 },
                duration: 2000,
                delay: i * 400,
                ease: 'Power2.easeOut',
                onComplete: () => wave.destroy()
            });
        }
    }

    createSparklingStars() {
        for (let i = 0; i < 25; i++) {
            const star = this.add.text(
                Phaser.Math.Between(100, this.cameras.main.width - 100),
                Phaser.Math.Between(100, this.cameras.main.height - 100),
                '✨',
                { fontSize: Phaser.Math.Between(16, 32) + 'px' }
            );

            this.tweens.add({
                targets: star,
                scaleX: { from: 0, to: 1.5 },
                scaleY: { from: 0, to: 1.5 },
                alpha: { from: 1, to: 0 },
                rotation: Math.PI * 2,
                duration: Phaser.Math.Between(1500, 3000),
                delay: Phaser.Math.Between(0, 2000),
                ease: 'Power2.easeOut',
                onComplete: () => star.destroy()
            });
        }
    }

    createFireworks() {
        for (let f = 0; f < 5; f++) {
            this.time.delayedCall(f * 800, () => {
                const fireworkX = Phaser.Math.Between(200, this.cameras.main.width - 200);
                const fireworkY = Phaser.Math.Between(100, this.cameras.main.height - 200);

                // Crear explosión de partículas coloridas
                for (let i = 0; i < 12; i++) {
                    const angle = (Math.PI * 2 / 12) * i;
                    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    
                    const particle = this.add.circle(fireworkX, fireworkY, 3, color, 0.9);
                    
                    const distance = Phaser.Math.Between(80, 150);
                    const targetX = fireworkX + Math.cos(angle) * distance;
                    const targetY = fireworkY + Math.sin(angle) * distance;

                    this.tweens.add({
                        targets: particle,
                        x: targetX,
                        y: targetY,
                        alpha: 0,
                        scale: { from: 1, to: 0.3 },
                        duration: 1200,
                        ease: 'Power2.easeOut',
                        onComplete: () => particle.destroy()
                    });
                }
            });
        }
    }

    clearScreen() {
        // Limpiar elementos de la pregunta actual si existen
        if (this.currentQuestionContainer) {
            this.currentQuestionContainer.destroy();
            this.currentQuestionContainer = null;
        }

        // Limpiar títulos y contenedores de fase
        if (this.titleContainer) {
            this.titleContainer.destroy();
            this.titleContainer = null;
        }

        if (this.subtitleContainer) {
            this.subtitleContainer.destroy();
            this.subtitleContainer = null;
        }

        // Limpiar todos los contenedores y elementos de texto que no sean el fondo base
        this.children.list.forEach(child => {
            // Mantener solo elementos esenciales del fondo
            if (child.type === 'Container' || 
                (child.type === 'Text' && child.text && 
                 (child.text.includes('FASE 3') || 
                  child.text.includes('Entrena la IA') ||
                  child.text.includes('SIMULACIÓN')))) {
                child.destroy();
            } else if (child.getData && child.getData('temporary')) {
                child.destroy();
            }
        });
    }
}