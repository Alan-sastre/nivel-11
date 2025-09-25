class ScenaPregunta1 extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaPregunta1' });
        this.gameState = 'showing_code';
        this.selectedOption = null;
        this.codeLines = [];
        this.neuralNodes = [];
        this.glitchEffect = null;
        this.electricFlow = [];
    }

    preload() {
        // Cargar la música de fondo
        this.load.audio('backgroundMusic', 'assets/scenaPrincipal/musica.mp3');
        
        // Cargar assets de audio con archivos de respaldo y mejor manejo de errores
        this.load.audio('click', ['assets/sounds/click.wav', 'assets/sounds/click.mp3']);
        this.load.audio('success', ['assets/sounds/success.wav', 'assets/sounds/success.mp3']);
        this.load.audio('error', ['assets/sounds/error.wav', 'assets/sounds/error.mp3']);
        
        // Manejo de errores de carga de audio mejorado
        this.load.on('loaderror', (file) => {
            console.warn(`Error cargando archivo de audio: ${file.key} - continuando sin audio`);
        });
        
        // Configurar audio context para mejor compatibilidad
        this.load.on('complete', () => {
            try {
                if (this.sound.context && this.sound.context.state === 'suspended') {
                    this.sound.context.resume();
                }
            } catch (error) {
                console.warn('Error al configurar contexto de audio:', error);
            }
        });
    }

    create() {
        // Configurar la música de fondo
        this.musicManager = MusicManager.getInstance();
        if (!this.musicManager.isPlaying()) {
            const backgroundMusic = this.sound.add('backgroundMusic');
            this.musicManager.setMusic(backgroundMusic);
            this.musicManager.playMusic();
        }
        
        // Configurar el contexto de audio
        if (this.sound.context && this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }

        // Configuración de dimensiones
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;

        // Crear fondo futurista
        this.createFuturisticBackground();
        
        // Crear título principal
        this.createTitle();
        
        // Crear consola de simulación
        this.createConsole();
        
        // Crear editor de código
        this.createCodeEditor();
        
        // Crear pregunta y opciones
        this.createQuestion();
        
        // Crear red neuronal visual
        this.createNeuralNetwork();
        
        // Efectos de sonido
        this.createSounds();
        
        // Iniciar animaciones de fondo
        this.startBackgroundAnimations();
    }

    createFuturisticBackground() {
        // Fondo base con gradiente
        const bg = this.add.rectangle(this.centerX, this.centerY, this.cameras.main.width, this.cameras.main.height, 0x0a0a0a);
        
        // Crear partículas de fondo flotantes
        this.createFloatingParticles();
        
        // Líneas de conexión animadas
        this.createAnimatedConnections();
        
        // Efectos de luz ambiental
        this.createAmbientLighting();

        // Crear líneas de la cuadrícula con animación
        const gridSpacing = 50;
        for (let x = 0; x < this.cameras.main.width; x += gridSpacing) {
            const line = this.add.line(0, 0, x, 0, x, this.cameras.main.height, 0x1a1a2e, 0.3);
            
            this.tweens.add({
                targets: line,
                alpha: { from: 0.3, to: 0.1 },
                duration: 3000,
                repeat: -1,
                yoyo: true
            });
        }
        
        for (let y = 0; y < this.cameras.main.height; y += gridSpacing) {
            const line = this.add.line(0, 0, 0, y, this.cameras.main.width, y, 0x1a1a2e, 0.3);
            
            this.tweens.add({
                targets: line,
                alpha: { from: 0.3, to: 0.1 },
                duration: 3000,
                repeat: -1,
                yoyo: true
            });
        }
    }
    
    createFloatingParticles() {
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const particle = this.add.circle(x, y, 2, 0x4a90e2, 0.6);
            
            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-100, 100),
                y: y + Phaser.Math.Between(-100, 100),
                alpha: { from: 0.6, to: 0.2 },
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
            
            this.tweens.add({
                targets: particle,
                scaleX: { from: 1, to: 1.5 },
                scaleY: { from: 1, to: 1.5 },
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                yoyo: true,
                ease: 'Power2.easeInOut'
            });
        }
    }
    
    createAnimatedConnections() {
        // Crear líneas de conexión animadas entre puntos aleatorios
        for (let i = 0; i < 8; i++) {
            const startX = Phaser.Math.Between(50, this.cameras.main.width - 50);
            const startY = Phaser.Math.Between(50, this.cameras.main.height - 50);
            const endX = Phaser.Math.Between(50, this.cameras.main.width - 50);
            const endY = Phaser.Math.Between(50, this.cameras.main.height - 50);
            
            const connection = this.add.line(0, 0, startX, startY, endX, endY, 0x4a90e2, 0.4);
            
            this.tweens.add({
                targets: connection,
                alpha: { from: 0.4, to: 0.1 },
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
            
            this.tweens.add({
                targets: connection,
                scaleX: { from: 1, to: 1.1 },
                scaleY: { from: 1, to: 1.1 },
                duration: Phaser.Math.Between(3000, 5000),
                repeat: -1,
                yoyo: true,
                ease: 'Power2.easeInOut'
            });
        }
    }
    

    
    createAmbientLighting() {
        // Crear efectos de luz ambiental más sutiles
        const lightColors = [0x4a90e2, 0x6c7b7f, 0x5a6c7d, 0x37474f];
        
        for (let i = 0; i < 4; i++) {
            const light = this.add.circle(
                Phaser.Math.Between(100, this.cameras.main.width - 100),
                Phaser.Math.Between(100, this.cameras.main.height - 100),
                Phaser.Math.Between(80, 150),
                lightColors[i],
                0.1
            );
            
            this.tweens.add({
                targets: light,
                alpha: { from: 0.1, to: 0.05 },
                scaleX: { from: 1, to: 1.3 },
                scaleY: { from: 1, to: 1.3 },
                duration: Phaser.Math.Between(4000, 8000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
            
            this.tweens.add({
                targets: light,
                x: light.x + Phaser.Math.Between(-50, 50),
                y: light.y + Phaser.Math.Between(-50, 50),
                duration: Phaser.Math.Between(6000, 10000),
                repeat: -1,
                yoyo: true,
                ease: 'Power1.easeInOut'
            });
        }
    }

    createTitle() {
        // Título principal con mejor renderizado
        const titleText = this.add.text(this.centerX, 60, 'SISTEMA DE ANÁLISIS NEURONAL', {
            fontSize: '32px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffffff',
            stroke: '#4a90e2',
            strokeThickness: 1,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#2c5aa0',
                blur: 2,
                fill: true
            },
            resolution: 2
        }).setOrigin(0.5);

        // Animación de entrada del título
        titleText.setScale(0);
        titleText.setAlpha(0);
        this.tweens.add({
            targets: titleText,
            scale: 1,
            alpha: 1,
            duration: 1200,
            ease: 'Back.easeOut'
        });

        // Efecto de pulso más sutil
        this.tweens.add({
            targets: titleText,
            scaleX: { from: 1, to: 1.01 },
            scaleY: { from: 1, to: 1.01 },
            duration: 3000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Subtítulo con colores más balanceados
        const subtitle = this.add.text(this.centerX, 100, 'CONSOLA DE SIMULACIÓN DE IA v2.1.4', {
            fontSize: '16px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#a0a0a0',
            alpha: 0.9,
            resolution: 2
        }).setOrigin(0.5);

        subtitle.setAlpha(0);
        this.tweens.add({
            targets: subtitle,
            alpha: 0.9,
            duration: 1500,
            delay: 600,
            ease: 'Power2.easeOut'
        });
    }

    createConsole() {
        // Marco principal de la consola con colores más balanceados
        const consoleFrame = this.add.rectangle(this.centerX, this.centerY + 20, 900, 500, 0x1a1a2e, 0.95);
        consoleFrame.setStrokeStyle(2, 0x4a90e2);
        
        // Efecto de brillo sutil
        const glowFrame = this.add.rectangle(this.centerX, this.centerY + 20, 905, 505, 0x4a90e2, 0.05);
        
        // Barra superior
        const topBar = this.add.rectangle(this.centerX, this.centerY - 230, 900, 30, 0x2c5aa0, 0.9);
        
        const consoleTitle = this.add.text(this.centerX - 430, this.centerY - 235, '● NEURAL_NETWORK_DEBUGGER.exe v3.2.1', {
            fontSize: '14px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffffff',
            fontWeight: 'bold',
            resolution: 2
        });

        // Indicador de estado con animación más sutil
        this.statusIndicator = this.add.circle(this.centerX + 400, this.centerY - 230, 6, 0x4a90e2);
        this.tweens.add({
            targets: this.statusIndicator,
            alpha: { from: 1, to: 0.5 },
            scaleX: { from: 1, to: 1.1 },
            scaleY: { from: 1, to: 1.1 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Líneas de escaneo
        for (let i = 0; i < 3; i++) {
            const scanLine = this.add.line(0, 0, 
                this.centerX - 440, this.centerY - 200 + (i * 100), 
                this.centerX + 440, this.centerY - 200 + (i * 100), 
                0x4a90e2, 0.3);
            
            this.tweens.add({
                targets: scanLine,
                alpha: { from: 0.3, to: 0.1 },
                duration: 2000 + (i * 500),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createCodeEditor() {
        // Posición y dimensiones del editor
        const leftX = this.cameras.main.width * 0.35;
        const editorWidth = this.cameras.main.width * 0.35;
        const editorHeight = 300;
        
        // Contenedor del editor
        const editorContainer = this.add.container(leftX, this.centerY - 50);
        
        // Fondo del editor con colores más balanceados
        const editorBg = this.add.rectangle(0, 0, editorWidth, editorHeight, 0x1a1a2e, 0.98);
        editorBg.setStrokeStyle(2, 0x4a90e2);
        
        // Efecto de brillo
        const glowBg = this.add.rectangle(0, 0, editorWidth + 4, editorHeight + 4, 0x4a90e2, 0.05);
        
        // Sombra
        const editorShadow = this.add.rectangle(3, 3, editorWidth, editorHeight, 0x2c5aa0, 0.4);
        
        // Header del editor
        const headerBg = this.add.rectangle(0, -editorHeight/2 + 30, editorWidth, 60, 0x2c5aa0, 1);
        headerBg.setStrokeStyle(1, 0x4a90e2);
        
        // Título del editor
        const editorTitle = this.add.text(0, -editorHeight/2 + 30, '⚡ CÓDIGO NEURONAL v2.1', {
            fontSize: '18px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffffff',
            fontStyle: 'bold',
            resolution: 2
        }).setOrigin(0.5);

        // Código con mejor renderizado
        const codeText = `float peso1 = 0.5;
float peso2 = 0.5;
float sesgo = 1.0;

void setup() {
  Serial.begin(9600);
}
void loop() {
  float entrada1 = analogRead(A0);
  float entrada2 = analogRead(A1);
  float salida = (entrada1 * peso1) + 
                 (entrada2 * peso2) + sesgo;
  if (salida > 500) {
    Serial.println("Decisión: Aceptar.");
  }
}`;

        this.codeDisplay = this.add.text(0, -editorHeight/2 + 80, codeText, {
            fontSize: '11px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffffff',
            lineSpacing: 1,
            wordWrap: { width: editorWidth - 40 },
            resolution: 2
        }).setOrigin(0.5, 0);

        // Resaltar líneas de error
        this.highlightErrorLines();

        // Cursor parpadeante
        this.cursor = this.add.rectangle(0, -editorHeight/2 + 300, 2, 15, 0x4a90e2);
        this.tweens.add({
            targets: this.cursor,
            alpha: { from: 1, to: 0.2 },
            scaleY: { from: 1, to: 1.2 },
            duration: 600,
            repeat: -1,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Efecto de escritura
        this.createTypingEffect();
        
        // Partículas de código
        this.createCodeParticles(editorContainer);
        
        // Agregar elementos al contenedor
        editorContainer.add([editorShadow, glowBg, editorBg, headerBg, editorTitle, this.codeDisplay, this.cursor]);
        
        // Animación de entrada
        editorContainer.setX(-editorWidth);
        editorContainer.setAlpha(0);
        editorContainer.setScale(0.8);
        
        this.tweens.add({
            targets: editorContainer,
            x: leftX,
            alpha: 1,
            scale: 1,
            duration: 1000,
            ease: 'Power3.easeOut',
            delay: 200
        });
        
        // Efecto de escaneo
        this.tweens.add({
            targets: editorBg,
            strokeAlpha: { from: 0.5, to: 1 },
            duration: 600,
            repeat: 4,
            yoyo: true,
            delay: 1000,
            ease: 'Power2'
        });
    }
    
    createTypingEffect() {
        // Indicador de escritura
        const typingIndicator = this.add.text(0, -this.cameras.main.height * 0.35 + 350, '█', {
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            fill: '#4a90e2',
            resolution: 2
        }).setOrigin(0.5);
        
        // Animación del cursor
        this.tweens.add({
            targets: typingIndicator,
            alpha: { from: 1, to: 0 },
            duration: 400,
            repeat: -1,
            yoyo: true,
            delay: 2000
        });
        
        // Eliminar después de un tiempo
        this.time.delayedCall(5000, () => {
            typingIndicator.destroy();
        });
    }
    
    createCodeParticles(container) {
        // Partículas de código flotantes
        const symbols = ['01', '10', '11', '00', 'AI', 'NN'];
        
        for (let i = 0; i < 8; i++) {
            const particle = this.add.text(
                Phaser.Math.Between(-150, 150),
                Phaser.Math.Between(-100, 100),
                symbols[Phaser.Math.Between(0, symbols.length - 1)],
                {
                    fontSize: '10px',
                    fontFamily: 'Orbitron, Courier New, monospace',
                    fill: '#4a90e2',
                    alpha: 0.4,
                    resolution: 2
                }
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y - 50,
                alpha: { from: 0.4, to: 0 },
                duration: Phaser.Math.Between(3000, 5000),
                repeat: -1,
                ease: 'Power1.easeOut',
                onRepeat: () => {
                    particle.y = 100;
                    particle.x = Phaser.Math.Between(-150, 150);
                    particle.setText(symbols[Phaser.Math.Between(0, symbols.length - 1)]);
                }
            });
            
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-20, 20),
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    highlightErrorLines() {
        // Resaltar líneas con errores con colores más sutiles
        const errorHighlight1 = this.add.rectangle(this.centerX - 200, this.centerY - 60, 450, 15, 0xff6b35, 0.2);
        const errorHighlight2 = this.add.rectangle(this.centerX - 200, this.centerY - 45, 450, 15, 0xff6b35, 0.2);
        
        // Animación de parpadeo sutil
        this.tweens.add({
            targets: [errorHighlight1, errorHighlight2],
            alpha: { from: 0.2, to: 0.1 },
            scaleX: { from: 1, to: 1.01 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Cambio de color sutil
        this.tweens.add({
            targets: [errorHighlight1, errorHighlight2],
            tint: { from: 0xff6b35, to: 0xff8c42 },
            duration: 3000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    createQuestion() {
        // Área de preguntas con colores más balanceados
        const rightX = this.cameras.main.width * 0.75;
        const questionBg = this.add.rectangle(rightX, this.centerY - 50, 360, 300, 0x1a1a2e, 0.98);
        questionBg.setStrokeStyle(2, 0x4a90e2);
        
        // Efecto de brillo
        const glowBg = this.add.rectangle(rightX, this.centerY - 50, 365, 305, 0x4a90e2, 0.05);

        const questionText = this.add.text(rightX, this.centerY - 170, 
            '¿Cuál es el problema\nen este código?', {
            fontSize: '20px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 5,
            fontWeight: 'bold',
            resolution: 2
        }).setOrigin(0.5);

        // Opciones de respuesta
        const options = [
            'A) Falta normalización de valores de entrada',
            'B) No hay estructura de aprendizaje',
            'C) Se necesita int en lugar de float',
            'D) Usar digitalRead() en lugar de analogRead()'
        ];

        // Colores más balanceados para las opciones
        const optionColors = [
            { bg: 0x2c5aa0, border: 0x4a90e2, text: '#ffffff', hover: 0x3d6bb3 },
            { bg: 0x2c5aa0, border: 0x4a90e2, text: '#ffffff', hover: 0x3d6bb3 },
            { bg: 0x2c5aa0, border: 0x4a90e2, text: '#ffffff', hover: 0x3d6bb3 },
            { bg: 0x2c5aa0, border: 0x4a90e2, text: '#ffffff', hover: 0x3d6bb3 }
        ];

        this.optionButtons = [];

        options.forEach((option, index) => {
            const y = this.centerY - 100 + (index * 50);
            const colors = optionColors[index];

            // Botón de opción con mejor diseño
            const button = this.add.rectangle(rightX, y, 340, 40, colors.bg, 0.9);
            button.setStrokeStyle(2, colors.border);

            // Texto de la opción con mejor renderizado
            const optionText = this.add.text(rightX, y, option, {
                fontSize: '11px',
                fontFamily: 'Orbitron, Courier New, monospace',
                fill: colors.text,
                align: 'center',
                lineSpacing: 2,
                fontWeight: 'bold',
                resolution: 2
            }).setOrigin(0.5);

            // Efectos hover con animación de cristal
            button.setInteractive({ useHandCursor: true });
            
            button.on('pointerover', () => {
                // Crear efecto de cristal brillante
                const crystalGlow = this.add.rectangle(button.x, button.y, button.width + 8, button.height + 8, 0x00e5ff, 0.15);
                crystalGlow.setStrokeStyle(2, 0x4dd0e1, 0.6);
                button.crystalGlow = crystalGlow;
                
                this.tweens.add({
                    targets: button,
                    scaleX: 1.03,
                    scaleY: 1.03,
                    duration: 250,
                    ease: 'Power2.easeOut'
                });
                
                // Animación de brillo cristalino
                this.tweens.add({
                    targets: crystalGlow,
                    scaleX: { from: 0.9, to: 1.1 },
                    scaleY: { from: 0.9, to: 1.1 },
                    alpha: { from: 0.15, to: 0.4 },
                    duration: 400,
                    repeat: -1,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });
                
                this.tweens.add({
                    targets: optionText,
                    fill: '#b3e5fc',
                    duration: 250
                });
                
                // Partículas de cristal
                this.createCrystalParticles(button);
            });

            button.on('pointerout', () => {
                if (this.selectedOption !== index) {
                    this.tweens.add({
                        targets: button,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 250,
                        ease: 'Power2.easeOut'
                    });
                    
                    // Destruir efecto de cristal
                    if (button.crystalGlow) {
                        this.tweens.add({
                            targets: button.crystalGlow,
                            alpha: 0,
                            scaleX: 0.8,
                            scaleY: 0.8,
                            duration: 200,
                            onComplete: () => {
                                button.crystalGlow.destroy();
                                button.crystalGlow = null;
                            }
                        });
                    }
                    this.tweens.add({
                        targets: optionText,
                        fill: colors.text,
                        duration: 200
                    });
                }
            });

            button.on('pointerdown', () => {
                this.selectOption(index, button, optionText, colors);
            });

            this.optionButtons.push({ button, text: optionText, colors });
        });

        // Botón de confirmación con mejor diseño
        this.confirmButton = this.add.rectangle(this.centerX + 200, this.centerY + 120, 120, 40, 0x2c5aa0, 0.5);
        this.confirmButton.setStrokeStyle(2, 0x4a90e2);
        
        const confirmText = this.add.text(this.centerX + 200, this.centerY + 120, 'CONFIRMAR', {
            fontSize: '16px',
            fontFamily: 'Orbitron, monospace',
            fill: '#ffffff',
            fontWeight: 'bold',
            resolution: 2
        }).setOrigin(0.5);

        // Animación de pulso sutil para el botón
        this.tweens.add({
            targets: this.confirmButton,
            alpha: { from: 0.5, to: 0.7 },
            scaleX: { from: 1, to: 1.01 },
            scaleY: { from: 1, to: 1.01 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: confirmText,
            alpha: { from: 0.7, to: 1 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // Interactividad del botón de confirmación
        this.confirmButton.setInteractive({ useHandCursor: true });
        
        this.confirmButton.on('pointerover', () => {
            if (this.selectedOption !== null) {
                this.tweens.add({
                    targets: [this.confirmButton, confirmText],
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            }
        });

        this.confirmButton.on('pointerout', () => {
            this.tweens.add({
                targets: [this.confirmButton, confirmText],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2.easeOut'
            });
        });

        this.confirmButton.on('pointerdown', () => {
            if (this.selectedOption !== null) {
                this.tweens.add({
                    targets: [this.confirmButton, confirmText],
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 100,
                    ease: 'Power2.easeOut',
                    yoyo: true,
                    onComplete: () => {
                        this.checkAnswer();
                    }
                });
            }
        });
    }

    createNeuralNetwork() {
        // Red neuronal horizontal más pequeña y compacta debajo del código
        const codeEditorBottom = this.centerY + 100; // Posición debajo del editor de código
        const networkStartY = codeEditorBottom + 60; // Menos espacio debajo del código
        const layerSpacing = 80; // Espaciado horizontal más compacto entre capas
        const nodeSpacing = 35; // Espaciado vertical más pequeño entre nodos
        
        // Limpiar nodos anteriores si existen
        if (this.neuralNodes) {
            this.neuralNodes.forEach(node => node.destroy());
        }
        this.neuralNodes = [];
        
        // CAPA DE ENTRADA (4 nodos) - Vertical en el lado izquierdo, más pequeña
        const inputLayer = [];
        const inputStartX = this.centerX - 120;
        for (let i = 0; i < 4; i++) {
            const x = inputStartX;
            const y = networkStartY - 50 + (i * nodeSpacing);
            
            // Nodo principal más pequeño
            const node = this.add.circle(x, y, 8, 0x1976d2, 1);
            node.setStrokeStyle(2, 0x42a5f5);
            
            // Efecto de brillo más sutil
            const glow = this.add.circle(x, y, 12, 0x42a5f5, 0.2);
            
            // Etiqueta del nodo más pequeña
            const label = this.add.text(x - 20, y, `I${i+1}`, {
                fontSize: '10px',
                fill: '#42a5f5',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            
            // Animación más sutil
            this.tweens.add({
                targets: [node, glow],
                scaleX: { from: 1, to: 1.1 },
                scaleY: { from: 1, to: 1.1 },
                duration: 2000 + (i * 200),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
            
            inputLayer.push({ node, glow, x, y, label });
            this.neuralNodes.push(node);
        }
        
        // CAPA OCULTA (3 nodos) - Vertical en el centro, más compacta
        const hiddenLayer = [];
        const hiddenStartX = this.centerX - 40;
        for (let i = 0; i < 3; i++) {
            const x = hiddenStartX;
            const y = networkStartY - 35 + (i * nodeSpacing);
            
            // Nodo principal más pequeño
            const node = this.add.circle(x, y, 7, 0x7b1fa2, 0.9);
            node.setStrokeStyle(2, 0x9c27b0);
            
            // Efecto de brillo más sutil
            const glow = this.add.circle(x, y, 11, 0x9c27b0, 0.2);
            
            // Etiqueta del nodo más pequeña
            const label = this.add.text(x, y - 18, `H${i+1}`, {
                fontSize: '9px',
                fill: '#9c27b0',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            
            // Animación más sutil
            this.tweens.add({
                targets: [node, glow],
                scaleX: { from: 1, to: 1.15 },
                scaleY: { from: 1, to: 1.15 },
                duration: 1800 + (i * 250),
                repeat: -1,
                yoyo: true,
                ease: 'Power2.easeInOut'
            });
            
            hiddenLayer.push({ node, glow, x, y, label });
            this.neuralNodes.push(node);
        }
        
        // CAPA DE SALIDA (1 nodo) - En el lado derecho, más pequeña
        const outputX = this.centerX + 40;
        const outputY = networkStartY - 18; // Centrado verticalmente
        
        const outputNode = this.add.circle(outputX, outputY, 10, 0xd32f2f, 1);
        outputNode.setStrokeStyle(3, 0xff5722);
        
        // Brillo especial para salida más sutil
        const outputGlow = this.add.circle(outputX, outputY, 15, 0xff5722, 0.3);
        
        // Etiqueta de salida eliminada
        
        // Animación especial para salida más sutil
        this.tweens.add({
            targets: [outputNode, outputGlow],
            scaleX: { from: 1, to: 1.2 },
            scaleY: { from: 1, to: 1.2 },
            duration: 2200,
            repeat: -1,
            yoyo: true,
            ease: 'Power3.easeInOut'
        });
        
        const outputLayer = [{ node: outputNode, glow: outputGlow, x: outputX, y: outputY }];
        this.neuralNodes.push(outputNode);
        
        // Crear conexiones profesionales
        this.createNeuralConnections(inputLayer, hiddenLayer, outputLayer);
    }

    createNeuralConnections(inputLayer, hiddenLayer, outputLayer) {
        // Limpiar conexiones anteriores
        if (this.neuralConnections) {
            this.neuralConnections.forEach(connection => connection.destroy());
        }
        this.neuralConnections = [];
        
        // CONEXIONES ENTRADA → OCULTA (4 nodos → 3 nodos) - Líneas precisas
        inputLayer.forEach((inputNode, i) => {
            hiddenLayer.forEach((hiddenNode, j) => {
                // Crear línea usando graphics para mayor precisión
                const graphics = this.add.graphics();
                graphics.lineStyle(1, 0x42a5f5, 0.4);
                graphics.beginPath();
                graphics.moveTo(inputNode.x, inputNode.y);
                graphics.lineTo(hiddenNode.x, hiddenNode.y);
                graphics.strokePath();
                
                this.neuralConnections.push(graphics);
                
                // Animación de flujo de datos más sutil
                this.tweens.add({
                    targets: graphics,
                    alpha: { from: 0.4, to: 0.7, to: 0.4 },
                    duration: 2000 + (i * 100) + (j * 50),
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                    delay: i * 150
                });
                
                // Efecto de pulso ocasional más sutil
                this.time.delayedCall(3000 + (i * 400), () => {
                    this.tweens.add({
                        targets: graphics,
                        scaleX: { from: 1, to: 1.05, to: 1 },
                        scaleY: { from: 1, to: 1.05, to: 1 },
                        duration: 200,
                        ease: 'Power2.easeOut'
                    });
                }, [], this);
            });
        });
        
        // CONEXIONES OCULTA → SALIDA (3 nodos → 1 nodo) - Líneas precisas
        hiddenLayer.forEach((hiddenNode, i) => {
            const outputNode = outputLayer[0];
            
            // Crear línea usando graphics para mayor precisión
            const graphics = this.add.graphics();
            graphics.lineStyle(1.5, 0x9c27b0, 0.5);
            graphics.beginPath();
            graphics.moveTo(hiddenNode.x, hiddenNode.y);
            graphics.lineTo(outputNode.x, outputNode.y);
            graphics.strokePath();
            
            this.neuralConnections.push(graphics);
            
            // Animación especial para conexiones de salida más sutil
            this.tweens.add({
                targets: graphics,
                alpha: { from: 0.5, to: 0.8, to: 0.5 },
                duration: 1600 + (i * 150),
                repeat: -1,
                ease: 'Power2.easeInOut',
                delay: i * 100
            });
            
            // Efecto de energía que viaja por la conexión más pequeño
            this.time.delayedCall(2500 + (i * 400), () => {
                // Crear partícula de energía más pequeña
                const energyParticle = this.add.circle(hiddenNode.x, hiddenNode.y, 2, 0xffffff, 0.8);
                
                // Animar la partícula desde el nodo oculto hasta la salida
                this.tweens.add({
                    targets: energyParticle,
                    x: outputNode.x,
                    y: outputNode.y,
                    duration: 600,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
                        energyParticle.destroy();
                        
                        // Efecto de impacto en el nodo de salida más sutil
                        this.tweens.add({
                            targets: [outputNode.node, outputNode.glow],
                            scaleX: { from: 1, to: 1.2, to: 1 },
                            scaleY: { from: 1, to: 1.2, to: 1 },
                            duration: 150,
                            ease: 'Power2.easeOut'
                        });
                    }
                });
            }, [], this);
        });
        
        // Agregar etiquetas de las capas más pequeñas y mejor posicionadas
        // Etiquetas eliminadas - red neuronal sin texto
        
        return this.neuralConnections;
    }

    createCrystalParticles(button) {
        // Crear partículas cristalinas que emergen del botón
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(
                button.x + (Math.random() - 0.5) * button.width,
                button.y + (Math.random() - 0.5) * button.height,
                Math.random() * 3 + 1,
                0x4dd0e1,
                0.8
            );
            
            // Animación de las partículas cristalinas
            this.tweens.add({
                targets: particle,
                x: particle.x + (Math.random() - 0.5) * 60,
                y: particle.y - Math.random() * 40 - 20,
                alpha: 0,
                scaleX: { from: 1, to: 0.2 },
                scaleY: { from: 1, to: 0.2 },
                duration: 800 + Math.random() * 400,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    createHoverParticles(container, color) {
        // Partículas hover más sutiles
        for (let i = 0; i < 5; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(-20, 20),
                Phaser.Math.Between(-20, 20),
                2, color, 0.6
            );
            
            container.add(particle);
            
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-30, 30),
                y: particle.y + Phaser.Math.Between(-30, 30),
                alpha: { from: 0.6, to: 0 },
                scale: { from: 1, to: 0.5 },
                duration: 1000,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }
    
    createClickWave(container, color) {
        // Onda de click más sutil
        const wave = this.add.circle(0, 0, 5, color, 0.3);
        container.add(wave);
        
        this.tweens.add({
            targets: wave,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 600,
            ease: 'Power2.easeOut',
            onComplete: () => {
                wave.destroy();
            }
        });
    }

    createSounds() {
        // Cargar sonidos con manejo de errores mejorado
        try {
            if (this.cache.audio.exists('click')) {
                this.clickSound = this.sound.add('click', { volume: 0.3 });
            } else {
                console.warn('Audio "click" no disponible en cache');
                this.clickSound = null;
            }
        } catch (e) {
            console.warn('No se pudo cargar el sonido click:', e);
            this.clickSound = null;
        }
        
        try {
            if (this.cache.audio.exists('success')) {
                this.successSound = this.sound.add('success', { volume: 0.5 });
            } else {
                console.warn('Audio "success" no disponible en cache');
                this.successSound = null;
            }
        } catch (e) {
            console.warn('No se pudo cargar el sonido success:', e);
            this.successSound = null;
        }
        
        try {
            if (this.cache.audio.exists('error')) {
                this.errorSound = this.sound.add('error', { volume: 0.4 });
            } else {
                console.warn('Audio "error" no disponible en cache');
                this.errorSound = null;
            }
        } catch (e) {
            console.warn('No se pudo cargar el sonido error:', e);
            this.errorSound = null;
        }
    }

    startBackgroundAnimations() {
        // Animaciones de fondo para los nodos neurales
        this.neuralNodes.forEach((node, index) => {
            this.tweens.add({
                targets: node,
                alpha: { from: node.alpha, to: node.alpha * 0.7, to: node.alpha },
                scaleX: { from: 1, to: 1.05, to: 1 },
                scaleY: { from: 1, to: 1.05, to: 1 },
                duration: 3000 + (index * 200),
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Rotación sutil
            this.tweens.add({
                targets: node,
                rotation: { from: 0, to: Math.PI * 2 },
                duration: 20000 + (index * 1000),
                repeat: -1,
                ease: 'Linear'
            });
        });
        
        // Animación para las conexiones de la red neuronal
        if (this.networkConnections) {
            this.tweens.add({
                targets: this.networkConnections,
                alpha: { from: 0.6, to: 0.9, to: 0.6 },
                duration: 3000,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    selectOption(index, button, text, colors) {
        // Resetear opciones anteriores
        this.optionButtons.forEach((opt, i) => {
            if (i !== index) {
                this.tweens.add({
                    targets: opt.button,
                    fillColor: opt.colors.bg,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 300
                });
                opt.text.setFill(opt.colors.text);
            }
        });

        // Resaltar opción seleccionada con colores más sutiles
        button.setFillStyle(0x4a90e2);
        button.setStrokeStyle(3, 0x6c7b7f);
        text.setFill('#ffffff');
        
        // Animación de selección mejorada
        this.tweens.add({
            targets: button,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            ease: 'Back.easeOut',
            yoyo: true,
            repeat: 0
        });
        
        // Efecto de pulso mejorado
        this.tweens.add({
            targets: button,
            alpha: { from: 0.7, to: 1 },
            duration: 150,
            repeat: 3,
            yoyo: true
        });

        // Efecto de brillo/glow
        const glowEffect = this.add.rectangle(button.x, button.y, button.width + 10, button.height + 10, 0x00e5ff, 0.3);
        glowEffect.setStrokeStyle(2, 0x00ffff, 0.8);
        
        this.tweens.add({
            targets: glowEffect,
            scaleX: { from: 0.8, to: 1.2 },
            scaleY: { from: 0.8, to: 1.2 },
            alpha: { from: 0.8, to: 0 },
            duration: 600,
            ease: 'Power2.easeOut',
            onComplete: () => {
                glowEffect.destroy();
            }
        });

        // Partículas de selección
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(
                button.x + (Math.random() - 0.5) * button.width,
                button.y + (Math.random() - 0.5) * button.height,
                3,
                0x00e5ff
            );
            
            this.tweens.add({
                targets: particle,
                x: particle.x + (Math.random() - 0.5) * 100,
                y: particle.y + (Math.random() - 0.5) * 100,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.2 },
                duration: 800,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
        
        this.selectedOption = index;
        this.confirmButton.setAlpha(1);
        
        // Sonido de click (solo si está disponible)
        try {
            if (this.clickSound) {
                this.clickSound.play();
            }
        } catch (error) {
            // Silenciar error de audio
        }
    }

    checkAnswer() {
        if (this.selectedOption === 0) { // Respuesta correcta (A)
            this.showCorrectAnswer();
        } else {
            this.showIncorrectAnswer();
        }
    }

    showCorrectAnswer() {
        // Animaciones de éxito con colores más balanceados
        this.createSuccessAnimation();
        this.createCelebrationParticles();
        this.createSuccessWave();
        
        // ¡NUEVA ANIMACIÓN ESPECTACULAR DE LA RED NEURONAL!
        this.createNeuralNetworkCelebration();
        
        // Cambiar indicador de estado
        this.tweens.add({
            targets: this.statusIndicator,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.statusIndicator.setFillStyle(0x4caf50);
                this.tweens.add({
                    targets: this.statusIndicator,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
        });
        
        // Flash de pantalla sutil
        this.createScreenFlash(0x4caf50, 0.2);
        
        // Sonido de éxito
        if (this.successSound) {
            this.successSound.play();
        }

        // Mostrar código corregido
        this.time.delayedCall(1000, () => {
            this.showCorrectedCode();
        });
        
        // Activar red neuronal
        this.time.delayedCall(1500, () => {
            this.activateNeuralNetwork();
        });
        
        // Mostrar mensaje de éxito
        this.time.delayedCall(2000, () => {
            this.showSuccessMessage();
        });
    }

    createSuccessAnimation() {
        // Partículas de éxito con colores más sutiles
        const particles = [];
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                this.centerX + Phaser.Math.Between(-50, 50),
                this.centerY + Phaser.Math.Between(-50, 50),
                Phaser.Math.Between(3, 8),
                0x4caf50,
                0.8
            );
            particles.push(particle);
            
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-100, 100),
                y: particle.y + Phaser.Math.Between(-100, 100),
                alpha: 0,
                scale: 0.2,
                duration: 1500,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
        
        // Ondas de energía
        for (let i = 0; i < 3; i++) {
            const wave = this.add.circle(this.centerX, this.centerY, 20, 0x4caf50, 0.3);
            
            this.tweens.add({
                targets: wave,
                scaleX: 8,
                scaleY: 8,
                alpha: 0,
                duration: 2000,
                delay: i * 300,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    wave.destroy();
                }
            });
        }
        
        // Texto de felicitaciones flotante con mejor renderizado
        const congratsText = this.add.text(this.centerX, this.centerY - 100, '¡SISTEMA ACTIVADO!', {
            fontSize: '48px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#4caf50',
            stroke: '#ffffff',
            strokeThickness: 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#4caf50',
                blur: 15,
                stroke: true,
                fill: true
            },
            resolution: 2
        }).setOrigin(0.5);
        
        // Animación del texto de felicitaciones
        congratsText.setScale(0);
        this.tweens.add({
            targets: congratsText,
            scale: { from: 0, to: 1.1 },
            duration: 600,
            ease: 'Back.easeOut',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.tweens.add({
                    targets: congratsText,
                    y: congratsText.y - 50,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
                        congratsText.destroy();
                    }
                });
            }
        });
        
        // Flash de pantalla sutil
        const flashOverlay = this.add.rectangle(this.centerX, this.centerY, 
            this.cameras.main.width, this.cameras.main.height, 0x4caf50, 0.2);
        
        this.tweens.add({
            targets: flashOverlay,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                flashOverlay.destroy();
            }
        });
        
        // Efecto de brillo en el marco de la consola
        this.tweens.add({
            targets: this.consoleFrame,
            scaleX: { from: 1, to: 1.05 },
            scaleY: { from: 1, to: 1.05 },
            tint: { from: 0xffffff, to: 0x4caf50, to: 0xffffff },
            duration: 600,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    showCorrectedCode() {
        // Código corregido
        const correctedCode = `float peso1 = 0.5;
float peso2 = 0.5;
float sesgo = 1.0;

void setup() {
  Serial.begin(9600);
}
void loop() {
  float entrada1 = analogRead(A0) / 1023.0;
  float entrada2 = analogRead(A1) / 1023.0;
  float salida = (entrada1 * peso1) + 
                 (entrada2 * peso2) + sesgo;
  if (salida > 0.5) {
    Serial.println("Decisión: Aceptar.");
  }
}`;

        // Transición del código
        this.tweens.add({
            targets: this.codeDisplay,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.codeDisplay.setText(correctedCode);
                this.codeDisplay.setFill('#4caf50');
                this.tweens.add({
                    targets: this.codeDisplay,
                    alpha: 1,
                    duration: 500
                });
            }
        });
    }

    activateNeuralNetwork() {
        // Activar animaciones de la red neuronal
        this.neuralNodes.forEach((node, index) => {
            this.tweens.add({
                targets: node,
                fillColor: 0x4caf50,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 300,
                delay: index * 100,
                ease: 'Back.easeOut',
                yoyo: true
            });
        });
        
        // Crear flujo eléctrico
        this.createElectricFlow();
    }

    createElectricFlow() {
        const networkY = this.centerY + 200;
        
        // Crear partículas de flujo eléctrico
        for (let i = 0; i < 10; i++) {
            const particle = this.add.circle(
                this.centerX - 200,
                networkY,
                3,
                0x4caf50,
                0.8
            );
            
            this.tweens.add({
                targets: particle,
                x: this.centerX,
                y: networkY + 120,
                duration: 1000,
                delay: i * 100,
                ease: 'Power2.easeInOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    showSuccessMessage() {
        const successBg = this.add.rectangle(this.centerX, this.centerY + 300, 800, 80, 0x1b5e20, 0.9);
        successBg.setStrokeStyle(2, 0x4caf50);
        
        const successText = this.add.text(this.centerX, this.centerY + 300, 
            '¡BIEN HECHO! Ahora la IA procesa los datos correctamente\nantes de tomar una decisión.', {
            fontSize: '16px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#4caf50',
            align: 'center',
            lineSpacing: 5,
            resolution: 2
        }).setOrigin(0.5);

        // Animaciones de entrada
        successBg.setScale(0);
        successText.setAlpha(0);
        
        this.tweens.add({
            targets: successBg,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: successText,
            alpha: 1,
            duration: 800,
            delay: 300
        });
        
        // Auto-ocultar después de 3 segundos
        this.time.delayedCall(3000, () => {
            this.scene.start('CircuitosQuemados');
        });
    }

    showIncorrectAnswer() {
        // Efectos de error con colores más sutiles
        this.createErrorExplosion();
        this.createShakeEffect();
        this.createErrorParticles();
        
        // Cambiar indicador de estado
        this.tweens.add({
            targets: this.statusIndicator,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            ease: 'Power2.easeOut',
            onComplete: () => {
                this.statusIndicator.setFillStyle(0xf44336);
                this.tweens.add({
                    targets: this.statusIndicator,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.statusIndicator,
                            alpha: { from: 1, to: 0.3 },
                            duration: 200,
                            repeat: 5,
                            yoyo: true
                        });
                    }
                });
            }
        });
        
        // Flash de pantalla sutil
        this.createScreenFlash(0xf44336, 0.3);

        // Sonido de error
        if (this.errorSound) {
            this.errorSound.play();
        }
        
        // Efecto de glitch
        this.createGlitchEffect();
        
        // Mostrar mensaje de error
        this.showErrorMessage();
    }

    createGlitchEffect() {
        // Overlay de glitch con colores más sutiles
        const glitchOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xff6b35, 0.1);
        glitchOverlay.setOrigin(0, 0);
        
        // Líneas de interferencia
        for (let i = 0; i < 25; i++) {
            const line = this.add.rectangle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.Between(50, 200),
                2,
                0xff8c42,
                0.6
            );
            
            // Efecto de brillo en las líneas
            line.setStrokeStyle(1, 0xff6b35);
            
            this.tweens.add({
                targets: line,
                x: line.x + Phaser.Math.Between(-100, 100),
                alpha: 0,
                duration: 400,
                ease: 'Power2.easeOut',
                onComplete: () => line.destroy()
            });
        }
        
        // Partículas de error tecnológicas
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.Between(2, 6),
                0xff6b35,
                0.7
            );
            
            // Efecto de brillo
            particle.setStrokeStyle(1, 0xff8c42);
            
            this.tweens.add({
                targets: particle,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 600,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
        
        // Shake de cámara más sutil
        this.cameras.main.shake(800, 0.005);
        
        // Limpiar efectos
        this.time.delayedCall(800, () => {
            glitchOverlay.destroy();
        });
    }

    createCelebrationParticles() {
        // Partículas de celebración con colores más balanceados
        for (let i = 0; i < 35; i++) {
            const colors = [0x4caf50, 0x66bb6a, 0x81c784, 0xa5d6a7];
            const particle = this.add.circle(
                this.centerX,
                this.centerY,
                Phaser.Math.Between(3, 8),
                colors[Phaser.Math.Between(0, colors.length - 1)],
                0.8
            );
            
            // Efecto de brillo
            particle.setStrokeStyle(1, 0x4caf50);
            
            // Animación de explosión robótica
            this.tweens.add({
                targets: particle,
                y: particle.y + Phaser.Math.Between(-150, -50),
                x: particle.x + Phaser.Math.Between(-100, 100),
                alpha: 0,
                scale: 0.3,
                rotation: Phaser.Math.Between(0, Math.PI * 2),
                duration: Phaser.Math.Between(1000, 2000),
                ease: 'Power3.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createSuccessWave() {
        // Ondas de éxito
        for (let i = 0; i < 5; i++) {
            const wave = this.add.circle(this.centerX, this.centerY, 10, 0x4caf50, 0.3);
            
            this.tweens.add({
                targets: wave,
                scaleX: 10,
                scaleY: 10,
                alpha: 0,
                duration: 2000,
                delay: i * 200,
                ease: 'Power2.easeOut',
                onComplete: () => wave.destroy()
            });
        }
    }

    createScreenFlash(color, intensity) {
        // Flash de pantalla
        const flash = this.add.rectangle(
            this.centerX, this.centerY,
            this.cameras.main.width, this.cameras.main.height,
            color, intensity
        );
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 400,
            ease: 'Power2.easeOut',
            onComplete: () => flash.destroy()
        });
    }

    createErrorExplosion() {
        // Explosión de error con colores más sutiles
        for (let i = 0; i < 25; i++) {
            const particle = this.add.circle(
                this.centerX + Phaser.Math.Between(-30, 30),
                this.centerY + Phaser.Math.Between(-30, 30),
                Phaser.Math.Between(2, 6),
                0xff6b35,
                0.7
            );
            
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-80, 80),
                y: particle.y + Phaser.Math.Between(-80, 80),
                alpha: 0,
                scale: 0.1,
                duration: 800,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createShakeEffect() {
        // Efecto de shake más sutil
        const elementsToShake = [this.consoleFrame, this.codeDisplay];
        
        elementsToShake.forEach(element => {
            if (element) {
                const originalX = element.x;
                const originalY = element.y;
                
                this.tweens.add({
                    targets: element,
                    x: originalX + Phaser.Math.Between(-3, 3),
                    y: originalY + Phaser.Math.Between(-3, 3),
                    duration: 50,
                    repeat: 8,
                    yoyo: true,
                    onComplete: () => {
                        element.setPosition(originalX, originalY);
                    }
                });
            }
        });
    }

    createErrorParticles() {
        // Partículas de error
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.Between(2, 5),
                0xff6b35,
                0.6
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y + Phaser.Math.Between(50, 100),
                alpha: 0,
                scale: 0.2,
                duration: 1000,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    showErrorMessage() {
        const errorMessages = [
            'ERROR CRÍTICO: La IA ha decidido que las papas fritas\nson la moneda oficial.',
            'FALLO DEL SISTEMA: La IA quiere encender 300 ventiladores\nal mismo tiempo.',
            'DECISIÓN ABSURDA: La IA cree que los gatos\nson la solución a todos los problemas.',
            'ERROR NEURAL: La IA ha decidido que el color azul\nsabe a matemáticas.'
        ];

        const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        
        const errorBg = this.add.rectangle(this.centerX, this.centerY + 300, 800, 80, 0x3e2723, 0.9);
        errorBg.setStrokeStyle(2, 0xff6b35);
        
        const errorText = this.add.text(this.centerX, this.centerY + 300, randomMessage, {
            fontSize: '16px',
            fontFamily: 'Orbitron, Courier New, monospace',
            fill: '#ff6b35',
            align: 'center',
            lineSpacing: 5,
            resolution: 2
        }).setOrigin(0.5);

        // Animaciones de entrada
        errorBg.setScale(0);
        errorText.setAlpha(0);
        
        this.tweens.add({
            targets: errorBg,
            scale: 1,
            duration: 300,
            ease: 'Power2.easeOut'
        });
        
        this.tweens.add({
            targets: errorText,
            alpha: 1,
            duration: 500,
            delay: 200
        });

        // Efecto de parpadeo en el texto de error
        this.tweens.add({
            targets: errorText,
            alpha: { from: 1, to: 0.3 },
            duration: 300,
            repeat: -1,
            yoyo: true,
            delay: 1000
        });

        // Permitir reintentar después de 3 segundos
        this.time.delayedCall(3000, () => {
            this.resetQuestion();
        });
    }

    resetQuestion() {
        // Resetear selección
        this.selectedOption = null;
        this.confirmButton.setAlpha(0.5);
        
        // Resetear botones
        this.optionButtons.forEach(opt => {
            opt.button.setFillStyle(0x2c5aa0);
            opt.button.setStrokeStyle(2, 0x4a90e2);
            opt.text.setFill('#ffffff');
        });

        // Limpiar mensajes
        this.children.list.forEach(child => {
            if (child.type === 'Rectangle' && 
                (child.fillColor === 0x1b5e20 || child.fillColor === 0x3e2723)) {
                child.destroy();
            }
            if (child.type === 'Text' && 
                (child.style.fill === '#4caf50' || child.style.fill === '#ff6b35')) {
                if (child.text.includes('BIEN HECHO') || child.text.includes('ERROR')) {
                    child.destroy();
                }
            }
        });
    }

    // ¡NUEVA FUNCIÓN: ANIMACIÓN ESPECTACULAR DE LA RED NEURONAL!
    createNeuralNetworkCelebration() {
        if (!this.neuralNodes || this.neuralNodes.length === 0) return;

        // Animación de pulso intenso en todos los nodos
        this.neuralNodes.forEach((node, index) => {
            // Pulso de escala dramático
            this.tweens.add({
                targets: node,
                scaleX: 2.5,
                scaleY: 2.5,
                duration: 400,
                delay: index * 100,
                ease: 'Elastic.easeOut',
                yoyo: true,
                repeat: 2
            });

            // Cambio de color espectacular
            this.tweens.add({
                targets: node,
                fillColor: { from: node.fillColor, to: 0x00ff00 },
                duration: 300,
                delay: index * 100,
                ease: 'Power2.easeOut',
                yoyo: true,
                repeat: 3
            });

            // Efecto de brillo intenso
            const glowEffect = this.add.circle(node.x, node.y, 25, 0x00ff00, 0.6);
            this.tweens.add({
                targets: glowEffect,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 800,
                delay: index * 100,
                ease: 'Power2.easeOut',
                onComplete: () => glowEffect.destroy()
            });
        });

        // Animación de las conexiones - líneas brillantes
        if (this.neuralConnections) {
            this.neuralConnections.forEach((connection, index) => {
                if (connection.clear) { // Es un graphics object
                    this.tweens.add({
                        targets: connection,
                        alpha: { from: 0.4, to: 1 },
                        duration: 200,
                        delay: index * 50,
                        ease: 'Power2.easeOut',
                        yoyo: true,
                        repeat: 5
                    });
                }
            });
        }

        // Explosión de partículas desde la red neuronal
        const centerX = this.centerX;
        const centerY = this.screenHeight * 0.75;
        
        for (let i = 0; i < 30; i++) {
            const particle = this.add.circle(centerX, centerY, 3, 0x00ff00, 0.8);
            const angle = (i / 30) * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            
            this.tweens.add({
                targets: particle,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 1000 + Math.random() * 500,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }

        // Ondas de energía desde la red
        for (let i = 0; i < 3; i++) {
            const wave = this.add.circle(centerX, centerY, 10, 0x00ff00, 0);
            wave.setStrokeStyle(3, 0x00ff00, 0.8);
            
            this.tweens.add({
                targets: wave,
                scaleX: 8,
                scaleY: 8,
                alpha: 0,
                duration: 1200,
                delay: i * 300,
                ease: 'Power2.easeOut',
                onComplete: () => wave.destroy()
            });
        }
    }
}