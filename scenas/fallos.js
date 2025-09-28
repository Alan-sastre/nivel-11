class scenaFallos extends Phaser.Scene {
  constructor() {
    super({ key: "scenaFallos" });
    
    // Game state variables
    this.currentPhase = 1;
    this.totalPhases = 1;
    this.score = 0;
    this.lives = 3;
    this.phaseComplete = false;
    
    // Phase 1: Neural Network Hacking
    this.neuralNodes = [];
    this.connections = [];
    this.hackingProgress = 0;
    this.targetNodes = [];
    this.nodeSequence = [];
    this.currentSequenceIndex = 0;
    
    // Input handling
    this.cursors = null;
    this.pointer = null;
  }

  preload() {
    // Cargar la música de fondo
    this.load.audio('backgroundMusic', 'assets/scenaPrincipal/musica.mp3');
    
    // Load background assets (optional - will fallback if not found)
    this.load.image('ai_planet_bg', 'assets/ai_planet_bg.svg');
    this.load.image('neural_network', 'assets/neural_network.svg');
    this.load.image('ai_interface', 'assets/ai_interface.svg');
    

 
    
    // Load sound assets with WAV format for better compatibility
    console.log('Iniciando carga de sonidos WAV...');
    
    // Add load event listeners for debugging
    this.load.on('filecomplete', (key, type, data) => {
      if (type === 'audio') {
        console.log(`Audio cargado exitosamente: ${key}`);
      }
    });
    
    this.load.on('loaderror', (file) => {
      console.error(`Error cargando archivo: ${file.key} - ${file.src}`);
    });
    
    // Cargar música de fondo
    this.load.audio('backgroundMusic', 'assets/scenaPrincipal/musica.mp3');
    
    // Cargar sonido de click para los nodos (probando ambos formatos)
    this.load.audio('clickSound', ['assets/sounds/click.wav', 'assets/sounds/click.mp3']);
    
    // No need to preload game objects - we'll create them as graphics
  }

  create() {
    // Get screen dimensions
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    // Configurar la música de fondo
    this.musicManager = MusicManager.getInstance();
    if (!this.musicManager.isPlaying()) {
      const backgroundMusic = this.sound.add('backgroundMusic');
      this.musicManager.setMusic(backgroundMusic);
      this.musicManager.playMusic();
    }
    
    // Initialize audio context on first user interaction
    this.input.once('pointerdown', () => {
      console.log('Primera interacción detectada, activando audio...');
      
      if (this.sound.context && this.sound.context.state === 'suspended') {
        this.sound.context.resume().then(() => {
          console.log('Contexto de audio activado exitosamente');
        }).catch(error => {
          console.error('Error activando contexto de audio:', error);
        });
      }
      
      // Verificar estado del contexto de audio
      console.log('Estado del contexto de audio:', this.sound.context ? this.sound.context.state : 'No disponible');
      
      // No iniciar música adicional aquí ya que MusicManager ya la maneja
      
      // Probar sonido de click
      setTimeout(() => {
        console.log('Probando sonido de click después de activar contexto...');
        this.playClickSound();
      }, 500);
    });
    
    // Detect mobile device
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    ('ontouchstart' in window) || 
                    (navigator.maxTouchPoints > 0);
    
    // Debug: Log mobile detection
    console.log('Mobile detection:', this.isMobile);
    console.log('User Agent:', navigator.userAgent);
    console.log('Touch support:', 'ontouchstart' in window);
    console.log('Max touch points:', navigator.maxTouchPoints);
    
    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;
    
    // Mobile controls not needed for Phase 1
    this.mobileControls = null;
    
    // Add animated background
    this.createAnimatedBackground(screenWidth, screenHeight);
    
    // Create UI elements
    this.createUI(screenWidth, screenHeight);
    
    // Show initial introduction screen instead of starting the game
    this.showInitialIntro();
    
    // Game timer will be initialized when the game actually starts
  }

  createAnimatedBackground(width, height) {
    // Create space background with gradient
    const bg = this.add.rectangle(width/2, height/2, width, height, 0x0f0f23);
    
    // Add animated stars
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 0.9)
      );
      
      // Twinkling animation
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.2, 1),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    
    // Add AI planet
    const planet = this.add.circle(150, height/2, 80, 0x4a90e2, 0.8);
    planet.setStrokeStyle(3, 0x00ffff, 0.6);
    
    // Planet rotation
    this.tweens.add({
      targets: planet,
      rotation: Math.PI * 2,
      duration: 10000,
      repeat: -1,
      ease: 'Linear'
    });
  }

  createUI(width, height) {
    // Header panel - Enhanced for better organization
    const headerBg = this.add.rectangle(width/2, 40, width - 40, 60, 0x1a1a2e, 0.9);
    headerBg.setStrokeStyle(2, 0x00ffff, 0.8);
    
    // Adjust UI layout for mobile devices
    const isMobile = this.isMobile;
    const fontSize = isMobile ? '14px' : '16px';
    
    // For mobile, adjust score position to avoid overlap with controls
    const scoreX = isMobile ? width - 120 : width - 200;
    this.scoreText = this.add.text(scoreX, isMobile ? 25 : 50, 'PUNTOS: 0', {
      font: `bold ${fontSize} Arial`,
      fill: '#00ff00'
    });
    
    // Animación de pulso en el score cuando aumenta
    this.scoreText.setScale(1);
    
    this.livesText = this.add.text(isMobile ? 20 : 50, 25, 'VIDAS: 3', {
      font: `bold ${fontSize} Arial`,
      fill: '#ff4757'
    });
    
    // Phase indicator - Updated to show only Phase 1
    this.phaseText = this.add.text(isMobile ? 20 : 50, isMobile ? 45 : 50, 'FASE: 1 - HACKEO NEURAL', {
      font: `bold ${fontSize} Arial`,
      fill: '#ffffff'
    });
    
    // Animación de brillo sutil en los textos de UI
    [this.scoreText, this.livesText, this.phaseText].forEach((text, index) => {
      this.tweens.add({
        targets: text,
        alpha: 0.8,
        duration: 2000 + (index * 300),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  startPhase1() {
    this.currentPhase = 1;
    this.phaseComplete = false;
    this.timeLeft = 60;
    this.updatePhaseDisplay();
    
    // Clear previous phase elements
    this.clearPhaseElements();
    
    // Start neural network hacking directly (no second intro)
    this.createNeuralHackingGame();
  }

  createNeuralHackingGame() {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    // Crear efectos de fondo animados
    this.createAnimatedBackground();
    
    // Create neural network nodes
    this.neuralNodes = [];
    this.targetNodes = [];
    this.nodeSequence = [];
    this.currentSequenceIndex = 0;
    this.hackingProgress = 0;
    
    // Create 12 nodes in a network pattern
    const nodePositions = [
      {x: centerX - 200, y: centerY - 100}, {x: centerX - 100, y: centerY - 150},
      {x: centerX, y: centerY - 100}, {x: centerX + 100, y: centerY - 150},
      {x: centerX + 200, y: centerY - 100}, {x: centerX - 150, y: centerY},
      {x: centerX - 50, y: centerY}, {x: centerX + 50, y: centerY},
      {x: centerX + 150, y: centerY}, {x: centerX - 100, y: centerY + 100},
      {x: centerX, y: centerY + 150}, {x: centerX + 100, y: centerY + 100}
    ];
    
    nodePositions.forEach((pos, index) => {
      const node = this.add.circle(pos.x, pos.y, 15, 0x4a90e2, 0.8);
      node.setStrokeStyle(3, 0x00ffff, 0.6);
      node.setInteractive({ useHandCursor: true });
      node.nodeIndex = index;
      node.isActive = false;
      
      // Animación de pulso MUY SUTIL para nodos que no están en la secuencia
      this.tweens.add({
        targets: node,
        scaleX: 1.02, // Reducido de 1.1 a 1.02
        scaleY: 1.02, // Reducido de 1.1 a 1.02
        alpha: 0.85,  // Reducido de 0.9 a 0.85
        duration: 3000 + (index * 200), // Aumentado de 1500 a 3000 para ser más lento
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Animación de brillo en el borde MUY REDUCIDA
      this.tweens.add({
        targets: node,
        strokeAlpha: 0.7, // Reducido de 1 a 0.7
        duration: 4000 + (index * 300), // Aumentado de 2000 a 4000 para ser más lento
        yoyo: true,
        repeat: -1,
        ease: 'Power2.easeInOut'
      });
      
      // Node click handler
      node.on('pointerdown', () => {
        this.handleNodeClick(node);
      });
      
      // Hover effects REDUCIDOS para no distraer
      node.on('pointerover', () => {
        // Detener animaciones de pulso temporalmente
        this.tweens.killTweensOf(node);
        
        // Animación de hover MÁS SUTIL
        this.tweens.add({
          targets: node,
          scaleX: 1.15, // Reducido de 1.4 a 1.15
          scaleY: 1.15, // Reducido de 1.4 a 1.15
          alpha: 0.95,  // Reducido de 1 a 0.95
          strokeAlpha: 0.9, // Reducido de 1 a 0.9
          duration: 300, // Aumentado de 200 a 300 para ser más suave
          ease: 'Power2.easeOut' // Cambiado de Back.easeOut a Power2.easeOut para ser menos dramático
        });
        
        node.setFillStyle(0x00ffff, 0.8); // Reducido alpha de 0.9 a 0.8
        node.setStrokeStyle(3, 0xffffff, 0.8); // Reducido grosor de 4 a 3 y alpha de 1 a 0.8
        
        // NO crear efecto de ondas expansivas para reducir distracción
      });
      
      node.on('pointerout', () => {
        if (!node.isActive) {
          // Restaurar animaciones de pulso MÁS SUTILES
          this.tweens.add({
            targets: node,
            scaleX: 1,
            scaleY: 1,
            alpha: 0.8,
            strokeAlpha: 0.6,
            duration: 400, // Aumentado de 300 a 400 para transición más suave
            ease: 'Power2.easeOut',
            onComplete: () => {
              // Reiniciar animaciones de pulso REDUCIDAS
              this.tweens.add({
                targets: node,
                scaleX: 1.02, // Manteniendo el valor reducido
                scaleY: 1.02, // Manteniendo el valor reducido
                alpha: 0.85,  // Manteniendo el valor reducido
                duration: 3000 + (index * 200), // Manteniendo la duración más lenta
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
              });
              
              this.tweens.add({
                targets: node,
                strokeAlpha: 0.7, // Manteniendo el valor reducido
                duration: 4000 + (index * 300), // Manteniendo la duración más lenta
                yoyo: true,
                repeat: -1,
                ease: 'Power2.easeInOut'
              });
            }
          });
          
          node.setFillStyle(0x4a90e2, 0.8);
          node.setStrokeStyle(3, 0x00ffff, 0.6);
        }
      });
      
      this.neuralNodes.push(node);
    });
    
    // Create connections between nodes
    this.createNodeConnections();
    
    // Start the hacking sequence
    this.startHackingSequence();
    
    // Progress bar
    this.createProgressBar(centerX, centerY + 200, 'PROGRESO DE HACKEO');
  }

  createNodeConnections() {
    // Crear conexiones estáticas con gráficos básicos
    const staticGraphics = this.add.graphics();
    staticGraphics.lineStyle(1, 0x00ffff, 0.2);
    
    // Crear conexiones animadas con partículas
    this.connectionLines = [];
    this.dataParticles = [];
    
    // Connect nodes to create network pattern
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 8], [4, 8],
      [5, 6], [6, 7], [7, 8], [5, 9], [6, 10], [7, 10], [8, 11], [9, 10], [10, 11]
    ];
    
    connections.forEach((connection, index) => {
      const node1 = this.neuralNodes[connection[0]];
      const node2 = this.neuralNodes[connection[1]];
      
      // Línea estática de fondo
      staticGraphics.lineBetween(node1.x, node1.y, node2.x, node2.y);
      
      // Crear línea animada para flujo de datos MÁS SUTIL
      const animatedLine = this.add.graphics();
      animatedLine.lineStyle(2, 0x00ffff, 0); // Reducido grosor de 3 a 2
      animatedLine.lineBetween(node1.x, node1.y, node2.x, node2.y);
      this.connectionLines.push(animatedLine);
      
      // Animación de pulso en las conexiones MÁS REDUCIDA
      this.tweens.add({
        targets: animatedLine,
        alpha: 0.4, // Reducido de 0.8 a 0.4
        duration: 4000 + (index * 400), // Aumentado de 2000 a 4000 para ser más lento
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Crear partículas de datos que viajan por las conexiones CON MENOS FRECUENCIA
      this.time.delayedCall(index * 600, () => { // Aumentado de 300 a 600 para menos frecuencia
        this.createDataParticle(node1, node2, index);
      });
    });
    
    // Timer para crear partículas periódicamente CON MENOS FRECUENCIA
    this.dataFlowTimer = this.time.addEvent({
      delay: 6000, // Aumentado de 3000 a 6000 para menos frecuencia
      callback: () => {
        connections.forEach((connection, index) => {
          if (Math.random() < 0.15) { // Reducido de 30% a 15% de probabilidad
            const node1 = this.neuralNodes[connection[0]];
            const node2 = this.neuralNodes[connection[1]];
            this.createDataParticle(node1, node2, index);
          }
        });
      },
      loop: true
    });
  }

  createDataParticle(startNode, endNode, connectionIndex) {
    // Verificar que los nodos existan
    if (!startNode || !endNode || startNode.x === undefined || startNode.y === undefined || 
        endNode.x === undefined || endNode.y === undefined) {
      console.warn('Nodos inválidos para crear partícula de datos');
      return;
    }
    
    // Crear partícula de datos MÁS SUTIL
    const particle = this.add.circle(startNode.x, startNode.y, 2, 0xffffff, 0.6); // Reducido tamaño de 3 a 2 y alpha de 0.9 a 0.6
    particle.setStrokeStyle(1, 0x00ffff, 0.6); // Reducido alpha del stroke de 1 a 0.6
    
    // Efecto de brillo en la partícula MÁS REDUCIDO
    this.tweens.add({
      targets: particle,
      alpha: 0.3, // Reducido de 0.5 a 0.3
      duration: 1000, // Aumentado de 500 a 1000 para ser más lento
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Movimiento de la partícula a lo largo de la conexión MÁS LENTO
    this.tweens.add({
      targets: particle,
      x: endNode.x,
      y: endNode.y,
      duration: 2500 + (connectionIndex * 200), // Aumentado de 1500 a 2500 para ser más lento
      ease: 'Power2.easeInOut',
      onComplete: () => {
        // NO crear efecto de llegada para reducir distracción
        particle.destroy();
      }
    });
    
    this.dataParticles.push(particle);
  }

  startHackingSequence() {
    // Safety check to ensure neuralNodes exists and has elements
    if (!this.neuralNodes || this.neuralNodes.length === 0) {
      console.error("neuralNodes is not properly initialized");
      return;
    }
    
    // Generate random sequence of 6 nodes, ensuring indices are valid
    this.nodeSequence = [];
    const maxNodes = Math.min(6, this.neuralNodes.length); // Don't exceed available nodes
    
    for (let i = 0; i < maxNodes; i++) {
      let randomIndex;
      do {
        randomIndex = Phaser.Math.Between(0, this.neuralNodes.length - 1);
      } while (this.nodeSequence.includes(randomIndex));
      this.nodeSequence.push(randomIndex);
    }
    
    this.currentSequenceIndex = 0;
    
    // Show the sequence to the player
    this.showNodeSequence();
  }

  showNodeSequence() {
    // Safety check to ensure nodeSequence exists
    if (!this.nodeSequence || !Array.isArray(this.nodeSequence) || this.nodeSequence.length === 0) {
      console.error("nodeSequence is not properly initialized");
      return;
    }
    
    // Safety check to ensure neuralNodes exists
    if (!this.neuralNodes || !Array.isArray(this.neuralNodes) || this.neuralNodes.length === 0) {
      console.error("neuralNodes is not properly initialized");
      return;
    }
    
    // Flash the sequence for the player to memorize - SLOWED DOWN
    this.nodeSequence.forEach((nodeIndex, sequenceIndex) => {
      this.time.delayedCall(1500 + sequenceIndex * 1200, () => { // Increased from 1000 + 800 to 1500 + 1200
        const node = this.neuralNodes[nodeIndex];
        
        // Safety check for the specific node
        if (!node) {
          console.error(`Node at index ${nodeIndex} is undefined`);
          return;
        }
        
        // Flash effect - LONGER DURATION
        this.tweens.add({
          targets: node,
          scaleX: 1.5,
          scaleY: 1.5,
          alpha: 1,
          duration: 500, // Increased from 300 to 500
          yoyo: true,
          ease: 'Power2',
          onStart: () => {
            node.setFillStyle(0x00ff00, 1);
          },
          onComplete: () => {
            node.setFillStyle(0x4a90e2, 0.8);
          }
        });
      });
    });
    
    // After showing sequence, allow player input - LONGER WAIT TIME
    this.time.delayedCall(1500 + this.nodeSequence.length * 1200 + 1500, () => { // Increased timing
      this.showInstructions("¡Ahora repite la secuencia!");
    });
  }

  handleNodeClick(node) {
    if (this.phaseComplete) return;
    
    // Reproducir sonido de click al presionar cualquier nodo
    this.playClickSound();
    
    const expectedNodeIndex = this.nodeSequence[this.currentSequenceIndex];
    
    if (node.nodeIndex === expectedNodeIndex) {
      // Correct node clicked
      node.isActive = true;
      node.setFillStyle(0x00ff00, 0.9);
      node.setScale(1.2);
      
      // Add visual confirmation that this node stays marked
      node.setStrokeStyle(3, 0x00ff00);
      
      this.currentSequenceIndex++;
      this.hackingProgress = (this.currentSequenceIndex / this.nodeSequence.length) * 100;
      this.updateProgressBar(this.hackingProgress);
      
      // Success sound effect (visual feedback)
      this.createSuccessEffect(node.x, node.y);
      
      if (this.currentSequenceIndex >= this.nodeSequence.length) {
        // Sequence completed
        this.completePhase1();
      }
    } else {
      // Wrong node clicked
      this.lives--;
      this.updateUI();
      
      // Error effect
      this.createErrorEffect(node.x, node.y);
      
      if (this.lives <= 0) {
        // Si no quedan vidas, ir directamente a game over sin mostrar mensaje de error
        this.gameOver();
        return;
      }
      
      // Solo mostrar mensaje de error si aún quedan vidas
      this.showHackingErrorMessage();
      
      // Reset sequence
      this.resetHackingSequence();
    }
  }

  resetHackingSequence() {
    // Cancelar cualquier tween o timer activo para evitar doble secuencia
    this.tweens.killTweensOf(this.neuralNodes);
    this.time.removeAllEvents();
    
    // Reset ALL nodes to their initial state (complete restart)
    this.neuralNodes.forEach((node, index) => {
      node.isActive = false; // Reset active state
      node.setFillStyle(0x4a90e2, 0.8);
      node.setScale(1);
      node.setStrokeStyle(0); // Remove stroke for all nodes
    });
    
    this.currentSequenceIndex = 0;
    this.hackingProgress = 0;
    this.updateProgressBar(0);
    
    // Show sequence again after delay
    this.time.delayedCall(1000, () => {
      this.showNodeSequence();
    });
  }

  completePhase1() {
    this.phaseComplete = true;
    this.score += 1000;
    this.updateUI();
    
    this.showPhaseComplete("¡JUEGO COMPLETADO!", "Red neuronal hackeada exitosamente");
  }

  showShipShield(ship) {
    // Show shield effect when hit
    ship.shield.setAlpha(0.6);
    ship.shield.setStrokeAlpha(0.8);
    
    this.tweens.add({
      targets: ship.shield,
      scaleX: { from: 0.8, to: 1.2 },
      scaleY: { from: 0.8, to: 1.2 },
      alpha: { from: 0.6, to: 0 },
      strokeAlpha: { from: 0.8, to: 0 },
      duration: 500,
      ease: 'Power2'
    });
  }



  startPhase3() {
    this.currentPhase = 3;
    this.phaseComplete = false;
    this.timeLeft = 60;
    this.updatePhaseDisplay();
    
    this.clearPhaseElements();
    
    this.showPhaseIntro("FASE 3: CONTROL DEL NÚCLEO IA", 
      "OBJETIVO: Estabilizar el núcleo de energía\n\n" +
      "• Usa los botones ▲ y ▼ para ajustar cada barra\n" +
      "• Mantén TODAS las barras en la ZONA VERDE\n" +
      "• Debes mantener 100% de estabilidad por 3 segundos\n" +
      "• Las barras fluctúan automáticamente - ¡mantente alerta!");
    
    this.time.delayedCall(4000, () => {
      console.log('Creating Phase 3 core control game...');
      this.createCoreControlGame();
    });
  }

  createCoreControlGame() {
    console.log('Phase 3 createCoreControlGame started');
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    // === ENHANCED BACKGROUND FOR PHASE 3 ===
    this.createPhase3Background();
    
    // Create control panels
    this.controlPanels = [];
    this.energyBars = [];
    this.stabilizationTargets = [];
    this.coreStability = 100;
    
    // === TÍTULO ELIMINADO PARA EVITAR DUPLICACIÓN ===
    // El título ya se muestra en la introducción de la fase
    
    // === INDICADOR DE ESTABILIDAD DEL NÚCLEO (INTEGRADO EN PANEL SUPERIOR) ===
    // Movido al panel superior junto al tiempo para mejor organización
    this.stabilityText = this.add.text(screenWidth - 150, 25, 'NÚCLEO: 0%', {
      font: 'bold 16px Arial',
      fill: '#ff4757',
      align: 'center'
    }).setOrigin(0.5);
    
    // === ÁREA PRINCIPAL DE CONTROL (REACTORES CENTRADOS) ===
    const reactorAreaY = centerY + 20;
    const reactorSpacing = 140; // Espaciado equidistante
    const reactorStartX = centerX - (reactorSpacing * 1.5); // Para centrar 4 reactores
    
    // Create 4 energy control bars con espaciado mejorado y centrado
    for (let i = 0; i < 4; i++) {
      const x = reactorStartX + (i * reactorSpacing); // Posicionamiento equidistante
      const y = reactorAreaY;
      
      // === ETIQUETA DEL REACTOR ===
      const reactorLabel = this.add.text(x, y - 120, `REACTOR ${i + 1}`, {
        font: 'bold 16px Arial',
        fill: '#00ffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      
      // === BOTONES DE CONTROL PEGADOS A LA BARRA ===
      // Botón subir (arriba de la barra)
      const upButton = this.add.rectangle(x, y - 100, 55, 30, 0x2c3e50);
      upButton.setStrokeStyle(3, 0x3498db);
      upButton.setInteractive({ useHandCursor: true });
      
      const upText = this.add.text(x, y - 100, '▲', {
        font: 'bold 20px Arial',
        fill: '#3498db',
        align: 'center'
      }).setOrigin(0.5);
      
      // Botón bajar (abajo de la barra)
      const downButton = this.add.rectangle(x, y + 100, 55, 30, 0x2c3e50);
      downButton.setStrokeStyle(3, 0xe74c3c);
      downButton.setInteractive({ useHandCursor: true });
      
      const downText = this.add.text(x, y + 100, '▼', {
        font: 'bold 20px Arial',
        fill: '#e74c3c',
        align: 'center'
      }).setOrigin(0.5);
      
      // === FONDO DE LA BARRA ===
      const barBg = this.add.rectangle(x, y, 40, 180, 0x1a1a1a);
      barBg.setStrokeStyle(3, 0x00ffff, 0.8);
      
      // === ZONA VERDE (TARGET ZONE) ===
      const targetZone = this.add.rectangle(x, y - 10, 44, 60, 0x00ff00, 0.3);
      targetZone.setStrokeStyle(4, 0x00ff00, 1.0);
      
      // Etiquetas de zona verde centradas y claras
      this.add.text(x, y - 35, 'ZONA', {
        font: 'bold 12px Arial',
        fill: '#00ff00',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      this.add.text(x, y - 20, 'VERDE', {
        font: 'bold 12px Arial',
        fill: '#00ff00',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      
      // === BARRA DE ENERGÍA ===
      const energyBar = this.add.rectangle(x, y + 30, 35, 90, 0xff4757);
      // Generar niveles más extremos para mayor criticidad
      const randomValue = Math.random();
      if (randomValue < 0.7) { // 70% de probabilidad de niveles críticos
        energyBar.currentLevel = Math.random() < 0.5 ? 
          Phaser.Math.Between(5, 25) :   // Muy bajo (crítico)
          Phaser.Math.Between(75, 95);   // Muy alto (crítico)
      } else {
        energyBar.currentLevel = Phaser.Math.Between(35, 65); // Niveles moderados
      }
      energyBar.targetLevel = 50; // Target is always center
      energyBar.barIndex = i;
      
      // === PORCENTAJES Y META CON CÓDIGO DE COLORES ===
      // Fondo para los indicadores
      const indicatorBg = this.add.rectangle(x, y + 140, 100, 60, 0x0a0a0a, 0.8);
      indicatorBg.setStrokeStyle(2, 0x666666, 0.6);
      
      // Porcentaje actual con código de colores
      const currentPercentage = energyBar.currentLevel;
      let percentageColor = '#ff4757'; // Rojo por defecto (crítico)
      let statusText = 'CRÍTICO';
      
      if (currentPercentage >= 45 && currentPercentage <= 55) {
        percentageColor = '#00ff00'; // Verde (correcto)
        statusText = 'CORRECTO';
      } else if (currentPercentage >= 35 && currentPercentage <= 65) {
        percentageColor = '#ffa502'; // Amarillo (advertencia)
        statusText = 'ADVERTENCIA';
      }
      
      const levelText = this.add.text(x, y + 125, `${currentPercentage}%`, {
        font: 'bold 16px Arial',
        fill: percentageColor,
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      
      // Meta (siempre verde)
      const targetText = this.add.text(x, y + 145, 'Meta: 50%', {
        font: 'bold 12px Arial',
        fill: '#00ff00',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5);
      
      // Estado con código de colores
      const statusLabel = this.add.text(x, y + 160, statusText, {
        font: 'bold 11px Arial',
        fill: percentageColor,
        align: 'center',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5);
      
      // === INTERACCIONES DE BOTONES CON ANIMACIONES ===
      upButton.on('pointerdown', () => {
        this.adjustEnergyLevel(i, 8);
        // Animación de click suave
        this.tweens.add({
          targets: upButton,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 80,
          yoyo: true,
          ease: 'Power2'
        });
      });
      
      downButton.on('pointerdown', () => {
        this.adjustEnergyLevel(i, -8);
        // Animación de click suave
        this.tweens.add({
          targets: downButton,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 80,
          yoyo: true,
          ease: 'Power2'
        });
      });
      
      // Efectos hover consistentes
      [upButton, downButton].forEach(button => {
        button.on('pointerover', () => {
          this.tweens.add({
            targets: button,
            fillColor: 0x3498db,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 120,
            ease: 'Power2'
          });
        });
        button.on('pointerout', () => {
          this.tweens.add({
            targets: button,
            fillColor: 0x2c3e50,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 120,
            ease: 'Power2'
          });
        });
      });
      
      this.energyBars.push(energyBar);
      this.controlPanels.push({ 
        barBg, energyBar, targetZone, upButton, downButton, levelText, targetText, statusLabel 
      });
    }
    
    // === RELOJ DE ESTABILIDAD MEJORADO (POSICIONADO A LA DERECHA) ===
    const clockX = screenWidth - 120; // Posicionado a la derecha
    const clockY = 160;  // Posición vertical bajada para mejor ubicación
    const clockRadius = 35; // Radio más grande para mejor visibilidad
    
    // Fondo del reloj con efecto glassmorphism
    this.clockBg = this.add.circle(clockX, clockY, clockRadius + 8, 0x1a1a2e, 0.8);
    this.clockBg.setStrokeStyle(2, 0x00ffff, 0.6);
    
    // Círculo principal del reloj con gradiente visual
    this.clockCircle = this.add.circle(clockX, clockY, clockRadius, 0x0f172a, 0.9);
    this.clockCircle.setStrokeStyle(3, 0x00d4ff, 1);
    
    // Círculo interior para efecto de profundidad
    this.clockInner = this.add.circle(clockX, clockY, clockRadius - 10, 0x000000, 0);
    this.clockInner.setStrokeStyle(1, 0x334155, 0.8);
    
    // Marcadores de tiempo (12, 3, 6, 9)
    for (let i = 0; i < 4; i++) {
      const angle = (i * 90) * Math.PI / 180;
      const markX = clockX + Math.cos(angle - Math.PI/2) * (clockRadius - 5);
      const markY = clockY + Math.sin(angle - Math.PI/2) * (clockRadius - 5);
      this.add.circle(markX, markY, 2, 0x00d4ff, 1);
    }
    
    // Manecilla principal del reloj (más gruesa y con efecto)
    this.clockHand = this.add.line(clockX, clockY, 0, 0, 0, -(clockRadius - 8), 0x00ff88, 1);
    this.clockHand.setLineWidth(4);
    
    // Manecilla secundaria para efecto visual
    this.clockHandShadow = this.add.line(clockX, clockY, 0, 0, 0, -(clockRadius - 8), 0x000000, 0.3);
    this.clockHandShadow.setLineWidth(6);
    
    // Centro del reloj
    this.clockCenter = this.add.circle(clockX, clockY, 4, 0x00ff88, 1);
    this.clockCenter.setStrokeStyle(1, 0x000000, 1);
    
    // Texto del tiempo con mejor diseño
    this.stabilityTimerText = this.add.text(clockX, clockY + clockRadius + 25, '0.0s / 3.0s', {
      font: 'bold 12px Arial',
      fill: '#00d4ff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Etiqueta del reloj
    this.clockLabel = this.add.text(clockX, clockY - clockRadius - 20, 'ESTABILIDAD', {
      font: 'bold 10px Arial',
      fill: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // === INICIALIZACIÓN DE VARIABLES DE CONTROL ===
    this.stabilizationTime = 0;
    this.isStabilized = false;
    this.requiredStabilizationTime = 3.0;
    
    // === ACTUALIZACIÓN INICIAL DE LA INTERFAZ ===
    this.updateCoreControlUI();
    console.log('Phase 3 createCoreControlGame completed successfully');
  }

  // Método updateCoreControlUI optimizado para la nueva interfaz
  updateCoreControlUI() {
    if (this.phaseComplete) return;
    
    let stabilizedBars = 0;
    
    // Actualizar cada reactor con código de colores
    this.energyBars.forEach((bar, index) => {
      const panel = this.controlPanels[index];
      if (!panel) return;
      
      // Actualizar visual de la barra con animación suave
      const barHeight = (bar.currentLevel / 100) * 180;
      const barY = bar.y + 90 - (barHeight / 2);
      
      this.tweens.add({
        targets: bar,
        displayHeight: barHeight,
        y: barY,
        duration: 200,
        ease: 'Power2'
      });
      
      // Determinar colores según el código de colores solicitado
      const currentPercentage = Math.round(bar.currentLevel);
      let percentageColor = '#ff4757'; // Rojo por defecto (crítico)
      let statusText = 'CRÍTICO';
      let barColor = 0xff4757;
      
      if (currentPercentage >= 45 && currentPercentage <= 55) {
        percentageColor = '#00ff00'; // Verde (correcto)
        statusText = 'CORRECTO';
        barColor = 0x00ff00;
        stabilizedBars++;
      } else if (currentPercentage >= 35 && currentPercentage <= 65) {
        percentageColor = '#ffa502'; // Amarillo (advertencia)
        statusText = 'ADVERTENCIA';
        barColor = 0xffa502;
      }
      
      // Actualizar color de la barra con transición suave
      this.tweens.add({
        targets: bar,
        fillColor: barColor,
        duration: 300,
        ease: 'Power2'
      });
      
      // Actualizar texto del porcentaje
      if (panel.levelText) {
        const newText = `${currentPercentage}%`;
        if (panel.levelText.text !== newText) {
          panel.levelText.setText(newText);
          panel.levelText.setFill(percentageColor);
          
          // Efecto de pulso al cambiar
          this.tweens.add({
            targets: panel.levelText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 150,
            yoyo: true,
            ease: 'Power2'
          });
        }
      }
      
      // Actualizar texto de estado
      if (panel.statusLabel) {
        panel.statusLabel.setText(statusText);
        panel.statusLabel.setFill(percentageColor);
      }
    });
    
    // Actualizar indicador de estabilidad del núcleo
    const stabilityPercentage = Math.round((stabilizedBars / 4) * 100);
    let stabilityColor = '#ff4757'; // Rojo por defecto (crítico)
    let stabilityBgColor = 0xff4757;
    
    if (stabilizedBars === 4) {
      stabilityColor = '#00ff00'; // Verde (estable)
      stabilityBgColor = 0x00ff00;
    } else if (stabilizedBars >= 2) {
      stabilityColor = '#ffa502'; // Amarillo (advertencia)
      stabilityBgColor = 0xffa502;
    }
    
    // Actualizar texto y fondo de estabilidad
    if (this.stabilityText) {
      this.stabilityText.setText(`NÚCLEO: ${stabilityPercentage}%`);
      this.stabilityText.setFill(stabilityColor);
    }
    
    if (this.stabilityBg) {
      this.tweens.add({
        targets: this.stabilityBg,
        fillColor: stabilityBgColor,
        duration: 300,
        ease: 'Power2'
      });
    }
    
    // Actualizar progreso de estabilización
    if (stabilizedBars === 4) {
      if (!this.isStabilized) {
        this.isStabilized = true;
        this.stabilizationTime = 0;
      }
      this.stabilizationTime += 0.016; // Aproximadamente 60 FPS
    } else {
      this.isStabilized = false;
      this.stabilizationTime = 0;
    }
    
    // Actualizar reloj de tiempo en estabilidad con diseño mejorado
    if (this.stabilityTimerText && this.clockHand) {
      const timeText = `${this.stabilizationTime.toFixed(1)}s / ${this.requiredStabilizationTime.toFixed(1)}s`;
      this.stabilityTimerText.setText(timeText);
      
      // Actualizar la manecilla del reloj (360 grados = 3 segundos)
      const progress = Math.min(this.stabilizationTime / this.requiredStabilizationTime, 1);
      const angle = (progress * 360) - 90; // -90 para empezar desde arriba
      this.clockHand.setRotation(Phaser.Math.DegToRad(angle));
      
      // Actualizar también la manecilla sombra
      if (this.clockHandShadow) {
        this.clockHandShadow.setRotation(Phaser.Math.DegToRad(angle));
      }
      
      // Cambiar colores según el progreso con el nuevo diseño
      if (this.stabilizationTime >= this.requiredStabilizationTime) {
        this.stabilityTimerText.setFill('#00ff00'); // Verde cuando se completa
        this.clockHand.setStrokeStyle(4, 0x00ff00, 1);
        this.clockCircle.setStrokeStyle(3, 0x00ff00, 1);
        this.clockBg.setStrokeStyle(2, 0x00ff00, 0.8);
      } else if (this.isStabilized) {
        this.stabilityTimerText.setFill('#ffa502'); // Amarillo cuando está progresando
        this.clockHand.setStrokeStyle(4, 0xffa502, 1);
        this.clockCircle.setStrokeStyle(3, 0xffa502, 1);
        this.clockBg.setStrokeStyle(2, 0xffa502, 0.8);
      } else {
        this.stabilityTimerText.setFill('#ff4757'); // Rojo cuando no está estabilizado
        this.clockHand.setStrokeStyle(4, 0xff4757, 1);
        this.clockCircle.setStrokeStyle(3, 0xff4757, 1);
        this.clockBg.setStrokeStyle(2, 0xff4757, 0.8);
      }
    }
    
    // Verificar si se completó la fase
    if (this.stabilizationTime >= this.requiredStabilizationTime && !this.phaseComplete) {
      this.completePhase3();
    }
  }

  adjustEnergyLevel(barIndex, adjustment) {
    if (this.phaseComplete) return;
    
    const energyBar = this.energyBars[barIndex];
    const oldLevel = energyBar.currentLevel;
    energyBar.currentLevel = Phaser.Math.Clamp(energyBar.currentLevel + adjustment, 0, 100);
    
    // Efecto visual mejorado con chispas
    const panel = this.controlPanels[barIndex];
    if (panel && panel.energyBar) {
      // Crear efecto de "chispa" al ajustar
      const spark = this.add.circle(panel.energyBar.x, panel.energyBar.y, 8, 0x00ffff, 0.8);
      this.tweens.add({
        targets: spark,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => spark.destroy()
      });
      
      // Efecto de ondas si el cambio es significativo
      if (Math.abs(adjustment) >= 5) {
        const wave = this.add.circle(panel.energyBar.x, panel.energyBar.y, 15, 0x00ffff, 0.3);
        wave.setStrokeStyle(3, 0x00ffff, 0.6);
        this.tweens.add({
          targets: wave,
          scaleX: 3,
          scaleY: 3,
          alpha: 0,
          duration: 500,
          ease: 'Power2',
          onComplete: () => wave.destroy()
        });
      }
    }
    
    this.createClickEffect(energyBar.x, energyBar.y);
  }

  updateEnergyBars() {
    if (this.phaseComplete) return;
    
    let stabilizedBars = 0;
    
    this.energyBars.forEach((bar, index) => {
      // Update visual representation con animación suave
      const barHeight = (bar.currentLevel / 100) * 180;
      const barY = bar.y + 90 - (barHeight / 2);
      
      // Animación suave del tamaño de la barra
      this.tweens.add({
        targets: bar,
        displayHeight: barHeight,
        y: barY,
        duration: 200,
        ease: 'Power2'
      });
      
      // Update level text con animación
      const panel = this.controlPanels[index];
      if (panel.levelText) {
        const newText = `${Math.round(bar.currentLevel)}%`;
        if (panel.levelText.text !== newText) {
          panel.levelText.setText(newText);
          // Efecto de pulso al cambiar
          this.tweens.add({
            targets: panel.levelText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 150,
            yoyo: true,
            ease: 'Power2'
          });
        }
      }
      
      // Color based on stability con transiciones suaves - AJUSTADO para más criticidad
      const distanceFromTarget = Math.abs(bar.currentLevel - bar.targetLevel);
      let newColor, statusText, statusColor;
      
      if (distanceFromTarget <= 8) { // Zona verde más estricta
        newColor = 0x00ff00; // Green - stable
        statusText = 'ESTABLE';
        statusColor = '#00ff00';
        stabilizedBars++;
      } else if (distanceFromTarget <= 18) { // Zona amarilla reducida
        newColor = 0xffff00; // Yellow - warning
        statusText = 'ADVERTENCIA';
        statusColor = '#ffff00';
      } else {
        newColor = 0xff4757; // Red - critical (zona ampliada)
        statusText = 'CRÍTICO';
        statusColor = '#ff4757';
      }
      
      // Animación suave del color de la barra
      this.tweens.add({
        targets: bar,
        fillColor: newColor,
        duration: 300,
        ease: 'Power2'
      });
      
      // Actualizar textos con animaciones
      if (panel.levelText) {
        this.tweens.add({
          targets: panel.levelText,
          fillColor: newColor,
          duration: 300,
          ease: 'Power2'
        });
      }
      
      if (panel.statusText) {
        if (panel.statusText.text !== statusText) {
          panel.statusText.setText(statusText);
          panel.statusText.setStyle({ fill: statusColor });
          // Efecto de parpadeo al cambiar estado
          this.tweens.add({
            targets: panel.statusText,
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            repeat: 1,
            ease: 'Power2'
          });
        }
      }
    });
    
    // Update core stability
    const stabilityPercentage = (stabilizedBars / this.energyBars.length) * 100;
    this.coreStability = stabilityPercentage;
    
    // Update stability display con animación
    let stabilityColor = '#ff4757';
    if (stabilityPercentage >= 75) stabilityColor = '#00ff00';
    else if (stabilityPercentage >= 50) stabilityColor = '#ffff00';
    
    const newStabilityText = `NÚCLEO: ${Math.round(stabilityPercentage)}%`;
    if (this.stabilityText.text !== newStabilityText) {
      this.stabilityText.setText(newStabilityText);
      // Efecto de pulso para cambios importantes
      this.tweens.add({
        targets: this.stabilityText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        yoyo: true,
        ease: 'Power2'
      });
    }
    
    this.tweens.add({
      targets: this.stabilityText,
      fillColor: stabilityColor,
      duration: 400,
      ease: 'Power2'
    });
    
    // Update progress indicator
    const currentTime = this.stabilizationTime || 0;
    this.stabilizationProgress.setText(`Tiempo en estabilidad: ${currentTime.toFixed(1)}s / 3.0s`);
    
    // Check for phase completion
    if (stabilityPercentage >= 100) {
      this.stabilizationTime = (this.stabilizationTime || 0) + 0.1;
      this.stabilizationProgress.setStyle({ fill: '#00ff00' });
      
      // Efecto visual de éxito
      if (this.stabilizationTime >= 2.5) {
        this.tweens.add({
          targets: this.stabilizationProgress,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 300,
          yoyo: true,
          repeat: -1,
          ease: 'Power2'
        });
      }
      
      if (this.stabilizationTime >= 3) { // Need to maintain 100% for 3 seconds
        this.completePhase3();
      }
    } else {
      this.stabilizationTime = 0;
      this.stabilizationProgress.setStyle({ fill: '#ffff00' });
      // Detener animación de éxito si existe
      this.tweens.killTweensOf(this.stabilizationProgress);
      this.stabilizationProgress.setScale(1.0);
    }
  }

  addEnergyFluctuation() {
    if (this.phaseComplete) return;
    
    // Fluctuaciones más agresivas para mantener criticidad
    const randomBar = Phaser.Math.Between(0, this.energyBars.length - 1);
    const currentLevel = this.energyBars[randomBar].currentLevel;
    const targetLevel = this.energyBars[randomBar].targetLevel;
    
    // Si está cerca del objetivo, alejarlo para mantener criticidad
    if (Math.abs(currentLevel - targetLevel) < 15) {
      const fluctuation = Math.random() < 0.5 ? 
        Phaser.Math.Between(-20, -10) : 
        Phaser.Math.Between(10, 20);
      this.energyBars[randomBar].currentLevel = Phaser.Math.Clamp(
        currentLevel + fluctuation, 
        0, 100
      );
    } else {
      // Fluctuación normal pero más intensa
      const fluctuation = Phaser.Math.Between(-12, 12);
      this.energyBars[randomBar].currentLevel = Phaser.Math.Clamp(
        currentLevel + fluctuation, 
        0, 100
      );
    }
  }

  completePhase3() {
    this.phaseComplete = true;
    this.score += 1500 + (this.timeLeft * 15);
    this.updateUI();
    
    // Stop timers
    if (this.energyUpdateTimer) this.energyUpdateTimer.destroy();
    if (this.fluctuationTimer) this.fluctuationTimer.destroy();
    
    this.showPhaseComplete("¡JUEGO COMPLETADO!", "¡Has reparado exitosamente todos los sistemas!");
    
    this.time.delayedCall(3000, () => {
      this.showGameComplete();
    });
  }

  // Utility methods
  showInitialIntro() {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    const intro = this.add.container(centerX, centerY);
    
    const introBg = this.add.rectangle(0, 0, 700, 350, 0x1a1a2e, 0.95);
    introBg.setStrokeStyle(3, 0x00ffff, 0.8);
    
    const introTitle = this.add.text(0, -120, '¡Ahora repite la secuencia!', {
      font: 'bold 24px Arial',
      fill: '#00ffff',
      align: 'center'
    }).setOrigin(0.5);
    
    const phaseTitle = this.add.text(0, -70, 'FASE 1: HACKEO DE RED NEURONAL', {
      font: 'bold 20px Arial',
      fill: '#00ffff',
      align: 'center'
    }).setOrigin(0.5);
    
    const introText = this.add.text(0, -20, 'Conecta los nodos en la secuencia correcta\nSigue el patrón de luces para hackear la IA', {
      font: '16px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);
    
    // Agregar mensaje de "click para comenzar"
    const clickToBegin = this.add.text(0, 80, 'CLICK EN CUALQUIER LUGAR PARA COMENZAR', {
      font: 'bold 18px Arial',
      fill: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);
    
    intro.add([introBg, introTitle, phaseTitle, introText, clickToBegin]);
    intro.setAlpha(0);
    intro.setScale(0.5);
    
    // Animación de entrada mejorada con escala y rotación
    this.tweens.add({
      targets: intro,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut'
    });
    
    // Animación de pulso en el borde
    this.tweens.add({
      targets: introBg,
      strokeAlpha: 0.4,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Animación de brillo en el título
    this.tweens.add({
      targets: introTitle,
      alpha: 0.7,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Animación de parpadeo en el mensaje de click
    this.tweens.add({
      targets: clickToBegin,
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Esperar click del usuario para comenzar el juego
    const clickHandler = () => {
      this.input.off('pointerdown', clickHandler);
      this.tweens.add({
        targets: intro,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          intro.destroy();
          // Iniciar el juego después de que desaparezca la introducción
          this.startPhase1();
        }
      });
    };
    
    this.input.on('pointerdown', clickHandler);
  }

  showPhaseIntro(title, description) {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    // Clear any existing intro containers first
    this.children.list.forEach(child => {
      if (child.type === 'Container' && child.list && child.list.some(item => 
        item.type === 'Text' && (item.text.includes('FASE') || item.text.includes('HACKEO') || 
        item.text.includes('NAVEGACIÓN') || item.text.includes('CONTROL') || item.text.includes('ESCAPE')))) {
        child.destroy();
      }
    });
    
    const intro = this.add.container(centerX, centerY);
    
    const introBg = this.add.rectangle(0, 0, 650, 280, 0x1a1a2e, 0.95);
    introBg.setStrokeStyle(3, 0x00ffff, 0.8);
    
    const introTitle = this.add.text(0, -80, title, {
      font: 'bold 22px Arial',
      fill: '#00ffff',
      align: 'center'
    }).setOrigin(0.5);
    
    const introText = this.add.text(0, -10, description, {
      font: '16px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);
    
    // Agregar mensaje de "click para comenzar"
    const clickToBegin = this.add.text(0, 80, 'CLICK EN CUALQUIER LUGAR PARA COMENZAR', {
      font: 'bold 18px Arial',
      fill: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);
    
    intro.add([introBg, introTitle, introText, clickToBegin]);
    intro.setAlpha(0);
    intro.setScale(0.5);
    
    // Animación de entrada mejorada con escala y rotación
    this.tweens.add({
      targets: intro,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut'
    });
    
    // Animación de pulso en el borde
    this.tweens.add({
      targets: introBg,
      strokeAlpha: 0.4,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Animación de brillo en el título
    this.tweens.add({
      targets: introTitle,
      alpha: 0.7,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Animación de parpadeo en el mensaje de click
    this.tweens.add({
      targets: clickToBegin,
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Esperar click del usuario para continuar
    const clickHandler = () => {
      this.input.off('pointerdown', clickHandler);
      this.tweens.add({
        targets: intro,
        alpha: 0,
        duration: 500,
        onComplete: () => intro.destroy()
      });
    };
    
    this.input.on('pointerdown', clickHandler);
  }

  showInstructions(text) {
    if (this.instructionText) {
      this.instructionText.destroy();
    }
    
    // Adjust font size and position for mobile
    const fontSize = this.isMobile ? '16px' : '18px';
    const yPosition = this.isMobile ? 80 : 100;
    
    this.instructionText = this.add.text(this.sys.game.config.width/2, yPosition, text, {
      font: `bold ${fontSize} Arial`,
      fill: '#ffff00',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: this.isMobile ? this.sys.game.config.width - 40 : this.sys.game.config.width - 100 }
    }).setOrigin(0.5);
    
    // Blinking effect
    this.tweens.add({
      targets: this.instructionText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut'
    });
  }

  createProgressBar(x, y, label) {
    if (this.progressBarBg) {
      this.progressBarBg.destroy();
      this.progressBar.destroy();
      this.progressLabel.destroy();
    }
    
    this.progressBarBg = this.add.rectangle(x, y, 300, 20, 0x333333);
    this.progressBarBg.setStrokeStyle(2, 0x00ffff);
    
    this.progressBar = this.add.rectangle(x - 148, y, 4, 16, 0x00ff00);
    this.progressBar.setOrigin(0, 0.5);
    
    this.progressLabel = this.add.text(x, y - 30, label, {
      font: 'bold 14px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Animación de pulso en el borde de la barra de progreso
    this.tweens.add({
      targets: this.progressBarBg,
      strokeAlpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Animación de brillo en el label
    this.tweens.add({
      targets: this.progressLabel,
      alpha: 0.8,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Initialize with current progress
    if (this.navigationProgress !== undefined) {
      this.updateProgressBar(this.navigationProgress);
    }
  }

  updateProgressBar(currentProgress) {
    if (this.progressBar && this.progressBarBg) {
      // Calculate percentage - currentProgress is already a percentage (0-100)
      const percentage = Math.min(currentProgress, 100);
      const maxWidth = 296; // Maximum width of the progress bar
      const width = Math.max(4, (percentage / 100) * maxWidth); // Minimum width of 4px
      
      this.progressBar.setDisplaySize(width, 16);
      
      // Position the bar correctly from the left edge of the background
      const bgLeft = this.progressBarBg.x - 150; // Left edge of background
      this.progressBar.x = bgLeft + 2; // Small offset from the edge
    }
  }

  createSuccessEffect(x, y) {
    const effect = this.add.circle(x, y, 20, 0x00ff00, 0.8);
    this.tweens.add({
      targets: effect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => effect.destroy()
    });
  }

  createErrorEffect(x, y) {
    const effect = this.add.circle(x, y, 25, 0xff4757, 0.8);
    this.tweens.add({
      targets: effect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => effect.destroy()
    });
    
    // Sin flash de pantalla - solo el efecto local del círculo
  }

  createClickEffect(x, y) {
    const effect = this.add.circle(x, y, 15, 0x00ffff, 0.6);
    this.tweens.add({
      targets: effect,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => effect.destroy()
    });
  }

  showPhaseComplete(title, message) {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    const complete = this.add.container(centerX, centerY);
    
    // Fondo más grande para acomodar el botón
    const completeBg = this.add.rectangle(0, 0, 600, 250, 0x1a1a2e, 0.95);
    completeBg.setStrokeStyle(3, 0x00ff00, 0.8);
    
    const completeTitle = this.add.text(0, -70, title, {
      font: 'bold 28px Arial',
      fill: '#00ff00',
      align: 'center'
    }).setOrigin(0.5);
    
    const completeText = this.add.text(0, -20, message, {
      font: '18px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Mensaje de felicitaciones adicional
    const congratsText = this.add.text(0, 10, '¡Excelente trabajo, agente!', {
      font: 'bold 16px Arial',
      fill: '#ffaa00',
      align: 'center'
    }).setOrigin(0.5);
    
    // Botón de siguiente
    const nextButton = this.add.rectangle(0, 60, 200, 50, 0x00aa00, 0.8);
    nextButton.setStrokeStyle(2, 0x00ff00, 1);
    
    const nextButtonText = this.add.text(0, 60, 'SIGUIENTE', {
      font: 'bold 18px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Hacer el botón interactivo
    nextButton.setInteractive({ useHandCursor: true });
    
    // Efectos hover del botón
    nextButton.on('pointerover', () => {
      nextButton.setFillStyle(0x00cc00, 1);
      this.tweens.add({
        targets: [nextButton, nextButtonText],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    nextButton.on('pointerout', () => {
      nextButton.setFillStyle(0x00aa00, 0.8);
      this.tweens.add({
        targets: [nextButton, nextButtonText],
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    // Acción del botón
    nextButton.on('pointerdown', () => {
      // Efecto de click
      this.tweens.add({
        targets: [nextButton, nextButtonText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        ease: 'Power2',
        yoyo: true,
        onComplete: () => {
          // Transición a la siguiente escena
          this.scene.start('scenaPrincipal');
        }
      });
    });
    
    complete.add([completeBg, completeTitle, completeText, congratsText, nextButton, nextButtonText]);
    complete.setAlpha(0);
    
    this.tweens.add({
      targets: complete,
      alpha: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      ease: 'Back.easeOut'
    });
  }

  clearPhaseElements() {
    // Clear all phase-specific elements
    if (this.neuralNodes) {
      this.neuralNodes.forEach(node => node.destroy());
      this.neuralNodes = [];
    }
    
    if (this.obstacles) {
      this.obstacles.forEach(obstacle => obstacle.destroy());
      this.obstacles = [];
    }
    
    if (this.collectibles) {
      this.collectibles.forEach(collectible => collectible.destroy());
      this.collectibles = [];
    }
    
    if (this.escapeObstacles) {
      this.escapeObstacles.forEach(obstacle => obstacle.destroy());
      this.escapeObstacles = [];
    }
    
    // Clear space background elements
    if (this.starLayers) {
      this.starLayers.forEach(layer => {
        layer.stars.forEach(star => star.destroy());
      });
      this.starLayers = [];
    }
    
    if (this.nebulaClouds) {
      this.nebulaClouds.forEach(cloud => cloud.destroy());
      this.nebulaClouds = [];
    }
    
    if (this.energyStreams) {
      this.energyStreams.forEach(stream => stream.destroy());
      this.energyStreams = [];
    }
    
    if (this.starScrollTimer) {
      this.starScrollTimer.destroy();
      this.starScrollTimer = null;
    }
    
    // Only clear control panels if we're not starting Phase 3
    if (this.controlPanels && this.currentPhase !== 3) {
      this.controlPanels.forEach(panel => {
        Object.values(panel).forEach(element => element.destroy());
      });
      this.controlPanels = [];
    }
    
    if (this.ship) this.ship.destroy();
    if (this.exitPortal) this.exitPortal.destroy();
    if (this.progressBarBg) this.progressBarBg.destroy();
    if (this.progressBar) this.progressBar.destroy();
    if (this.progressLabel) this.progressLabel.destroy();
    
    // Clear mobile controls
    if (this.mobileControls) {
      this.mobileControls.destroy();
      this.mobileControls = null;
    }
    if (this.mobileInput) {
      this.mobileInput = null;
    }
    if (this.instructionText) this.instructionText.destroy();
    if (this.stabilityText) this.stabilityText.destroy();
    
    // Clear any existing intro containers or messages
    this.children.list.forEach(child => {
      if (child.type === 'Container' && child.list && child.list.some(item => 
        item.type === 'Text' && (item.text.includes('FASE') || item.text.includes('HACKEO') || 
        item.text.includes('NAVEGACIÓN') || item.text.includes('CONTROL') || item.text.includes('ESCAPE')))) {
        child.destroy();
      }
    });
    
    // Clear timers
    if (this.obstacleTimer) this.obstacleTimer.destroy();
    if (this.collectibleTimer) this.collectibleTimer.destroy();
    if (this.energyUpdateTimer) this.energyUpdateTimer.destroy();
    if (this.fluctuationTimer) this.fluctuationTimer.destroy();
    if (this.escapeObstacleTimer) this.escapeObstacleTimer.destroy();
    if (this.warningFlash) this.warningFlash.destroy();
  }

  updateUI() {
    const oldScore = parseInt(this.scoreText.text.split(': ')[1]) || 0;
    const newScore = this.score;
    
    this.scoreText.setText(`PUNTOS: ${this.score}`);
    this.livesText.setText(`VIDAS: ${this.lives}`);
    
    // Animación de pulso cuando el score aumenta
    if (newScore > oldScore) {
      this.tweens.add({
        targets: this.scoreText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true,
        ease: 'Back.easeOut'
      });
      
      // Cambio temporal de color
      const originalColor = this.scoreText.style.fill;
      this.scoreText.setStyle({ fill: '#ffff00' });
      this.time.delayedCall(300, () => {
        this.scoreText.setStyle({ fill: originalColor });
      });
    }
    
    // Update lives color and animation
    if (this.lives <= 1) {
      this.livesText.setStyle({ fill: '#ff4757' });
      // Animación de parpadeo cuando quedan pocas vidas
      this.tweens.add({
        targets: this.livesText,
        alpha: 0.3,
        duration: 300,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut'
      });
    } else if (this.lives <= 2) {
      this.livesText.setStyle({ fill: '#ffaa00' });
    } else {
      this.livesText.setStyle({ fill: '#00ff00' });
    }
    
    // === ACTUALIZAR PANEL DE INFORMACIÓN SUPERIOR DERECHO ===
    // Actualizar información del panel superior derecho si existe
    if (this.infoPhaseText) {
      this.infoPhaseText.setText(`${this.currentPhase || 1}/${this.totalPhases || 3}`);
    }
    
    if (this.infoTimeText) {
      const minutes = Math.floor((this.timeLeft || 60) / 60);
      const seconds = (this.timeLeft || 60) % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      this.infoTimeText.setText(timeString);
      
      // Color del tiempo según criticidad
      if ((this.timeLeft || 60) <= 10) {
        this.infoTimeText.setStyle({ fill: '#ff4757' });
      } else if ((this.timeLeft || 60) <= 30) {
        this.infoTimeText.setStyle({ fill: '#ffaa00' });
      } else {
        this.infoTimeText.setStyle({ fill: '#00ff00' });
      }
    }
    
    if (this.infoScoreText) {
      this.infoScoreText.setText(`${this.score || 0}`);
    }
    
    if (this.infoLivesText) {
      this.infoLivesText.setText(`${this.lives || 3}`);
      
      // Color de las vidas según criticidad
      if ((this.lives || 3) <= 1) {
        this.infoLivesText.setStyle({ fill: '#ff4757' });
      } else if ((this.lives || 3) <= 2) {
        this.infoLivesText.setStyle({ fill: '#ffaa00' });
      } else {
        this.infoLivesText.setStyle({ fill: '#00ff00' });
      }
    }
  }

  updatePhaseDisplay() {
    this.phaseText.setText(`FASE: ${this.currentPhase}/${this.totalPhases}`);
  }

  resetCurrentPhase() {
    this.startPhase1();
  }

  gameOver() {
    this.clearPhaseElements();
    
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    const gameOverContainer = this.add.container(centerX, centerY);
    
    const gameOverBg = this.add.rectangle(0, 0, 600, 350, 0x1a1a2e, 0.95);
    gameOverBg.setStrokeStyle(3, 0xff4757, 0.8);
    
    // Mensaje específico para cada fase
    let titleText = '¡HAS PERDIDO!';
    let messageText = 'Has gastado las 3 vidas';
    
    if (this.currentPhase === 1) {
      titleText = '¡HAS PERDIDO!';
      messageText = 'Has gastado las 3 vidas en la Fase 1 - Hackeo Neural';
    } else if (this.currentPhase === 3) {
      titleText = '¡HAS PERDIDO!';
      messageText = 'Has gastado las 3 vidas en la Fase 3 - Control del Núcleo';
    }
    
    const gameOverTitle = this.add.text(0, -120, titleText, {
      font: 'bold 36px Arial',
      fill: '#ff4757',
      align: 'center'
    }).setOrigin(0.5);
    
    const gameOverMessage = this.add.text(0, -60, messageText, {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    const retryMessage = this.add.text(0, -20, 'HAZ CLICK PARA INTENTARLO DE NUEVO', {
      font: 'bold 22px Arial',
      fill: '#00ffff',
      align: 'center'
    }).setOrigin(0.5);
    
    const finalScore = this.add.text(0, 20, `Puntuación Final: ${this.score}`, {
      font: 'bold 18px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    const restartText = this.add.text(0, 80, 'Haz CLICK para intentarlo de nuevo', {
      font: '16px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Make the entire game over container interactive, not just the restart text
    gameOverContainer.setInteractive(new Phaser.Geom.Rectangle(-300, -175, 600, 350), Phaser.Geom.Rectangle.Contains);
    gameOverContainer.setData('clickable', true);
    
    gameOverContainer.add([gameOverBg, gameOverTitle, gameOverMessage, retryMessage, finalScore, restartText]);
    
    // Blinking restart text
    this.tweens.add({
      targets: restartText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Clear any existing input listeners first
    this.input.keyboard.removeAllListeners();
    this.input.removeAllListeners();
    
    // Make the restart text interactive with animations
    restartText.setInteractive({ useHandCursor: true });
    
    // Add hover animations
    restartText.on('pointerover', () => {
      this.tweens.add({
        targets: restartText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });
    
    restartText.on('pointerout', () => {
      this.tweens.add({
        targets: restartText,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });
    
    // Input handling with proper cleanup - solo click, no espacio
    const restartHandler = () => {
      console.log('Click detected - restarting scene');
      
      // Add click animation before restarting
      this.tweens.add({
        targets: restartText,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        ease: 'Power2',
        yoyo: true,
        onComplete: () => {
          // Clear all listeners before restarting
          this.input.keyboard.removeAllListeners();
          this.input.removeAllListeners();
          restartText.removeAllListeners();
          
          // Reset game state
          this.lives = 3;
          this.score = 0;
          this.currentPhase = 1;
          this.phaseComplete = false;
          this.timeLeft = 60;
          
          // Restart the scene
          this.scene.restart();
        }
      });
    };
    
    // Add click handler to the entire game over container for better usability
    gameOverContainer.on('pointerdown', restartHandler);
    
    // Also add hover effect to the container
    gameOverContainer.on('pointerover', () => {
      gameOverContainer.setAlpha(0.9);
    });
    
    gameOverContainer.on('pointerout', () => {
      gameOverContainer.setAlpha(1);
    });
  }

  update() {
    // Phase 3: Core Control Game
    if (this.currentPhase === 3 && !this.phaseComplete) {
      // Actualizar la interfaz de control del núcleo
      this.updateCoreControlUI();
    }
    
  }



  completeGame() {
    this.phaseComplete = true;
    this.score += 2000;
    
    this.clearPhaseElements();
    
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    const victoryContainer = this.add.container(centerX, centerY);
    
    const victoryBg = this.add.rectangle(0, 0, 700, 400, 0x1a1a2e, 0.95);
    victoryBg.setStrokeStyle(3, 0x00ff00, 0.8);
    
    const victoryTitle = this.add.text(0, -150, '¡MISIÓN COMPLETADA!', {
      font: 'bold 32px Arial',
      fill: '#00ff00',
      align: 'center'
    }).setOrigin(0.5);
    
    const victoryMessage = this.add.text(0, -80, 
      'Has logrado escapar de la singularidad de la IA.\n' +
      'Tu habilidad y reflejos han salvado a la humanidad.',
      {
        font: '18px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 650 }
      }
    ).setOrigin(0.5);
    
    const finalScore = this.add.text(0, 20, `Puntuación Final: ${this.score}`, {
      font: 'bold 24px Arial',
      fill: '#00ffff',
      align: 'center'
    }).setOrigin(0.5);
    
    const continueText = this.add.text(0, 120, 'Haz CLICK para continuar', {
      font: '16px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    victoryContainer.add([victoryBg, victoryTitle, victoryMessage, finalScore, continueText]);
    victoryContainer.setAlpha(0);
    
    this.tweens.add({
      targets: victoryContainer,
      alpha: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      ease: 'Back.easeOut'
    });
    
    // Blinking continue text
    this.tweens.add({
      targets: continueText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Make the continue text interactive with animations
    continueText.setInteractive({ useHandCursor: true });
    
    // Add hover animations
    continueText.on('pointerover', () => {
      this.tweens.add({
        targets: continueText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });
    
    continueText.on('pointerout', () => {
      this.tweens.add({
        targets: continueText,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });
    
    // Input handling
    this.input.keyboard.removeAllListeners();
    this.input.removeAllListeners();
    
    const continueHandler = () => {
      console.log('Continue button clicked - going to Rompecabezas scene');
      
      // Add click animation before continuing
      this.tweens.add({
        targets: continueText,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        ease: 'Power2',
        yoyo: true,
        onComplete: () => {
          // Clear all listeners before continuing
          this.input.keyboard.removeAllListeners();
          this.input.removeAllListeners();
          continueText.removeAllListeners();
          
          // Detener música de fondo antes de cambiar de escena
          this.stopBackgroundMusic();
          
          this.scene.start('scenaVideo2');
        }
      });
    };
    
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on('down', continueHandler);
    
    // Add click handler to both the text and the general input
    continueText.on('pointerdown', continueHandler);
    this.input.on('pointerdown', continueHandler);
  }

  // Método para iniciar música de fondo
  startBackgroundMusic() {
    try {
      if (this.sound && this.cache.audio.exists('backgroundMusic')) {
        this.backgroundMusic = this.sound.add('backgroundMusic', { 
          volume: 0.15,  // Reducido de 0.3 a 0.15 para ser más ameno
          loop: true
        });
        this.backgroundMusic.play();
        console.log('Música de fondo iniciada con volumen reducido');
      }
    } catch (error) {
      console.error('Error iniciando música de fondo:', error);
    }
  }

  // Método para reproducir sonido de click
  playClickSound() {
    try {
      // Verificar si el sistema de sonido está disponible
      if (!this.sound || !this.sound.context) {
        console.warn('Sistema de sonido no disponible');
        return;
      }
      
      // Verificar si el sonido está cargado
      const clickSound = this.sound.get('clickSound');
      if (clickSound && this.sound.context.state === 'running') {
        this.sound.play('clickSound', { volume: 0.5 });
      } else {
        // Silenciosamente fallar si no hay sonido disponible
        console.log('Sonido de click no disponible, continuando sin audio');
      }
    } catch (error) {
      // Silenciosamente manejar errores de audio para no interrumpir el juego
      console.log('Audio no disponible, continuando sin sonido');
    }
  }

  // Método para detener música de fondo
  stopBackgroundMusic() {
    try {
      if (this.backgroundMusic) {
        this.backgroundMusic.stop();
        this.backgroundMusic.destroy();
        this.backgroundMusic = null;
        console.log('Música de fondo detenida');
      }
    } catch (error) {
      console.error('Error deteniendo música de fondo:', error);
    }
  }

  // Función para crear efectos de fondo animados
  createAnimatedBackground() {
    // Grid animado de fondo
    this.createAnimatedGrid();
    
    // Partículas flotantes
    this.createFloatingParticles();
    
    // Ondas de energía
    this.createEnergyWaves();
  }

  createAnimatedGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x00ffff, 0.1);
    
    const gridSize = 50;
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    
    // Líneas verticales
    for (let x = 0; x <= width; x += gridSize) {
      graphics.lineBetween(x, 0, x, height);
    }
    
    // Líneas horizontales
    for (let y = 0; y <= height; y += gridSize) {
      graphics.lineBetween(0, y, width, y);
    }
    
    // Animación de pulso del grid
    this.tweens.add({
      targets: graphics,
      alpha: 0.3,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createFloatingParticles() {
    this.floatingParticles = [];
    
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.sys.game.config.width),
        Phaser.Math.Between(0, this.sys.game.config.height),
        Phaser.Math.Between(1, 3),
        0x00ffff,
        0.6
      );
      
      // Movimiento flotante aleatorio
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-100, 100),
        y: particle.y + Phaser.Math.Between(-100, 100),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Parpadeo
      this.tweens.add({
        targets: particle,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      this.floatingParticles.push(particle);
    }
  }

  createEnergyWaves() {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    // Crear ondas de energía que se expanden desde el centro
    this.time.addEvent({
      delay: 4000,
      callback: () => {
        const wave = this.add.circle(centerX, centerY, 10, 0x00ffff, 0);
        wave.setStrokeStyle(2, 0x00ffff, 0.5);
        
        this.tweens.add({
          targets: wave,
          radius: 400,
          strokeAlpha: 0,
          duration: 3000,
          ease: 'Power2.easeOut',
          onComplete: () => wave.destroy()
        });
      },
      loop: true
    });
  }

  // Función para crear efecto de ondas expansivas
  createRippleEffect(x, y, color = 0x00ffff) {
    const ripple1 = this.add.circle(x, y, 5, color, 0);
    ripple1.setStrokeStyle(2, color, 0.8);
    
    const ripple2 = this.add.circle(x, y, 5, color, 0);
    ripple2.setStrokeStyle(1, color, 0.6);
    
    // Primera onda
    this.tweens.add({
      targets: ripple1,
      radius: 40,
      strokeAlpha: 0,
      duration: 600,
      ease: 'Power2.easeOut',
      onComplete: () => ripple1.destroy()
    });
    
    // Segunda onda con delay
    this.time.delayedCall(200, () => {
      this.tweens.add({
        targets: ripple2,
        radius: 60,
        strokeAlpha: 0,
        duration: 800,
        ease: 'Power2.easeOut',
        onComplete: () => ripple2.destroy()
      });
    });
  }

  // Función para configurar controles táctiles - no necesaria sin Fase 2
  setupTouchControls() {
    // Esta función ya no es necesaria sin la Fase 2
    console.log('Touch controls not needed without Phase 2');
  }

  // Función para mostrar mensaje de felicitaciones con animaciones espectaculares
  showGameComplete() {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    // Crear contenedor principal
    const congratsContainer = this.add.container(centerX, centerY);
    
    // Fondo con efecto de brillo
    const bg = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000011, 0.9);
    congratsContainer.add(bg);
    
    // Título principal con efecto de aparición
    const mainTitle = this.add.text(0, -150, '¡FELICITACIONES!', {
      font: 'bold 48px Arial',
      fill: '#FFD700',
      stroke: '#FF6B35',
      strokeThickness: 4,
      shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 5, fill: true }
    }).setOrigin(0.5);
    
    // Subtítulo
    const subtitle = this.add.text(0, -80, 'HAS COMPLETADO TODAS LAS FASES', {
      font: 'bold 24px Arial',
      fill: '#00FFFF',
      stroke: '#0066CC',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Mensaje de logro
    const achievement = this.add.text(0, -20, 'Sistemas reparados exitosamente\nMisión cumplida con excelencia', {
      font: '18px Arial',
      fill: '#FFFFFF',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5);
    
    // Botón de continuar
    const continueBtn = this.add.text(0, 100, 'PRESIONA EN CUALQUIER LUGAR PARA CONTINUAR', {
      font: 'bold 16px Arial',
      fill: '#FFFF00',
      stroke: '#FF8800',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    congratsContainer.add([mainTitle, subtitle, achievement, continueBtn]);
    
    // Animación de entrada del contenedor
    congratsContainer.setAlpha(0);
    this.tweens.add({
      targets: congratsContainer,
      alpha: 1,
      duration: 1000,
      ease: 'Power2.easeOut'
    });
    
    // Animación del título principal
    mainTitle.setScale(0);
    this.tweens.add({
      targets: mainTitle,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 800,
      ease: 'Back.easeOut',
      delay: 500,
      onComplete: () => {
        // Efecto de pulso continuo
        this.tweens.add({
          targets: mainTitle,
          scaleX: 1,
          scaleY: 1,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
    
    // Animación del subtítulo
    subtitle.setAlpha(0);
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      y: subtitle.y,
      duration: 600,
      ease: 'Power2.easeOut',
      delay: 800
    });
    
    // Animación del mensaje de logro
    achievement.setAlpha(0);
    this.tweens.add({
      targets: achievement,
      alpha: 1,
      duration: 600,
      ease: 'Power2.easeOut',
      delay: 1200
    });
    
    // Animación del botón de continuar (parpadeo)
    continueBtn.setAlpha(0);
    this.time.delayedCall(1800, () => {
      this.tweens.add({
        targets: continueBtn,
        alpha: 1,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    
    // Crear fuegos artificiales
    this.createFireworks();
    
    // Crear partículas de celebración
    this.createCelebrationParticles();
    
    // Crear ondas de energía
    this.createVictoryWaves();
    
    // Manejar input para continuar
    this.input.keyboard.once('keydown', () => {
      this.handleGameCompletion();
    });
    
    this.input.once('pointerdown', () => {
      this.handleGameCompletion();
    });
  }
  
  // Crear efecto de fuegos artificiales
  createFireworks() {
    const colors = [0xFF6B35, 0xFFD700, 0x00FFFF, 0xFF1493, 0x32CD32, 0xFF69B4];
    
    // Crear múltiples fuegos artificiales
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 400, () => {
        const x = Phaser.Math.Between(100, this.sys.game.config.width - 100);
        const y = Phaser.Math.Between(100, this.sys.game.config.height - 200);
        const color = Phaser.Utils.Array.GetRandom(colors);
        
        // Crear explosión central
        const explosion = this.add.circle(x, y, 5, color, 0.8);
        
        // Animación de explosión
        this.tweens.add({
          targets: explosion,
          radius: 80,
          alpha: 0,
          duration: 1000,
          ease: 'Power2.easeOut',
          onComplete: () => explosion.destroy()
        });
        
        // Crear chispas que salen de la explosión
        for (let j = 0; j < 12; j++) {
          const spark = this.add.circle(x, y, 2, color, 0.9);
          const angle = (j / 12) * Math.PI * 2;
          const distance = Phaser.Math.Between(40, 80);
          
          this.tweens.add({
            targets: spark,
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            alpha: 0,
            duration: 800,
            ease: 'Power2.easeOut',
            onComplete: () => spark.destroy()
          });
        }
      });
    }
  }
  
  // Crear partículas de celebración
  createCelebrationParticles() {
    const colors = [0xFFD700, 0xFF6B35, 0x00FFFF, 0xFF1493];
    
    // Crear partículas que caen desde arriba
    this.particleTimer = this.time.addEvent({
      delay: 100,
      callback: () => {
        for (let i = 0; i < 3; i++) {
          const particle = this.add.circle(
            Phaser.Math.Between(0, this.sys.game.config.width),
            -10,
            Phaser.Math.Between(2, 5),
            Phaser.Utils.Array.GetRandom(colors),
            0.8
          );
          
          this.tweens.add({
            targets: particle,
            y: this.sys.game.config.height + 10,
            rotation: Math.PI * 4,
            duration: Phaser.Math.Between(2000, 4000),
            ease: 'Linear',
            onComplete: () => particle.destroy()
          });
        }
      },
      repeat: 50
    });
  }
  
  // Crear ondas de victoria
  createVictoryWaves() {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;
    
    // Crear ondas expansivas desde el centro
    this.waveTimer = this.time.addEvent({
      delay: 800,
      callback: () => {
        const wave = this.add.circle(centerX, centerY, 10, 0xFFD700, 0);
        wave.setStrokeStyle(3, 0xFFD700, 0.6);
        
        this.tweens.add({
          targets: wave,
          radius: 400,
          strokeAlpha: 0,
          duration: 2000,
          ease: 'Power2.easeOut',
          onComplete: () => wave.destroy()
        });
      },
      repeat: 6
    });
  }
  
  // Manejar la finalización del juego
  handleGameCompletion() {
    // Limpiar timers
    if (this.particleTimer) {
      this.particleTimer.destroy();
    }
    if (this.waveTimer) {
      this.waveTimer.destroy();
    }
    
    // Transición a la escena principal o reiniciar
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        this.scene.start('scenaVideo2');
      }
    });
  }

  showHackingErrorMessage() {
    // Crear contenedor para el mensaje de error
    const errorContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
    
    // Fondo del mensaje
    const errorBg = this.add.rectangle(0, 0, 400, 150, 0x330000, 0.9);
    errorBg.setStrokeStyle(3, 0xff0000);
    
    // Título del error
    const errorTitle = this.add.text(0, -30, 'ERROR', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Mensaje de error
    const errorMessage = this.add.text(0, 10, 'Te has equivocado,\nvuelve a intentarlo', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Agregar elementos al contenedor
    errorContainer.add([errorBg, errorTitle, errorMessage]);
    
    // Animación de aparición
    errorContainer.setScale(0);
    errorContainer.setAlpha(0);
    
    this.tweens.add({
      targets: errorContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Mantener visible por 2 segundos y luego desaparecer
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: errorContainer,
            scale: 0,
            alpha: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
              errorContainer.destroy();
            }
          });
        });
      }
    });
  }

  // Handle collision between ship and obstacles
  handleObstacleCollision(ship, obstacle) {
    // Prevent multiple collisions with the same obstacle
    if (obstacle.hasCollided || ship.invincible) return;
    obstacle.hasCollided = true;
    
    this.lives = Math.max(0, this.lives - 1);
    this.updateUI();
    this.createErrorEffect(ship.x, ship.y);
    
    // Remove the obstacle immediately
    obstacle.destroy();
    this.obstacleGroup.remove(obstacle);
    const index = this.obstacles.indexOf(obstacle);
    if (index > -1) this.obstacles.splice(index, 1);
    
    // Add brief invincibility to prevent multiple hits
    ship.invincible = true;
    this.time.delayedCall(1000, () => {
      if (ship && ship.active) {
        ship.invincible = false;
      }
    });
    
    if (this.lives <= 0) {
      this.gameOver();
      return;
    }
  }

  // Handle collision between ship and collectibles
  handleCollectibleCollision(ship, collectible) {
    this.score += 50;
    this.navigationProgress += 10;
    this.updateUI();
    this.updateProgressBar(this.navigationProgress);
    this.createSuccessEffect(collectible.x, collectible.y);
    
    // Remove the collectible
    collectible.destroy();
    this.collectibleGroup.remove(collectible);
    const index = this.collectibles.indexOf(collectible);
    if (index > -1) this.collectibles.splice(index, 1);
    
    // Phase 2 completion logic removed - no longer needed
  }
}