import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { FALLBACK_EXERCISES, Exercise } from "./src/data/fallback_exercises.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS manually with preflight handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY not found or is placeholder. AI translation & tips in Spanish will use preloaded fallback data.");
}

// In-Memory Exercise Cache - Pre-seeded with local fallback exercises so that it is NEVER empty on startup!
let exerciseCache: Exercise[] = [...FALLBACK_EXERCISES];
let isCacheLoading = false;
let isCacheLoadedFromNetwork = false;

// Constant Categories as high-speed fallbacks
const BODY_PARTS = ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"];
const MUSCLES = ["abductors", "abs", "adductors", "biceps", "calves", "cardiovascular system", "delts", "forearms", "glutes", "hamstrings", "lats", "levator scapulae", "pectorals", "quads", "serratus anterior", "spine", "traps", "triceps", "upper back"];
const EQUIPMENTS = ["assisted", "band", "barbell", "body weight", "bosu ball", "cable", "dumbbell", "elliptical machine", "ez barbell", "hammer", "kettlebell", "medicine ball", "olympic barbell", "resistance band", "roller", "rope", "skierg machine", "sled machine", "smith machine", "stability ball", "stationary bike", "stepper", "leverage machine", "weighted", "wheel roller"];

// Pre-fill Spanish translations for categories
const CATEGORY_TRANSLATIONS: { [key: string]: string } = {
  // Body Parts
  "back": "Espalda",
  "cardio": "Cardio",
  "chest": "Pecho",
  "lower arms": "Antebrazo",
  "lower legs": "Pantorrilla",
  "neck": "Cuello",
  "shoulders": "Hombros",
  "upper arms": "Brazos",
  "upper legs": "Piernas",
  "waist": "Abdomen / Cintura",
  
  // Muscles
  "abductors": "Abductores",
  "abs": "Abdominales",
  "adductors": "Aductores",
  "biceps": "Bíceps",
  "calves": "Pantorrillas",
  "cardiovascular system": "Sistema Cardiovascular",
  "delts": "Deltoides",
  "forearms": "Antebrazos",
  "glutes": "Glúteos",
  "hamstrings": "Isquiotibiales",
  "lats": "Dorsales",
  "levator scapulae": "Elevador de la escápula",
  "pectorals": "Pectorales",
  "quads": "Cuádriceps",
  "serratus anterior": "Serrato anterior",
  "spine": "Espina erectora",
  "traps": "Trapecios",
  "triceps": "Tríceps",
  "upper back": "Espalda superior",

  // Equipments
  "assisted": "Asistido",
  "band": "Banda elástica",
  "barbell": "Barra",
  "body weight": "Peso corporal",
  "bosu ball": "Bosu",
  "cable": "Cable / Polea",
  "dumbbell": "Mancuerna",
  "elliptical machine": "Elíptica",
  "ez barbell": "Barra EZ",
  "hammer": "Martillo",
  "kettlebell": "Pesa rusa (Kettlebell)",
  "medicine ball": "Balón medicinal",
  "olympic barbell": "Barra olímpica",
  "resistance band": "Banda de resistencia",
  "roller": "Rodillo",
  "rope": "Soga / Cuerda",
  "skierg machine": "Máquina SkiErg",
  "sled machine": "Trineo de empuje",
  "smith machine": "Máquina Smith (Multipower)",
  "stability ball": "Balón de estabilidad",
  "stationary bike": "Bicicleta fija",
  "stepper": "Escaladora / Stepper",
  "leverage machine": "Máquina de palanca",
  "weighted": "Cargado con peso",
  "wheel roller": "Rueda abdominal"
};

// Helper: robustly fetch with a timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Fetch exercises from WorkoutX API and map them safely
async function fetchWorkoutXExercises(): Promise<Exercise[]> {
  const workoutXKey = "wx_d4fc4fdc2c83e9d25ca87cc8e0e3e51fc34aa911bd67ef86dce40daa";
  try {
    console.log("Attempting to fetch exercises from WorkoutX API...");
    const res = await fetchWithTimeout("https://api.workoutxapp.com/v1/exercises", {
      headers: {
        "X-WorkoutX-Key": workoutXKey
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      let rawExercises: any[] = [];
      if (Array.isArray(data)) {
        rawExercises = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.exercises)) rawExercises = data.exercises;
        else if (Array.isArray(data.results)) rawExercises = data.results;
        else if (Array.isArray(data.items)) rawExercises = data.items;
        else if (Array.isArray(data.data)) rawExercises = data.data;
      }

      console.log(`Successfully fetched ${rawExercises.length} raw exercises from WorkoutX API.`);
      
      const mapped: Exercise[] = rawExercises.map((ex: any, idx: number) => {
        const id = ex.id || ex._id || `workoutx-${idx}`;
        const name = ex.name || ex.title || "WorkoutX Exercise";
        const bodyPart = ex.bodyPart || ex.category || ex.muscleGroup || ex.group || "waist";
        const target = ex.target || ex.muscle || ex.targetMuscle || "abs";
        const equipment = ex.equipment || ex.tool || "body weight";
        const gifUrl = ex.gifUrl || ex.imageUrl || ex.image || "https://assets.exercisedb.io/gifs/0025.gif";
        
        let instructions: string[] = [];
        if (Array.isArray(ex.instructions)) {
          instructions = ex.instructions;
        } else if (typeof ex.instructions === 'string') {
          instructions = ex.instructions.split('\n').filter((l: string) => l.trim().length > 0);
        } else if (ex.description) {
          instructions = [ex.description];
        } else {
          instructions = ["Inicia el movimiento de manera segura.", "Realiza la acción mecánicamente correcta.", "Mantén contracción voluntaria constante."];
        }

        return {
          id: String(id),
          name: name.toLowerCase(),
          bodyPart: bodyPart.toLowerCase(),
          target: target.toLowerCase(),
          equipment: equipment.toLowerCase(),
          gifUrl: gifUrl,
          instructions: instructions,
          isWorkoutX: true
        };
      });

      return mapped;
    } else {
      console.error(`WorkoutX API request failed with status: ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to fetch from WorkoutX API:", err);
  }
  return [];
}

// Populate Cache on Startup or Lazy Load
async function loadExercisesToCache() {
  if (isCacheLoadedFromNetwork || isCacheLoading) return;
  isCacheLoading = true;
  console.log("Loading exercises into fullstack server cache...");
  
  const rapidApiKey = "65e1457ae3msh6055ec67e5abb29p11be89jsn75e65a1df42e";
  const rapidApiHeaders = {
    "X-RapidAPI-Key": rapidApiKey,
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
  };

  let loadedBase = false;

  try {
    // 1. Try to fetch from Free Mirror (no key needed, fast)
    console.log("Attempting query back to OSS Mirror endpoint...");
    const mirrorRes = await fetchWithTimeout("https://oss.exercisedb.dev/api/v1/exercises?limit=1500");
    if (mirrorRes.ok) {
      const data = await mirrorRes.json();
      if (Array.isArray(data) && data.length > 0) {
        exerciseCache = data as Exercise[];
        console.log(`Success! Pre-cached ${exerciseCache.length} exercises using OSS Mirror.`);
        loadedBase = true;
      }
    }
  } catch (err) {
    console.warn("Mirror load failed or timed out. Trying RapidAPI...");
  }

  if (!loadedBase) {
    try {
      // 2. Try RapidAPI endpoint if mirror failed
      const rapidRes = await fetchWithTimeout("https://exercisedb.p.rapidapi.com/exercises?limit=1500", {
        headers: rapidApiHeaders
      });
      if (rapidRes.ok) {
        const data = await rapidRes.json();
        if (Array.isArray(data) && data.length > 0) {
          exerciseCache = data as Exercise[];
          console.log(`Success! Pre-cached ${exerciseCache.length} exercises using RapidAPI.`);
          loadedBase = true;
        }
      }
    } catch (err) {
      console.error("RapidAPI load failed as well:", err);
    }
  }

  if (!loadedBase) {
    // 3. Fallback to local offline catalog if all connections failed
    console.log("Using local FALLBACK_EXERCISES catalog for starting set.");
    exerciseCache = [...FALLBACK_EXERCISES];
  }

  // 4. Fetch and append WorkoutX exercises to the cache
  try {
    const workoutXExercises = await fetchWorkoutXExercises();
    if (workoutXExercises.length > 0) {
      const baseMap = new Map<string, Exercise>();
      exerciseCache.forEach(ex => baseMap.set(ex.id, ex));
      workoutXExercises.forEach(ex => baseMap.set(ex.id, ex));
      exerciseCache = Array.from(baseMap.values());
      console.log(`Successfully merged WorkoutX API exercises. New total exercise cache size: ${exerciseCache.length}`);
    }
  } catch (wxErr) {
    console.error("Error merging WorkoutX exercises into cache:", wxErr);
  }

  if (loadedBase) {
    isCacheLoadedFromNetwork = true;
  }
  isCacheLoading = false;
}

// Initial Boot Cache Load (Async)
loadExercisesToCache().catch(console.error);

// API Endpoint: Categories (Body parts, muscles, equipment)
app.get("/api/exercises/categories", async (req, res) => {
  // If cache is empty and not loading, trigger a load
  if (exerciseCache.length === 0 && !isCacheLoading) {
    await loadExercisesToCache();
  }
  
  // Wait a short time if it is currently loading to avoid getting empty results during startup
  let attempts = 0;
  while (isCacheLoading && exerciseCache.length === 0 && attempts < 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    attempts++;
  }

  // Find all actual active values in the cached exercises
  const activeBodyParts = new Set<string>();
  const activeMuscles = new Set<string>();
  const activeEquipments = new Set<string>();

  exerciseCache.forEach(ex => {
    if (ex.bodyPart) activeBodyParts.add(ex.bodyPart.toLowerCase().trim());
    if (ex.target) activeMuscles.add(ex.target.toLowerCase().trim());
    if (ex.equipment) activeEquipments.add(ex.equipment.toLowerCase().trim());
  });

  const bodyPartsList = activeBodyParts.size > 0 ? Array.from(activeBodyParts) : BODY_PARTS;
  const musclesList = activeMuscles.size > 0 ? Array.from(activeMuscles) : MUSCLES;
  const equipmentsList = activeEquipments.size > 0 ? Array.from(activeEquipments) : EQUIPMENTS;

  bodyPartsList.sort();
  musclesList.sort();
  equipmentsList.sort();

  const bodyPartsEs = bodyPartsList.map(part => ({
    key: part,
    name: CATEGORY_TRANSLATIONS[part] || part.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }));
  const musclesEs = musclesList.map(target => ({
    key: target,
    name: CATEGORY_TRANSLATIONS[target] || target.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }));
  const equipmentsEs = equipmentsList.map(eq => ({
    key: eq,
    name: CATEGORY_TRANSLATIONS[eq] || eq.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }));

  res.json({
    bodyParts: bodyPartsEs,
    muscles: musclesEs,
    equipments: equipmentsEs
  });
});

// Helper: Convert string to Pascal Case for ExerciseDB OSS formatting matches
const toPascalCase = (str: string): string => {
  if (!str) return "";
  return str.split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// API Endpoint: Custom Search & Filters (Optimized Cache-first lookup with Live OSS ExerciseDB Integration)
app.get("/api/exercises/search", async (req, res) => {
  const query = req.query.q ? String(req.query.q).toLowerCase().trim() : "";
  const filterBodyPart = req.query.bodyPart ? String(req.query.bodyPart).toLowerCase().trim() : "";
  const filterMuscle = req.query.muscle ? String(req.query.muscle).toLowerCase().trim() : "";
  const filterEquipment = req.query.equipment ? String(req.query.equipment).toLowerCase().trim() : "";
  
  let results: Exercise[] = [];
  let isFetchedLive = false;

  // Try fetching live from the open source ExerciseDB endpoint
  try {
    const params = new URLSearchParams();
    if (query) {
      params.append("name", toPascalCase(query));
    }
    if (filterBodyPart && filterBodyPart !== "all") {
      params.append("bodyParts", toPascalCase(filterBodyPart));
    }
    if (filterMuscle && filterMuscle !== "all") {
      params.append("targetMuscles", filterMuscle);
    }
    if (filterEquipment && filterEquipment !== "all") {
      params.append("equipments", toPascalCase(filterEquipment));
    }
    params.append("limit", "40");

    const liveUrl = `https://oss.exercisedb.dev/api/v1/exercises?${params.toString()}`;
    console.log(`Live API search request to: ${liveUrl}`);
    
    const liveResponse = await fetchWithTimeout(liveUrl, {}, 4000);
    if (liveResponse.ok) {
      const liveData = await liveResponse.json();
      if (Array.isArray(liveData)) {
        results = liveData;
        isFetchedLive = true;
        console.log(`Successfully fetched ${results.length} live results from oss.exercisedb.dev`);
      } else if (liveData && Array.isArray(liveData.results)) {
        results = liveData.results;
        isFetchedLive = true;
      }
    }
  } catch (err) {
    console.warn("Live query to oss.exercisedb.dev timed out or failed, utilizing local fallback indexing:", err);
  }

  // If live search succeeded, we should ALSO grab matched WorkoutX exercises from local cache and merge them
  if (isFetchedLive && results.length > 0) {
    try {
      if (exerciseCache.length === 0) {
        await loadExercisesToCache();
      }
      let workoutXMatches = exerciseCache.filter(ex => (ex as any).isWorkoutX);

      if (filterBodyPart && filterBodyPart !== "all") {
        workoutXMatches = workoutXMatches.filter(ex => ex.bodyPart && ex.bodyPart.toLowerCase() === filterBodyPart);
      }
      if (filterMuscle && filterMuscle !== "all") {
        workoutXMatches = workoutXMatches.filter(ex => ex.target && ex.target.toLowerCase() === filterMuscle);
      }
      if (filterEquipment && filterEquipment !== "all") {
        workoutXMatches = workoutXMatches.filter(ex => ex.equipment && ex.equipment.toLowerCase() === filterEquipment);
      }
      if (query) {
        workoutXMatches = workoutXMatches.filter(ex => {
          const nameMatch = ex.name && ex.name.toLowerCase().includes(query);
          const partMatch = ex.bodyPart && ex.bodyPart.toLowerCase().includes(query);
          const targetMatch = ex.target && ex.target.toLowerCase().includes(query);
          const eqMatch = ex.equipment && ex.equipment.toLowerCase().includes(query);
          return nameMatch || partMatch || targetMatch || eqMatch;
        });
      }

      if (workoutXMatches.length > 0) {
        const mergedMap = new Map<string, Exercise>();
        // Add WorkoutX exercises first so they are easily visible at the top!
        workoutXMatches.forEach(ex => mergedMap.set(ex.id, ex));
        results.forEach(ex => mergedMap.set(ex.id, ex));
        results = Array.from(mergedMap.values());
      }
    } catch (mergeErr) {
      console.error("Error merging WorkoutX exercises into live search results:", mergeErr);
    }
  }

  // Graceful Fallback if live fetch failed or returned empty results
  if (!isFetchedLive || results.length === 0) {
    // Make sure cache has data
    if (exerciseCache.length === 0) {
      await loadExercisesToCache();
    }

    results = [...exerciseCache];

    // If both cache and loading are empty, use local fallback
    if (results.length === 0) {
      results = [...FALLBACK_EXERCISES];
    }

    // Apply filters
    if (filterBodyPart && filterBodyPart !== "all") {
      results = results.filter(ex => ex.bodyPart && ex.bodyPart.toLowerCase() === filterBodyPart);
    }
    if (filterMuscle && filterMuscle !== "all") {
      results = results.filter(ex => ex.target && ex.target.toLowerCase() === filterMuscle);
    }
    if (filterEquipment && filterEquipment !== "all") {
      results = results.filter(ex => ex.equipment && ex.equipment.toLowerCase() === filterEquipment);
    }

    // Apply text search
    if (query) {
      results = results.filter(ex => {
        const nameMatch = ex.name && ex.name.toLowerCase().includes(query);
        const partMatch = ex.bodyPart && ex.bodyPart.toLowerCase().includes(query);
        const targetMatch = ex.target && ex.target.toLowerCase().includes(query);
        const eqMatch = ex.equipment && ex.equipment.toLowerCase().includes(query);
        return nameMatch || partMatch || targetMatch || eqMatch;
      });
    }
  }

  // Limit to 40 results max per search for client performance & speed
  const paginatedResult = results.slice(0, 40);

  // Auto-translate name & basic fields for the search list based on categories
  const translatedResults = paginatedResult.map(ex => {
    return {
      ...ex,
      bodyPartEs: CATEGORY_TRANSLATIONS[ex.bodyPart] || ex.bodyPart,
      targetEs: CATEGORY_TRANSLATIONS[ex.target] || ex.target,
      equipmentEs: CATEGORY_TRANSLATIONS[ex.equipment] || ex.equipment,
      // For fallback exercises they might already have everything
      nameEs: ex.nameEs || ex.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    };
  });

  res.json({
    results: translatedResults,
    totalCount: results.length,
    isLocalFallback: !isFetchedLive
  });
});

// API Endpoint: Translate & Enrich via Gemini AI
app.post("/api/exercises/enrich", async (req, res) => {
  const { exercise } = req.body;
  if (!exercise) {
    return res.status(400).json({ error: "Debe proveer un objeto de ejercicio válido." });
  }

  // Check if we already have local translated stats (e.g. for fallback exercises)
  if (exercise.nameEs && exercise.instructionsEs && exercise.solanaStats) {
    return res.json(exercise);
  }

  // If Gemini client is not initialized, mock translation/stats in server side
  if (!ai) {
    console.log("No Gemini API key supplied. Emulating exercise translation...");
    const nameEs = exercise.name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + " (Traducido)";
    const bodyPartEs = CATEGORY_TRANSLATIONS[exercise.bodyPart] || exercise.bodyPart;
    const targetEs = CATEGORY_TRANSLATIONS[exercise.target] || exercise.target;
    const equipmentEs = CATEGORY_TRANSLATIONS[exercise.equipment] || exercise.equipment;
    const descriptionEs = `Excelente ejercicio para desarrollar la musculatura y la fuerza del ${targetEs}. Especialmente adecuado para la cadena muscular en la zona de ${bodyPartEs}.`;
    const instructionsEs = exercise.instructions || ["Realice el ejercicio con buena postura.", "Mantenga el core activo.", "Haga de 3 a 4 series controladas."];

    const xpRandom = Math.floor(Math.random() * 30) + 20; // 20-50 XP
    const gasSaved = (Math.random() * 0.002 + 0.001).toFixed(4) + " ETH ($4-$8)";

    const mockStats = {
      xpReward: xpRandom,
      gasSavedEth: gasSaved,
      sweatFactor: "SPL Token Transfer (Fácil)",
      solCoachAdvice: `¡Mantén un ritmo estable al entrenar tus ${targetEs}! En el ecosistema de Solana, valoramos el consenso de alta velocidad, pero para hipertrofia, la fase excéntrica lenta tiene prioridad de red.`
    };

    return res.json({
      ...exercise,
      nameEs,
      bodyPartEs,
      targetEs,
      equipmentEs,
      descriptionEs,
      instructionsEs,
      solanaStats: mockStats,
      isMockAi: true
    });
  }

  // Request the real Gemini AI model to translate and enrich with Solana Proof-of-Sweat gamification
  try {
    const prompt = `
    Eres un deportólogo calificado, entrenador personal bilingüe y un entusiasta de Solana Web3.
    Traduce profesionalmente al español e introduce métricas de gamificación Web3 muy creativas para este ejercicio de fitness.

    DATOS DEL EJERCICIO (En inglés):
    - Nombre del ejercicio: "${exercise.name}"
    - Zona del cuerpo: "${exercise.bodyPart}"
    - Músculo principal: "${exercise.target}"
    - Equipamiento: "${exercise.equipment}"
    - Instrucciones originales: ${JSON.stringify(exercise.instructions)}

    Debes retornar OBLIGATORIAMENTE un JSON estrictamente estructurado según el siguiente esquema TypeScript:
    {
      "nameEs": "Traducción oficial y fluida al español del nombre del ejercicio",
      "bodyPartEs": "Traducción de la zona del cuerpo",
      "targetEs": "Traducción del músculo principal",
      "equipmentEs": "Traducción del equipamiento",
      "descriptionEs": "Una descripción técnica biomecánica en español muy motivadora y precisa sobre cómo funciona el ejercicio y sus beneficios para la hipertrofía/salud (aprox 2 a 3 líneas)",
      "instructionsEs": [
        "Paso 1 traducido rigurosamente al español",
        "Paso 2 traducido rigurosamente al español",
        ...
      ],
      "solanaStats": {
        "xpReward": 35, // Un número entero entre 15 y 60 asignando el valor del entrenamiento
        "gasSavedEth": "0.0025 ETH ($7.50)", // Una comparación divertida del 'gas de energía' ahorrado entrenando, expresado en ETH con su equivalente estimado usd
        "sweatFactor": "Por ejemplo: 'SPL Token Transfer (Rápido)', 'Proof of Sweat', 'Consenso Sol de Alta Velocidad', 'Validator Node Level'",
        "solCoachAdvice": "Consejo técnico motivador del Coach con jerga inteligente de tecnología Solana y blockchain (ejemplo: mantener el torso firme como bloque del consenso, no hacer forks en tu postura, etc)."
      }
    }
    `;

    console.log(`Querying Gemini (gemini-3.5-flash) to translate/enrich: ${exercise.name}`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const textOutput = response.text ? response.text.trim() : "";
    const enrichedData = JSON.parse(textOutput);

    res.json({
      ...exercise,
      ...enrichedData,
      isMockAi: false
    });

  } catch (error) {
    console.error("Gemini Translation generation failed, serving offline translation state:", error);
    // Serve graceful mock translation if JSON parsing or Gemini API fails
    res.json({
      ...exercise,
      nameEs: exercise.name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + " (Traducido)",
      bodyPartEs: CATEGORY_TRANSLATIONS[exercise.bodyPart] || exercise.bodyPart,
      targetEs: CATEGORY_TRANSLATIONS[exercise.target] || exercise.target,
      equipmentEs: CATEGORY_TRANSLATIONS[exercise.equipment] || exercise.equipment,
      descriptionEs: `Ejercicio de alto impacto enfocado en consolidar fuerza y resistencia del ${exercise.target}.`,
      instructionsEs: exercise.instructions || ["Inicie el ejercicio.", "Continúe de forma controlada."],
      solanaStats: {
        xpReward: 30,
        gasSavedEth: "0.0011 ETH ($3.3)",
        sweatFactor: "Proof of Sweat Básico",
        solCoachAdvice: "¡Mantente enfocado en cada bloque de repetición! Registra tu progreso de forma inmutable."
      },
      isMockAi: true
    });
  }
});

// Serve Frontend SPA
async function startServer() {
  // Vite integration in development env
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development Express server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    
    app.use(vite.middlewares);
  } else {
    // In production, serve built client assets from /dist
    console.log("Starting production Express server serving /dist folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Solana Fitness Explorer Server listening on http://localhost:${PORT}`);
  });
}

startServer();
