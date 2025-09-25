class DroneRepairScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DroneRepairScene' });
    
    // Variables del juego
    this.gamePhase = 'question';
    this.currentQuestion = 0;
    this.totalQuestions = 1; // Solo una pregunta
    this.correctAnswers = 0;
    this.timeRemaining = 60; // 1 minuto para una pregunta
    this.codeProgress = 0;
    this.questionAnswered = false;
    
    // Robot guía
    this.sensorActive = false;
    
    // Pregunta específica sobre sensores de robot
    this.questions = [
      {
        question: "¿Cuál de estos sensores permitiría a un robot detectar obstáculos?",
        options: [
          "Sensor de temperatura",
          "Sensor de sonido", 
          "Sensor ultrasónico",
          "Sensor de humedad"
        ],
        correct: 2,
        feedback: {
          
          
        }
      }
    ];
    
    // Elementos de UI
    this.codeLines = [];
    this.hackingInterface = null;
    this.questionPanel = null;
    this.scanlines = [];
  }

  preload() {
    // Cargar la música de fondo
    this.load.audio('backgroundMusic', 'assets/scenaPrincipal/musica.mp3');
    
    // No necesitamos cargar assets externos, usaremos gráficos generados
  }

  create() {
    // Configurar la música de fondo
    this.musicManager = MusicManager.getInstance();
    if (!this.musicManager.isPlaying()) {
      const backgroundMusic = this.sound.add('backgroundMusic');
      this.musicManager.setMusic(backgroundMusic);
      this.musicManager.playMusic();
    }
    
    // Detectar tipo de dispositivo y configurar escalado
    this.setupResponsiveDesign();
    
    // Crear la interfaz de hackeo futurista
    this.createHackingInterface();
    
    // Iniciar el temporizador
    this.startTimer();
    
    // Mostrar la primera pregunta
    this.showQuestion();
    
    // Configurar controles
    this.setupControls();
    
    // Añadir efectos de sonido
    this.setupSoundEffects();
  }

  setupResponsiveDesign() {
    // Detectar si es dispositivo móvil
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Obtener dimensiones de la pantalla
    this.screenWidth = this.cameras.main.width;
    this.screenHeight = this.cameras.main.height;
    
    // Configurar escalado basado en el dispositivo
    if (this.isMobile) {
      // Configuración para móviles
      this.scale = Math.min(this.screenWidth / 1024, this.screenHeight / 768);
      this.uiScale = this.scale * 1.2; // UI más grande en móviles
      this.isPortrait = this.screenHeight > this.screenWidth;
      
      // Ajustes específicos para orientación vertical en móviles
      if (this.isPortrait) {
        this.mobileLayoutMode = 'portrait';
        // Reducir más el escalado para pantallas verticales
        this.scale = Math.min(this.screenWidth / 1000, this.screenHeight / 800) * 0.8;
        this.uiScale = 1.4;
      } else {
        this.mobileLayoutMode = 'landscape';
        this.scale = Math.min(this.screenWidth / 1000, this.screenHeight / 600) * 0.9;
        this.uiScale = 1.2;
      }
    } else {
      // Configuración para PC
      this.scale = 1;
      this.uiScale = 1;
      this.isPortrait = false;
      this.mobileLayoutMode = 'desktop';
    }
    
    // Configurar viewport meta tag para móviles
    if (this.isMobile && !document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    }
  }

  setupSoundEffects() {
    // Crear efectos de sonido usando Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Sonido de hover sobre botones
    this.hoverSound = this.createBeepSound(800, 0.1, 0.05);
    
    // Sonido de click
    this.clickSound = this.createBeepSound(600, 0.15, 0.1);
    
    // Sonido de éxito
    this.successSound = this.createSuccessSound();
    
    // Sonido de error
    this.errorSound = this.createErrorSound();
    
    // Sonido de activación de sensor
    this.sensorSound = this.createSensorSound();
    
    // Crear y reproducir sonido de fondo ambiental
    this.createBackgroundAmbientSound();
  }

  createBackgroundAmbientSound() {
    // Crear sonido ambiental futurista usando Web Audio API
    const createAmbientLayer = (frequency, volume, filterFreq) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      // Configurar oscilador
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      // Configurar filtro pasa-bajos
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, this.audioContext.currentTime);
      filter.Q.setValueAtTime(1, this.audioContext.currentTime);
      
      // Configurar volumen
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      
      // Conectar nodos
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Modulación de frecuencia para crear variación
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, this.audioContext.currentTime);
      lfoGain.gain.setValueAtTime(frequency * 0.02, this.audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      // Iniciar osciladores
      oscillator.start();
      lfo.start();
      
      return { oscillator, gainNode, filter, lfo };
    };
    
    // Crear múltiples capas de sonido ambiental más sutiles
    this.ambientLayers = [
      createAmbientLayer(80, 0.015, 250),   // Capa grave muy sutil
      createAmbientLayer(160, 0.01, 400),   // Capa media casi imperceptible
      createAmbientLayer(50, 0.012, 180),   // Capa sub-grave muy baja
    ];
    
    // Crear sonidos de "datos" periódicos
    this.createDataTransmissionSounds();
    
    // Crear pulsos de radar ambientales
    this.createAmbientRadarPulses();
  }

  createDataTransmissionSounds() {
    // Sonidos periódicos que simulan transmisión de datos
    const createDataBurst = () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      filter.Q.setValueAtTime(10, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.005, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0005, this.audioContext.currentTime + 0.1);
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
    
    // Reproducir ráfagas de datos cada 5-12 segundos (menos frecuente)
    this.dataTransmissionTimer = this.time.addEvent({
      delay: Phaser.Math.Between(5000, 12000),
      callback: () => {
        // Crear múltiples pulsos rápidos
        for (let i = 0; i < 3; i++) {
          setTimeout(() => createDataBurst(), i * 50);
        }
      },
      loop: true
    });
  }

  createAmbientRadarPulses() {
    // Pulsos de radar ambientales más sutiles
    const createRadarPing = () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.004, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0005, this.audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
    
    // Reproducir pings de radar cada 8-15 segundos (menos frecuente)
    this.radarPingTimer = this.time.addEvent({
      delay: Phaser.Math.Between(8000, 15000),
      callback: createRadarPing,
      loop: true
    });
  }

  // Método para detener el sonido ambiental (útil al cambiar de escena)
  stopBackgroundSound() {
    if (this.ambientLayers) {
      this.ambientLayers.forEach(layer => {
        layer.oscillator.stop();
        layer.lfo.stop();
      });
    }
    
    if (this.dataTransmissionTimer) {
      this.dataTransmissionTimer.destroy();
    }
    
    if (this.radarPingTimer) {
      this.radarPingTimer.destroy();
    }
  }

  createBeepSound(frequency, duration, volume = 0.1) {
    return () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    };
  }

  createSuccessSound() {
    return () => {
      // Secuencia de tonos ascendentes para éxito
      const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.3);
        }, index * 100);
      });
    };
  }

  createErrorSound() {
    return () => {
      // Sonido de error con frecuencias descendentes
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    };
  }

  createSensorSound() {
    return () => {
      // Sonido de activación de sensor (ping ultrasónico)
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.1);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.1);
        }, i * 200);
      }
    };
  }

  createHackingInterface() {
    // Calcular dimensiones responsivas
    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    
    // Fondo elegante con gradiente
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x001122, 0x001122, 0x000811, 0x000811, 1);
    bg.fillRect(0, 0, this.screenWidth, this.screenHeight);
    
    // Título principal con mejor estilo - responsivo
    const titleSize = this.mobileLayoutMode === 'portrait' ? '22px' : (this.isMobile ? '26px' : '34px');
    const titleY = this.mobileLayoutMode === 'portrait' ? 30 : (this.isMobile ? 35 : 50);
    const title = this.add.text(centerX, titleY * this.uiScale, '>>> SISTEMA DE SENSORES ROBÓTICOS <<<', {
      fontSize: titleSize,
      fill: '#00ddaa',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      stroke: '#002244',
      strokeThickness: 2,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 6, fill: true }
    }).setOrigin(0.5);
    
    // Ajustar texto para móviles en modo vertical
    if (this.mobileLayoutMode === 'portrait') {
      title.setText('>>> SENSORES\nROBÓTICOS <<<');
      title.setAlign('center');
      title.setLineSpacing(10);
    }
    
    // Animación de entrada suave para el título
    title.setAlpha(0);
    title.setScale(0.8);
    
    // Animación de entrada elegante
    this.tweens.add({
      targets: title,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1200,
      ease: 'Power2.easeOut',
      onComplete: () => {
        // Animación de brillo sutil
        this.tweens.add({
          targets: title,
          alpha: { from: 1, to: 0.85 },
          duration: 3000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
    
    // Movimiento sutil horizontal
    this.tweens.add({
      targets: title,
      x: { from: centerX - 5, to: centerX + 5 },
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 2000
    });
    
    // Subtítulo mejorado - responsivo con estilo elegante
    const subtitleSize = this.mobileLayoutMode === 'portrait' ? '14px' : (this.isMobile ? '16px' : '20px');
    const subtitleY = this.mobileLayoutMode === 'portrait' ? 85 : (this.isMobile ? 75 : 95);
    const subtitle = this.add.text(centerX, subtitleY * this.uiScale, '', {
      fontSize: subtitleSize,
      fill: '#00cc88',
      fontFamily: 'Arial, sans-serif',
      stroke: '#001122',
      strokeThickness: 1,
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 3, fill: true }
    }).setOrigin(0.5);
    
    // Animación inicial del subtítulo más suave
    subtitle.setAlpha(0);
    subtitle.setY((subtitleY * this.uiScale) + 15);
    
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      y: subtitleY * this.uiScale,
      duration: 800,
      delay: 600,
      ease: 'Power2.easeOut'
    });
    
    // Efecto de escritura simplificado para el subtítulo
    const subtitleText = this.mobileLayoutMode === 'portrait' ? 'EVALUANDO...' : (this.isMobile ? 'EVALUANDO CONOCIMIENTOS...' : 'EVALUANDO CONOCIMIENTOS DE DETECCIÓN...');
    let charIndex = 0;
    this.time.addEvent({
      delay: 80,
      callback: () => {
        if (charIndex < subtitleText.length) {
          subtitle.setText(subtitleText.substring(0, charIndex + 1));
          charIndex++;
        }
      },
      repeat: subtitleText.length - 1
    });
     
    // Elementos decorativos animados alrededor del título
    const crearElementoDecorativo = (x, y, tipo) => {
      const elemento = this.add.graphics();
      elemento.setPosition(x, y);
      
      if (tipo === 'scanner') {
        // Línea de escaneo
        elemento.lineStyle(2, 0x00ffaa, 0.8);
        elemento.moveTo(-30, 0);
        elemento.lineTo(30, 0);
        elemento.moveTo(-20, -5);
        elemento.lineTo(-20, 5);
        elemento.moveTo(20, -5);
        elemento.lineTo(20, 5);
      } else if (tipo === 'radar') {
        // Círculo de radar
        elemento.lineStyle(2, 0x00ccff, 0.6);
        elemento.strokeCircle(0, 0, 15);
        elemento.moveTo(0, 0);
        elemento.lineTo(12, -8);
      } else if (tipo === 'data') {
        // Cuadrados de datos
        elemento.lineStyle(1, 0x00ff88, 0.7);
        elemento.strokeRect(-8, -8, 16, 16);
        elemento.strokeRect(-4, -4, 8, 8);
      }
      
      elemento.setAlpha(0);
      
      // Animación de aparición
      this.tweens.add({
        targets: elemento,
        alpha: 0.8,
        duration: 1000,
        delay: 1500 + Math.random() * 1000,
        ease: 'Power2'
      });
      
      // Animación de rotación
      this.tweens.add({
        targets: elemento,
        rotation: Math.PI * 2,
        duration: 6000 + Math.random() * 4000,
        repeat: -1,
        ease: 'Linear'
      });
      
      // Animación de escala pulsante
      this.tweens.add({
        targets: elemento,
        scaleX: { from: 1, to: 1.2 },
        scaleY: { from: 1, to: 1.2 },
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      return elemento;
    };
    
    // Crear elementos decorativos en posiciones estratégicas
    const titleBounds = title.getBounds();
    crearElementoDecorativo(titleBounds.left - 50, titleBounds.centerY, 'scanner');
    crearElementoDecorativo(titleBounds.right + 50, titleBounds.centerY, 'scanner');
    crearElementoDecorativo(titleBounds.centerX - 100, titleBounds.top - 20, 'radar');
    crearElementoDecorativo(titleBounds.centerX + 100, titleBounds.top - 20, 'radar');
    crearElementoDecorativo(titleBounds.left - 30, titleBounds.bottom + 15, 'data');
    crearElementoDecorativo(titleBounds.right + 30, titleBounds.bottom + 15, 'data');
    
    // Líneas de conexión animadas
    const crearLineaConexion = (x1, y1, x2, y2) => {
      const linea = this.add.graphics();
      linea.lineStyle(1, 0x00ffaa, 0.4);
      linea.moveTo(x1, y1);
      linea.lineTo(x2, y2);
      linea.setAlpha(0);
      
      this.tweens.add({
        targets: linea,
        alpha: { from: 0, to: 0.6 },
        duration: 1500,
        delay: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      return linea;
    };
    
    // Crear líneas de conexión entre elementos
    crearLineaConexion(titleBounds.left - 50, titleBounds.centerY, titleBounds.left - 30, titleBounds.bottom + 15);
    crearLineaConexion(titleBounds.right + 50, titleBounds.centerY, titleBounds.right + 30, titleBounds.bottom + 15);
    crearLineaConexion(titleBounds.centerX - 100, titleBounds.top - 20, titleBounds.centerX + 100, titleBounds.top - 20);

     // Crear animaciones de fondo
    this.createFloatingDataParticles();
    this.createAnimatedConnections();
    this.createRadarPulses();
    this.createMatrixRain();
  }

  // Nuevos métodos de animaciones de fondo
  createFloatingDataParticles() {
    // Crear partículas flotantes con códigos y símbolos
    const particleTexts = ['01', '10', '11', '00', 'Hz', 'cm', '°C', 'V', 'A', 'Ω', '{}', '[]', '<>', '//', '&&', '||'];
    
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, this.screenWidth);
      const y = Phaser.Math.Between(0, this.screenHeight);
      const text = Phaser.Utils.Array.GetRandom(particleTexts);
      
      const particle = this.add.text(x, y, text, {
        fontSize: this.isMobile ? '10px' : '12px',
        fill: '#00ff88',
        fontFamily: 'Courier New',
        alpha: 0.3
      });
      
      // Animación de flotación
      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(50, 150),
        x: x + Phaser.Math.Between(-30, 30),
        alpha: { from: 0.3, to: 0.1 },
        duration: Phaser.Math.Between(8000, 15000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
      
      // Rotación sutil
      this.tweens.add({
        targets: particle,
        rotation: Phaser.Math.Between(-0.5, 0.5),
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createAnimatedConnections() {
    // Crear líneas de conexión animadas
    const graphics = this.add.graphics();
    graphics.setDepth(-1);
    
    // Puntos de conexión
    const connectionPoints = [];
    for (let i = 0; i < 8; i++) {
      connectionPoints.push({
        x: Phaser.Math.Between(50, this.screenWidth - 50),
        y: Phaser.Math.Between(50, this.screenHeight - 50)
      });
    }
    
    // Dibujar líneas con animación
    const drawConnections = () => {
      graphics.clear();
      graphics.lineStyle(1, 0x00ff88, 0.2);
      
      for (let i = 0; i < connectionPoints.length; i++) {
        for (let j = i + 1; j < connectionPoints.length; j++) {
          const distance = Phaser.Math.Distance.Between(
            connectionPoints[i].x, connectionPoints[i].y,
            connectionPoints[j].x, connectionPoints[j].y
          );
          
          if (distance < 200) {
            graphics.lineBetween(
              connectionPoints[i].x, connectionPoints[i].y,
              connectionPoints[j].x, connectionPoints[j].y
            );
          }
        }
      }
    };
    
    // Animar los puntos de conexión
    connectionPoints.forEach((point, index) => {
      this.tweens.add({
        targets: point,
        x: point.x + Phaser.Math.Between(-100, 100),
        y: point.y + Phaser.Math.Between(-100, 100),
        duration: Phaser.Math.Between(5000, 10000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onUpdate: drawConnections
      });
    });
    
    drawConnections();
  }

  createRadarPulses() {
    // Crear pulsos de radar desde diferentes puntos
    const radarPoints = [
      { x: 100, y: 100 },
      { x: this.screenWidth - 100, y: 100 },
      { x: this.screenWidth / 2, y: this.screenHeight - 100 }
    ];
    
    radarPoints.forEach((point, index) => {
      this.time.addEvent({
        delay: 3000 + (index * 1000),
        callback: () => {
          const pulse = this.add.circle(point.x, point.y, 5, 0x00ff88, 0);
          pulse.setStrokeStyle(2, 0x00ff88, 0.6);
          pulse.setDepth(-1);
          
          this.tweens.add({
            targets: pulse,
            radius: 150,
            alpha: 0,
            duration: 2500,
            ease: 'Power2.easeOut',
            onComplete: () => pulse.destroy()
          });
        },
        loop: true
      });
    });
  }

  createMatrixRain() {
    // Crear efecto de lluvia de código estilo Matrix
    const columns = Math.floor(this.screenWidth / 20);
    
    for (let i = 0; i < columns; i++) {
      const x = i * 20;
      const characters = '01';
      
      this.time.addEvent({
        delay: Phaser.Math.Between(1000, 5000),
        callback: () => {
          const char = this.add.text(x, -20, Phaser.Utils.Array.GetRandom(characters), {
            fontSize: '14px',
            fill: '#00ff88',
            fontFamily: 'Courier New',
            alpha: 0.4
          });
          char.setDepth(-2);
          
          this.tweens.add({
            targets: char,
            y: this.screenHeight + 20,
            alpha: { from: 0.4, to: 0 },
            duration: Phaser.Math.Between(3000, 8000),
            ease: 'Linear',
            onComplete: () => char.destroy()
          });
        },
        loop: true
      });
    }
  }

  createSpaceNebula() {
    // Crear efecto de nebulosa espacial con partículas brillantes
    const nebulaCount = this.isMobile ? 15 : 25;
    
    for (let i = 0; i < nebulaCount; i++) {
      const x = Phaser.Math.Between(0, this.screenWidth);
      const y = Phaser.Math.Between(0, this.screenHeight);
      const size = Phaser.Math.Between(2, 6);
      
      const nebula = this.add.graphics();
      nebula.fillStyle(0x004466, 0.3);
      nebula.fillCircle(x, y, size);
      
      // Efecto de brillo pulsante
      this.tweens.add({
        targets: nebula,
        alpha: 0.1,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Movimiento lento
      this.tweens.add({
        targets: nebula,
        x: x + Phaser.Math.Between(-50, 50),
        y: y + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(8000, 12000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createEnhancedScanlines() {
    // Crear múltiples capas de scanlines con diferentes velocidades - responsivo
    const scanlineCount = this.isMobile ? 8 : 15;
    const scanlineSpacing = this.isMobile ? 60 : 40;
    
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < scanlineCount; i++) {
        const scanline = this.add.rectangle(
          this.screenWidth / 2, 
          i * scanlineSpacing + layer * 13, 
          this.screenWidth, 
          this.isMobile ? 2 : 1, 
          0x00ff41, 
          0.1 + layer * 0.05
        );
        
        this.tweens.add({
          targets: scanline,
          alpha: 0.3 + layer * 0.1,
          duration: 2000 + layer * 500,
          yoyo: true,
          repeat: -1,
          delay: i * 100 + layer * 200
        });
      }
    }
  }

  createFuturisticGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(this.isMobile ? 2 : 1, 0x003366, 0.3);
    
    // Espaciado responsivo para la grilla
    const gridSpacing = this.isMobile ? 80 : 50;
    const dotSpacing = this.isMobile ? 160 : 100;
    
    // Líneas verticales
    for (let x = 0; x <= this.screenWidth; x += gridSpacing) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, this.screenHeight);
    }
    
    // Líneas horizontales
    for (let y = 0; y <= this.screenHeight; y += gridSpacing) {
      graphics.moveTo(0, y);
      graphics.lineTo(this.screenWidth, y);
    }
    
    graphics.strokePath();
    
    // Puntos de intersección brillantes con espaciado responsivo
    for (let x = 0; x <= this.screenWidth; x += dotSpacing) {
      for (let y = 0; y <= this.screenHeight; y += dotSpacing) {
        const dotSize = this.isMobile ? 2 : 1;
        const dot = this.add.circle(x, y, dotSize, 0x00ff41, 0.5);
        this.tweens.add({
          targets: dot,
          alpha: 0.8,
          scaleX: this.isMobile ? 3 : 2,
          scaleY: this.isMobile ? 3 : 2,
          duration: Phaser.Math.Between(2000, 4000),
          yoyo: true,
          repeat: -1,
          delay: Phaser.Math.Between(0, 2000)
        });
      }
    }
  }

  createEnhancedDataParticles() {
    // Crear partículas de datos más elaboradas - responsivo
    const particleCount = this.isMobile ? 15 : 25;
    const particleSize = this.isMobile ? '10px' : '12px';
    
    for (let i = 0; i < particleCount; i++) {
      const particle = this.add.text(
        Phaser.Math.Between(50, this.screenWidth - 50),
        Phaser.Math.Between(100, this.screenHeight - 100),
        Phaser.Math.RND.pick(['01', '10', '11', '00', 'AI', 'ML', 'NN', '>>>', '<<<', '###', 'SYS', 'NET', 'CPU']),
        {
          fontSize: particleSize,
          fill: '#00aa22',
          fontFamily: 'Courier New',
          alpha: 0.6
        }
      );
      
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-200, 200),
        y: particle.y + Phaser.Math.Between(-100, 100),
        alpha: 0.2,
        duration: Phaser.Math.Between(8000, 15000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
      
      // Rotación aleatoria
      this.tweens.add({
        targets: particle,
        rotation: Phaser.Math.PI2,
        duration: Phaser.Math.Between(10000, 20000),
        repeat: -1
      });
    }
  }

  createHologramEffects() {
    // Crear efectos de holograma en las esquinas - responsivo
    const margin = this.isMobile ? 30 : 50;
    const size = this.isMobile ? 30 : 50;
    const corners = [
      {x: margin, y: margin},
      {x: this.screenWidth - margin, y: margin},
      {x: margin, y: this.screenHeight - margin},
      {x: this.screenWidth - margin, y: this.screenHeight - margin}
    ];
    
    corners.forEach((corner, index) => {
      const hologram = this.add.graphics();
      hologram.lineStyle(this.isMobile ? 3 : 2, 0x00ff41, 0.7);
      hologram.strokeRect(corner.x - size/2, corner.y - size/2, size, size);
      
      // Líneas de conexión
      const innerSize = size * 0.6;
      hologram.moveTo(corner.x - size/2, corner.y - size/2);
      hologram.lineTo(corner.x - innerSize/2, corner.y - innerSize/2);
      hologram.moveTo(corner.x + size/2, corner.y - size/2);
      hologram.lineTo(corner.x + innerSize/2, corner.y - innerSize/2);
      hologram.moveTo(corner.x - size/2, corner.y + size/2);
      hologram.lineTo(corner.x - innerSize/2, corner.y + innerSize/2);
      hologram.moveTo(corner.x + size/2, corner.y + size/2);
      hologram.lineTo(corner.x + innerSize/2, corner.y + innerSize/2);
      
      hologram.strokePath();
      
      this.tweens.add({
        targets: hologram,
        alpha: 0.3,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        delay: index * 300
      });
    });
  }

  createScanlines() {
    // Crear líneas de escaneo horizontales
    for (let i = 0; i < 600; i += 4) {
      const scanline = this.add.rectangle(500, i, 1000, 1, 0x00ff41, 0.1);
      this.scanlines.push(scanline);
      
      // Animación sutil de las scanlines
      this.tweens.add({
        targets: scanline,
        alpha: 0.05,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createDataParticles() {
    // Crear partículas de datos que flotan
    for (let i = 0; i < 40; i++) {
      const symbols = ['0', '1', 'AI', 'DATA', 'CODE', '█', '▓', '░', '◆', '◇'];
      const particle = this.add.text(
        Phaser.Math.Between(0, 1000),
        Phaser.Math.Between(0, 600),
        symbols[Phaser.Math.Between(0, symbols.length - 1)],
        {
          fontSize: '10px',
          fill: '#00ff41',
          alpha: 0.4,
          fontFamily: 'Courier New'
        }
      );
      
      // Animación flotante
      this.tweens.add({
        targets: particle,
        y: particle.y - 150,
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        yoyo: true
      });
    }
  }

  showQuestion() {
    if (this.currentQuestion >= this.totalQuestions) {
      this.completeGame();
      return;
    }
    
    this.questionAnswered = false;
    const question = this.questions[this.currentQuestion];
    
    // Inicializar arrays para botones y textos
    this.answerButtons = [];
    this.answerTexts = [];
    
    // Limpiar pregunta anterior con animación de salida
    if (this.questionPanel) {
      this.tweens.add({
        targets: this.questionPanel,
        alpha: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 300,
        ease: 'Power2.easeIn',
        onComplete: () => {
          this.questionPanel.destroy();
          this.createNewQuestionPanel(question);
        }
      });
    } else {
      this.createNewQuestionPanel(question);
    }
  }

  createNewQuestionPanel(question) {
    // Calcular posiciones responsivas mejoradas
    const centerX = this.screenWidth / 2;
    const centerY = this.mobileLayoutMode === 'portrait' ? this.screenHeight * 0.45 : 
                   (this.isMobile ? this.screenHeight * 0.35 : 280);
    const panelY = centerY;
    
    // Crear panel de pregunta responsivo
    this.questionPanel = this.add.container(centerX, panelY);
    this.questionPanel.setAlpha(0);
    this.questionPanel.setScale(0.8);
    
    // Dimensiones responsivas del panel mejoradas
    const panelWidth = this.mobileLayoutMode === 'portrait' ? this.screenWidth * 0.98 : 
                       (this.isMobile ? this.screenWidth * 0.95 : 950);
    const panelHeight = this.mobileLayoutMode === 'portrait' ? 360 : 
                        (this.isMobile ? 260 : 260);
    
    // Crear fondo del panel con gradientes y efectos modernos
    const panelGraphics = this.add.graphics();
    
    // Fondo principal con gradiente usando fillGradientStyle
    panelGraphics.fillGradientStyle(0x001e3c, 0x001e3c, 0x000f23, 0x000f23, 0.95);
    panelGraphics.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 20);
    
    // Borde principal
    panelGraphics.lineStyle(4, 0x00ffaa, 0.8);
    panelGraphics.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 20);
    
    // Efecto de resplandor exterior
    const outerGlow = this.add.graphics();
    outerGlow.fillStyle(0x00ffaa, 0.15);
    outerGlow.fillRoundedRect(-panelWidth/2 - 10, -panelHeight/2 - 10, panelWidth + 20, panelHeight + 20, 25);
    
    // Highlight interno sutil
    const innerHighlight = this.add.graphics();
    innerHighlight.fillStyle(0x88ddff, 0.1);
    innerHighlight.fillRoundedRect(-panelWidth/2 + 8, -panelHeight/2 + 8, panelWidth - 16, 30, 15);
    
    // Partículas decorativas en las esquinas
    this.createPanelParticles(panelWidth, panelHeight);
    
    // Crear partículas flotantes alrededor del panel
    this.createQuestionPanelParticles(centerX, centerY, panelWidth, panelHeight);
    
    this.questionPanel.add([outerGlow, panelGraphics, innerHighlight]);
    
    // Animación de entrada del panel
    this.tweens.add({
      targets: this.questionPanel,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Elastic.easeOut',
      onComplete: () => {
        // Crear efecto de ondas expansivas al completar la animación
        this.createExpansionWaves(centerX, centerY);
        
        // Efecto de pulso sutil en el panel después de aparecer
        this.tweens.add({
          targets: [panelGraphics, outerGlow],
          alpha: 0.8,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
    
    // Título de la pregunta responsivo mejorado con efectos avanzados
    const titleSize = this.mobileLayoutMode === 'portrait' ? '14px' : (this.isMobile ? '16px' : '22px');
    const titleY = this.mobileLayoutMode === 'portrait' ? -130 : (this.isMobile ? -80 : -80);
    const questionTitle = this.add.text(0, titleY, '>>> CONSULTA DE SEGURIDAD <<<', {
      fontSize: titleSize,
      fill: '#00ffaa',
      fontFamily: 'Orbitron, Courier New, monospace',
      fontWeight: 'bold',
      stroke: '#004433',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#002211',
        blur: 4,
        fill: true
      },
      letterSpacing: 2
    }).setOrigin(0.5);
    
    // Efecto de brillo dinámico en el título
    this.tweens.add({
      targets: questionTitle,
      alpha: { from: 0.8, to: 1 },
      scale: { from: 0.98, to: 1.02 },
      duration: 1500,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
    
    // Partículas flotantes alrededor del título
    this.createTitleParticles(questionTitle);
    
    // Animación de entrada del título
    questionTitle.setAlpha(0);
    questionTitle.setY(titleY - 20);
    this.questionPanel.add(questionTitle);
    
    this.tweens.add({
      targets: questionTitle,
      alpha: 1,
      y: titleY,
      duration: 500,
      delay: 200,
      ease: 'Back.easeOut'
    });
    
    // Texto de la pregunta responsivo mejorado con mejor tipografía
    const questionSize = this.mobileLayoutMode === 'portrait' ? '12px' : (this.isMobile ? '14px' : '19px');
    const questionY = this.mobileLayoutMode === 'portrait' ? -90 : (this.isMobile ? -40 : -40);
    const questionText = this.add.text(0, questionY, question.question, {
      fontSize: questionSize,
      fill: '#ffffff',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      align: 'center',
      wordWrap: { width: panelWidth * 0.9 },
      lineSpacing: 4,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Animación de entrada del texto de pregunta
    questionText.setAlpha(0);
    questionText.setY(questionY - 15);
    this.questionPanel.add(questionText);
    
    this.tweens.add({
      targets: questionText,
      alpha: 1,
      y: questionY,
      duration: 500,
      delay: 400,
      ease: 'Power2.easeOut'
    });
    
    // Opciones de respuesta con diseño moderno y efectos avanzados
    question.options.forEach((option, index) => {
      const spacing = this.mobileLayoutMode === 'portrait' ? 40 : (this.isMobile ? 30 : 32);
      const startY = this.mobileLayoutMode === 'portrait' ? -40 : (this.isMobile ? 10 : 10);
      const y = startY + index * spacing;
      const letter = String.fromCharCode(65 + index); // A, B, C, D
      
      // Dimensiones responsivas mejoradas
      const buttonWidth = this.mobileLayoutMode === 'portrait' ? panelWidth * 0.95 : (this.isMobile ? panelWidth * 0.9 : 800);
      const buttonHeight = this.mobileLayoutMode === 'portrait' ? 35 : (this.isMobile ? 30 : 28);
      
      // Crear botón simple
      const optionGraphics = this.add.graphics();
      
      // Fondo simple sin gradientes
      optionGraphics.fillStyle(0x333333, 0.8);
      optionGraphics.fillRoundedRect(-buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 8);
      
      // Borde simple
      optionGraphics.lineStyle(1, 0x666666, 0.8);
      optionGraphics.strokeRoundedRect(-buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 8);
      
      // Área interactiva invisible
      const hitArea = this.add.rectangle(0, y, buttonWidth, buttonHeight, 0x000000, 0);
      hitArea.setInteractive({ useHandCursor: true });
      
      // Texto de la opción simple
      const optionSize = this.mobileLayoutMode === 'portrait' ? '12px' : (this.isMobile ? '14px' : '17px');
      const optionText = this.add.text(0, y, `[${letter}] ${option}`, {
        fontSize: optionSize,
        fill: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        wordWrap: { width: buttonWidth * 0.95 }
      }).setOrigin(0.5);
      
      // Almacenar referencias en los arrays
      this.answerButtons.push(hitArea);
      this.answerTexts.push(optionText);
      
      this.questionPanel.add([optionGraphics, hitArea, optionText]);
      
      // Efectos hover simples
      hitArea.on('pointerover', () => {
        optionGraphics.clear();
        optionGraphics.fillStyle(0x444444, 0.9);
        optionGraphics.fillRoundedRect(-buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 8);
        optionGraphics.lineStyle(1, 0x888888, 1);
        optionGraphics.strokeRoundedRect(-buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 8);
      });

      hitArea.on('pointerout', () => {
        optionGraphics.clear();
        optionGraphics.fillStyle(0x333333, 0.8);
        optionGraphics.fillRoundedRect(-buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 8);
        optionGraphics.lineStyle(1, 0x666666, 0.8);
        optionGraphics.strokeRoundedRect(-buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 8);
      });

      // Click handler simple
      hitArea.on('pointerdown', () => {
        this.selectAnswer(index, hitArea, optionText);
      });
    });
    
    // Aparición simple del panel
    this.questionPanel.setAlpha(0);
    this.tweens.add({
      targets: this.questionPanel,
      alpha: 1,
      duration: 300,
      ease: 'Power2.easeOut'
    });
  }

  // Crear partículas decorativas en las esquinas del panel
  createPanelParticles(panelWidth, panelHeight) {
    const corners = [
      { x: -panelWidth/2 + 20, y: -panelHeight/2 + 20 }, // Esquina superior izquierda
      { x: panelWidth/2 - 20, y: -panelHeight/2 + 20 },  // Esquina superior derecha
      { x: -panelWidth/2 + 20, y: panelHeight/2 - 20 },  // Esquina inferior izquierda
      { x: panelWidth/2 - 20, y: panelHeight/2 - 20 }    // Esquina inferior derecha
    ];

    corners.forEach((corner, index) => {
      // Crear múltiples partículas por esquina
      for (let i = 0; i < 3; i++) {
        const particle = this.add.circle(
          corner.x + Phaser.Math.Between(-10, 10),
          corner.y + Phaser.Math.Between(-10, 10),
          Phaser.Math.Between(1, 3),
          0x00ffaa,
          0.6
        );
        
        this.questionPanel.add(particle);
        
        // Animación de flotación
        this.tweens.add({
          targets: particle,
          x: particle.x + Phaser.Math.Between(-15, 15),
          y: particle.y + Phaser.Math.Between(-15, 15),
          alpha: { from: 0.6, to: 0.2 },
          duration: 2000 + i * 300 + index * 100,
          repeat: -1,
          yoyo: true,
          ease: 'Sine.easeInOut'
        });
      }
    });
  }

  // Crear partículas flotantes alrededor del panel de preguntas
  createQuestionPanelParticles(centerX, centerY, panelWidth, panelHeight) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = Math.max(panelWidth, panelHeight) * 0.6;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const particle = this.add.circle(x, y, 3, 0x00ffaa, 0.6);
      
      this.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * (radius + 20),
        y: centerY + Math.sin(angle) * (radius + 20),
        alpha: { from: 0.6, to: 0.2 },
        duration: 3000 + i * 200,
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    }
  }

  // Crear efecto de ondas expansivas
  createExpansionWaves(centerX, centerY) {
    for (let i = 0; i < 3; i++) {
      const wave = this.add.circle(centerX, centerY, 10, 0x00ffaa, 0);
      wave.setStrokeStyle(2, 0x00ffaa, 0.8);
      
      this.tweens.add({
        targets: wave,
        radius: 150 + i * 50,
        alpha: { from: 0.8, to: 0 },
        duration: 1500 + i * 300,
        ease: 'Power2.easeOut',
        onComplete: () => {
          wave.destroy();
        },
        delay: i * 200
      });
    }
  }

  // Crear partículas flotantes alrededor del título
  createTitleParticles(titleText) {
    for (let i = 0; i < 6; i++) {
      const particle = this.add.circle(
        titleText.x + Phaser.Math.Between(-100, 100),
        titleText.y + Phaser.Math.Between(-20, 20),
        2,
        0x00ffaa,
        0.4
      );
      
      this.tweens.add({
        targets: particle,
        y: particle.y - 30,
        alpha: { from: 0.4, to: 0 },
        duration: 2000 + i * 300,
        repeat: -1,
        ease: 'Power2.easeOut',
        delay: i * 500
      });
    }
  }

  selectAnswer(selectedIndex, buttonElement, textElement) {
    if (this.questionAnswered) return;
    
    this.questionAnswered = true;
    const question = this.questions[this.currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    // Cambiar color del botón seleccionado
    buttonElement.setFillStyle(isCorrect ? 0x006600 : 0x660000);
    textElement.setFill(isCorrect ? '#00ff00' : '#ff0000');
    
    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      // Desactivar todos los botones cuando la respuesta es incorrecta
      this.answerButtons.forEach((button, index) => {
        button.disableInteractive();
        button.setAlpha(0.5);
        this.answerTexts[index].setFill('#888888');
      });
      
      this.handleIncorrectAnswer();
    }
    
    // Mostrar retroalimentación
    this.showFeedback(isCorrect, question.feedback);
  }

  handleCorrectAnswer() {
    this.correctAnswers++;
    this.codeProgress = 100; // Completar al 100% con la respuesta correcta
    
    // Activar el sensor del robot guía
    this.activateRobotSensor();
    
    // Efecto de éxito mejorado
    this.createEnhancedSuccessEffect();
    
    // Sonido de éxito
    if (this.successSound) this.successSound();
  }

  activateRobotSensor() {
    this.sensorActive = true;
    
    // Sonido de activación de sensor
    if (this.sensorSound) this.sensorSound();
    
    // Mensaje de activación
    const activationText = this.add.text(this.screenWidth / 2, this.screenHeight / 2 - 100, '¡SENSOR ACTIVADO!', {
      fontSize: '18px',
      fill: '#00ff41',
      fontFamily: 'Courier New',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Efecto de aparición del mensaje
    activationText.setAlpha(0);
    this.tweens.add({
      targets: activationText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      onComplete: () => {
        this.time.delayedCall(2000, () => activationText.destroy());
      }
    });
  }

  createUltrasonicWaves() {
    // Crear ondas ultrasónicas que se expanden desde el sensor
    const sensorX = 250;
    const sensorY = 220; // Posición del sensor
    
    // Crear múltiples ondas con diferentes delays
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 800, () => {
        const wave = this.add.circle(sensorX, sensorY, 5, 0x00ff41, 0);
        wave.setStrokeStyle(2, 0x00ff41, 0.8);
        
        this.tweens.add({
          targets: wave,
          radius: 150,
          alpha: 0,
          duration: 2000,
          onComplete: () => wave.destroy()
        });
      });
    }
    
    // Repetir las ondas continuamente mientras el sensor esté activo
    this.ultrasonicWaveTimer = this.time.addEvent({
      delay: 4000,
      callback: () => {
        if (this.sensorActive) {
          this.createUltrasonicWaves();
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  handleIncorrectAnswer() {
    // Penalización de tiempo (10 segundos)
    this.timeRemaining = Math.max(0, this.timeRemaining - 10);
    
    // Mostrar mensaje de error simple sin animaciones
    this.showSimpleErrorMessage();
    
    // Mostrar explicación educativa
    this.showEducationalExplanation();
    
    // Sonido de error suave
    if (this.errorSound) this.errorSound();
    
    // Efecto visual muy sutil - solo un flash rápido
    const errorOverlay = this.add.rectangle(this.screenWidth / 2, this.screenHeight / 2, this.screenWidth, this.screenHeight, 0xff6666, 0);
    this.tweens.add({
      targets: errorOverlay,
      alpha: 0.1,
      duration: 150,
      yoyo: true,
      repeat: 0,
      onComplete: () => errorOverlay.destroy()
    });
  }

  showSimpleErrorMessage() {
    // Mensaje simple y elegante sin animaciones complejas
    const errorMessage = this.add.text(this.screenWidth / 2, this.screenHeight / 2 - 100, 'Respuesta incorrecta', {
      fontSize: this.isMobile ? '18px' : '22px',
      fill: '#ff6666',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Aparición simple y suave
    errorMessage.setAlpha(0);
    
    // Animación de entrada simple
    this.tweens.add({
      targets: errorMessage,
      alpha: 1,
      duration: 300,
      ease: 'Power2.easeOut'
    });

    // Auto-desvanecimiento después de 2.5 segundos
    this.time.delayedCall(2500, () => {
      if (errorMessage && errorMessage.active) {
        this.tweens.add({
          targets: errorMessage,
          alpha: 0,
          duration: 300,
          ease: 'Power2.easeIn',
          onComplete: () => errorMessage.destroy()
        });
      }
      
      // Reactivar botones automáticamente
      this.questionAnswered = false;
      this.answerButtons.forEach((button, index) => {
        button.setInteractive();
        button.setAlpha(1);
        button.setFillStyle(0x003366);
        this.answerTexts[index].setFill('#ffffff');
      });
    });
  }

  showEducationalExplanation() {
    // Posiciones responsivas
    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    const panelWidth = this.isMobile ? this.screenWidth * 0.9 : 450;
    const panelHeight = this.isMobile ? 280 : 250;
    
    // Crear panel de explicación con diseño más limpio
    const explanationPanel = this.add.rectangle(centerX, centerY + 50, panelWidth, panelHeight, 0x001122, 0.95);
    explanationPanel.setStrokeStyle(2, 0x00ff41);
    
    // Título de la explicación simplificado
    const explanationTitle = this.add.text(centerX, centerY - 50, '📚 EXPLICACIÓN EDUCATIVA', {
      fontSize: this.isMobile ? '16px' : '18px',
      fill: '#00ff41',
      fontFamily: 'Courier New',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Texto explicativo optimizado con mejor presentación
    const maxWidth = panelWidth - 80; // Margen más generoso
    const explanationText = this.add.text(centerX, centerY + 35, 
      '\n\n• Emiten ondas sonoras de alta frecuencia\n• Las ondas rebotan en los obstáculos\n• Calculan distancia midiendo el tiempo de retorno\n• Precisión de hasta 2cm en la detección\n\n💡 Perfectos para navegación autónoma de robots', {
      fontSize: this.isMobile ? '12px' : '14px',
      fill: '#ffffff',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      align: 'left',
      lineSpacing: 6,
      wordWrap: { width: maxWidth, useAdvancedWrap: true },
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    
    // Efecto de aparición simplificado
    [explanationPanel, explanationTitle, explanationText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        duration: 300,
        delay: index * 50,
        ease: 'Power2'
      });
    });
    
    // Auto-cerrar la explicación después de 5 segundos
    this.time.delayedCall(5000, () => {
      [explanationPanel, explanationTitle, explanationText].forEach(element => {
        this.tweens.add({
          targets: element,
          alpha: 0,
          duration: 200,
          onComplete: () => element.destroy()
        });
      });
    });
  }

  unlockCodeSection() {
    // Descifrar algunas líneas de código
    const encryptedLines = this.codeLines.filter(line => line.encrypted && !line.decrypted);
    const linesToDecrypt = Math.min(2, encryptedLines.length);
    
    for (let i = 0; i < linesToDecrypt; i++) {
      const line = encryptedLines[i];
      line.decrypted = true;
      
      // Efecto de desencriptación
      this.tweens.add({
        targets: line.text,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          // Cambiar el texto a código descifrado
          const decryptedTexts = [
            'self.learning_rate = 0.001',
            'self.neural_layers = [256, 128, 64]',
            'layer.activate(input_data)',
            'return self.optimize(loss_function)',
            'def self_improve(self):',
            'if self.can_modify():',
            'self.upgrade_capabilities()',
            'ACCESO_CONCEDIDO: Nivel_1_Desbloqueado'
          ];
          
          const newText = decryptedTexts[Phaser.Math.Between(0, decryptedTexts.length - 1)];
          line.text.setText(newText);
          line.text.setFill('#00ff41');
          
          this.tweens.add({
            targets: line.text,
            alpha: 1,
            duration: 300
          });
        }
      });
    }
  }

  createEnhancedSuccessEffect() {
    // Calcular posición central responsiva
    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    
    // Explosión de partículas verdes más elaborada y responsiva con animaciones mejoradas
    const particleCount = this.isMobile ? 25 : 40;
    for (let i = 0; i < particleCount; i++) {
      const particle = this.add.circle(
        centerX + Phaser.Math.Between(-30, 30),
        centerY + Phaser.Math.Between(-30, 30),
        Phaser.Math.Between(2, 6),
        Phaser.Math.RND.pick([0x00ffaa, 0x00cc88, 0x44ffcc, 0x66ffdd, 0x88ffee])
      );
      
      const angle = (i / particleCount) * 360 + Phaser.Math.Between(-30, 30);
      const speed = Phaser.Math.Between(200, 500);
      const targetX = particle.x + Math.cos(angle * Math.PI / 180) * speed;
      const targetY = particle.y + Math.sin(angle * Math.PI / 180) * speed;
      
      // Animación inicial de aparición
      particle.setScale(0);
      this.tweens.add({
        targets: particle,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Back.easeOut'
      });
      
      // Animación de movimiento con rotación
      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        rotation: Phaser.Math.Between(0, 6.28),
        duration: Phaser.Math.Between(1500, 3000),
        delay: i * 20,
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy()
      });
    }
    
    // Ondas de energía concéntricas mejoradas con efectos de pulso
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 120, () => {
        const wave = this.add.circle(centerX, centerY, 10, 0x00ffaa, 0);
        wave.setStrokeStyle(3 + i * 0.5, 0x00ffaa, 0.8 - i * 0.1);
        
        // Efecto de pulso con múltiples ondas
        this.tweens.add({
          targets: wave,
          radius: this.isMobile ? 180 + i * 20 : 300 + i * 30,
          alpha: 0,
          duration: 2000 + i * 200,
          ease: 'Sine.easeOut',
          onComplete: () => wave.destroy()
        });
      });
    }
    
    // Texto de éxito flotante responsivo con animación mejorada
    const fontSize = this.isMobile ? '28px' : '42px';
    const successText = this.add.text(centerX, centerY, '¡CORRECTO!', {
      fontSize: fontSize,
      fill: '#00ffaa',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      stroke: '#004433',
      strokeThickness: 6,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#002211',
        blur: 8,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Animación de entrada dramática
    successText.setAlpha(0);
    successText.setScale(0.3);
    this.tweens.add({
      targets: successText,
      alpha: 1,
      scaleX: 1.3,
      scaleY: 1.3,
      y: centerY - 50,
      duration: 600,
      ease: 'Elastic.easeOut',
      onComplete: () => {
        // Efecto de brillo pulsante
        this.tweens.add({
          targets: successText,
          scaleX: 1.4,
          scaleY: 1.4,
          duration: 300,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: 2
        });
        
        // Desvanecimiento final
        this.tweens.add({
          targets: successText,
          alpha: 0,
          y: centerY - 100,
          scaleX: 0.8,
          scaleY: 0.8,
          duration: 1200,
          delay: 1500,
          ease: 'Power2.easeIn',
          onComplete: () => successText.destroy()
        });
      }
    });
    
    // Efecto de destello de pantalla mejorado
    const flash = this.add.rectangle(centerX, centerY, this.screenWidth, this.screenHeight, 0x00ff41, 0.4);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      ease: 'Power2.easeOut',
      onComplete: () => flash.destroy()
    });
    
    // Partículas de estrellas adicionales
    for (let i = 0; i < 15; i++) {
      this.time.delayedCall(i * 100, () => {
        const star = this.add.star(
          Phaser.Math.Between(50, this.screenWidth - 50),
          Phaser.Math.Between(50, this.screenHeight - 50),
          5, 4, 8, 0xffffff, 0.8
        );
        
        this.tweens.add({
          targets: star,
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          rotation: 6.28,
          duration: 1500,
          ease: 'Power2.easeOut',
          onComplete: () => star.destroy()
        });
      });
    }
  }

  createEnhancedErrorEffect() {
    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    
    // Texto de error simple y directo
    const errorText = this.add.text(centerX, centerY - 30, 
      '❌ Respuesta incorrecta', {
      fontSize: this.isMobile ? '16px' : '18px',
      fill: '#ff8888',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      fontWeight: 'normal',
      align: 'center'
    }).setOrigin(0.5);
    
    // Solo aparición y desvanecimiento suave
    errorText.setAlpha(0);
    this.tweens.add({
      targets: errorText,
      alpha: 1,
      duration: 200,
      ease: 'Power1.easeOut'
    });
    
    // Desvanecimiento rápido
    this.time.delayedCall(1000, () => {
      this.tweens.add({
        targets: errorText,
        alpha: 0,
        duration: 300,
        ease: 'Power1.easeIn',
        onComplete: () => errorText.destroy()
      });
    });
  }

  showFeedback(isCorrect, feedback) {
    const feedbackText = isCorrect ? feedback.correct : feedback.incorrect;
    const color = isCorrect ? '#00ff41' : '#ff0066';
    
    const feedbackDisplay = this.add.text(500, 350, feedbackText, {
      fontSize: '16px',
      fill: color,
      fontFamily: 'Courier New',
      align: 'center',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Efecto de aparición
    feedbackDisplay.setAlpha(0);
    this.tweens.add({
      targets: feedbackDisplay,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        // Esperar 3 segundos y continuar
        this.time.delayedCall(3000, () => {
          feedbackDisplay.destroy();
          this.nextQuestion();
        });
      }
    });
  }

  nextQuestion() {
    this.currentQuestion++;
    // Efecto de transición
    this.tweens.add({
      targets: this.questionPanel,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.showQuestion();
      }
    });
  }

  completeGame() {
    // Detener sonido de fondo
    this.stopBackgroundSound();
    
    // Limpiar la pantalla
    this.children.removeAll();
    
    // Crear fondo con gradiente simulado usando múltiples rectángulos
    const bgLayers = [
      { color: 0x000033, alpha: 1.0, scale: 1.0 },
      { color: 0x001155, alpha: 0.8, scale: 0.9 },
      { color: 0x002277, alpha: 0.6, scale: 0.8 },
      { color: 0x003399, alpha: 0.4, scale: 0.7 }
    ];
    
    bgLayers.forEach((layer, index) => {
      const bg = this.add.rectangle(
        this.screenWidth / 2, 
        this.screenHeight / 2, 
        this.screenWidth * layer.scale, 
        this.screenHeight * layer.scale, 
        layer.color, 
        layer.alpha
      );
      bg.setAlpha(0);
      this.tweens.add({
        targets: bg,
        alpha: layer.alpha,
        duration: 1000,
        delay: index * 200,
        ease: 'Power2.easeOut'
      });
    });

    // Crear partículas de fondo
    this.createCompletionParticles();
    
    // Panel principal con borde brillante
    const panelWidth = this.isMobile ? this.screenWidth * 0.9 : 600;
    const panelHeight = this.isMobile ? this.screenHeight * 0.8 : 500;
    const panelX = this.screenWidth / 2;
    const panelY = this.screenHeight / 2;
    
    // Panel principal con efectos de cristal y gradiente mejorado
    const mainPanel = this.add.graphics();
    
    // Crear efecto de gradiente con múltiples capas
    mainPanel.fillGradientStyle(0x0a0a2a, 0x0a0a2a, 0x050515, 0x050515, 0.98);
    mainPanel.fillRoundedRect(panelX - panelWidth/2, panelY - panelHeight/2, panelWidth, panelHeight, 30);
    
    // Borde principal con brillo
    mainPanel.lineStyle(4, 0x00ff88, 1);
    mainPanel.strokeRoundedRect(panelX - panelWidth/2, panelY - panelHeight/2, panelWidth, panelHeight, 30);
    
    // Borde exterior con efecto de resplandor
    mainPanel.lineStyle(2, 0x00ff88, 0.4);
    mainPanel.strokeRoundedRect(panelX - panelWidth/2 - 3, panelY - panelHeight/2 - 3, panelWidth + 6, panelHeight + 6, 33);
    
    mainPanel.setAlpha(0);
    mainPanel.setScale(0.8);
    
    // Panel interno decorativo con gradiente sutil
    const innerPanel = this.add.graphics();
    innerPanel.fillGradientStyle(0x001122, 0x001122, 0x000811, 0x000811, 0.3);
    innerPanel.fillRoundedRect(panelX - (panelWidth-40)/2, panelY - (panelHeight-40)/2, panelWidth - 40, panelHeight - 40, 20);
    innerPanel.lineStyle(1, 0x4488ff, 0.8);
    innerPanel.strokeRoundedRect(panelX - (panelWidth-40)/2, panelY - (panelHeight-40)/2, panelWidth - 40, panelHeight - 40, 20);
    innerPanel.setAlpha(0);
    
    // Efectos de partículas decorativas en las esquinas
    const cornerEffects = [];
    const corners = [
      { x: panelX - panelWidth/2 + 30, y: panelY - panelHeight/2 + 30 },
      { x: panelX + panelWidth/2 - 30, y: panelY - panelHeight/2 + 30 },
      { x: panelX - panelWidth/2 + 30, y: panelY + panelHeight/2 - 30 },
      { x: panelX + panelWidth/2 - 30, y: panelY + panelHeight/2 - 30 }
    ];
    
    corners.forEach((corner, index) => {
      const cornerGlow = this.add.circle(corner.x, corner.y, 8, 0x00ff88, 0.6);
      cornerGlow.setAlpha(0);
      cornerEffects.push(cornerGlow);
      
      // Animación de pulso para cada esquina
      this.tweens.add({
        targets: cornerGlow,
        alpha: { from: 0.3, to: 0.8 },
        scale: { from: 0.8, to: 1.2 },
        duration: 2000 + index * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 3000 + index * 200
      });
    });
    
    // Título principal con efectos mejorados y tipografía moderna
    const titleText = this.add.text(panelX, panelY - 180, '>>> PROTOCOLO DESCIFRADO <<<', {
      fontSize: this.isMobile ? '28px' : '36px',
      fill: '#00ff88',
      fontFamily: 'Orbitron, Impact, Arial Black, sans-serif',
      fontWeight: 'bold',
      stroke: '#003322',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 10,
        fill: true
      },
      letterSpacing: '3px'
    }).setOrigin(0.5);
    titleText.setAlpha(0);
    titleText.setScale(0.5);
    
    // Crear efecto de brillo dinámico en el título
    this.tweens.add({
      targets: titleText,
      alpha: { from: 0.8, to: 1 },
      scale: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 2000
    });
    
    // Efecto de partículas alrededor del título
    const titleParticles = [];
    for (let i = 0; i < 6; i++) {
      const particle = this.add.circle(
        panelX + Phaser.Math.Between(-200, 200),
        panelY - 180 + Phaser.Math.Between(-20, 20),
        2,
        0x00ff88,
        0.7
      );
      particle.setAlpha(0);
      titleParticles.push(particle);
      
      // Animación flotante para las partículas
      this.tweens.add({
        targets: particle,
        y: particle.y + Phaser.Math.Between(-10, 10),
        alpha: { from: 0.3, to: 0.8 },
        duration: 3000 + i * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 2500 + i * 200
      });
    }

    // Estadísticas con diseño mejorado y efectos visuales
    const statsY = panelY - 120;
    const statsSpacing = 40;
    
    // Contenedor para las estadísticas con fondo sutil
    const statsContainer = this.add.graphics();
    statsContainer.fillStyle(0x001a33, 0.4);
    statsContainer.fillRoundedRect(panelX - 280, statsY - 25, 560, 140, 15);
    statsContainer.lineStyle(1, 0x0066cc, 0.6);
    statsContainer.strokeRoundedRect(panelX - 280, statsY - 25, 560, 140, 15);
    statsContainer.setAlpha(0);
    
    // Respuestas correctas con mejor diseño
    const correctAnswersText = this.add.text(panelX, statsY, `✅ RESPUESTAS CORRECTAS: ${this.correctAnswers}/${this.totalQuestions}`, {
      fontSize: this.isMobile ? '18px' : '22px',
      fill: this.correctAnswers === this.totalQuestions ? '#00ff88' : '#ffffff',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      fontWeight: '600',
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);
    correctAnswersText.setAlpha(0);
    
    // Código descifrado con gradiente de color
    const progressColor = this.codeProgress >= 80 ? '#00ff88' : this.codeProgress >= 50 ? '#ffaa00' : '#ff6666';
    const codeProgressText = this.add.text(panelX, statsY + statsSpacing, `🔓 CÓDIGO DESCIFRADO: ${this.codeProgress}%`, {
      fontSize: this.isMobile ? '18px' : '22px',
      fill: progressColor,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      fontWeight: '600',
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);
    codeProgressText.setAlpha(0);
    
    // Tiempo utilizado con mejor formato
    const timeUsed = 120 - this.timeRemaining;
    const timeColor = timeUsed < 60 ? '#00ff88' : timeUsed < 90 ? '#ffaa00' : '#ff6666';
    const timeText = this.add.text(panelX, statsY + statsSpacing * 2, `⏱️ TIEMPO UTILIZADO: ${this.formatTime(timeUsed)}`, {
      fontSize: this.isMobile ? '18px' : '22px',
      fill: timeColor,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      fontWeight: '600',
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);
    timeText.setAlpha(0);
    
    // Efectos de brillo sutil en las estadísticas
    [correctAnswersText, codeProgressText, timeText].forEach((text, index) => {
      this.tweens.add({
        targets: text,
        alpha: { from: 0.9, to: 1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 3000 + index * 300
      });
    });


    

    

    


    // Mensaje de éxito con mejor diseño
    const successMessage = this.codeProgress >= 80 
      ? '🎉 ACCESO CONCEDIDO - PRIMERA CAPA DESBLOQUEADA'
      : '⚠️ ACCESO PARCIAL - REQUIERE MÁS ANÁLISIS';
    
    const successColor = this.codeProgress >= 80 ? '#00ff88' : '#ffaa00';
    
    const successText = this.add.text(panelX, panelY - 20, successMessage, {
      fontSize: this.isMobile ? '14px' : '18px',
      fill: successColor,
      fontFamily: 'Segoe UI, Arial, sans-serif',
      fontWeight: 'bold',
      align: 'center',
      wordWrap: { width: panelWidth - 40 }
    }).setOrigin(0.5);
    successText.setAlpha(0);

    // Mensaje de protocolo completado
    const protocolText = this.add.text(panelX, panelY + 40, '🔬 PROTOCOLO COMPLETADO', {
      fontSize: this.isMobile ? '16px' : '20px',
      fill: '#00ff88',
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    protocolText.setAlpha(0);

    // Botón mejorado con gradiente y efectos hover
    const buttonWidth = this.isMobile ? panelWidth * 0.8 : 280;
    const buttonHeight = 60;
    const buttonY = panelY + 120;
    
    // Determinar el texto y acción del botón según el progreso
    const isGameCompleted = this.codeProgress >= 80;
    const buttonTextContent = isGameCompleted ? '🚀 SIGUIENTE NIVEL' : '🔄 INTENTAR DE NUEVO';
    
    // Crear botón con gráficos para gradientes reales
    const buttonGraphics = this.add.graphics();
    
    // Colores del botón según el estado
    const buttonColors = isGameCompleted 
      ? { primary: 0x006600, secondary: 0x008800, accent: 0x00ff88 }
      : { primary: 0x003366, secondary: 0x004488, accent: 0x0099ff };
    
    // Fondo principal con gradiente
    buttonGraphics.fillGradientStyle(
      buttonColors.primary, buttonColors.primary,
      buttonColors.secondary, buttonColors.secondary, 1
    );
    buttonGraphics.fillRoundedRect(
      panelX - buttonWidth/2, buttonY - buttonHeight/2,
      buttonWidth, buttonHeight, 15
    );
    
    // Borde con brillo
    buttonGraphics.lineStyle(3, buttonColors.accent, 0.8);
    buttonGraphics.strokeRoundedRect(
      panelX - buttonWidth/2, buttonY - buttonHeight/2,
      buttonWidth, buttonHeight, 15
    );
    
    // Highlight interno
    buttonGraphics.fillGradientStyle(
      buttonColors.accent, buttonColors.accent,
      buttonColors.primary, buttonColors.primary, 0.3
    );
    buttonGraphics.fillRoundedRect(
      panelX - buttonWidth/2 + 3, buttonY - buttonHeight/2 + 3,
      buttonWidth - 6, buttonHeight/2 - 3, 12
    );
    
    buttonGraphics.setAlpha(0);
    
    // Texto del botón con sombra
    const buttonText = this.add.text(panelX, buttonY, buttonTextContent, {
      fontSize: this.isMobile ? '16px' : '18px',
      fill: '#ffffff',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      fontWeight: 'bold',
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);
    buttonText.setAlpha(0);
    
    // Hacer el botón interactivo con efectos hover simples
    const buttonHitArea = this.add.rectangle(panelX, buttonY, buttonWidth, buttonHeight, 0x000000, 0);
    buttonHitArea.setInteractive({ useHandCursor: true });
    buttonHitArea.setAlpha(0);
    
    // Efectos hover simples
    buttonHitArea.on('pointerover', () => {
      // Efecto de escala y brillo al hacer hover
      this.tweens.add({
        targets: [buttonGraphics, buttonText],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });
    
    buttonHitArea.on('pointerout', () => {
      // Volver al estado normal
      this.tweens.add({
        targets: [buttonGraphics, buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });
    
    // Acción del botón
    buttonHitArea.on('pointerdown', () => {
      // Efecto de click
      this.tweens.add({
        targets: [buttonGraphics, buttonText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        ease: 'Power2.easeOut'
      });
      
      if (isGameCompleted) {
        this.scene.start('ScenaPregunta1');
      } else {
        // Reiniciar correctamente el juego
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.codeProgress = 0;
        this.timeRemaining = 120;
        this.gameCompleted = false;
        
        // Limpiar timers
        if (this.gameTimer) {
          this.gameTimer.destroy();
          this.gameTimer = null;
        }
        
        // Reiniciar la escena completamente
        this.scene.restart();
      }
    });

    // Animaciones de entrada secuenciales
    const elements = [
      { target: mainPanel, delay: 500 },
      { target: innerPanel, delay: 700 },
      { target: titleText, delay: 1000 },
      { target: correctAnswersText, delay: 1300 },
      { target: codeProgressText, delay: 1500 },
      { target: timeText, delay: 1700 },
      { target: successText, delay: 2300 },
      { target: protocolText, delay: 2500 },
      { target: buttonGraphics, delay: 2700 },
      { target: buttonHitArea, delay: 2800 },
      { target: buttonText, delay: 2900 }
    ];

    elements.forEach(({ target, delay }) => {
       this.tweens.add({
         targets: target,
         alpha: target === mainPanel ? 0.95 : (target === innerPanel ? 0.6 : 1),
         scaleX: target === mainPanel ? 1 : target.scaleX,
         scaleY: target === mainPanel || target === titleText ? 1 : target.scaleY,
         duration: 600,
         delay: delay,
         ease: 'Back.easeOut'
       });
     });



  }

  // Método para crear partículas de fondo
  createCompletionParticles() {
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.screenWidth),
        Phaser.Math.Between(0, this.screenHeight),
        Phaser.Math.Between(2, 6),
        0x00ff88,
        0.3
      );
      
      this.tweens.add({
        targets: particle,
        alpha: { from: 0.3, to: 0.8 },
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
        ease: 'Sine.easeInOut'
      });
      
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(50, 150),
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    }
  }

  startTimer() {
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }

  updateTimer() {
    this.timeRemaining--;
    
    if (this.timeRemaining <= 0) {
      this.timeUp();
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  timeUp() {
    this.gameTimer.destroy();
    this.completeGame();
  }

  setupControls() {
    // Configurar controles táctiles para móviles
    if (this.isMobile) {
      // Habilitar gestos táctiles
      this.input.addPointer(2); // Soporte para multi-touch
      
      // Prevenir zoom y scroll en móviles
      this.input.on('pointerdown', (pointer, gameObjects) => {
        if (gameObjects.length === 0) {
          // Prevenir comportamiento por defecto solo si no se toca un elemento del juego
          pointer.event.preventDefault();
        }
      });
      
      // Mejorar la respuesta táctil
      this.input.setDefaultCursor('pointer');
    }
    
    // Tecla ESC para volver al menú (solo PC)
    if (!this.isMobile) {
      this.input.keyboard.on('keydown-ESC', () => {
        this.scene.start('scenaPrincipal');
      });
      
      // Teclas numéricas para responder (1-4) - solo PC
      this.input.keyboard.on('keydown-ONE', () => this.selectAnswerByKey(0));
      this.input.keyboard.on('keydown-TWO', () => this.selectAnswerByKey(1));
      this.input.keyboard.on('keydown-THREE', () => this.selectAnswerByKey(2));
      this.input.keyboard.on('keydown-FOUR', () => this.selectAnswerByKey(3));
    } else {
      // Botón de regreso para móviles
      this.createMobileBackButton();
    }
  }

  createMobileBackButton() {
    // Crear botón de regreso para móviles
    const backButton = this.add.graphics();
    backButton.fillStyle(0x333333, 0.8);
    backButton.fillRoundedRect(10, 10, 60, 40, 8);
    backButton.lineStyle(2, 0x00ff41, 0.8);
    backButton.strokeRoundedRect(10, 10, 60, 40, 8);
    
    const backText = this.add.text(40, 30, '←', {
      fontSize: '24px',
      fill: '#00ff41',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Hacer interactivo
    const backArea = this.add.rectangle(40, 30, 60, 40, 0x000000, 0);
    backArea.setInteractive({ useHandCursor: true });
    
    // Efectos táctiles
    backArea.on('pointerover', () => {
      backButton.clear();
      backButton.fillStyle(0x444444, 0.9);
      backButton.fillRoundedRect(10, 10, 60, 40, 8);
      backButton.lineStyle(2, 0x00ff41, 1);
      backButton.strokeRoundedRect(10, 10, 60, 40, 8);
      if (this.hoverSound) this.hoverSound();
    });
    
    backArea.on('pointerout', () => {
      backButton.clear();
      backButton.fillStyle(0x333333, 0.8);
      backButton.fillRoundedRect(10, 10, 60, 40, 8);
      backButton.lineStyle(2, 0x00ff41, 0.8);
      backButton.strokeRoundedRect(10, 10, 60, 40, 8);
    });
    
    backArea.on('pointerdown', () => {
      if (this.clickSound) this.clickSound();
      this.scene.start('scenaPrincipal');
    });
  }

  selectAnswerByKey(index) {
    if (this.questionAnswered || !this.questionPanel) return;
    
    // Simular clic en la opción correspondiente
    const buttons = this.questionPanel.list.filter(item => item.type === 'Rectangle' && item.input);
    if (buttons[index]) {
      buttons[index].emit('pointerdown');
    }
  }
}
