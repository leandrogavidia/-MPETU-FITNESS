export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
  // Spanish translated properties (provided as initial fallbacks or cached translations)
  nameEs?: string;
  bodyPartEs?: string;
  targetEs?: string;
  equipmentEs?: string;
  descriptionEs?: string;
  instructionsEs?: string[];
  solanaStats?: {
    xpReward: number;
    gasSavedEth: string;
    sweatFactor: string;
    solCoachAdvice: string;
  };
}

export const FALLBACK_EXERCISES: Exercise[] = [
  {
    id: "0025",
    name: "barbell biceps curl",
    bodyPart: "upper arms",
    target: "biceps",
    equipment: "barbell",
    gifUrl: "/assets/images/biceps_cyberflex_1780841992435.png",
    instructions: [
      "Stand up straight with a barbell in your hands, palms facing forward.",
      "Keep your elbows close to your torso and curl the weights while contracting your biceps.",
      "Continue to raise the bar until your biceps are fully contracted and the bar is at shoulder level.",
      "Hold the contracted position for a brief pause, then slowly lower the bar back to the starting position."
    ],
    nameEs: "Curl de bíceps con barra",
    bodyPartEs: "brazos",
    targetEs: "bíceps",
    equipmentEs: "barra",
    descriptionEs: "El ejercicio rey para el desarrollo de la fuerza y del volumen del bíceps braquial. Al mantener los codos bloqueados, aíslas la flexión del codo maximizando la hipertrofia.",
    instructionsEs: [
      "Párate derecho con una barra en las manos, las palmas mirando hacia el frente.",
      "Mantén los codos pegados al torso y flexiona los brazos contrayendo los bíceps.",
      "Sigue subiendo la barra hasta que tus bíceps estén completamente contraídos y la barra a la altura de los hombros.",
      "Mantén la posición de contracción un breve instante, luego baja lentamente la barra a la posición inicial."
    ],
    solanaStats: {
      xpReward: 35,
      gasSavedEth: "0.0012 ETH ($3.5)",
      sweatFactor: "Consenso de Alta Velocidad (Fácil)",
      solCoachAdvice: "¡Mantén tus codos estables como nodos validadores de Solana! Cero balanceo para una máxima eficiencia en la contracción."
    }
  },
  {
    id: "0322",
    name: "dumbbell lateral raise",
    bodyPart: "shoulders",
    target: "deltoids",
    equipment: "dumbbell",
    gifUrl: "/assets/images/lateral_cyberflex_1780842006155.png",
    instructions: [
      "Stand with dumbbells at your sides, knees slightly bent.",
      "Perfect a slight forward lean at the hips.",
      "Raise the dumbbells out to your sides with a slight bend in your elbows.",
      "Lower the weights slowly back to the initial position."
    ],
    nameEs: "Elevaciones laterales con mancuernas",
    bodyPartEs: "hombros",
    targetEs: "deltoides laterales",
    equipmentEs: "mancuernas",
    descriptionEs: "Aísla de forma excelente la porción lateral del deltoides para obtener unos hombros redondeados en 'forma de V' tridimensional. Ideal para optimizar tu presencia física.",
    instructionsEs: [
      "Párate con las mancuernas a los costados, las rodillas ligeramente flexionadas.",
      "Mantén una ligera inclinación hacia adelante desde las caderas.",
      "Eleva las mancuernas lateralmente manteniendo una ligera flexión en los codos.",
      "Baja el peso lentamente de regreso a la posición de inicio."
    ],
    solanaStats: {
      xpReward: 40,
      gasSavedEth: "0.0015 ETH ($4.4)",
      sweatFactor: "Proof of Sweat Intermedio",
      solCoachAdvice: "No subas el peso de golpe. Piensa en el escalado de Solana L1: estabilidad y velocidad progresivas. Sube despacio y siente el ardor."
    }
  },
  {
    id: "0220",
    name: "cable pushdown",
    bodyPart: "upper arms",
    target: "triceps",
    equipment: "cable",
    gifUrl: "/assets/images/pushdown_cyberflex_1780842019157.png",
    instructions: [
      "Attach a straight or angled bar (or rope) to a high pulley and grab with palms facing down.",
      "Standing upright with a very slight forward lean, bring your upper arms close to your body.",
      "Push the bar down using your triceps until your elbows are fully locked out.",
      "Slowly return the bar back to the starting point."
    ],
    nameEs: "Pushdown de tríceps en polea alta",
    bodyPartEs: "brazos",
    targetEs: "tríceps",
    equipmentEs: "polea de cable",
    descriptionEs: "Un ejercicio biomecánico óptimo para aislar la cabeza lateral y medial de tus tríceps. Ofrece tensión mecánica constante durante todo el rango de movimiento.",
    instructionsEs: [
      "Sujeta una barra recta o en ángulo (o soga) a la polea alta y tómala con las palmas hacia abajo.",
      "Párate derecho inclinándote ligeramente hacia adelante, y pega los brazos a los costados del cuerpo.",
      "Empuja la barra hacia abajo usando tus tríceps hasta que los codos queden totalmente extendidos.",
      "Regresa lentamente la barra al punto inicial controlando la resistencia."
    ],
    solanaStats: {
      xpReward: 30,
      gasSavedEth: "0.0010 ETH ($2.9)",
      sweatFactor: "SPL Token Transfer (Fácil)",
      solCoachAdvice: "¡Enfócate en la extensión total! Bloquea el tríceps abajo como un Smart Contract inmutable."
    }
  },
  {
    id: "0652",
    name: "push-up",
    bodyPart: "chest",
    target: "pectorals",
    equipment: "body weight",
    gifUrl: "/assets/images/pushup_cyberflex_1780842033064.png",
    instructions: [
      "Place your hands on the floor slightly wider than shoulder-width apart.",
      "Extend your legs feet behind you, toes tucked, creating a straight plank posture.",
      "Lower your body by bending your elbows until your chest almost touches the floor.",
      "Push yourself back up to the starting position."
    ],
    nameEs: "Flexiones de pecho",
    bodyPartEs: "pecho",
    targetEs: "pectorales",
    equipmentEs: "peso corporal",
    descriptionEs: "El ejercicio calisténico fundamental para el desarrollo multiarticular del torso superior. Trabaja simultáneamente pecho, deltoides anterior, tríceps y estabilizadores del núcleo.",
    instructionsEs: [
      "Coloca tus manos en el suelo un poco más separadas que el ancho de los hombros.",
      "Extiende tus piernas hacia atrás apoyando las puntas de los pies, formando una plancha recta.",
      "Baja tu cuerpo doblando los codos hasta que el pecho casi toque el suelo.",
      "Empújate de vuelta hacia arriba regresando a la posición inicial."
    ],
    solanaStats: {
      xpReward: 32,
      gasSavedEth: "0.0011 ETH ($3.2)",
      sweatFactor: "Consenso Distribuido Básico",
      solCoachAdvice: "No dejes caer la pelvis. Tu abdomen debe estar tan bloqueado como la liquidez en Raydium. Fuerza de núcleo total."
    }
  },
  {
    id: "0651",
    name: "pull-up",
    bodyPart: "back",
    target: "lats",
    equipment: "body weight",
    gifUrl: "/assets/images/pullup_cyberflex_1780842047310.png",
    instructions: [
      "Hang from a pull-up bar with an overhand grip, hands slightly wider than shoulder-width.",
      "Pull your body up by driving your elbows down toward your floor, pulling your chest to the bar.",
      "Concentrate on using your back muscles rather than your arms.",
      "Lower yourself back down in a slow, controlled manner."
    ],
    nameEs: "Dominadas",
    bodyPartEs: "espalda",
    targetEs: "dorsales",
    equipmentEs: "peso corporal",
    descriptionEs: "La máxima prueba de fuerza relativa para la cadena posterior. Otorga amplitud al dorsal ancho y fortalece toda la musculatura escapular posterior.",
    instructionsEs: [
      "Cuélgate de una barra de dominadas con agarre prono, las manos un poco más anchas que los hombros.",
      "Tira de tu cuerpo hacia arriba dirigiendo tus codos hacia el suelo, llevando tu pecho hacia la barra.",
      "Concéntrate en reclutar los músculos de la espalda en lugar de jalar solo con los brazos.",
      "Bájate lentamente de manera controlada hasta estirar completo."
    ],
    solanaStats: {
      xpReward: 50,
      gasSavedEth: "0.0022 ETH ($6.4)",
      sweatFactor: "Validador Solana RPC (Difícil)",
      solCoachAdvice: "Evita el balanceo involuntario (kipping). Ejecuta dominadas estrictas para validar cada bloque muscular al 100%."
    }
  },
  {
    id: "0043",
    name: "barbell squat",
    bodyPart: "cardiovascular system",
    target: "quads",
    equipment: "barbell",
    gifUrl: "/assets/images/squat_cyberflex_1780838673035.png",
    instructions: [
      "Rest a barbell on your upper back, stand with feet shoulder-width wide.",
      "Lower your body by bending at the hips and knees, sitting back as if in a chair.",
      "Push through your heels to return to the upright starting position.",
      "Keep your back straight and head forward throughout the squat."
    ],
    nameEs: "Sentadillas con barra",
    bodyPartEs: "piernas",
    targetEs: "cuádriceps",
    equipmentEs: "barra",
    descriptionEs: "La sentadilla es el ejercicio definitivo de fuerza general. Promueve la liberación hormonal sistémica, fortalece los cuádriceps, glúteos menores y mayores, y la estabilidad espinal.",
    instructionsEs: [
      "Apoya una barra en tu espalda superior, párate con los pies al ancho de los hombros.",
      "Baja tu cuerpo doblando las caderas y rodillas, sentándote atrás como si hubiera una silla.",
      "Presiona con fuerza a través de tus talones para regresar a la posición erguida inicial.",
      "Mantén la espalda recta y la mirada al frente durante toda la sentadilla."
    ],
    solanaStats: {
      xpReward: 55,
      gasSavedEth: "0.0030 ETH ($8.8)",
      sweatFactor: "Mainnet Performance (Muy Difícil)",
      solCoachAdvice: "Baja por debajo del paralelo (90 grados) para activar la prueba de participación (Proof of Participation) del glúteo. ¡Tu base de datos muscular te lo agradecerá!"
    }
  }
];
