class Rompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "Rompecabezas" });
    
    // Estado del juego
    this.gameState = 'intro'; // intro, neural_puzzle, ai_dialogue, ethical_choice, completed
    this.currentPhase = 1;
    this.playerChoices = [];
    this.neuralNetworkNodes = [];
    this.connections = [];
    this.aiPersonality = 'neutral'; // neutral, friendly, hostile
    
    // Estadísticas del juego
    this.startTime = null;
    this.completionTime = null;
    this.totalConnections = 0;
    
    // Elementos visuales
    this.backgroundParticles = [];
    this.glitchEffect = null;
    this.aiAvatar = null;
    this.neuralNetwork = null;
    this.dialogueOptions = [];
    this.currentAIMessage = null;
    this.aiDialogue = null;
    
    // Audio
    this.sounds = {};
    
    // Configuración
    this.config = {
      nodeCount: 12,
      connectionThreshold: 0.7,
      glitchIntensity: 0.3,
      aiResponseDelay: 2000
    };
  }

  preload() {
    // Cargar la música de fondo
    this.load.audio('backgroundMusic', 'assets/scenaPrincipal/musica.mp3');
    
    // Cargar assets existentes
    this.load.image('ai_planet_bg', 'assets/ai_planet_bg.svg');
    this.load.image('neural_network', 'assets/neural_network.svg');
    this.load.image('ai_interface', 'assets/ai_interface.svg');
    this.load.image('neural_network_reference', 'assets/neural_network_reference.svg');
    
    // Cargar nuevos assets de nodos mejorados
    this.load.image('neural_node', 'assets/neural_node.svg');
    this.load.image('neural_node_selected', 'assets/neural_node_selected.svg');
    
    // Cargar imagen de referencia del patrón objetivo
    this.load.image('nodo_pattern', 'assets/rompecabezas/Nodo.png');
    
    // Cargar efectos de sonido (comentados para evitar errores)
    // this.load.audio('click', 'assets/sounds/click.mp3');
    // this.load.audio('success', 'assets/sounds/success.mp3');
    // this.load.audio('error', 'assets/sounds/error.mp3');
    // this.load.audio('win', 'assets/sounds/win.mp3');
    
    // Música de fondo removida para evitar problemas de decodificación
    
    
    // Configurar contexto de canvas para mejor rendimiento
    this.load.on('complete', () => {
      if (this.sys.canvas) {
        const context = this.sys.canvas.getContext('2d');
        if (context) {
          context.willReadFrequently = true;
        }
      }
    });
    
    // Manejar errores de carga de audio con más detalle
    // Listeners de audio removidos para evitar errores
    // this.load.on('loaderror', (file) => {
    //   console.warn(`Error loading file: ${file.key} - ${file.src}`);
    //   if (file.key === 'musica') {
    //     console.warn('Background music failed to load, audio will be disabled');
    //     this.audioLoadError = true;
    //   }
    // });
    
    // this.load.on('filecomplete', (key, type, data) => {
    //   if (key === 'musica') {
    //     console.log('Background music loaded successfully');
    //     this.audioLoadError = false;
    //   }
    // });
    
    // Optimizar configuración de Phaser para mejor rendimiento
    this.physics.world.fps = 60;
    this.physics.world.fixedStep = false;
  }


  create() {
    // Configuración unificada para todas las plataformas
    this.setupMobileOptimizations();
    
    // Configurar la música de fondo
    try {
      this.musicManager = MusicManager.getInstance();
      if (!this.musicManager.isPlaying()) {
        const backgroundMusic = this.sound.add('backgroundMusic');
        this.musicManager.setMusic(backgroundMusic);
        this.musicManager.playMusic();
      }
    } catch (e) {
      console.log('Error configurando música:', e);
    }
    
    // Crear fondo animado de Omega-1
    this.createOmega1Background();
    
    // Iniciar secuencia de introducción
    this.startIntroSequence();
    
    // Configurar controles
    this.setupControls();
    
    // Inicializar variables del juego
    this.selectedNode = null;
    this.connectionCount = 0;
    this.nodes = [];
    this.connections = [];
    this.neuralNetworkNodes = [];
  }

  setupMobileOptimizations() {
    try {
      // Configurar input para móvil
      this.input.addPointer(2); // Soporte para multi-touch
    } catch (e) {
      console.log('Error configurando input, continuando...');
    }
    
    // Prevenir zoom en móvil
    if (this.sys.game.device.input.touch) {
      try {
        this.input.mouse.disableContextMenu();
      } catch (e) {
        console.log('Error deshabilitando menú contextual');
      }
      
      // Configurar viewport para móvil
      try {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        } else {
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
      } catch (e) {
        console.log('Error configurando viewport');
      }
      
      // Prevenir comportamientos por defecto en móvil
      try {
        document.addEventListener('touchstart', (e) => {
          if (e.target.tagName === 'CANVAS') {
            e.preventDefault();
          }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
          if (e.target.tagName === 'CANVAS') {
            e.preventDefault();
          }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
          if (e.target.tagName === 'CANVAS') {
            e.preventDefault();
          }
        }, { passive: false });
      } catch (e) {
        console.log('Error configurando eventos touch');
      }
    }
  }

  // Método setupAudio completamente removido para evitar errores de audio
  /*
  setupAudio() {
    try {
      // Verificar si hubo error en la carga
      if (this.audioLoadError) {
        console.warn('Audio setup skipped due to loading error');
        this.createSilentAudioFallback();
        return;
      }

      // Intentar cargar sonidos reales si están disponibles
      if (this.sound && this.cache.audio.exists('click')) {
        this.sounds = {
          click: this.sound.add('click', { volume: 0.3 }),
          success: this.sound.add('success', { volume: 0.5 }),
          error: this.sound.add('error', { volume: 0.4 }),
          win: this.sound.add('win', { volume: 0.6 })
        };
        
        // Configurar música de fondo usando MusicManager
        if (this.cache.audio.exists('musica')) {
        console.log('Setting up background music...');
        this.backgroundMusic = this.sound.add('musica', { 
            volume: 0.2, 
            loop: true 
          });
          
          // Usar MusicManager para gestión global
          const musicManager = MusicManager.getInstance();
          musicManager.setMusic(this.backgroundMusic);
          
          console.log('MusicManager configured with background music');
          console.log('Background music object:', this.backgroundMusic);
          console.log('Music manager state:', { music: musicManager.music, isPlaying: musicManager.isPlaying });
          
          // Intentar reproducir inmediatamente
          this.time.delayedCall(500, () => {
            try {
              console.log('Attempting to play music...');
              musicManager.playMusic();
              console.log('Background music started via MusicManager');
              console.log('Music manager state after play:', { music: musicManager.music, isPlaying: musicManager.isPlaying });
              
              // Verificar si realmente está sonando
              if (this.backgroundMusic.isPlaying) {
                console.log('✅ Music is actually playing!');
              } else {
                console.log('❌ Music object exists but is not playing');
              }
            } catch (error) {
              console.log('Auto-play blocked, waiting for user interaction:', error.message);
            }
          });
        } else {
          console.warn('Background music not found in audio cache');
          this.audioLoadError = true;
        }
        
        console.log('Audio system initialized with real sounds');
      } else {
        console.warn('Click sound not found, using silent fallback');
        this.createSilentAudioFallback();
      }
    } catch (error) {
      console.error('Error setting up audio:', error);
      this.createSilentAudioFallback();
    }
  }

  createSilentAudioFallback() {
    // Sistema de audio silencioso como fallback
    this.sounds = {
      click: { play: () => {}, setVolume: () => {} },
      success: { play: () => {}, setVolume: () => {} },
      error: { play: () => {}, setVolume: () => {} },
      win: { play: () => {}, setVolume: () => {} }
    };
    
    this.backgroundMusic = { 
      play: () => {}, 
      stop: () => {}, 
      setVolume: () => {} 
    };
    
    console.log('Silent audio fallback activated');
  }
  */

  // Método forceStartMusic removido para evitar errores de audio
  /*
  forceStartMusic() {
    // Método para forzar el inicio de la música
    try {
      const musicManager = MusicManager.getInstance();
      if (musicManager.music && !musicManager.isPlaying) {
        musicManager.playMusic();
        this.audioEnabled = true;
        console.log('Music force started');
        
        // Mostrar notificación
        const notification = this.add.text(500, 30, '🎵 Música iniciada', {
          fontSize: '14px',
          fill: '#00ff88',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: { x: 12, y: 6 },
          fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(1000);
        
        this.tweens.add({
          targets: notification,
          alpha: 0,
          duration: 2000,
          onComplete: () => notification.destroy()
        });
      }
    } catch (error) {
      console.error('Error force starting music:', error);
    }
  }

  enableAudio() {
    // Habilitar audio después de la primera interacción del usuario
    if (!this.audioEnabled) {
      try {
        const musicManager = MusicManager.getInstance();
        
        console.log('🎵 User interaction detected, attempting to start music...');
        console.log('MusicManager state before interaction:', { 
          music: musicManager.music, 
          isPlaying: musicManager.isPlaying 
        });
        
        // Intentar reproducir música usando MusicManager
        if (musicManager.music && !musicManager.isPlaying) {
          musicManager.playMusic();
          this.audioEnabled = true;
          console.log('Background music started after user interaction via MusicManager');
          
          // Verificar si realmente está sonando después de la interacción
          this.time.delayedCall(100, () => {
            if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
              console.log('✅ Music is now playing after user interaction!');
            } else {
              console.log('❌ Music still not playing even after user interaction');
              console.log('Background music state:', this.backgroundMusic);
              
              // Intentar reproducción directa como último recurso
              if (this.backgroundMusic && this.backgroundMusic.play) {
                console.log('Trying direct play as fallback...');
                this.backgroundMusic.play({ volume: 0.2, loop: true });
              }
            }
          });
          
          // Mostrar notificación de audio habilitado
          const audioNotification = this.add.text(500, 50, '🎵 Música de fondo activada', {
            fontSize: '16px',
            fill: '#00ff88',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: { x: 15, y: 8 },
            fontFamily: 'Arial',
            fontWeight: 'bold'
          }).setOrigin(0.5).setDepth(1000);
          
          // Desvanecer la notificación
          this.tweens.add({
            targets: audioNotification,
            alpha: 0,
            y: 20,
            duration: 3000,
            ease: 'Power2.easeOut',
            onComplete: () => audioNotification.destroy()
          });
        } else {
          console.log('❌ No music available or already playing');
          console.log('Music available:', !!musicManager.music);
          console.log('Already playing:', musicManager.isPlaying);
        }
        
        // Remover el listener después de la primera activación
        this.input.off('pointerdown', this.enableAudio, this);
      } catch (error) {
        console.error('Error starting background music:', error);
      }
    }
  }
  */

  createSimplifiedBackground() {
    // Fondo simple para Safari iOS - sin efectos pesados
    const bg = this.add.rectangle(500, 250, 1000, 500, 0x1a1a2e);
    bg.setAlpha(0.8);
    
    // Título simple sin animaciones
    const title = this.add.text(500, 100, '🚀 MISIÓN OMEGA-1', {
      fontSize: '28px',
      fill: '#ff6b35',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    const subtitle = this.add.text(500, 140, 'Rompecabezas Neural', {
      fontSize: '16px',
      fill: '#00ccff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    console.log('Safari iOS: Fondo simplificado creado');
  }

  createOmega1Background() {
    // Fondo del planeta artificial
    const bg = this.add.image(500, 250, 'ai_planet_bg');
    bg.setScale(1.2);
    bg.setAlpha(0.7);
    
    // Crear partículas de datos flotantes
    this.createDataParticles();
    
    // Efecto de glitch sutil
    this.createGlitchEffect();
  }

  createDataParticles() {
    for (let i = 0; i < 30; i++) {
      const particle = this.add.text(
        Phaser.Math.Between(50, 950),
        Phaser.Math.Between(50, 450),
        ['01', '10', '11', '00', 'AI', 'ΩΩ', '∞∞'][Phaser.Math.Between(0, 6)],
        {
          fontSize: '12px',
          fill: '#00ff88',
          alpha: 0.6
        }
      );
      
      // Animación flotante
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(20, 50),
        alpha: { from: 0.6, to: 0.1 },
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
      
      this.backgroundParticles.push(particle);
    }
  }

  createGlitchEffect() {
    this.glitchEffect = this.add.rectangle(500, 250, 1000, 500, 0x00ff88, 0);
    
    // Efecto de glitch aleatorio
    this.time.addEvent({
      delay: Phaser.Math.Between(2000, 5000),
      callback: () => {
        this.tweens.add({
          targets: this.glitchEffect,
          alpha: 0.1,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            this.time.delayedCall(Phaser.Math.Between(2000, 5000), () => {
              this.createGlitchEffect();
            });
          }
        });
      }
    });
  }

  startIntroSequence() {
    // Título principal con efecto de brillo
    const title = this.add.text(500, 80, '🚀 MISIÓN OMEGA-1', {
      fontSize: '32px',
      fill: '#ff6b35',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Subtítulo con efecto de parpadeo
    const subtitle = this.add.text(500, 120, 'Rompecabezas Neural', {
      fontSize: '18px',
      fill: '#00ccff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Historia introductoria con efecto de escritura
    const storyText = this.add.text(500, 200, '', {
      fontSize: '14px',
      fill: '#ffffff',
      align: 'center',
      lineSpacing: 8,
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const fullStory = 'Completa el rompecabezas conectando\n' +
      'los nodos de la red neural.\n\n' +
      'Conecta todos los nodos para\n' +
      'completar la misión.';

    // Crear área de toque de pantalla completa para móvil
    const fullScreenTouchArea = this.add.rectangle(500, 250, 1000, 500, 0x000000, 0)
      .setInteractive()
      .setDepth(-1);

    // Texto de instrucción para móvil
    const touchInstruction = this.add.text(500, 350, 'Presiona en cualquier parte para iniciar', {
      fontSize: '18px',
      fill: '#00ff88',
      backgroundColor: '#1a1a2e',
      padding: { x: 20, y: 10 },
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Variable para controlar si ya se inició
    let missionStarted = false;

    // Función para iniciar la misión
    const startMission = (pointer) => {
      if (missionStarted) return;
      missionStarted = true;
      
      // Efecto visual de activación en el texto
      this.tweens.add({
        targets: touchInstruction,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true
      });

      // Efecto de flash en toda la pantalla
      const flashEffect = this.add.rectangle(500, 250, 1000, 500, 0x00ff88, 0.3);
      this.tweens.add({
        targets: flashEffect,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          flashEffect.destroy();
          this.transitionToNeuralPuzzle();
        }
      });
    };

    // Configurar eventos de toque en toda la pantalla
    fullScreenTouchArea.on('pointerdown', startMission);
    fullScreenTouchArea.on('touchstart', startMission);

    // Efectos visuales del texto (solo visuales)
    const handleHoverStart = () => {
      if (missionStarted) return;
      
      this.tweens.add({
        targets: touchInstruction,
        scale: 1.1,
        duration: 200,
        ease: 'Power2'
      });
      touchInstruction.setFill('#ffffff');
      
      // Efecto de brillo
      this.tweens.add({
        targets: touchInstruction,
        alpha: { from: 1, to: 0.8 },
        duration: 300,
        yoyo: true,
        repeat: -1
      });
    };

    const handleHoverEnd = () => {
      if (missionStarted) return;
      
      this.tweens.killTweensOf(touchInstruction);
      this.tweens.add({
        targets: touchInstruction,
        scale: 1,
        alpha: 1,
        duration: 200,
        ease: 'Power2'
      });
      touchInstruction.setFill('#00ff88');
    };

    // Eventos de hover para el área completa
    fullScreenTouchArea.on('pointerover', handleHoverStart);
    fullScreenTouchArea.on('pointerout', handleHoverEnd);

    // Animaciones de entrada mejoradas
    this.tweens.add({
      targets: title,
      alpha: { from: 0, to: 1 },
      y: { from: 50, to: 80 },
      scale: { from: 0.5, to: 1 },
      duration: 1200,
      ease: 'Elastic.easeOut'
    });

    this.tweens.add({
      targets: subtitle,
      alpha: { from: 0, to: 1 },
      x: { from: 300, to: 500 },
      duration: 1000,
      delay: 300,
      ease: 'Power3.easeOut'
    });

    // Efecto de escritura para el texto de historia
    let currentChar = 0;
    const typewriterTimer = this.time.addEvent({
      delay: 50,
      callback: () => {
        if (currentChar < fullStory.length) {
          storyText.setText(fullStory.substring(0, currentChar + 1));
          currentChar++;
        } else {
          typewriterTimer.destroy();
        }
      },
      repeat: fullStory.length - 1
    });

    // Animación de la instrucción de toque
    this.tweens.add({
      targets: touchInstruction,
      alpha: { from: 0, to: 1 },
      y: { from: 400, to: 350 },
      duration: 1000,
      delay: 2000,
      ease: 'Bounce.easeOut'
    });

    // Animación de pulso continuo
    this.tweens.add({
      targets: touchInstruction,
      scaleX: { from: 1, to: 1.1 },
      scaleY: { from: 1, to: 1.1 },
      duration: 800,
      delay: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Efecto de parpadeo en la instrucción
    this.tweens.add({
      targets: touchInstruction,
      alpha: { from: 1, to: 0.7 },
      duration: 1200,
      delay: 3200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Animación de flotación sutil
    this.tweens.add({
      targets: touchInstruction,
      y: { from: 350, to: 345 },
      duration: 2000,
      delay: 3500,
      yoyo: true,
      repeat: -1,
      ease: 'Power1.easeInOut'
    });

    // Efecto de brillo y cambio de color
    this.tweens.add({
      targets: touchInstruction,
      tint: { from: 0x00ff88, to: 0xffffff },
      duration: 1500,
      delay: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Power2.easeInOut'
    });

    // Efecto de brillo en el título
    this.tweens.add({
      targets: title,
      tint: { from: 0xff6b35, to: 0xffffff },
      duration: 2000,
      delay: 1500,
      yoyo: true,
      repeat: -1
    });

    // Efecto de parpadeo en el subtítulo
    this.tweens.add({
      targets: subtitle,
      alpha: { from: 1, to: 0.5 },
      duration: 1500,
      delay: 2000,
      yoyo: true,
      repeat: -1
    });
  }

  transitionToNeuralPuzzle() {
    // Detectar Safari iOS para transición simplificada
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari && isIOS) {
      // Transición directa sin animaciones para Safari iOS
      console.log('Safari iOS: Transición directa al puzzle');
      this.startNeuralNetworkPuzzle();
      return;
    }
    
    // Transición suave con fade out para otros navegadores
    const fadeOverlay = this.add.rectangle(500, 250, 1000, 500, 0x000000, 0);
    
    this.tweens.add({
      targets: fadeOverlay,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.startNeuralNetworkPuzzle();
        this.tweens.add({
          targets: fadeOverlay,
          alpha: 0,
          duration: 500,
          onComplete: () => fadeOverlay.destroy()
        });
      }
    });
  }

  startNeuralNetworkPuzzle() {
    // Detectar Safari iOS para inicialización simplificada
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Limpiar pantalla
    this.children.removeAll();
    
    if (isSafari && isIOS) {
      console.log('Safari iOS: Creando fondo simplificado para puzzle');
      this.createSimplifiedBackground();
    } else {
      this.createOmega1Background();
    }
    
    this.gameState = 'neural_puzzle';
    
    

    // Comenzar directamente el puzzle interactivo
    this.startInteractivePuzzle();
  }

  startInteractivePuzzle() {
    // Registrar tiempo de inicio
    this.startTime = Date.now();
    
    // Definir el patrón objetivo que el jugador debe replicar
    this.targetPattern = [
      { from: 0, to: 2 }, // Nodo 1 -> Nodo 3
      { from: 0, to: 3 }, // Nodo 1 -> Nodo 4
      { from: 1, to: 3 }, // Nodo 2 -> Nodo 4
      { from: 1, to: 4 }, // Nodo 2 -> Nodo 5
      { from: 2, to: 5 }, // Nodo 3 -> Nodo 6
      { from: 3, to: 6 }, // Nodo 4 -> Nodo 7
  
      { from: 6, to: 4 }, // Nodo 7 -> Nodo 5 (conexión agregada)
      { from: 6, to: 8 }, // Nodo 7 -> Nodo 9
      { from: 7, to: 9 }  // Nodo 8 -> Nodo 10
    ];
    
    // Crear imagen de referencia
    this.createReferenceImage();
    
    // Crear red neuronal interactiva directamente
    this.createInteractiveNeuralNetwork();
    
    // Contador de conexiones actualizado
    this.connectionCounter = this.add.text(50, 470, 'Conexiones: 0/10 ✨', {
      fontSize: '14px',
      fill: '#00ff88',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    });
    
    // Instrucciones del juego
    this.instructionText = this.add.text(500, 470, 'Replica el patrón de la imagen de referencia', {
      fontSize: '14px',
      fill: '#ffaa00',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // Botón de patrón objetivo
    this.patternButton = this.add.text(50, 50, '📋 PATRÓN OBJETIVO', {
      fontSize: '14px',
      fill: '#00ff88',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 1,
      backgroundColor: '#001122',
      padding: { x: 10, y: 6 }
    }).setOrigin(0);
    
    this.patternButton.setInteractive({ useHandCursor: true });
    
    // Variable para controlar si la imagen está visible
    this.patternImageVisible = false;
    this.patternImage = null;
    
    this.patternButton.on('pointerdown', () => {
      this.togglePatternImage();
    });
    
    // Efecto hover para el botón de patrón objetivo
    this.patternButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.patternButton,
        scale: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });
    
    this.patternButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.patternButton,
        scale: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    // Botón de reinicio
    this.resetButton = this.add.text(850, 470, '🔄 Reiniciar', {
      fontSize: '14px',
      fill: '#ff6b35',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 1,
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    this.resetButton.setInteractive({ useHandCursor: true });
    this.resetButton.on('pointerdown', () => {
      this.resetPuzzle();
    });
    
    // Efecto hover para el botón de reinicio
    this.resetButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.resetButton,
        scale: 1.1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });
    
    this.resetButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.resetButton,
        scale: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });
  }
  
  resetPuzzle() {
    // Limpiar todas las conexiones existentes
    this.connections.forEach(connection => {
      if (connection.line) {
        connection.line.destroy();
      }
    });
    this.connections = [];
    
    // Resetear nodo seleccionado
    this.selectedNode = null;
    
    // Actualizar contador
    this.updateConnectionCounter();
    
    // Mostrar mensaje de reinicio
    const resetMsg = this.add.text(500, 200, '🔄 Puzzle reiniciado', {
      fontSize: '16px',
      fill: '#ff6b35',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Animación y destrucción automática del mensaje
    this.tweens.add({
      targets: resetMsg,
      y: 180,
      alpha: 0,
      duration: 1500,
      ease: 'Power2.easeOut',
      onComplete: () => resetMsg.destroy()
    });
    
    // Sonido de reinicio si está disponible
    if (this.sounds && this.sounds.click) {
      this.sounds.click.play();
    }
  }

  createReferenceImage() {
    // Función vacía - la imagen ahora se mostrará mediante botón
  }

  createInteractiveNeuralNetwork() {
    this.neuralNetworkNodes = [];
    this.connections = [];
    this.selectedNode = null;
    
    // Definir posiciones de los nodos (4 capas - más complejo)
    const nodePositions = [
      // Capa de entrada (2 nodos)
      { x: 150, y: 200, layer: 0 },
      { x: 150, y: 300, layer: 0 },
      
      // Capa oculta 1 (3 nodos)
      { x: 350, y: 160, layer: 1 },
      { x: 350, y: 250, layer: 1 },
      { x: 350, y: 340, layer: 1 },
      
      // Capa oculta 2 (3 nodos)
      { x: 650, y: 160, layer: 2 },
      { x: 650, y: 250, layer: 2 },
      { x: 650, y: 340, layer: 2 },
      
      // Capa de salida (2 nodos)
      { x: 850, y: 200, layer: 3 },
      { x: 850, y: 300, layer: 3 }
    ];

    // Colores modernos por capa con efectos holográficos
    const layerColors = [
      { primary: 0x00ff88, secondary: 0x00cc66, glow: 0x88ffaa }, // Entrada - Verde neón
      { primary: 0xff6b35, secondary: 0xff4500, glow: 0xffaa77 }, // Oculta 1 - Naranja vibrante
      { primary: 0x8a2be2, secondary: 0x6a1b9a, glow: 0xaa77ff }, // Oculta 2 - Púrpura místico
      { primary: 0x00bfff, secondary: 0x0099cc, glow: 0x77ddff }  // Salida - Azul cielo
    ];

    // Crear nodos con diseño holográfico moderno
    nodePositions.forEach((pos, index) => {
      const layerColor = layerColors[pos.layer];
      
      // Crear núcleo del nodo con efecto glassmorphism
      const nodeCore = this.add.circle(pos.x, pos.y, 18, layerColor.primary, 0.8);
      nodeCore.setStrokeStyle(2, layerColor.glow, 0.9);
      nodeCore.setInteractive();
      nodeCore.nodeId = index;
      nodeCore.layer = pos.layer;
      
      // Anillo interior con gradiente
      const innerRing = this.add.circle(pos.x, pos.y, 14, layerColor.secondary, 0.6);
      innerRing.setBlendMode(Phaser.BlendModes.ADD);
      
      // Anillo exterior holográfico
      const outerRing = this.add.circle(pos.x, pos.y, 28, 0x000000, 0);
      outerRing.setStrokeStyle(3, layerColor.glow, 0.5);
      
      // Halo de energía
      const energyHalo = this.add.circle(pos.x, pos.y, 35, layerColor.primary, 0.1);
      energyHalo.setBlendMode(Phaser.BlendModes.ADD);
      
      // Animación de respiración del núcleo
      this.tweens.add({
        targets: [nodeCore, innerRing],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Animación del anillo exterior
      this.tweens.add({
        targets: outerRing,
        scaleX: 1.3,
        scaleY: 1.3,
        alpha: 0.2,
        duration: 2500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Animación del halo de energía
      this.tweens.add({
        targets: energyHalo,
        scaleX: 1.4,
        scaleY: 1.4,
        alpha: 0.05,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Crear partículas de energía orbitales
      const energyParticles = [];
      for (let i = 0; i < 6; i++) {
        const particle = this.add.circle(pos.x, pos.y, 2, layerColor.glow, 0.9);
        particle.setBlendMode(Phaser.BlendModes.ADD);
        energyParticles.push(particle);
        
        // Órbita fluida con diferentes radios
        const angle = (i * 60) * Math.PI / 180;
        const radius = 25 + (i % 2) * 8;
        
        // Rotación orbital suave
        this.tweens.add({
          targets: particle,
          rotation: Math.PI * 2,
          duration: 4000 + (i * 300),
          repeat: -1,
          ease: 'Linear',
          onUpdate: () => {
            const currentAngle = angle + particle.rotation;
            particle.x = pos.x + Math.cos(currentAngle) * radius;
            particle.y = pos.y + Math.sin(currentAngle) * radius;
          }
        });
        
        // Pulso de intensidad
        this.tweens.add({
          targets: particle,
          alpha: 0.3,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 1200 + (i * 150),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
      
      // Texto del nodo con efecto holográfico
      const nodeText = this.add.text(pos.x, pos.y, `${index + 1}`, {
        fontSize: '14px',
        fill: '#ffffff',
        fontFamily: 'Arial Black',
        fontWeight: 'bold',
        stroke: layerColor.glow,
        strokeThickness: 3,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: layerColor.glow,
          blur: 8,
          stroke: true,
          fill: true
        }
      }).setOrigin(0.5);
      
      // Etiqueta de capa con glassmorphism
      const layerNames = ['INPUT', 'HIDDEN 1', 'HIDDEN 2', 'OUTPUT'];
      if (index === 0 || index === 2 || index === 5 || index === 8) { // Primer nodo de cada capa
        const layerLabel = this.add.text(pos.x, pos.y - 60, layerNames[pos.layer], {
          fontSize: '10px',
          fill: '#ffffff',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: { x: 8, y: 4 },
          stroke: layerColor.glow,
          strokeThickness: 1
        }).setOrigin(0.5);
        
        // Animación sutil de la etiqueta
        this.tweens.add({
          targets: layerLabel,
          alpha: 0.7,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
      
      // Animación de entrada espectacular
      nodeCore.setScale(0);
      innerRing.setScale(0);
      outerRing.setScale(0);
      energyHalo.setScale(0);
      nodeText.setAlpha(0);
      
      // Entrada escalonada con efectos
      this.tweens.add({
        targets: [nodeCore, innerRing],
        scale: 1,
        duration: 800,
        delay: index * 120,
        ease: 'Elastic.easeOut'
      });
      
      this.tweens.add({
        targets: outerRing,
        scale: 1,
        duration: 600,
        delay: index * 120 + 200,
        ease: 'Back.easeOut'
      });
      
      this.tweens.add({
        targets: energyHalo,
        scale: 1,
        duration: 1000,
        delay: index * 120 + 400,
        ease: 'Power2.easeOut'
      });
      
      this.tweens.add({
        targets: nodeText,
        alpha: 1,
        scale: { from: 0.3, to: 1 },
        duration: 500,
        delay: index * 120 + 600,
        ease: 'Back.easeOut'
      });
      
      // Efectos de interacción unificados para todas las plataformas
      const handleNodeSelection = () => {
        // Efecto de impacto visual
        this.tweens.add({
          targets: [nodeCore, innerRing],
          scale: 0.85,
          duration: 100,
          yoyo: true,
          ease: 'Power3'
        });
        
        // Onda de choque
        const shockwave = this.add.circle(pos.x, pos.y, 20, layerColor.primary, 0.3);
        this.tweens.add({
          targets: shockwave,
          scale: 3,
          alpha: 0,
          duration: 400,
          ease: 'Power2.easeOut',
          onComplete: () => shockwave.destroy()
        });
        
        this.selectNode(nodeCore, outerRing, nodeText, energyParticles);
      };
      
      // Eventos unificados para todas las plataformas
      nodeCore.on('pointerdown', handleNodeSelection);
      
      // Eventos hover unificados
      const handleNodeHover = () => {
        // Efectos de hover para todas las plataformas
        this.tweens.add({
          targets: nodeCore,
          scale: 1.4,
          duration: 300,
          ease: 'Back.easeOut'
        });
        
        this.tweens.add({
          targets: innerRing,
          scale: 1.6,
          alpha: 0.9,
          duration: 300,
          ease: 'Back.easeOut'
        });
        
        this.tweens.add({
          targets: outerRing,
          scale: 2,
          alpha: 0.8,
          duration: 300,
          ease: 'Back.easeOut'
        });
        
        this.tweens.add({
          targets: energyHalo,
          scale: 2.2,
          alpha: 0.3,
          duration: 300,
          ease: 'Back.easeOut'
        });
        
        // Efecto de brillo intenso en el texto
        this.tweens.add({
          targets: nodeText,
          scale: 1.3,
          duration: 300,
          ease: 'Back.easeOut'
        });
        
        // Acelerar partículas
        energyParticles.forEach((particle, i) => {
          this.tweens.add({
            targets: particle,
            scale: 2,
            alpha: 1,
            duration: 200,
            delay: i * 20,
            ease: 'Power2'
          });
        });
        
        // Mostrar información del nodo
        this.showNodeInfo(nodeCore, pos.layer);
      };
      
      // Solo agregar eventos hover en navegadores que no sean Safari iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (!(isSafari && isIOS)) {
        nodeCore.on('pointerover', handleNodeHover);
      }
      
      nodeCore.on('pointerout', () => {
        if (this.selectedNode !== nodeCore) {
          // Restaurar estado normal suavemente
          this.tweens.add({
            targets: nodeCore,
            scale: 1,
            duration: 400,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: innerRing,
            scale: 1,
            alpha: 0.6,
            duration: 400,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: outerRing,
            scale: 1,
            alpha: 0.5,
            duration: 400,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: energyHalo,
            scale: 1,
            alpha: 0.1,
            duration: 400,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: nodeText,
            scale: 1,
            duration: 400,
            ease: 'Power2.easeOut'
          });
          
          // Restaurar partículas
          energyParticles.forEach(particle => {
            this.tweens.add({
              targets: particle,
              scale: 1,
              alpha: 0.9,
              duration: 300,
              ease: 'Power2.easeOut'
            });
          });
        }
        
        this.hideNodeInfo();
      });
      
      // Guardar referencias con nuevos nombres
      nodeCore.outerRing = outerRing;
      nodeCore.innerRing = innerRing;
      nodeCore.energyHalo = energyHalo;
      nodeCore.nodeText = nodeText;
      nodeCore.particles = energyParticles;
      
      this.neuralNetworkNodes.push(nodeCore);
    });
  }

  selectNode(node, outerRing, nodeText, particles) {
    if (!this.selectedNode) {
      // Primer nodo seleccionado - cambiar color para indicar selección
      this.selectedNode = node;
      
      // Cambiar el color al estado seleccionado usando setFillStyle
      node.setFillStyle(0x00ffff, 0.8);
      
      // Efectos visuales para todas las plataformas
      this.tweens.add({
        targets: node,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      
      this.tweens.add({
        targets: outerRing,
        scaleX: 2,
        scaleY: 2,
        alpha: 0.7,
        duration: 200,
        ease: 'Power2'
      });
      
      // Pulso simplificado - solo 2 repeticiones en lugar de infinito
      this.tweens.add({
        targets: outerRing,
        scaleX: { from: 2, to: 2.2 },
        scaleY: { from: 2, to: 2.2 },
        alpha: { from: 0.7, to: 0.4 },
        duration: 400,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut'
      });
      
      // Simplificar animación de partículas - solo cambio de escala
      particles.forEach((particle, index) => {
        if (index < 3) { // Limitar a solo 3 partículas para móvil
          this.tweens.add({
            targets: particle,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 150,
            ease: 'Power2'
          });
          
          // Efecto de brillo simplificado
          if (particle.setTint) {
            particle.setTint(0xffff00);
          }
        }
      });
      
      if (this.sounds && this.sounds.click) {
        this.sounds.click.play();
      }
      
      // Pistas visuales simplificadas para móvil
      this.showConnectionHints(node);
      
    } else if (this.selectedNode === node) {
        // Deseleccionar con animación suave - restaurar color normal
        this.tweens.killTweensOf(this.selectedNode.outerRing);
        
        // Restaurar el color normal usando setFillStyle
        this.selectedNode.setFillStyle(0xffffff, 0.8);
      
      this.tweens.add({
        targets: this.selectedNode,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 300,
        ease: 'Power2'
      });
      
      this.tweens.add({
        targets: this.selectedNode.outerRing,
        scaleX: 1,
        scaleY: 1,
        alpha: 0.4,
        duration: 300,
        ease: 'Power2'
      });
      
      // Restaurar partículas al estado normal
      this.selectedNode.particles.forEach(particle => {
        this.tweens.add({
          targets: particle,
          scaleX: 1,
          scaleY: 1,
          alpha: 0.8,
          duration: 200,
          ease: 'Power2'
        });
        
        // Restaurar color normal - verificar que la partícula existe
        if (particle && particle.clearTint) {
          particle.clearTint();
        }
      });
      
      this.selectedNode = null;
      
      // Limpiar pistas visuales
      this.clearConnectionHints();
      
    } else {
      // Crear conexión con efectos mejorados
      if (this.canConnect(this.selectedNode, node)) {
        // Sonido de conexión exitosa
        if (this.sounds.success) {
          this.sounds.success.play();
        }
        
        this.createConnection(this.selectedNode, node);
        
        // Efecto de éxito en ambos nodos
        [this.selectedNode, node].forEach(n => {
          this.tweens.add({
            targets: n,
            tint: 0x00ff88,
            duration: 200,
            yoyo: true,
            onComplete: () => {
              if (n && n.clearTint) {
                n.clearTint();
              }
            }
          });
        });
        
        // Sonido de éxito para el efecto
        this.time.delayedCall(300, () => {
          if (this.sounds.success) {
            this.sounds.success.play();
          }
        });
        
      } else {
        // Sonido de error más prominente
        if (this.sounds.error) {
          this.sounds.error.play();
        }
        
        this.showError('❌ Conexión no válida');
        
        // Efecto de error visual con vibración
        [this.selectedNode, node].forEach(n => {
          this.tweens.add({
            targets: n,
            tint: 0xff0000,
            x: n.x + 5,
            duration: 100,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
              if (n && n.clearTint) {
                n.clearTint();
              }
              n.x = n.x; // Restaurar posición
            }
          });
        });
      }
      
      // Limpiar selección
      this.tweens.killTweensOf(this.selectedNode.outerRing);
      
      this.tweens.add({
        targets: this.selectedNode,
        scale: 1,
        duration: 200,
        ease: 'Power2'
      });
      
      this.tweens.add({
        targets: this.selectedNode.outerRing,
        scale: 1,
        alpha: 0,
        duration: 300,
        ease: 'Power2'
      });
      
      this.selectedNode.setFillStyle(0x00ccff, 0.8);
      
      // Restaurar partículas del nodo seleccionado
      this.selectedNode.particles.forEach(particle => {
        this.tweens.add({
          targets: particle,
          scale: 1,
          alpha: 0.6,
          duration: 200
        });
      });
      
      this.selectedNode = null;
    }
  }

  canConnect(node1, node2) {
    // Verificar si ya existe la conexión
    const existingConnection = this.connections.find(conn => 
      (conn.from === node1 && conn.to === node2) ||
      (conn.from === node2 && conn.to === node1)
    );
    
    if (existingConnection) return false;
    
    // Usar la propiedad layer que se asigna al crear los nodos
    const layer1 = node1.layer;
    const layer2 = node2.layer;
    
    // Solo permitir conexiones entre capas adyacentes
    return Math.abs(layer1 - layer2) === 1;
  }

  createConnection(node1, node2) {
    // Crear línea de conexión optimizada para móvil
    const line = this.add.graphics();
    
    // Calcular puntos de conexión
    const startX = node1.x;
    const startY = node1.y;
    const endX = node2.x;
    const endY = node2.y;
    
    // Obtener colores de las capas conectadas
    const layerColors = [
      { primary: 0x00ff88 },
      { primary: 0xff6b35 },
      { primary: 0x8a2be2 },
      { primary: 0x00bfff }
    ];
    
    const startColor = layerColors[node1.layer];
    
    // Verificar si esta conexión es correcta según el patrón objetivo
    const connectionId1 = `${node1.nodeId}-${node2.nodeId}`;
    const connectionId2 = `${node2.nodeId}-${node1.nodeId}`;
    const isCorrectConnection = this.targetPattern.some(pattern => 
      (pattern.from === node1.nodeId && pattern.to === node2.nodeId) ||
      (pattern.from === node2.nodeId && pattern.to === node1.nodeId)
    );
    
    // Usar color verde para conexiones correctas, rojo para incorrectas
    const connectionColor = isCorrectConnection ? 0x00ff88 : 0xff4444;
    
    // Dibujar línea con color según si es correcta o no
    line.lineStyle(3, connectionColor, 0.8);
    line.beginPath();
    line.moveTo(startX, startY);
    line.lineTo(endX, endY);
    line.strokePath();
    
    // Efecto visual diferente según si la conexión es correcta
    if (isCorrectConnection) {
      // Efecto de éxito - brillo verde
      const glowLine = this.add.graphics();
      glowLine.lineStyle(6, 0x88ffaa, 0.4);
      glowLine.beginPath();
      glowLine.moveTo(startX, startY);
      glowLine.lineTo(endX, endY);
      glowLine.strokePath();
      glowLine.setBlendMode(Phaser.BlendModes.ADD);
      
      // Animación de pulso para conexión correcta
      this.tweens.add({
        targets: glowLine,
        alpha: 0.1,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Sonido de éxito
      if (this.sounds && this.sounds.success) {
        this.sounds.success.play();
      }
      
      // Mostrar mensaje de éxito temporal
      this.showSuccessMessage('✅ ¡Conexión correcta!');
      
    } else {
      // Efecto de error - parpadeo rojo
      this.tweens.add({
        targets: line,
        alpha: 0.3,
        duration: 300,
        yoyo: true,
        repeat: 2,
        ease: 'Power2.easeInOut'
      });
      
      // Sonido de error
      if (this.sounds && this.sounds.error) {
        this.sounds.error.play();
      }
      
      // Mostrar mensaje de error temporal
      this.showErrorMessage('❌ Conexión incorrecta');
    }
    
    // Efecto unificado para todas las plataformas
    [node1, node2].forEach(node => {
      this.tweens.add({
        targets: node,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        yoyo: true,
        ease: 'Power2.easeInOut'
      });
    });
    
    const connection = { 
      from: node1, 
      to: node2, 
      line: line, 
      isCorrect: isCorrectConnection,
      fromId: node1.nodeId,
      toId: node2.nodeId
    };
    this.connections.push(connection);
    
    // Incrementar contador de conexiones totales
    this.totalConnections++;
    
    // Actualizar contador
    this.updateConnectionCounter();
    
    // Verificar si se completó el puzzle correctamente
    this.checkPuzzleCompletion();
  }
  
  checkPuzzleCompletion() {
    // Contar conexiones correctas
    const correctConnections = this.connections.filter(conn => conn.isCorrect).length;
    const totalCorrectNeeded = this.targetPattern.length;
    
    // Actualizar progreso
    this.updateProgressDisplay(correctConnections, totalCorrectNeeded);
    
    // Verificar si todas las conexiones correctas están hechas
    if (correctConnections === totalCorrectNeeded) {
      // Verificar que no hay conexiones incorrectas
      const incorrectConnections = this.connections.filter(conn => !conn.isCorrect).length;
      
      if (incorrectConnections === 0) {
        // ¡Puzzle completado perfectamente!
        this.time.delayedCall(500, () => {
          this.completePuzzleSuccessfully();
        });
      } else {
        // Hay conexiones incorrectas, mostrar mensaje
        this.showHintMessage(`¡Bien! Tienes ${correctConnections}/${totalCorrectNeeded} conexiones correctas, pero elimina las ${incorrectConnections} incorrectas.`);
      }
    } else if (this.connections.length >= 10) {
      // Demasiadas conexiones, sugerir reinicio
      this.showHintMessage('Demasiadas conexiones. Haz clic en "Reiniciar" para intentar de nuevo.');
    }
  }
  
  updateProgressDisplay(correct, total) {
    // Actualizar contador con progreso
    this.connectionCounter.setText(`Progreso: ${correct}/${total} correctas ✨`);
    
    // Cambiar color según progreso
    if (correct === total) {
      this.connectionCounter.setFill('#00ff88'); // Verde cuando está completo
    } else if (correct > total / 2) {
      this.connectionCounter.setFill('#ffaa00'); // Naranja cuando está a la mitad
    } else {
      this.connectionCounter.setFill('#ffffff'); // Blanco al inicio
    }
  }
  
  completePuzzleSuccessfully() {
    // Efectos visuales de victoria
    this.cameras.main.flash(500, 0, 255, 0, false);
    
    // Sonido de victoria
    if (this.sounds && this.sounds.victory) {
      this.sounds.victory.play();
    }
    
    // Mensaje de victoria
    const victoryText = this.add.text(500, 250, '🎉 ¡PATRÓN COMPLETADO! 🎉', {
      fontSize: '32px',
      fill: '#00ff88',
      fontFamily: 'Arial Black',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Animación del texto de victoria
    this.tweens.add({
      targets: victoryText,
      scale: 1.2,
      duration: 500,
      yoyo: true,
      repeat: 2,
      ease: 'Back.easeInOut'
    });
    
    // Continuar al siguiente nivel después de 3 segundos
    this.time.delayedCall(3000, () => {
      this.completeNeuralPuzzle();
    });
  }
  
  showSuccessMessage(message) {
    const successMsg = this.add.text(500, 200, message, {
      fontSize: '18px',
      fill: '#00ff88',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Animación y destrucción automática
    this.tweens.add({
      targets: successMsg,
      y: 180,
      alpha: 0,
      duration: 2000,
      ease: 'Power2.easeOut',
      onComplete: () => successMsg.destroy()
    });
  }
  
  showErrorMessage(message) {
    const errorMsg = this.add.text(500, 200, message, {
      fontSize: '18px',
      fill: '#ff4444',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Animación y destrucción automática
    this.tweens.add({
      targets: errorMsg,
      y: 180,
      alpha: 0,
      duration: 2000,
      ease: 'Power2.easeOut',
      onComplete: () => errorMsg.destroy()
    });
  }
  
  showHintMessage(message) {
    const hintMsg = this.add.text(500, 220, message, {
      fontSize: '14px',
      fill: '#ffaa00',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 1,
      wordWrap: { width: 600 }
    }).setOrigin(0.5);
    
    // Animación y destrucción automática
    this.tweens.add({
      targets: hintMsg,
      alpha: 0,
      duration: 4000,
      ease: 'Power2.easeOut',
      onComplete: () => hintMsg.destroy()
    });
  }
  
  createConnectionParticles(startX, startY, endX, endY, midX, midY) {
    // Crear solo 3 partículas simples para evitar congelamiento
    for (let i = 0; i < 3; i++) {
      const particle = this.add.circle(startX, startY, 2, 0xffffff, 0.8);
      particle.setBlendMode(Phaser.BlendModes.ADD);
      
      // Movimiento simple directo
      this.tweens.add({
        targets: particle,
        x: endX,
        y: endY,
        alpha: 0,
        duration: 800 + i * 100,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }
  
  updateConnectionCounter() {
    // Contar conexiones correctas e incorrectas
    const correctConnections = this.connections.filter(conn => conn.isCorrect).length;
    const incorrectConnections = this.connections.filter(conn => !conn.isCorrect).length;
    const totalCorrectNeeded = this.targetPattern.length;
    
    // Animación del contador
    this.tweens.add({
      targets: this.connectionCounter,
      scale: 1.3,
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Actualizar texto con progreso detallado
    if (correctConnections === totalCorrectNeeded && incorrectConnections === 0) {
      this.connectionCounter.setText(`¡Perfecto! ${correctConnections}/${totalCorrectNeeded} 🎉`);
      this.connectionCounter.setFill('#00ff88');
      this.tweens.add({
        targets: this.connectionCounter,
        alpha: { from: 1, to: 0.7 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    } else {
      let statusText = `Progreso: ${correctConnections}/${totalCorrectNeeded} correctas`;
      if (incorrectConnections > 0) {
        statusText += ` (${incorrectConnections} incorrectas)`;
      }
      statusText += ' ✨';
      
      this.connectionCounter.setText(statusText);
      
      // Cambiar color según progreso
      if (correctConnections === totalCorrectNeeded) {
        this.connectionCounter.setFill('#ffaa00'); // Naranja si tiene todas correctas pero hay incorrectas
      } else if (correctConnections > totalCorrectNeeded / 2) {
        this.connectionCounter.setFill('#ffaa00'); // Naranja cuando está a la mitad
      } else {
        this.connectionCounter.setFill('#ffffff'); // Blanco al inicio
      }
    }
  }

  showNodeInfo(node) {
    const layerNames = ['Entrada', 'Oculta 1', 'Oculta 2', 'Salida'];
    this.nodeInfo = this.add.text(node.x, node.y - 35, 
      `${layerNames[node.layer]}\nNodo ${node.index + 1}`, {
        fontSize: '10px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 4, y: 2 },
        align: 'center'
      }).setOrigin(0.5);
  }

  hideNodeInfo() {
    if (this.nodeInfo) {
      this.nodeInfo.destroy();
      this.nodeInfo = null;
    }
  }

  showError(message) {
    const errorText = this.add.text(500, 480, message, {
      fontSize: '14px',
      fill: '#ff0000',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    this.time.delayedCall(2000, () => {
      errorText.destroy();
    });
  }

  completeNeuralPuzzle() {
    // Calcular tiempo de finalización
    this.completionTime = Date.now();
    const timeElapsed = Math.round((this.completionTime - this.startTime) / 1000);
    
    // Obtener dimensiones del juego para centrado perfecto
    const centerX = this.sys.game.config.width / 2;  // 500
    const centerY = this.sys.game.config.height / 2; // 250
    
    // Efectos de celebración unificados para todas las plataformas
    this.createSimpleCelebrationEffect();
    
    // Animación unificada de todos los nodos
    this.neuralNetworkNodes.forEach((node, index) => {
      this.tweens.add({
        targets: node,
        scale: { from: 1, to: 1.2 },
        duration: 600,
        delay: index * 50,
        ease: 'Power2.easeOut'
      });
    });
    
    // Animación unificada de las conexiones
    this.connections.forEach((connection, index) => {
      this.tweens.add({
        targets: connection.line,
        alpha: { from: 0.8, to: 1 },
        duration: 200,
        yoyo: true,
        repeat: 2,
        delay: index * 50
      });
    });
    
    // Crear partículas de celebración flotantes unificadas
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
      const particle = this.add.circle(
        centerX + Phaser.Math.Between(-450, 450),
        centerY + Phaser.Math.Between(-150, 150),
        Phaser.Math.Between(3, 8),
        Phaser.Math.Between(0x00ffff, 0xffff00)
      );
      particle.setAlpha(0.7);
      
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(100, 200),
        alpha: { from: 0.7, to: 0 },
        scale: { from: 1, to: 0.3 },
        duration: Phaser.Math.Between(2000, 3000),
        delay: Phaser.Math.Between(0, 500),
        ease: 'Quad.easeOut'
      });
    }

    // Mensaje de felicitaciones espectacular y centrado
    const congratsTitle = this.add.text(centerX, centerY - 180, 
      '🎉✨ ¡MISIÓN CUMPLIDA! ✨🎉', {
        fontSize: '32px',
        fill: '#FFD700',
        fontWeight: 'bold',
        stroke: '#FF1493',
        strokeThickness: 3,
        fontFamily: 'Arial Black',
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: '#000000',
          blur: 10,
          stroke: true,
          fill: true
        }
      }
    ).setOrigin(0.5);
    
    const successMsg = this.add.text(centerX, centerY - 130, 
      '🏆 DECODIFICACIÓN NEURAL EXITOSA 🏆', {
        fontSize: '15px',
        fill: '#00ff88',
        backgroundColor: 'rgba(0, 20, 40, 0.9)',
        padding: { x: 20, y: 15 },
        align: 'center',
        lineSpacing: 8,
        fontWeight: 'bold',
        stroke: '#004d26',
        strokeThickness: 2,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 6,
          stroke: false,
          fill: true
        }
      }
    ).setOrigin(0.5);
    
    // Estadísticas del jugador con diseño premium
    const statsMsg = this.add.text(centerX, centerY - 70, 
      `📊✨ ANÁLISIS DE RENDIMIENTO EXCEPCIONAL ✨📊\n⏱️🔥 Tiempo récord: ${timeElapsed} segundos\n🔗💎 Conexiones perfectas: ${this.totalConnections}/9n⚡🏅 Nivel de maestría: ${this.totalConnections === 6 ? '🌟 LEGENDARIO 🌟' : '💫 EXTRAORDINARIO 💫'}`, {
        fontSize: '13px',
        fill: '#FFD700',
        backgroundColor: 'rgba(25, 15, 0, 0.9)',
        padding: { x: 18, y: 12 },
        align: 'center',
        lineSpacing: 6,
        fontWeight: 'bold',
        stroke: '#664400',
        strokeThickness: 1,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 5,
          stroke: false,
          fill: true
        }
      }
    ).setOrigin(0.5);
    
    const aiResponse = this.add.text(centerX, centerY + 20, 
      '🤖💬 AIDEN: "¡INCREÍBLE! Tu destreza supera mis cálculos más optimistas.\n🌐✨ Iniciando protocolo de comunicación avanzada...\n🔮🚀 El futuro de la humanidad está en buenas manos."', {
        fontSize: '13px',
        fill: '#00ccff',
        backgroundColor: 'rgba(0, 15, 25, 0.9)',
        padding: { x: 18, y: 12 },
        align: 'center',
        lineSpacing: 6,
        fontWeight: 'bold',
        stroke: '#003366',
        strokeThickness: 1,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 5,
          stroke: false,
          fill: true
        }
      }
    ).setOrigin(0.5);
    
    // Animaciones del texto de felicitaciones unificadas
    this.tweens.add({
      targets: congratsTitle,
      scale: { from: 0.3, to: 1.2 },
      alpha: { from: 0, to: 1 },
      rotation: { from: -0.2, to: 0 },
      duration: 1000,
      delay: 200,
      ease: 'Elastic.easeOut'
    });
    
    this.tweens.add({
      targets: [successMsg, statsMsg, aiResponse],
      alpha: { from: 0, to: 1 },
      y: { from: '+=30', to: '-=0' },
      scale: { from: 0.9, to: 1 },
      duration: 800,
      delay: 600,
      ease: 'Back.easeOut',
      stagger: 150
    });
    
    // Efecto de brillo pulsante en el título
    this.tweens.add({
      targets: congratsTitle,
      tint: { from: 0xFFD700, to: 0xFFFFFF },
      scale: { from: 1.2, to: 1.3 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      delay: 1200,
      ease: 'Sine.easeInOut'
    });
    
    // Efecto de brillo en el borde del fondo - comentado ya que glowEffect no está definido
    // this.tweens.add({
    //   targets: glowEffect,
    //   alpha: { from: 1, to: 0.3 },
    //   duration: 2000,
    //   yoyo: true,
    //   repeat: -1,
    //   delay: 800,
    //   ease: 'Sine.easeInOut'
    // });
    
    if (this.sounds && this.sounds.win) {
      this.sounds.win.play();
    }
    
    // Botón para continuar a la siguiente escena
    const continueBtn = this.add.text(centerX, centerY + 100, '👆 HAZ CLICK PARA CONTINUAR', {
      fontSize: '16px',
      fill: '#00ff88',
      backgroundColor: '#0f3460',
      padding: { x: 18, y: 10 },
      stroke: '#00ff88',
      strokeThickness: 1
    }).setOrigin(0.5).setInteractive();
    
    continueBtn.on('pointerdown', () => {
      if (this.sounds && this.sounds.click) {
        this.sounds.click.play();
      }
      // Ir a la siguiente escena
      this.scene.start('DroneRepairScene');
    });
    
    continueBtn.on('pointerover', () => {
      continueBtn.setScale(1.1);
      continueBtn.setTint(0xffff00);
    });
    
    continueBtn.on('pointerout', () => {
      continueBtn.setScale(1);
      continueBtn.clearTint();
    });
    
    // Animación del botón
    this.tweens.add({
      targets: continueBtn,
      alpha: { from: 0, to: 1 },
      y: { from: '+=30', to: '-=0' },
      scale: { from: 0.9, to: 1 },
      duration: 800,
      delay: 2000,
      ease: 'Back.easeOut'
    });
  }
  
  createCelebrationEffect() {
    // Crear múltiples explosiones de partículas mejoradas
    const centerX = 400;
    const centerY = 300;
    
    // Explosión central con partículas doradas
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const distance = Phaser.Math.Between(50, 200);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const particle = this.add.circle(centerX, centerY, Phaser.Math.Between(4, 10), 0xffd700, 1);
      
      this.tweens.add({
        targets: particle,
        x: x,
        y: y,
        scale: { from: 1.5, to: 0 },
        alpha: { from: 1, to: 0 },
        duration: 2000,
        delay: i * 30,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
    
    // Estrellas doradas brillantes
    for (let i = 0; i < 15; i++) {
      const star = this.add.star(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 400),
        5, 8, 16, 0xFFD700, 1
      );
      
      this.tweens.add({
        targets: star,
        scale: { from: 0, to: 1.5 },
        rotation: Math.PI * 2,
        alpha: { from: 1, to: 0 },
        duration: 2500,
        delay: i * 100,
        ease: 'Back.easeOut',
        onComplete: () => star.destroy()
      });
    }
    
    // Lluvia de confeti mejorada con más colores
    for (let i = 0; i < 40; i++) {
      const colors = [0x00ff88, 0xffd700, 0x00ccff, 0xff6b35, 0xffffff];
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, 800),
        -20,
        Phaser.Math.Between(6, 12),
        Phaser.Math.Between(6, 12),
        colors[Math.floor(Math.random() * colors.length)]
      );
      
      this.tweens.add({
        targets: confetti,
        y: 650,
        rotation: Math.PI * 6,
        scaleX: { from: 1, to: 0.5 },
        scaleY: { from: 1, to: 0.5 },
        duration: Phaser.Math.Between(2500, 4000),
        delay: i * 80,
        ease: 'Power1.easeIn',
        onComplete: () => confetti.destroy()
      });
    }
    
    // Ondas de energía doradas
    for (let i = 0; i < 5; i++) {
      const wave = this.add.circle(centerX, centerY, 15, 0xFFD700, 0.4);
      
      this.tweens.add({
        targets: wave,
        scale: 20,
        alpha: 0,
        duration: 3000,
        delay: i * 400,
        ease: 'Power2.easeOut',
        onComplete: () => wave.destroy()
      });
    }
    
    // Partículas flotantes de celebración
    for (let i = 0; i < 25; i++) {
      const floatingParticle = this.add.circle(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(400, 500),
        Phaser.Math.Between(2, 6),
        0xFFD700,
        0.8
      );
      
      this.tweens.add({
        targets: floatingParticle,
        y: floatingParticle.y - Phaser.Math.Between(100, 200),
        x: floatingParticle.x + Phaser.Math.Between(-50, 50),
        alpha: 0,
        scale: { from: 1, to: 0.2 },
        duration: Phaser.Math.Between(3000, 5000),
        delay: i * 150,
        ease: 'Power1.easeOut',
        onComplete: () => floatingParticle.destroy()
      });
    }
  }

  completeGame() {
    // Transición a la siguiente escena
    console.log('Juego completado - Transicionando a la siguiente escena');
    
    // Crear efecto de transición
    const fadeOverlay = this.add.rectangle(500, 250, 1000, 500, 0x000000, 0);
    
    this.tweens.add({
      targets: fadeOverlay,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        // Cambiar a la siguiente escena (puedes cambiar 'scenaPrincipal' por la escena que desees)
        this.scene.start('scenaPrincipal');
      }
    });
  }

  createCelebrationEffect() {
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const particle = this.add.text(
          Phaser.Math.Between(100, 700),
          Phaser.Math.Between(100, 500),
          Phaser.Math.RND.pick(['✨', '🎆', '⭐', '💫', '🌟']),
          { fontSize: '20px' }
        );
        
        this.tweens.add({
          targets: particle,
          scaleX: 2,
          scaleY: 2,
          alpha: 0,
          duration: 1000,
          onComplete: () => particle.destroy()
        });
      });
    }
  }

  // Función de celebración simplificada para iOS
  createSimpleCelebrationEffect() {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    // Solo crear 3 partículas simples
    for (let i = 0; i < 3; i++) {
      const particle = this.add.circle(
        centerX + Phaser.Math.Between(-100, 100),
        centerY + Phaser.Math.Between(-50, 50),
        5,
        0x00ff88
      );
      
      // Animación muy simple
      this.tweens.add({
        targets: particle,
        alpha: { from: 1, to: 0 },
        scale: { from: 1, to: 0.5 },
        duration: 1000,
        delay: i * 200,
        ease: 'Power2.easeOut',
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  setupControls() {
    // Controles de teclado para navegación
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Tecla ESC para menú
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('scenaPrincipal');
    });
  }

  update() {
    // Optimización de rendimiento: limitar actualizaciones innecesarias
    if (this.gameState === 'intro' || this.gameState === 'dialogue') {
      return; // No necesita actualizaciones constantes en estos estados
    }
    
    // Actualizar efectos de fondo de manera optimizada
    if (this.backgroundParticles && this.backgroundParticles.length > 0) {
      this.backgroundParticles.forEach(particle => {
        if (particle.y < -50) {
          particle.y = 650;
          particle.x = Phaser.Math.Between(0, 800);
          particle.setAlpha(0.3);
        }
      });
    }
    
    // Limpiar tweens completados para liberar memoria
    if (this.time.now % 1000 === 0) { // Cada segundo
      this.tweens.getAllTweens().forEach(tween => {
        if (tween.isComplete()) {
          tween.destroy();
        }
      });
    }
    
    // Optimizar partículas: remover las que están fuera de pantalla
    this.children.list.forEach(child => {
      if (child.type === 'Arc' && child.getData && child.getData('isParticle')) {
        if (child.x < -50 || child.x > 850 || child.y < -50 || child.y > 650 || child.alpha <= 0.1) {
          child.destroy();
        }
      }
    });
    
    // Limitar la frecuencia de actualización de efectos visuales
    if (this.time.now % 200 === 0) { // Cada 200ms
      this.updateOptimizedVisualEffects();
    }
    
    // Actualizar efectos según el estado del juego
    switch (this.gameState) {
      case 'neural_puzzle':
        this.updateNeuralNetworkEffects();
        break;
      case 'ai_dialogue':
        this.updateAIEffects();
        break;
    }
  }
  
  updateOptimizedVisualEffects() {
    // Detectar móvil para aplicar optimizaciones específicas
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Actualizar efectos visuales de manera eficiente
    if (this.gameState === 'neural_puzzle' && this.connections) {
      if (isMobile) {
        // Versión ultra-simplificada para móvil
        this.connections.forEach((connection, index) => {
          if (connection.line && connection.line.active) {
            // Solo actualizar cada segundo para móvil
            if (this.time.now % 1000 === 0) {
              connection.line.setAlpha(0.8); // Alpha fijo para móvil
            }
          }
        });
      } else {
        // Versión normal para desktop
        this.connections.forEach((connection, index) => {
          if (connection.line && connection.line.active) {
            // Solo actualizar cada cierto tiempo para optimizar
            if (this.time.now % (400 + index * 150) === 0) {
              connection.line.setAlpha(Phaser.Math.FloatBetween(0.7, 1));
            }
          }
        });
      }
    }
  }
  
  // Método para limpiar recursos y optimizar memoria
  cleanupResources() {
    // Detener música de fondo
    if (this.backgroundMusic && this.backgroundMusic.stop) {
      this.backgroundMusic.stop();
    }
    
    // Limpiar tweens inactivos
    this.tweens.killAll();
    
    // Limpiar timers
    this.time.removeAllEvents();
    
    // Limpiar partículas huérfanas
    this.children.list.forEach(child => {
      if (child.type === 'Arc' && child.alpha <= 0) {
        child.destroy();
      }
    });
  }

  // Función de limpieza específica para iOS
  // Optimizar creación de partículas para evitar lag en móvil
  createOptimizedParticle(x, y, color, size = 3, duration = 1000) {
    // Detectar móvil para aplicar límites más estrictos
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Limitar el número máximo de partículas según el dispositivo
    const maxParticles = isMobile ? 10 : 30; // Mucho menos en móvil
    const currentParticles = this.children.list.filter(child => 
      child.type === 'Arc' && child.getData && child.getData('isParticle')
    ).length;
    
    if (currentParticles >= maxParticles) {
      return null; // No crear más partículas si ya hay muchas
    }
    
    // En móvil, crear partículas más simples
    const particle = this.add.circle(x, y, isMobile ? size * 0.7 : size, color, isMobile ? 0.6 : 0.8);
    particle.setData('isParticle', true);
    
    // Auto-destruir después del tiempo especificado (más rápido en móvil)
    const actualDuration = isMobile ? duration * 0.5 : duration;
    this.time.delayedCall(actualDuration, () => {
      if (particle && particle.active) {
        particle.destroy();
      }
    });
    
    return particle;
  }



  updateNeuralNetworkEffects() {
    // Detectar móvil para optimizar efectos
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Consolidar efectos de red neuronal con optimizaciones
    if (!this.connections || this.connections.length === 0) return;
    
    if (isMobile) {
      // Versión ultra-simplificada para móvil - sin efectos adicionales
      return;
    }
    
    // Solo ejecutar efectos en desktop
    this.connections.forEach((conn, index) => {
      if (conn.line && conn.line.active) {
        // Actualizar brillo de manera optimizada
        if (this.time.now % (800 + index * 300) === 0) { // Menos frecuente
          conn.line.setAlpha(Phaser.Math.FloatBetween(0.7, 1));
        }
        
        // Efectos de activación muy ocasionales
        if (Math.random() < 0.02) { // Reducido de 0.05 a 0.02
          this.tweens.add({
            targets: conn.line,
            alpha: 1,
            duration: 150, // Más rápido
            yoyo: true
          });
        }
      }
    });
  }

  updateAIEffects() {
    // Efecto de "pensamiento" optimizado en el avatar de IA
    if (this.aiAvatar && Math.random() < 0.02) {
      this.tweens.add({
        targets: this.aiAvatar,
        tint: 0x00ff88,
        duration: 300,
        yoyo: true,
        onComplete: () => {
          if (this.aiAvatar && this.aiAvatar.active) {
            this.aiAvatar.clearTint();
          }
        }
      });
    }
  }

  // FUNCIONES OPTIMIZADAS PARA PISTAS VISUALES EN MÓVIL
  showConnectionHints(selectedNode) {
    // Limpiar pistas anteriores
    this.clearConnectionHints();
    
    // Inicializar array de pistas si no existe
    if (!this.connectionHints) {
      this.connectionHints = [];
    }
    
    // Detectar si es móvil para simplificar efectos
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Encontrar nodos que se pueden conectar
    this.neuralNetworkNodes.forEach(node => {
      if (node !== selectedNode && this.canConnect(selectedNode, node)) {
        if (isMobile) {
          // Versión simplificada para móvil - solo círculo estático
          const hint = this.add.circle(node.x, node.y, 30, 0x00ff00, 0.4);
          this.connectionHints.push(hint);
        } else {
          // Versión completa para desktop
          const hint = this.add.circle(node.x, node.y, 35, 0x00ff00, 0.3);
          hint.setBlendMode(Phaser.BlendModes.ADD);
          
          // Animación de pulso simplificada
          this.tweens.add({
            targets: hint,
            scaleX: { from: 1, to: 1.3 },
            scaleY: { from: 1, to: 1.3 },
            alpha: { from: 0.3, to: 0.5 },
            duration: 600,
            yoyo: true,
            repeat: 1, // Solo 1 repetición en lugar de infinito
            ease: 'Sine.easeInOut'
          });
          
          this.connectionHints.push(hint);
          
          // Texto solo en desktop
          const hintText = this.add.text(node.x, node.y - 50, '¡Conectar!', {
            fontSize: '10px',
            fill: '#00ff00',
            fontFamily: 'Arial',
            fontWeight: 'bold'
          }).setOrigin(0.5);
          
          hintText.setAlpha(0.8); // Aparición directa sin animación
          this.connectionHints.push(hintText);
        }
      }
    });
  }

  clearConnectionHints() {
    if (this.connectionHints) {
      // Matar todas las animaciones antes de destruir
      this.connectionHints.forEach(hint => {
        if (hint && hint.destroy) {
          this.tweens.killTweensOf(hint);
          hint.destroy();
        }
      });
      this.connectionHints = [];
    }
  }

  // Función para mostrar/ocultar la imagen del patrón objetivo
  togglePatternImage() {
    if (this.patternImageVisible) {
      // Ocultar la imagen
      if (this.patternImage) {
        // Destruir overlay también
        if (this.patternImage.overlay) {
          this.patternImage.overlay.destroy();
        }
        this.patternImage.destroy();
        this.patternImage = null;
      }
      this.patternImageVisible = false;
      this.patternButton.setText('📋 PATRÓN OBJETIVO');
    } else {
      // Mostrar la imagen centrada en la pantalla
      this.patternImage = this.add.image(500, 250, 'nodo_pattern')
        .setOrigin(0.5)
        .setScale(0.3)
        .setDepth(1000); // Asegurar que esté por encima de todo
      
      // Agregar fondo semi-transparente
      const overlay = this.add.rectangle(500, 250, 1000, 500, 0x000000, 0.7)
        .setDepth(999)
        .setInteractive();
      
      // Hacer clic en el overlay también cierra la imagen
      overlay.on('pointerdown', () => {
        this.togglePatternImage();
      });
      
      // Guardar referencia al overlay para poder destruirlo
      this.patternImage.overlay = overlay;
      
      this.patternImageVisible = true;
      this.patternButton.setText('❌ CERRAR PATRÓN');
    }
  }
}