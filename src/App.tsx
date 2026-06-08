import { useState, useEffect } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Maximize2, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Cpu, 
  Coins, 
  Award, 
  Check, 
  TrendingUp, 
  RotateCcw,
  Zap,
  BookOpen,
  Activity,
  Wallet,
  LogOut,
  Copy,
  ExternalLink,
  Info,
  User,
  Trophy,
  BarChart3,
  Edit2,
  Save,
  Clock,
  UserCheck
} from "lucide-react";
import { Exercise, Category, CategoriesResponse, SearchResponse } from "./types";
import { Confetti } from "./components/Confetti";
import { ImpMiningDashboard } from "./components/ImpMiningDashboard";
import { SocialProfileTab } from "./components/SocialProfileTab";
import { ExperienceTab } from "./components/ExperienceTab";
import { StatsTab } from "./components/StatsTab";

export default function App() {
  // Navigation & Profile States
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("impetu_active_tab") || "dashboard";
  });
  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem("impetu_profile_name") || "Atleta de Acero";
  });
  const [profileBio, setProfileBio] = useState<string>(() => {
    return localStorage.getItem("impetu_profile_bio") || "Fisiculturismo On-Chain. Validando contracciones musculares en Solana proof-of-sweat.";
  });
  const [profilePic, setProfilePic] = useState<string>(() => {
    return localStorage.getItem("impetu_profile_pic") || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80";
  });
  const [profileBanner, setProfileBanner] = useState<string>(() => {
    return localStorage.getItem("impetu_profile_banner") || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("impetu_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("impetu_profile_name", profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem("impetu_profile_bio", profileBio);
  }, [profileBio]);

  useEffect(() => {
    localStorage.setItem("impetu_profile_pic", profilePic);
  }, [profilePic]);

  useEffect(() => {
    localStorage.setItem("impetu_profile_banner", profileBanner);
  }, [profileBanner]);

  // General State
  const [categories, setCategories] = useState<{
    bodyParts: Category[];
    muscles: Category[];
    equipments: Category[];
  }>({ bodyParts: [], muscles: [], equipments: [] });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLocalFallback, setIsLocalFallback] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Search Filters
  const [q, setQ] = useState<string>("");
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("all");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all");

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);

  // Selected Detail Modal
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [enrichedExercise, setEnrichedExercise] = useState<Exercise | null>(null);

  // Web3 Solana Workout State
  const [userXp, setUserXp] = useState<number>(() => {
    const saved = localStorage.getItem("solana_fitness_xp");
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [validatedSessions, setValidatedSessions] = useState<string[]>(() => {
    const saved = localStorage.getItem("solana_fitness_validated");
    return saved ? JSON.parse(saved) : [];
  });

  // $IMP Token & Proof-of-Sweat Mining States
  const [userImpBalance, setUserImpBalance] = useState<number>(() => {
    const saved = localStorage.getItem("solana_fitness_imp_balance");
    // Give 120 $IMP on startup for instant trial of the rewards marketplace!
    return saved ? parseFloat(saved) : 120;
  });

  const [unlockedCoupons, setUnlockedCoupons] = useState<string[]>(() => {
    const saved = localStorage.getItem("solana_fitness_unlocked_coupons");
    return saved ? JSON.parse(saved) : [];
  });

  const [showP2PModal, setShowP2PModal] = useState<boolean>(false);
  const [p2pActiveExerciseId, setP2pActiveExerciseId] = useState<string | null>(null);

  const [justValidated, setJustValidated] = useState<boolean>(false);
  const [imageMode, setImageMode] = useState<"gif" | "static">("gif");
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [showDocModal, setShowDocModal] = useState<boolean>(false);
  const [docSubTab, setDocSubTab] = useState<string>("welcome");

  // Web3 Wallet Connections States & Integrations
  const [walletConnected, setWalletConnected] = useState<boolean>(() => {
    return localStorage.getItem("impetu_wallet_connected") === "true";
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    return localStorage.getItem("impetu_wallet_address");
  });
  const [walletType, setWalletType] = useState<'phantom' | 'solflare' | 'backpack' | null>(() => {
    return localStorage.getItem("impetu_wallet_type") as any || null;
  });
  const [walletBalance, setWalletBalance] = useState<number | null>(() => {
    const savedBalance = localStorage.getItem("impetu_wallet_balance");
    return savedBalance ? parseFloat(savedBalance) : null;
  });
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [customAddressInput, setCustomAddressInput] = useState<string>("");
  const [solanaNetwork, setSolanaNetwork] = useState<'mainnet' | 'devnet'>(() => {
    return (localStorage.getItem("impetu_solana_network") as 'mainnet' | 'devnet') || 'mainnet';
  });

  useEffect(() => {
    localStorage.setItem("impetu_wallet_connected", walletConnected.toString());
    if (walletAddress) localStorage.setItem("impetu_wallet_address", walletAddress);
    else localStorage.removeItem("impetu_wallet_address");
    
    if (walletType) localStorage.setItem("impetu_wallet_type", walletType);
    else localStorage.removeItem("impetu_wallet_type");

    if (walletBalance !== null) localStorage.setItem("impetu_wallet_balance", walletBalance.toString());
    else localStorage.removeItem("impetu_wallet_balance");
  }, [walletConnected, walletAddress, walletType, walletBalance]);

  useEffect(() => {
    localStorage.setItem("impetu_solana_network", solanaNetwork);
  }, [solanaNetwork]);

  const fetchBalance = async (pubKey: string, network: 'mainnet' | 'devnet') => {
    try {
      const endpoint = network === 'mainnet' ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com";
      const connection = new Connection(endpoint, "confirmed");
      const balance = await connection.getBalance(new PublicKey(pubKey));
      setWalletBalance(balance / LAMPORTS_PER_SOL);
    } catch (balErr) {
      console.error(`Error al obtener balance en ${network}:`, balErr);
      setWalletBalance(0.0);
    }
  };

  useEffect(() => {
    if (walletConnected && walletAddress) {
      fetchBalance(walletAddress, solanaNetwork);
    }
  }, [solanaNetwork, walletConnected, walletAddress]);

  // Detector of actual extensions present on browser
  const detectWallets = () => {
    const isPhantomInstalled = !!((window as any).solana?.isPhantom || (window as any).phantom?.solana);
    const isSolflareInstalled = !!(window as any).solflare;
    const isBackpackInstalled = !!(window as any).backpack;
    return {
      phantom: isPhantomInstalled,
      solflare: isSolflareInstalled,
      backpack: isBackpackInstalled
    };
  };

  // Connection Handler for different Solana providers
  const connectWallet = async (type: 'phantom' | 'solflare' | 'backpack') => {
    try {
      let pubKey = "";
      if (type === 'phantom') {
        const provider = (window as any).solana || (window as any).phantom?.solana;
        if (provider) {
          const resp = await provider.connect();
          pubKey = resp.publicKey.toString();
        } else {
          window.open("https://phantom.app/", "_blank");
          return;
        }
      } else if (type === 'solflare') {
        const provider = (window as any).solflare;
        if (provider) {
          await provider.connect();
          pubKey = provider.publicKey?.toString();
        } else {
          window.open("https://solflare.com/", "_blank");
          return;
        }
      } else if (type === 'backpack') {
        const provider = (window as any).backpack;
        if (provider) {
          await provider.connect();
          pubKey = provider.publicKey?.toString();
        } else {
          window.open("https://backpack.app/", "_blank");
          return;
        }
      }

      if (pubKey) {
        setWalletAddress(pubKey);
        setWalletType(type);
        setWalletConnected(true);
        setShowWalletModal(false);

        // Fetch real balance from Solana network dynamically based on selected network
        await fetchBalance(pubKey, solanaNetwork);
      }
    } catch (err) {
      console.error("Fallo al conectar wallet:", err);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setWalletType(null);
    setWalletBalance(null);
  };

  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Fetch Dropdown Categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/exercises/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.warn("Failed to retrieve categories API");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
    // Fetch initial exercises
    handleSearch(true);
  }, []);

  // Update localStorage when user XP or sessions change
  useEffect(() => {
    localStorage.setItem("solana_fitness_xp", userXp.toString());
  }, [userXp]);

  useEffect(() => {
    localStorage.setItem("solana_fitness_validated", JSON.stringify(validatedSessions));
  }, [validatedSessions]);

  useEffect(() => {
    localStorage.setItem("solana_fitness_imp_balance", userImpBalance.toString());
  }, [userImpBalance]);

  useEffect(() => {
    localStorage.setItem("solana_fitness_unlocked_coupons", JSON.stringify(unlockedCoupons));
  }, [unlockedCoupons]);

  // Main Search Trigger
  const handleSearch = async (isInitial = false) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      // Build search URL
      const params = new URLSearchParams();
      if (!isInitial) {
        if (q) params.append("q", q);
        if (selectedBodyPart !== "all") params.append("bodyPart", selectedBodyPart);
        if (selectedMuscle !== "all") params.append("muscle", selectedMuscle);
        if (selectedEquipment !== "all") params.append("equipment", selectedEquipment);
      }
      
      const res = await fetch(`/api/exercises/search?${params.toString()}`);
      if (res.ok) {
        const data: SearchResponse = await res.json();
        setExercises(data.results);
        setTotalCount(data.totalCount);
        setIsLocalFallback(data.isLocalFallback);
      } else {
        throw new Error("Respuesta no satisfactoria del servidor remoto.");
      }
    } catch (err) {
      console.error("Fetch exercises failed:", err);
      setErrorMsg("Error al conectar con la red de validadores de ejercicio. Usando capa de respaldo fuera de línea.");
      // Standard local fallback simulation
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setQ("");
    setSelectedBodyPart("all");
    setSelectedMuscle("all");
    setSelectedEquipment("all");
    // Trigger fresh full query
    setTimeout(() => {
      handleSearch(true);
    }, 50);
  };

  // Open & Enrich Single Exercise Detail
  const handleOpenDetail = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setEnrichedExercise(null);
    setIsEnriching(true);
    setImageMode("gif"); // Default to interactive GIF

    try {
      const response = await fetch("/api/exercises/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercise })
      });
      
      if (response.ok) {
        const enriched: Exercise = await response.json();
        setEnrichedExercise(enriched);
      } else {
        // Fallback simulation in-app block
        setEnrichedExercise({
          ...exercise,
          nameEs: exercise.name.toUpperCase(),
          bodyPartEs: exercise.bodyPartEs || exercise.bodyPart,
          targetEs: exercise.targetEs || exercise.target,
          equipmentEs: exercise.equipmentEs || exercise.equipment,
          descriptionEs: "Ejecuta de forma óptima el movimiento manteniendo una contracción sostenida. Sigue el estándar de repetición establecido en Proof of Sweat.",
          instructionsEs: exercise.instructions,
          solanaStats: {
            xpReward: 30,
            gasSavedEth: "0.0015 ETH ($4.30)",
            sweatFactor: "SPL Fast Transfer",
            solCoachAdvice: "¡Mantén el core firme y realiza el ejercicio de forma concentrada!"
          }
        });
      }
    } catch (err) {
      console.error("Enrichment failed:", err);
      // Fallback
      setEnrichedExercise({
        ...exercise,
        nameEs: exercise.name.toUpperCase(),
        bodyPartEs: exercise.bodyPart,
        targetEs: exercise.target,
        equipmentEs: exercise.equipment,
        descriptionEs: "Movimiento técnico tradicional enfocado en optimizar fuerza.",
        instructionsEs: exercise.instructions,
        solanaStats: {
          xpReward: 25,
          gasSavedEth: "0.0010 ETH ($3.00)",
          sweatFactor: "SPL Local Consensus",
          solCoachAdvice: "¡Enfoque en la biomecánica corporal para evitar flicciones posturales!"
        }
      });
    } finally {
      setIsEnriching(false);
    }
  };

  // Validate exercise day activity
  const claimXP = (exerciseId: string, xp: number) => {
    if (validatedSessions.includes(exerciseId)) return; // Already validated
    
    // Each block validated mines an amount of $IMP tokens (Proof-of-Sweat ratio: 3x XP)
    const minedImp = xp * 3;
    
    setValidatedSessions(prev => [...prev, exerciseId]);
    setUserXp(prev => prev + xp);
    setUserImpBalance(prev => prev + minedImp);
    setJustValidated(true);
    
    setTimeout(() => {
      setJustValidated(false);
    }, 2500);
  };

  const resetAllXp = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      // Automatically end confirmation stage after 4 seconds
      setTimeout(() => {
        setConfirmReset(false);
      }, 4000);
      return;
    }

    // Direct state resets (synced with localStorage via useEffects)
    setUserXp(0);
    setUserImpBalance(120);
    setValidatedSessions([]);
    setUnlockedCoupons([]);
    setWalletConnected(false);
    setWalletAddress(null);
    setWalletType(null);
    setWalletBalance(null);
    setConfirmReset(false);
  };

  return (
    <div className="min-h-screen bg-[#05171d] text-teal-100 font-sans tracking-normal relative overflow-x-hidden selection:bg-cyan-800 selection:text-cyan-100">
      
      {/* Background Decorative Turquoise/Cyan Ambient Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1fc1c3]/15 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#00f2fe]/10 rounded-full blur-[160px] pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-[#14f195]/8 rounded-full blur-[150px] pointer-events-none" />
      
      {/* HEADER SECTION */}
      <header className="border-b border-teal-800/60 bg-[#09222c]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Theme Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#00f2fe] to-[#14f195] rounded-xl shadow-[0_0_15px_rgba(31,193,195,0.35)]">
              <Dumbbell className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#0d2d38] text-cyan-300 border border-teal-800/60 tracking-wider font-semibold">WEB3 FITNESS</span>
                <button
                  type="button"
                  onClick={() => setSolanaNetwork(prev => prev === 'mainnet' ? 'devnet' : 'mainnet')}
                  className={`flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded border font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                    solanaNetwork === 'mainnet'
                      ? 'bg-[#14f195]/15 text-[#14f195] border-[#14f195]/30 hover:bg-[#14f195]/25 hover:border-[#14f195]/40'
                      : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/25 hover:border-cyan-500/40'
                  }`}
                  title="Haz clic para cambiar entre Mainnet y Devnet"
                >
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-200 ${
                    solanaNetwork === 'mainnet' ? 'bg-[#14f195]' : 'bg-cyan-400'
                  }`} />
                  SIM {solanaNetwork === 'mainnet' ? 'MAINNET-BETA' : 'DEVNET'}
                </button>
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent">
                ÍMPETU <span className="text-[#14f195]">FITNESS</span>
              </h1>
            </div>
          </div>

          {/* Header Controls Wrapper */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3.5 w-full md:w-auto">
            {/* Web3 Gamified Header Info */}
            <div className="flex items-center justify-between gap-2 bg-[#0d2d38]/80 p-2 sm:p-2.5 rounded-xl border border-teal-900/70 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-2 sm:px-3 border-r border-teal-900/70 flex-1 sm:flex-none">
                <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] text-teal-300 font-mono tracking-wider leading-none">RANGO FÍSICO</p>
                  <p className="text-[11px] sm:text-xs font-bold text-cyan-200 font-mono mt-0.5 whitespace-nowrap">SOL Val. (Lvl {Math.floor(userXp / 100) + 1})</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 sm:px-3 border-r border-teal-900/70 flex-1 sm:flex-none">
                <Coins className="w-4 h-4 text-[#14f195] animate-bounce shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] text-teal-300 font-mono tracking-wider leading-none">XP SWEAT</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[11px] sm:text-sm font-bold text-white font-mono leading-none">{userXp}</span>
                    <span className="text-[9px] text-[#14f195] font-bold leading-none">XP</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 sm:px-3 flex-1 sm:flex-none">
                <Flame className="w-4 h-4 text-orange-400 shrink-0 animate-pulse" />
                <div className="text-left">
                  <p className="text-[9px] text-teal-300 font-mono tracking-wider leading-none">MINERÍA $IMP</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[11px] sm:text-sm font-bold text-orange-400 font-mono leading-none">{userImpBalance.toFixed(0)}</span>
                    <span className="text-[9px] text-orange-500 font-bold leading-none">$IMP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Connect & Reset Controls */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-end shrink-0">
              <button 
                onClick={resetAllXp}
                className={`py-2.5 px-3 font-mono text-[10px] font-bold rounded-xl border transition flex items-center justify-center gap-1.5 h-[38px] ${
                  confirmReset 
                    ? "text-red-100 bg-red-900/60 border-red-650 animate-pulse" 
                    : "text-teal-300 hover:text-red-400 bg-[#0d2d38] hover:bg-teal-950 border-teal-900/70"
                }`}
                title={confirmReset ? "Haz clic de nuevo para confirmar" : "Reiniciar Progreso de Historial"}
                aria-label="Reiniciar progreso"
              >
                <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${confirmReset ? "animate-spin" : ""}`} />
                <span>{confirmReset ? "¿CONFIRMAR?" : "RESETEAR"}</span>
              </button>

              {walletConnected ? (
                <div className="flex items-center gap-2.5 bg-[#14f195]/10 border border-[#14f195]/30 rounded-xl p-2 px-3 leading-none transition h-[38px] w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#14f195] animate-pulse shrink-0" />
                    <div className="text-left font-mono">
                      <p className="text-[8px] text-[#14f195] tracking-wider uppercase font-extrabold leading-none">
                        {walletType?.toUpperCase()} CONECTADO
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10.5px] font-bold text-white" title={walletAddress || undefined}>
                          {walletAddress ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : ""}
                        </span>
                        {walletBalance !== null && (
                          <span className="text-[9px] text-teal-300">
                            ({walletBalance} SOL)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={disconnectWallet}
                    className="ml-1 p-1 hover:bg-red-500/10 hover:text-red-405 rounded-lg text-teal-400 hover:text-red-400 transition cursor-pointer shrink-0"
                    title="Desconectar Billetera"
                    aria-label="Desconectar Billetera"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#14f195] to-[#0fc77a] hover:from-[#3dfca8] hover:to-[#14f195] text-black text-xs font-mono font-extrabold tracking-wider transition hover:shadow-[0_0_15px_rgba(20,241,149,0.35)] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/45 h-[38px] leading-none text-center"
                  aria-label="Conectar una wallet de criptomonedas"
                >
                  <Wallet className="w-4 h-4 stroke-[2.5]" />
                  <span>CONECTAR WALLET</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-28 sm:pb-32 sm:px-6 lg:px-8">
        
        {/* NAVEGACIÓN PRINCIPAL ENTRE APARTADOS - OPTIMIZADA AL 100% PARA MÓVIL (SIEMPRE VISIBLE EN LA PARTE INFERIOR) */}
        <nav className="fixed bottom-0 left-0 right-0 w-full rounded-t-2xl border-t border-teal-800/85 bg-[#082029]/95 px-2.5 pt-2 pb-5 sm:pb-3 z-50 flex items-center justify-between gap-1 shadow-[0_-10px_35px_rgba(0,0,0,0.6)] backdrop-blur-md sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-2rem)] sm:max-w-4xl sm:rounded-2xl sm:border sm:p-2 sm:gap-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity, desc: "Acuñación & Canjes" },
            { id: "stats", label: "Estadísticas", icon: BarChart3, desc: "Métricas" },
            { id: "exercises", label: "Ejercicios", icon: Dumbbell, desc: "Biomecánica" },
            { id: "experience", label: "Ruta XP", icon: Trophy, desc: "Niveles & Rango" },
            { id: "profile", label: "Perfil", icon: User, desc: "Identidad Web3" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 px-0.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl transition-all duration-300 relative text-center cursor-pointer select-none ${
                  isActive 
                    ? "bg-[#0d2d38] border border-teal-750/80 text-white shadow-[0_0_12px_rgba(20,241,149,0.18)] font-bold scale-[1.02]" 
                    : "border border-transparent hover:border-teal-900/20 hover:bg-[#05171d]/40 text-teal-350 hover:text-white"
                }`}
                aria-label={`Ver apartado ${tab.label}`}
              >
                {isActive && (
                  <motion.span 
                    layoutId="active-tab-glow"
                    className="absolute inset-0 rounded-xl bg-cyan-400/5 pointer-events-none border border-cyan-400/15"
                  />
                )}
                
                {/* Active bar dot layout for mobile screens to look like a premium fitness application */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#14f195] rounded-full sm:hidden" />
                )}

                <tab.icon className={`w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] shrink-0 transition-transform duration-300 ${isActive ? "text-[#14f195] scale-110" : "text-teal-405"}`} />
                <div className="text-center sm:text-left leading-none font-sans min-w-0 w-full sm:w-auto truncate">
                  <span className="block text-[7px] min-[360px]:text-[8px] sm:text-xs font-mono tracking-tight font-black uppercase sm:normal-case truncate">{tab.label}</span>
                  <span className="hidden sm:block text-[8px] text-teal-400 font-mono font-medium block mt-0.5 truncate">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* 1. DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* HERO TITLE & INTENDED MOTIVATION */}
            <section className="mb-10 text-center relative max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/10 to-[#14f195]/10 rounded-full border border-orange-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px] font-mono text-orange-200 font-semibold tracking-wide">BUSCADOR INTELIGENTE EN TIEMPO REAL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
                Valida Tus Bloques <span className="bg-gradient-to-r from-[#00f2fe] via-[#0bd8df] to-[#14f195] bg-clip-text text-transparent font-black">De Fuerza</span>
              </h2>
              <p className="text-white text-sm sm:text-base leading-relaxed font-normal">
                Explora una base de datos deportiva de alto rendimiento traducida íntegramente al español. Asigna de forma autónoma registros de entrenamiento para generar <span className="text-orange-400 font-bold">$IMP</span> tokens utilitarios y validar tu esfuerzo físico en la blockchain de Solana mediante un flujo de minado criptográfico optimizado.
              </p>

              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-2xl mx-auto">
                <div className="bg-[#082029]/85 p-3 rounded-lg border border-teal-850/60 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <div className="text-left">
                    <span className="block text-[10px] text-teal-400 font-mono leading-none m-0">VELOCIDAD</span>
                    <span className="text-[12px] font-mono font-bold leading-normal text-white">~55,000 rps</span>
                  </div>
                </div>
                <div className="bg-[#082029]/85 p-3 rounded-lg border border-teal-850/60 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-300" />
                  <div className="text-left">
                    <span className="block text-[10px] text-teal-400 font-mono leading-none m-0">RECOMPENSAS</span>
                    <span className="text-[12px] font-mono font-bold leading-normal text-white">Proof of Sweat</span>
                  </div>
                </div>
                <div className="bg-[#082029]/85 p-3 rounded-lg border border-teal-850/60 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                  <div className="text-left">
                    <span className="block text-[10px] text-teal-400 font-mono leading-none m-0">METABOLISMO</span>
                    <span className="text-[12px] font-mono font-bold leading-normal text-white">PoS Calories</span>
                  </div>
                </div>
                <div className="bg-[#082029]/85 p-3 rounded-lg border border-teal-850/60 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#14f195]" />
                  <div className="text-left">
                    <span className="block text-[10px] text-teal-400 font-mono leading-none m-0">EJERCICIOS</span>
                    <span className="text-[12px] font-mono font-bold leading-normal text-white">1,300+ Libres</span>
                  </div>
                </div>
              </div>
            </section>

            <ImpMiningDashboard 
              userImpBalance={userImpBalance}
              setUserImpBalance={setUserImpBalance}
              unlockedCoupons={unlockedCoupons}
              setUnlockedCoupons={setUnlockedCoupons}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Consenso y Auditoría de Actividad */}
              <div className="bg-[#082029] border border-teal-850/65 rounded-2xl p-5 shadow-xl text-left">
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-teal-900/40">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#14f195]" /> Transacciones del Pool de Sudor
                  </h4>
                  <span className="text-[9px] font-mono text-[#14f195] bg-[#14f195]/10 px-2 py-0.5 rounded border border-[#14f195]/20 font-bold uppercase animate-pulse">
                    AUDITANDO EN TIEMPO REAL
                  </span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { tx: "Tx: 3h8f...92b", user: "dev_sweat.sol", exercise: "Sentadillas Profesionales", reward: "+30 XP", time: "Hace 2 min" },
                    { tx: "Tx: 7pF2...12a", user: "muscle_maker.sol", exercise: "Fondos de Pecho con Lastre", reward: "+35 XP", time: "Hace 5 min" },
                    { tx: "Tx: 9aW3...k4b", user: "vitalik_reps.sol", exercise: "Dominadas Explosivas", reward: "+40 XP", time: "Hace 12 min" },
                    { tx: "Tx: 1rT8...0fd", user: "sol_coach.sol", exercise: "Plancha Abdominal Activa", reward: "+20 XP", time: "Hace 18 min" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#05171d]/90 border border-teal-900/40 text-xs font-mono hover:bg-[#0c2a35]/40 transition">
                      <div className="flex flex-col gap-0.5 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[#14f195] font-semibold">{item.user}</span>
                          <span className="text-[9px] text-teal-400">{item.time}</span>
                        </div>
                        <span className="text-white text-[11px] font-sans">{item.exercise}</span>
                      </div>
                      <div className="text-right flex flex-col gap-0.5">
                        <span className="text-[#14f195] font-bold">{item.reward}</span>
                        <span className="text-[8px] text-teal-500 uppercase font-extrabold">{item.tx}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas de Nivel Rápido */}
              <div className="bg-[#082029] border border-teal-850/65 rounded-2xl p-5 shadow-xl flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-teal-900/40">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-400" /> Panel de Logros del Validador
                    </h4>
                    <span className="text-[10px] text-teal-300 font-mono">Simulación de Nodo</span>
                  </div>
                  
                  <p className="text-xs text-teal-200 leading-relaxed mb-4">
                    Tu nodo de atleta local ha alcanzado el rango de <strong className="text-white font-bold font-sans">Nivel {Math.floor(userXp / 100) + 1}</strong>. Completa nuevos parámetros para desbloquear bonificaciones pasivas de minado de tokens $IMP.
                  </p>

                  <div className="bg-[#05171d]/90 p-4 rounded-xl border border-teal-900/50 space-y-2 mb-4">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-teal-400 uppercase font-semibold">XP PARA SIGUIENTE NIVEL</span>
                      <span className="text-white font-bold">{userXp % 100}/100 XP</span>
                    </div>
                    <div className="w-full bg-[#05171d] rounded-full h-2.5 overflow-hidden border border-teal-905">
                      <div 
                        style={{ width: `${userXp % 100}%` }}
                        className="bg-gradient-to-r from-cyan-400 to-[#14f195] h-full rounded-full duration-500 shadow-[0_0_8px_rgba(20,241,149,0.5)]"
                      />
                    </div>
                    <p className="text-[9px] text-teal-400 font-mono text-center">
                      {100 - (userXp % 100)} XP necesarios para escalar al Nivel {Math.floor(userXp / 100) + 2} y multiplicar el poder de cómputo en +5%.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#05171d]/50 rounded-lg border border-teal-900/30 text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#14f195] animate-pulse" />
                  <span className="text-[10px] text-[#14f195] font-mono uppercase tracking-wider font-extrabold">Minando a un ritmo de ~100 $IMP/rutina</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFILE TAB */}
        {activeTab === "profile" && (
          <SocialProfileTab 
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            userXp={userXp}
            profileName={profileName}
            setProfileName={setProfileName}
            profileBio={profileBio}
            setProfileBio={setProfileBio}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
            profileBanner={profileBanner}
            setProfileBanner={setProfileBanner}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            validatedSessions={validatedSessions}
            copyAddressToClipboard={copyAddressToClipboard}
            copiedAddress={copiedAddress}
            setActiveTab={setActiveTab}
          />
        )}

        {/* 3. EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <ExperienceTab 
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            userXp={userXp}
            profileName={profileName}
            userImpBalance={userImpBalance}
            setActiveTab={setActiveTab}
          />
        )}

        {/* 4. STATS TAB */}
        {activeTab === "stats" && (
          <StatsTab 
            validatedSessions={validatedSessions}
            userImpBalance={userImpBalance}
            userXp={userXp}
          />
        )}

        {/* 5. EXERCISES TAB */}
        {activeTab === "exercises" && (
          <>

        {/* SEARCH AND FILTERS CORE PANEL */}
        <section className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 sm:p-6 mb-8 shadow-xl shadow-black/35 relative">
          <h3 className="text-xs font-mono tracking-wider text-cyan-400 uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#14f195] animate-ping" /> Parámetros de Consenso Corporal
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Horizontal query search input */}
            <div className="relative">
              <label htmlFor="exercise-search" className="sr-only">Buscar por nombre o músculo</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-400">
                <Search className="w-4 h-4" />
              </div>
              <input 
                id="exercise-search"
                type="text" 
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                placeholder="Busca bicep, shoulders, legs..." 
                className="w-full bg-[#05171d] text-sm border border-teal-800/70 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-teal-500/80 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/35 hover:border-teal-700 transition"
                aria-label="Buscar por nombre o músculo"
              />
            </div>

            {/* Dropdown 1: Area (Body Part) */}
            <div>
              <label htmlFor="body-part-select" className="sr-only">Zona del Cuerpo</label>
              <select
                id="body-part-select"
                value={selectedBodyPart}
                onChange={(e) => setSelectedBodyPart(e.target.value)}
                className="w-full bg-[#05171d] text-sm border border-teal-800/70 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-cyan-400 transition hover:border-teal-700 cursor-pointer h-full min-h-[48px]"
                aria-label="Filtrar por Zona del Cuerpo"
              >
                <option value="all" className="bg-[#05171d]">Todas las Zonas (Body Parts)</option>
                {categories.bodyParts.map((cat) => (
                  <option key={cat.key} value={cat.key} className="bg-[#05171d]">{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Dropdown 2: Muscle */}
            <div>
              <label htmlFor="muscle-select" className="sr-only">Músculo Objetivo</label>
              <select
                id="muscle-select"
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="w-full bg-[#05171d] text-sm border border-teal-800/70 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-cyan-400 transition hover:border-teal-700 cursor-pointer h-full min-h-[48px]"
                aria-label="Filtrar por Músculo Objetivo"
              >
                <option value="all" className="bg-[#05171d]">Todos los Músculos</option>
                {categories.muscles.map((cat) => (
                  <option key={cat.key} value={cat.key} className="bg-[#05171d]">{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Dropdown 3: Equipment */}
            <div>
              <label htmlFor="equipment-select" className="sr-only">Equipamiento</label>
              <select
                id="equipment-select"
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full bg-[#05171d] text-sm border border-teal-800/70 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-cyan-400 transition hover:border-teal-700 cursor-pointer h-full min-h-[48px]"
                aria-label="Filtrar por Equipamiento"
              >
                <option value="all" className="bg-[#05171d]">Todos los Equipos</option>
                {categories.equipments.map((cat) => (
                  <option key={cat.key} value={cat.key} className="bg-[#05171d]">{cat.name}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-5 pt-4 border-t border-teal-900/60">
            {/* Quick search tags suggestions */}
            <div className="text-[11px] text-teal-300 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-teal-500 uppercase">Sugerencias: </span>
              {["shoulders", "biceps", "squat", "push-up", "cable"].map(keyword => (
                <button
                  key={keyword}
                  onClick={() => {
                    setQ(keyword);
                    setTimeout(() => handleSearch(), 50);
                  }}
                  className="px-2 py-1 rounded bg-[#05171d] text-teal-200 hover:text-cyan-405 border border-teal-800/80 transition text-[11px] cursor-pointer"
                  aria-label={`Buscar sugerencia ${keyword}`}
                >
                  #{keyword}
                </button>
              ))}
            </div>

            {/* Action Buttons with high-contrast Solana tones */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 sm:py-2.5 rounded-xl border border-teal-800/70 hover:bg-[#0d2d38] text-xs font-mono font-bold tracking-wide transition text-teal-300 hover:text-white text-center cursor-pointer w-full sm:w-auto shrink-0"
                aria-label="Limpiar todos los filtros"
              >
                LIMPIAR FILTROS
              </button>
              
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="px-6 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-xs font-mono font-extrabold tracking-wide text-white transition hover:shadow-[0_0_15px_rgba(31,193,195,0.45)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto shrink-0"
                aria-label="Buscar ejercicios"
              >
                {isLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    COMPILANDO...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    VALIDAR BÚSQUEDA
                  </>
                )}
              </button>
            </div>

          </div>
        </section>

        {/* CLASSIFICTION BANNER STATE */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">
              Registros Encontrados: <strong className="text-white font-bold">{totalCount}</strong>
            </span>
            {isLocalFallback && (
              <span className="px-2 py-0.5 rounded bg-yellow-950/20 text-yellow-400 border border-yellow-800/30 text-[10px] font-mono">
                Modo Offline Activo
              </span>
            )}
          </div>
          
          <span className="text-[11px] font-mono text-gray-500">
            Pág. 1 de 1 (Máx. 40 resultados para rapidez de red)
          </span>
        </div>

        {/* ERROR OR ZERO BLOCKS WARNING */}
        {errorMsg && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 p-5 rounded-xl flex items-start gap-3.5 mb-10">
            <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-yellow-300">Modo de Respaldo Fuera de Línea</h4>
              <p className="text-xs text-yellow-400/90 mt-1 leading-relaxed">{errorMsg}</p>
              <button 
                onClick={handleClearFilters}
                className="mt-3.5 px-3.5 py-1.5 text-[11px] font-mono bg-yellow-950/40 hover:bg-yellow-900/50 border border-yellow-800/40 rounded transition uppercase font-bold text-yellow-300 cursor-pointer"
              >
                Resetear Filtros y Reintentar
              </button>
            </div>
          </div>
        )}

        {/* LOADING SHADOW STONES */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#082029]/60 rounded-2xl p-4 border border-teal-800/60 animate-pulse flex flex-col gap-3">
                <div className="w-full h-44 bg-[#05171d] rounded-xl" />
                <div className="w-1/3 h-3 bg-teal-900/65 rounded" />
                <div className="w-3/4 h-5 bg-teal-900/65 rounded" />
                <div className="flex gap-2 mt-2">
                  <div className="w-16 h-5 bg-teal-905 rounded-full" />
                  <div className="w-20 h-5 bg-teal-905 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#072029]/40 border border-teal-900/30 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-teal-950/40 border border-teal-800/40 flex items-center justify-center text-[#14f195] mb-4 animate-bounce">
              <Dumbbell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No se encontraron bloques de ejercicio</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              No hay ejercicios compilados on-chain que coincidan con los filtros de búsqueda actuales. Prueba a limpiar los filtros o realizar una búsqueda con palabras clave más generales.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 text-xs font-mono bg-[#14f195] hover:bg-[#10c47a] text-black rounded-lg transition duration-200 font-bold uppercase tracking-wider cursor-pointer"
            >
              Resetear Filtros y Buscar de Nuevo
            </button>
          </div>
        ) : (
          /* EXERCISE GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exercises.map((ex) => {
              const isSessionValidated = validatedSessions.includes(ex.id);
              return (
                <motion.div
                  key={ex.id}
                  layoutId={`exercise-card-${ex.id}`}
                  onClick={() => handleOpenDetail(ex)}
                  className={`bg-[#082029] hover:bg-[#0c2a35] rounded-2xl border ${
                    isSessionValidated ? "border-[#14f195] shadow-[0_0_15px_rgba(20,241,149,0.15)]" : "border-teal-800/80 hover:border-cyan-405 hover:shadow-[0_0_15px_rgba(31,193,195,0.15)]"
                  } p-4.5 cursor-pointer flex flex-col justify-between group transition duration-300 relative overflow-hidden`}
                  aria-label={`Ver detalles de ${ex.name}`}
                >
                  {/* Validation Completed Checked Badge Overlay */}
                  {isSessionValidated && (
                    <div className="absolute top-3 right-3 bg-[#14f195] text-black px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold flex items-center gap-1 shadow-[0_0_10px_rgba(20,241,149,0.4)] z-10">
                      <Check className="w-3 h-3 stroke-[3]" /> VALIDADO
                    </div>
                  )}

                  <div>
                    {/* Visual representation card top (simulates static thumb beautifully) */}
                    <div className="w-full h-44 bg-[#05171d] rounded-xl mb-4.5 relative overflow-hidden flex items-center justify-center border border-teal-900/60">
                      {/* Grid background simulation */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370d_1px,transparent_1px),linear-gradient(to_bottom,#1f29370d_1px,transparent_1px)] bg-[size:10px_10px]" />
                      
                      {/* Exercise illustration or GIF with lazy loading */}
                      <img 
                        src={ex.gifUrl || "https://assets.exercisedb.io/gifs/0025.gif"} 
                        alt={ex.name} 
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="max-h-full max-w-full object-contain filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
                        onError={(e) => {
                          // Handle image loading failure gracefully (e.g. key/referrers blocks)
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=350&auto=format&fit=crop";
                        }}
                      />
                      
                      {/* Solana style holographic overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      
                      {/* Floating ID Tag */}
                      <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] text-[#14f195] bg-[#05171d]/90 px-1.5 py-0.5 rounded border border-[#14f195]/20">
                        ID:{ex.id}
                      </span>

                      <div className="absolute top-2.5 left-2.5 p-1 bg-black/40 rounded-lg text-teal-400 group-hover:text-white transition">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono bg-[#05171d] border border-teal-800/60 text-teal-200 rounded font-semibold uppercase">
                        {ex.bodyPartEs || ex.bodyPart}
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 rounded font-semibold uppercase">
                        {ex.targetEs || ex.target}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-white group-hover:text-[#14f195] transition duration-200 line-clamp-1">
                      {ex.nameEs || ex.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </h4>
                    
                    <p className="font-mono text-[10px] text-teal-300 mt-1 uppercase flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5 text-teal-450" /> {ex.equipmentEs || ex.equipment}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-teal-900/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#14f195] font-bold flex items-center gap-0.5">
                      +{(ex.id ? (parseInt(ex.id, 10) % 25) + 20 : 35)} <span className="text-teal-400 text-[10px]">XP</span>
                    </span>

                    <button
                      className={`font-mono text-[10px] font-bold px-3 py-1.5 rounded transition ${
                        isSessionValidated 
                          ? "bg-[#0d2d38] text-teal-450 border border-teal-850/50"
                          : "bg-[#05171d] hover:bg-cyan-950/30 text-teal-300 hover:text-cyan-200 border border-teal-800/70 hover:border-cyan-405"
                      }`}
                      aria-label={`Ver detalles del ejercicio de ${ex.name}`}
                    >
                      DETALLES
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
          </>
        )}

      </main>

      {/* DETAILED EXPANDED MODAL OVERLAY */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            
            {/* Modal Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExercise(null)}
              className="fixed inset-0 bg-[#020a0d]/85 backdrop-blur-md" 
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-3xl bg-[#082029] border border-teal-800/80 rounded-2xl shadow-2xl overflow-hidden z-10 font-sans max-h-[90vh] flex flex-col"
            >
              
              {/* Modal Custom Top Glowing line */}
              <div className="h-1 w-full bg-gradient-to-r from-[#00f2fe] via-[#14f195] to-[#00f2fe]" />

              {/* Modal Scrollable Container */}
              <div className="overflow-y-auto p-5 sm:p-7 flex-1">
                
                {/* Close absolute action */}
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-[#05171d] hover:bg-[#0c2a35] text-teal-300 hover:text-white border border-teal-800/60 transition shadow"
                  title="Cerrar modal"
                  aria-label="Cerrar ventana de detalles"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                {/* MODAL CORE WRAP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
                  
                  {/* COLUMN Left: Media (GIF & Static switches) */}
                  <div>
                    <div className="bg-[#05171d] p-4 rounded-xl border border-teal-900/60 relative group aspect-square flex items-center justify-center">
                      
                      {/* Media selector tool buttons */}
                      <div className="absolute top-2.5 right-2 gap-1.5 flex z-10">
                        <button
                          onClick={() => setImageMode("gif")}
                          className={`px-2.5 py-1 text-[9px] font-mono rounded font-bold transition border ${
                            imageMode === "gif" 
                              ? "bg-[#14f195] text-black border-[#14f195]"
                              : "bg-[#0d2d38] text-teal-300 border-teal-800/70 hover:text-white"
                          }`}
                          aria-label="Visualizar en modo GIF Animado"
                        >
                          GIF
                        </button>
                        <button
                          onClick={() => setImageMode("static")}
                          className={`px-2.5 py-1 text-[9px] font-mono rounded font-bold transition border ${
                            imageMode === "static" 
                              ? "bg-cyan-500 text-black border-cyan-500 font-black"
                              : "bg-[#0d2d38] text-teal-300 border-teal-800/70 hover:text-white"
                          }`}
                          aria-label="Visualizar en modo Imagen Estática"
                        >
                          ESTÁTICO
                        </button>
                      </div>

                      {imageMode === "gif" ? (
                        <img 
                          src={selectedExercise.gifUrl || "https://assets.exercisedb.io/gifs/0025.gif"} 
                          alt={selectedExercise.name} 
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter brightness-95"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=350&auto=format&fit=crop";
                          }}
                        />
                      ) : (
                        // Static frame simulator utilizing an absolute stylish cover card with Solana hologram layout
                        <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-5 rounded-lg bg-gradient-to-br from-[#082029] to-[#05171d]">
                          {/* Grid cover background overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />
                          <div className="absolute inset-0 bg-cyan-400/5 filter blur-3xl rounded-full" />
                          
                          <div className="flex justify-between items-center z-10">
                            <span className="font-mono text-xs text-[#14f195] tracking-widest font-extrabold uppercase">SOLANA ATLETICS</span>
                            <Dumbbell className="w-5 h-5 text-teal-400" />
                          </div>

                          <div className="my-auto text-center z-10 flex flex-col items-center justify-center gap-2">
                            <div className="p-3 bg-[#05171d]/80 rounded-full border border-teal-800/60">
                              <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
                            </div>
                            <h5 className="font-mono text-sm uppercase text-white font-bold tracking-wider mt-2">
                              {selectedExercise.name}
                            </h5>
                          </div>

                          <div className="flex justify-between text-[10px] text-teal-400 font-mono z-10">
                            <span>BLOC: #{selectedExercise.id}</span>
                            <span className="text-[#14f195]">PROOF OF SWEAT POOL</span>
                          </div>
                        </div>
                      )}

                      {/* Info Floating Tag to ensure frame accessibility */}
                      <div className="absolute bottom-2 left-2 text-[9px] text-teal-400 font-mono pointer-events-none">
                        Ref: {selectedExercise.id} | {selectedExercise.equipment}
                      </div>

                    </div>

                    {/* Left Column Web3 Solana Performance stats */}
                    <div className="mt-5 bg-[#05171d]/90 border border-teal-850/60 rounded-xl p-4">
                      <h5 className="text-[10px] font-mono tracking-wider text-cyan-300 uppercase mb-3 flex items-center justify-between">
                        <span>PROTOCOLO ÍMPETU FITNESS</span>
                        <span className="text-[#14f195]">ACTIVE NODE</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="bg-black/30 p-2.5 rounded-lg border border-teal-900/45">
                          <span className="block text-[8px] text-teal-400 font-mono">RECOMPENSA XP</span>
                          <span className="text-sm font-bold font-mono text-[#14f195]">
                            +{enrichedExercise?.solanaStats?.xpReward || (parseInt(selectedExercise.id, 10) % 25) + 20} XP
                          </span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-teal-900/45">
                          <span className="block text-[8px] text-teal-400 font-mono">GAS AHORRADO VS ETH</span>
                          <span className="text-xs font-bold font-mono text-cyan-200 truncate block">
                            {enrichedExercise?.solanaStats?.gasSavedEth || "0.0016 ETH ($4.80)"}
                          </span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-teal-900/45 sm:col-span-2">
                          <span className="block text-[8px] text-teal-400 font-mono">FACTOR DE DIFICULTAD (CONSENSO)</span>
                          <span className="text-xs font-semibold font-mono text-white">
                            {enrichedExercise?.solanaStats?.sweatFactor || "Proof of Sweat Intermedio"}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#05171d]/60 border border-teal-900/50 rounded-lg">
                        <span className="block text-[8px] font-mono text-[#14f195] uppercase font-bold tracking-widest mb-1">CONSEJO DEL COACH SOLANA</span>
                        <p className="text-[11.5px] text-teal-100 italic leading-relaxed">
                          {enrichedExercise?.solanaStats?.solCoachAdvice || "Cargando biomecánica de coach..."}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* COLUMN Right: Text Details & Multi-step Instructions (Enriched by Gemini) */}
                  <div className="flex flex-col gap-5">
                    
                    {/* Header Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[8.5px] font-mono bg-teal-950/80 border border-teal-800/60 text-teal-300 rounded uppercase font-semibold">
                          {selectedExercise.id}
                        </span>
                        <span className="px-2 py-0.5 text-[8.5px] font-mono bg-[#14f195]/10 text-[#14f195] border border-[#14f195]/20 rounded uppercase font-semibold">
                          {selectedExercise.bodyPartEs || selectedExercise.bodyPart}
                        </span>
                        <span className="px-2 py-0.5 text-[8.5px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-800/50 rounded uppercase font-semibold">
                          {selectedExercise.targetEs || selectedExercise.target}
                        </span>
                      </div>

                      {/* Display original and translated title */}
                      <h4 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-tight">
                        {enrichedExercise ? enrichedExercise.nameEs : selectedExercise.name.toUpperCase()}
                      </h4>
                      <p className="font-mono text-xs text-teal-400 mt-1 uppercase tracking-wide flex items-center gap-1">
                        <span className="text-teal-550">English:</span> {selectedExercise.name}
                      </p>
                    </div>

                    {/* GEMINI LOADER / DESCRIPTION CONTAINER */}
                    <div className="bg-[#05171d]/90 border border-teal-800/60 p-4.5 rounded-xl min-h-[90px] relative">
                      {isEnriching ? (
                        <div className="absolute inset-0 bg-[#05171d]/45 flex flex-col items-center justify-center p-3 text-center">
                          <span className="w-6 h-6 border-2 border-dashed border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="font-mono text-[10px] text-cyan-400 animate-pulse">
                            SINCRONIZANDO CON GEMINI AI...
                          </p>
                          <span className="text-[9px] text-teal-400 font-mono mt-1">Traduciendo biomecánica y generando plan Web3...</span>
                        </div>
                      ) : null}

                      <h5 className="font-mono text-[9px] tracking-wider text-cyan-400 uppercase font-extrabold mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#14f195]" /> DESCRIPCIÓN DEL EJERCICIO (TRADUCIDO AL ESPAÑOL)
                      </h5>
                      <p className="text-xs leading-relaxed text-teal-100">
                        {enrichedExercise?.descriptionEs || "Cargando descripción biomecánica optimizada..."}
                      </p>
                    </div>

                    {/* STEP_BY_STEP INSTRUCTIONS */}
                    <div>
                      <h5 className="font-mono text-[10px] tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-1">
                        ANATOMÍA DEL MOVIMIENTO / INSTRUCCIONES PASO A PASO
                      </h5>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {isEnriching ? (
                          [1, 2, 3].map((step) => (
                            <div key={step} className="flex gap-2.5 animate-pulse bg-teal-950/20 p-2 rounded border border-teal-950">
                              <div className="w-5 h-5 bg-teal-900/70 rounded-full shrink-0" />
                              <div className="w-full space-y-1.5">
                                <div className="h-2.5 bg-teal-950/80 rounded w-11/12" />
                                <div className="h-2 bg-teal-950/80 rounded w-2/3" />
                              </div>
                            </div>
                          ))
                        ) : (
                          (enrichedExercise?.instructionsEs || enrichedExercise?.instructions || selectedExercise.instructions || []).map((instruction, idx) => (
                            <div key={idx} className="flex gap-3 bg-[#05171d]/45 hover:bg-[#0c2a35]/65 p-2.5 rounded-lg border border-teal-900/50 transition">
                              <span className="w-5 h-5 rounded-full bg-cyan-950/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-cyan-800/55">
                                {idx + 1}
                              </span>
                              <p className="text-xs text-teal-100 leading-relaxed pt-0.5">
                                {instruction}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* VALIDA TU CONTRACCIÓN BLOCK ACTION */}
                    <div className="pt-4 border-t border-teal-900/60 flex flex-col gap-2 mt-auto">
                      
                      {validatedSessions.includes(selectedExercise.id) ? (
                        <div className="w-full bg-[#14f195]/10 border border-[#14f195]/20 text-[#14f195] p-3 rounded-xl text-xs font-mono text-center flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#14f195]" /> BLOQUE DE FUERZA VALIDADO EN LA SESIÓN DE HOY!
                        </div>
                      ) : (
                        <button
                          onClick={() => claimXP(
                            selectedExercise.id, 
                            enrichedExercise?.solanaStats?.xpReward || (parseInt(selectedExercise.id, 10) % 25) + 20
                          )}
                          disabled={isEnriching}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#14f195] to-[#11cb7d] hover:from-[#35ffa7] hover:to-[#17e691] text-black font-mono font-extrabold text-xs tracking-wider transition hover:shadow-[0_0_20px_rgba(20,241,149,0.35)] flex items-center justify-center gap-2 leading-none cursor-pointer"
                          aria-label="Validar sesión de entrenamiento y reclamar puntos"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          VALIDAR BLOQUE Y RECLAMAR XP
                        </button>
                      )}

                      <p className="text-[9px] text-teal-400 font-mono text-center leading-normal">
                        Al pulsar validar, registras de forma local la compleción de tus series biomecánicas y reclamas XP de la piscina descentralizada. 
                        Este software simula el motor Web3 de Proof of Sweat de Solana de forma aislada.
                      </p>

                    </div>

                  </div>

                </div>

              </div>
              
              {/* Animated confirmation notification */}
              {justValidated && (
                <>
                  <Confetti />
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="absolute bottom-5 left-5 right-5 bg-gradient-to-r from-[#05171d] via-[#082029] to-[#05171d] border border-[#14f195] p-4 rounded-xl shadow-2xl shadow-black z-20 flex items-center gap-3.5"
                  >
                    <div className="p-2 bg-[#14f195] rounded-full text-black">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h5 className="font-mono text-xs font-extrabold text-[#14f195]">CONFORME: BLOQUE DE ENTRENAMIENTO VALIDADO</h5>
                      <p className="text-[10px] text-white mt-0.5 font-mono">
                        Transacción confirmada en ~400ms. Has acreditado <strong className="text-white">+{enrichedExercise?.solanaStats?.xpReward || 35}</strong> Proof of Sweat XP a tu billetera física.
                      </p>
                    </div>
                  </motion.div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOLANA WALLET CONNECTOR MODAL */}
      <AnimatePresence>
        {showWalletModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Overlay background blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletModal(false)}
              className="fixed inset-0 bg-[#020a0d]/85 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-[#082029] border border-teal-800/80 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 flex flex-col gap-4 font-sans text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-[#14f195] to-cyan-400" />

              {/* Title Header */}
              <div className="flex items-center justify-between pb-3 border-b border-teal-900/60">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#14f195]" />
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Conectar Wallet Solana</h3>
                    <p className="text-[10px] text-teal-300 font-mono uppercase">Selecciona tu billetera de Solana</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="p-1 px-2.5 rounded-lg bg-[#05171d] border border-teal-805/70 hover:bg-[#0c2a35] text-teal-300 hover:text-white transition cursor-pointer font-mono text-xs"
                  aria-label="Cerrar modal"
                >
                  ESC
                </button>
              </div>

              {/* Informational Box */}
              <div className="bg-[#05171d]/95 border border-teal-900/60 p-3 rounded-xl flex gap-2.5">
                <Info className="w-4 h-4 text-[#14f195] shrink-0 mt-0.5" />
                <p className="text-[10.5px] leading-relaxed text-teal-200">
                  Si posees una de estas billeteras instaladas en tu navegador, nuestro detector intentará iniciar la conexión y firma directa con la red de Solana de forma segura.
                </p>
              </div>

              {/* Wallets List Grid */}
              <div className="flex flex-col gap-2.5">
                {/* Phantom Wallet Option */}
                <div 
                  onClick={() => connectWallet('phantom')}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#05171d] border border-teal-900/65 hover:border-cyan-400/50 hover:bg-[#0c2a35] cursor-pointer transition group animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    {/* Inline Phantom SVG Logo - Official High-Fidelity Silhouette */}
                    <svg className="w-8 h-8 rounded-xl shrink-0" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="120" height="120" rx="26" fill="#1A152E"/>
                      <path d="M60 22C39.013 22 22 39.013 22 60v26c0 2.209 1.791 4 4 4h2.2c1.986 0 3.8-1.206 4.54-3.047C36.1 78.43 45.42 71 56.5 71h7c11.08 0 20.4 7.43 23.76 15.953.74 1.841 2.554 3.047 4.54 3.047H94c2.209 0 4-1.791 4-4V60c0-20.987-17.013-38-38-38z" fill="#AB9FF2"/>
                      <circle cx="47.5" cy="49.5" r="7.5" fill="#1A152E"/>
                      <circle cx="72.5" cy="49.5" r="7.5" fill="#1A152E"/>
                      <circle cx="50" cy="52" r="2" fill="#FFFFFF"/>
                      <circle cx="75" cy="52" r="2" fill="#FFFFFF"/>
                      <path d="M43.5 63c2.5 4 7 6.5 12.5 6.5s10-2.5 12.5-6.5" stroke="#1A152E" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white leading-none">Phantom</h4>
                      <p className="text-[9px] text-[#14f195] font-mono mt-1 font-semibold">
                        {detectWallets().phantom ? "✓ INSTALADA & DETECTADA" : "SOLANA NAVEGADOR"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-teal-300 bg-[#061e27] px-2 py-1 rounded border border-teal-850/80 group-hover:bg-[#05171d] group-hover:border-cyan-400/50 group-hover:text-cyan-200 transition uppercase font-bold">
                    Conectar
                  </span>
                </div>

                {/* Solflare Wallet Option */}
                <div 
                  onClick={() => connectWallet('solflare')}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#05171d] border border-teal-900/65 hover:border-orange-500/50 hover:bg-[#0c2a35] cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    {/* Inline Solflare SVG Logo - High Fidelity Solflare Emblem */}
                    <svg className="w-8 h-8 rounded-xl shrink-0" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="120" height="120" rx="26" fill="#1A0D00"/>
                      <path d="M40 30h40l10 15-50 10-10-25z" fill="url(#sol_g1)"/>
                      <path d="M30 55v-5l50 15-10 15H40l-10-25z" fill="url(#sol_g2)"/>
                      <path d="M40 85h40l10-15H30l10 15z" fill="url(#sol_g3)"/>
                      <path d="M55 95h15l10-10H45l10 10z" fill="url(#sol_g4)"/>
                      <defs>
                        <linearGradient id="sol_g1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FC6C24"/>
                          <stop offset="100%" stopColor="#E02D96"/>
                        </linearGradient>
                        <linearGradient id="sol_g2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF4B72"/>
                          <stop offset="100%" stopColor="#FC6C24"/>
                        </linearGradient>
                        <linearGradient id="sol_g3" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#E02D96"/>
                          <stop offset="100%" stopColor="#FF4B72"/>
                        </linearGradient>
                        <linearGradient id="sol_g4" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FC6C24"/>
                          <stop offset="100%" stopColor="#E02D96"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white leading-none">Solflare</h4>
                      <p className="text-[9px] text-orange-400 font-mono mt-1 font-semibold">
                        {detectWallets().solflare ? "✓ INSTALADA & DETECTADA" : "NATIVA DE SOLANA"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-teal-300 bg-[#061e27] px-2 py-1 rounded border border-teal-850/80 group-hover:bg-[#05171d] group-hover:border-orange-500/50 group-hover:text-orange-400 transition uppercase font-bold">
                    Conectar
                  </span>
                </div>

                {/* Backpack Wallet Option */}
                <div 
                  onClick={() => connectWallet('backpack')}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#05171d] border border-teal-900/65 hover:border-[#14f195]/45 hover:bg-[#0c2a35] cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    {/* Inline Backpack SVG Logo - Official Red Backpack Icon */}
                    <svg className="w-8 h-8 rounded-xl shrink-0" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="120" height="120" rx="26" fill="#140202"/>
                      <path d="M42 45v-9a18 18 0 0118-18h0a18 18 0 0118 18v9" stroke="#E33E3E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="28" y="45" width="64" height="52" rx="12" stroke="#E33E3E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="#140202"/>
                      <path d="M60 55v18" stroke="#E33E3E" strokeWidth="8" strokeLinecap="round"/>
                    </svg>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white leading-none">Backpack</h4>
                      <p className="text-[9px] text-teal-400 font-mono mt-1 font-semibold">
                        {detectWallets().backpack ? "✓ INSTALADA & DETECTADA" : "XNFT & BACKPACK"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-teal-300 bg-[#061e27] px-2 py-1 rounded border border-teal-850/80 group-hover:bg-[#05171d] group-hover:border-[#14f195]/45 group-hover:text-[#14f195] transition uppercase font-bold">
                    Conectar
                  </span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED DOCUMENTATION MODAL OVERLAY */}
      <AnimatePresence>
        {showDocModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Modal Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDocModal(false)}
              className="fixed inset-0 bg-[#020a0d]/90 backdrop-blur-md" 
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-5xl bg-[#082029] border border-teal-800/80 rounded-2xl shadow-2xl overflow-hidden z-10 font-sans h-[90vh] md:h-[82vh] flex flex-col"
            >
              
              {/* Modal Custom Top Glowing line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-[#14f195] to-[#9945ff]" />

              {/* Header Box */}
              <div className="p-5 border-b border-teal-900/60 flex items-center justify-between bg-[#05171d]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-850/60 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#14f195]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-widest uppercase font-mono flex items-center gap-2">
                      ÍMPETU <span className="text-[10px] bg-[#14f195]/10 text-[#14f195] px-2 py-0.5 rounded border border-[#14f195]/20 font-bold">WHITEPAPER v1.0.4</span>
                    </h3>
                    <p className="text-[10px] text-teal-300 font-mono uppercase">Especificaciones del ecosistema fitness gamificado de Solana</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[10px] font-mono text-teal-500 uppercase tracking-widest bg-teal-950/40 px-2.5 py-1 rounded border border-teal-900/30">
                    Proof-of-Sweat v1
                  </span>
                  <button 
                    onClick={() => setShowDocModal(false)}
                    className="p-1 px-3 py-1.5 rounded-lg bg-[#0d2d38] hover:bg-teal-900 text-teal-300 hover:text-white border border-teal-850/60 transition font-mono text-xs cursor-pointer font-bold"
                  >
                    CERRAR
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT SPLIT LAYOUT */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* 1. LEFT SIDEBAR: CHAPTER LIST DIRECTORY (Desktop Layout) */}
                <div className="hidden md:flex flex-col w-72 bg-[#041115] border-r border-teal-950/80 p-4 overflow-y-auto space-y-2 select-none">
                  <div className="px-2 py-1 mb-2">
                    <span className="text-[10px] font-mono text-teal-500 font-bold uppercase tracking-widest">Capítulos del Documento</span>
                  </div>
                  
                  {[
                    { id: "welcome", label: "0.0 Portada & Visión", icon: Zap, color: "text-amber-400" },
                    { id: "building", label: "1.0 ¿Qué construimos?", icon: Sparkles, color: "text-[#14f195]" },
                    { id: "audience", label: "2.0 ¿Para quién es?", icon: UserCheck, color: "text-sky-450" },
                    { id: "problem", label: "3.0 Problema que resuelve", icon: AlertCircle, color: "text-red-400" },
                    { id: "action", label: "4.0 Acción Principal", icon: Flame, color: "text-orange-400" },
                    { id: "mvp", label: "5.0 Alcance Mínimo (MVP)", icon: Dumbbell, color: "text-pink-400" },
                    { id: "status", label: "6.0 Estado Actual", icon: Activity, color: "text-emerald-400" },
                    { id: "next", label: "7.0 Próximos Pasos", icon: TrendingUp, color: "text-purple-400" },
                    { id: "roles", label: "8.0 Roles y Equipo", icon: User, color: "text-indigo-400" },
                    { id: "technical", label: "9.0 Consenso & Token $IMP", icon: Cpu, color: "text-[#9945ff]" }
                  ].map((chap) => {
                    const IconComp = chap.icon;
                    const isActive = docSubTab === chap.id;
                    return (
                      <button
                        key={chap.id}
                        onClick={() => setDocSubTab(chap.id)}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                          isActive 
                            ? "bg-[#0c2e38] text-white border-teal-800/80 shadow-md translate-x-1" 
                            : "text-teal-400/70 hover:text-teal-200 bg-transparent border-transparent hover:bg-teal-950/30"
                        }`}
                      >
                        <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-[#14f195]" : chap.color}`} />
                        <span className="text-xs font-mono font-bold tracking-tight">{chap.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* MOBILE dropdown selector for Chapters */}
                <div className="block md:hidden bg-[#031318] p-3 border-b border-teal-950/80">
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider">Capítulo Whitepaper:</label>
                    <select
                      value={docSubTab}
                      onChange={(e) => setDocSubTab(e.target.value)}
                      className="bg-[#082029] border border-teal-800 text-[#14f195] text-xs font-mono font-bold rounded-lg p-2.5 w-full outline-none focus:border-cyan-400"
                    >
                      <option value="welcome">0.0 Portada & Visión</option>
                      <option value="building">1.0 ¿Qué construimos?</option>
                      <option value="audience">2.0 ¿Para quién es?</option>
                      <option value="problem">3.0 Problema que resuelve</option>
                      <option value="action">4.0 Acción Principal</option>
                      <option value="mvp">5.0 Alcance Mínimo (MVP)</option>
                      <option value="status">6.0 Estado Actual</option>
                      <option value="next">7.0 Próximos Pasos</option>
                      <option value="roles">8.0 Roles y Equipo</option>
                      <option value="technical">9.0 Consenso & Token $IMP</option>
                    </select>
                  </div>
                </div>

                {/* 2. RIGHT PANEL: MAIN DOCUMENT READING AREA */}
                <div className="flex-1 bg-[#041115] overflow-y-auto p-6 md:p-9 space-y-6 text-left text-teal-100 h-full flex flex-col justify-between">
                  
                  {/* Active content block container */}
                  <div className="space-y-6">
                    
                    {/* Welcome chapter (0.0) */}
                    {docSubTab === "welcome" && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="relative py-12 px-6 rounded-2xl bg-gradient-to-b from-[#082631] to-[#041115] border border-teal-800/40 text-center overflow-hidden">
                          {/* Ambient background aura */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#14f195]/10 filter blur-3xl pointer-events-none" />
                          
                          <div className="inline-flex p-3 bg-amber-950/30 border border-amber-900/30 rounded-2xl text-amber-400 mb-4 scale-110">
                            <Zap className="w-8 h-8 animate-pulse text-amber-300" />
                          </div>
                          
                          <h4 className="text-xl font-bold font-mono tracking-widest text-[#14f195] uppercase">
                            ÍMPETU
                          </h4>
                          <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase block mt-1.5 font-bold">
                            SOLANA FITNESS ECOSYSTEM & PROOF-OF-SWEAT CONCORD
                          </span>
                          
                          <div className="max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-teal-900/40 to-transparent my-6" />
                          
                          <p className="text-sm font-sans text-teal-250 leading-relaxed max-w-lg mx-auto">
                            "Estructure rutinas inteligentes, registre contracciones biomecánicas con validación neural de Inteligencia Artificial y mine el primer combustible atlético de Solana: $IMP."
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                            <div className="p-3 rounded-xl bg-[#031318]/70 border border-teal-950">
                              <span className="text-[9px] text-teal-500 font-mono block uppercase">CONSENSO</span>
                              <strong className="text-xs text-white font-mono uppercase">Proof-of-Sweat</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-[#031318]/70 border border-teal-950">
                              <span className="text-[9px] text-teal-500 font-mono block uppercase">GAS FEES</span>
                              <strong className="text-xs text-[#14f195] font-mono">0.00 SOL / Híbrida</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-[#031318]/70 border border-teal-950">
                              <span className="text-[9px] text-teal-500 font-mono block uppercase">BLOCKS</span>
                              <strong className="text-xs text-white font-mono">Asíncronos Dev</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-[#031318]/70 border border-teal-950">
                              <span className="text-[9px] text-teal-500 font-mono block uppercase">AI ENGINE</span>
                              <strong className="text-xs text-[#9945ff] font-mono uppercase">Gemini SDK</strong>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 p-4 rounded-xl bg-[#082029]/40 border border-teal-900/30">
                          <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" /> RESUMEN EJECUTIVO
                          </h5>
                          <p className="text-xs text-teal-200/90 leading-relaxed">
                            Ímpetu nace de la necesidad de fusionar los hábitos físicos saludables con los nuevos paradigmas financieros Web3. Este whitepaper actúa como hoja de ruta técnica y presentación general, detallando cómo empoderamos a los atletas y cómo aseguramos la robustez del consenso físico sin complicar las transacciones financieras.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Visión chapter (1.0) */}
                    {docSubTab === "building" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <Sparkles className="w-5 h-5 text-[#14f195]" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            1.0 ¿QUÉ CONSTRUIMOS EN ÍMPETU?
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          Ímpetu es un panel interactivo inteligente y un hub de fitness descentralizado. Construimos un sistema híbrido que dota de valor criptográfico real y cuantificable ($IMP) a cada levantamiento de pesas, contracción muscular o sesión cardiovascular del usuario. 
                        </p>
                        
                        <div className="space-y-3 bg-[#05171d] border border-teal-900/30 p-4 rounded-xl mt-3">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">MOLDEAMIENTO POR INTELIGENCIA ARTIFICIAL</span>
                          <p className="text-xs text-teal-350 leading-relaxed">
                            Utilizamos el cerebro de <strong className="text-white">Gemini API</strong> para traducir al español, estructurar rutinas biomecánicas, inyectar tips inteligentes de ejecución para cada masa muscular y contextualizar las rutinas. Traducimos descripciones técnicas complejas en consejos digeribles para entrenar con total seguridad.
                          </p>
                          <p className="text-xs text-teal-350 leading-relaxed">
                            Al conectar esto con una billetera Web3 (Phantom, Solflare, etc.), convertimos la interfaz en un nodo de monitoreo deportivo premium con datos actualizados.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Para quién es (2.0) */}
                    {docSubTab === "audience" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <UserCheck className="w-5 h-5 text-sky-400" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            2.0 ¿PARA QUIÉN ES EL PROTOCOLO?
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          Diseñamos este software pensando en tres tipos de pilares o agentes de comunidad:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-900/30 space-y-1.5">
                            <span className="text-lg">💪</span>
                            <h5 className="font-mono text-[11px] font-bold text-white uppercase tracking-wide">Deportistas Convencionales</h5>
                            <p className="text-[10px] text-teal-350 leading-relaxed">
                              Atletas habituales de gimnasio que buscan incentivos profundos de gamificación para mantener el hábito y ganar recompensas mientras entrenan.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-900/30 space-y-1.5">
                            <span className="text-lg">⛓️</span>
                            <h5 className="font-mono text-[11px] font-bold text-[#14f195] uppercase tracking-wide">Pioneros de Solana</h5>
                            <p className="text-[10px] text-teal-350 leading-relaxed">
                              Entusiastas Web3 interesados en probar interacciones de billetera y apps deportivas que no consuman gas fees on-chain cotidianos para minar.
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-900/30 space-y-1.5">
                            <span className="text-lg">🏢</span>
                            <h5 className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-wide">Gimnasios & Partners</h5>
                            <p className="text-[10px] text-teal-350 leading-relaxed">
                              Centros deportivos y marcas que desean captar comunidad Web3 sirviendo cupones asimétricos con utilidad garantizada y fidelización real.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Problema que resuelve (3.0) */}
                    {docSubTab === "problem" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            3.0 ¿QUÉ DISRUPCIONES Y PROBLEMAS RESOLVEMOS?
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          El ecosistema deportivo y Web3 actual sufre de tres deficiencias fundamentales:
                        </p>

                        <div className="space-y-3.5 pt-2">
                          <div className="flex gap-3 p-3 bg-red-950/10 border border-red-900/20 rounded-xl">
                            <span className="bg-red-950 text-red-400 px-2.0 py-1.0 rounded font-mono font-bold text-[9px] mt-0.5 shrink-0 h-fit">Nº 1</span>
                            <div>
                              <strong className="text-white text-xs font-mono block">Alta Tasa de Deserción por Falta de Gamificación</strong>
                              <p className="text-[11px] text-teal-300 mt-1 leading-relaxed">
                                Un 70% de las personas abandonan el entrenamiento físico en los primeros tres meses. Al vincular los puntos de XP a tokens de minado real de simulación y cupones tangibles, creamos un gancho motivador y lúdico para romper la monotonía del gimnasio.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 p-3 bg-red-950/10 border border-red-900/20 rounded-xl">
                            <span className="bg-red-950 text-red-400 px-2.0 py-1.0 rounded font-mono font-bold text-[9px] mt-0.5 shrink-0 h-fit">Nº 2</span>
                            <div>
                              <strong className="text-white text-xs font-mono block">Complejidad Financiera y Costos de Red en Micro-Acciones</strong>
                              <p className="text-[11px] text-teal-300 mt-1 leading-relaxed">
                                Si un usuario tuviera que pagar gas de Solana por validar cada una de las series y flexiones realizadas durante su entrenamiento diario, el sistema sería económicamente insostenible. Ímpetu despliega un protocolo híbrido descentralizado en el cual los tokens $IMP se acumulan localmente y se transfieren asíncronamente con total seguridad y velocidad sub-segundo sin pagar gas.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 p-3 bg-red-950/10 border border-red-900/20 rounded-xl">
                            <span className="bg-red-950 text-red-400 px-2.0 py-1.0 rounded font-mono font-bold text-[9px] mt-0.5 shrink-0 h-fit">Nº 3</span>
                            <div>
                              <strong className="text-white text-xs font-mono block">La Barrera del Idioma en las Bases de Ejercicios</strong>
                              <p className="text-[11px] text-teal-350 mt-1 leading-relaxed">
                                Los mejores repositorios atléticos públicos de código abierto se encuentran estrictamente en idioma inglés. Al integrar la traducción inteligente con Inteligencia Artificial vía Gemini API en nuestro servidor full-stack, democratizamos el acceso a rutinas detalladas en español enriquecidas con consejos atléticos avanzados al instante.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Acción Principal (4.0) */}
                    {docSubTab === "action" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            4.0 ¿CUÁL ES LA ACCIÓN PRINCIPAL DE LA PLATAFORMA?
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          El corazón de Ímpetu reside en la interacción atlética. El flujo de acción principal que un usuario ejecuta se detalla en el siguiente ciclo operativo de contracciones:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                          <div className="p-3.5 rounded-xl border border-teal-900/40 bg-[#05171d] space-y-1">
                            <span className="font-mono text-[#14f195] font-bold text-xs block">FASE A</span>
                            <strong className="text-white text-xs block font-mono">Búsqueda & Estructuración</strong>
                            <p className="text-[10px] text-teal-350 leading-relaxed">
                              El usuario realiza búsquedas biomecánicas personalizadas por músculos específicos o equipamiento disponible. El catálogo devuelve ejercicios en español optimizados.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-teal-900/40 bg-[#05171d] space-y-1">
                            <span className="font-mono text-cyan-400 font-bold text-xs block">FASE B</span>
                            <strong className="text-white text-xs block font-mono">Validación de Bloques</strong>
                            <p className="text-[10px] text-teal-350 leading-relaxed">
                              Al culminar las series de un ejercicio, el usuario presiona la acción prioritaria <span className="text-white">"Validar Bloque"</span>. El consenso computa el XP y acuña tokens de simulación instantáneos en el balance de su nodo físico local.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-teal-900/40 bg-[#05171d] space-y-1">
                            <span className="font-mono text-purple-400 font-bold text-xs block">FASE C</span>
                            <strong className="text-white text-xs block font-mono">Firma Mutual P2P</strong>
                            <p className="text-[10px] text-teal-355 leading-relaxed">
                              Mediante consorcio asimétrico físico, dos compañeros en el gimnasio escanean sus firmas usando validación mutable cruzada, desbloqueando un subsidio colectivo de <strong className="text-[#14f195]">+35 $IMP adicionales</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MVP Alcance Mínimo (5.0) */}
                    {docSubTab === "mvp" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <Dumbbell className="w-5 h-5 text-pink-400" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            5.0 ALCANCE DE LA VERSIÓN MÍNIMA VIABLE (MVP)
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          El alcance mínimo que estamos entregando y cerrando para garantizar estabilidad y una excelente experiencia funcional incluye los siguientes módulos técnicos y de negocios:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-[#05171d]/60 border border-teal-900/30 rounded-xl flex items-start gap-2.5">
                            <span className="text-xs">📖</span>
                            <div>
                              <strong className="text-white text-xs font-mono block">Buscador Multi-Filtro de Catálogos</strong>
                              <p className="text-[10px] text-teal-350 leading-relaxed mt-0.5">
                                Filtrado por partes clave, músculos target y equipos con traducción instantánea e inyecciones de tips de ejecución de Inteligencia Artificial en español.
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-[#05171d]/60 border border-teal-900/30 rounded-xl flex items-start gap-2.5">
                            <span className="text-xs">🔑</span>
                            <div>
                              <strong className="text-white text-xs font-mono block">Simulador de Billetera RPC de Solana</strong>
                              <p className="text-[10px] text-teal-350 leading-relaxed mt-0.5">
                                Conectividad con wallets oficiales de Solana, permitiendo leer con seguridad la firma de red y reflejar tus balances de red reales en Devnet/Mainnet si están sincronizados.
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-[#05171d]/60 border border-teal-900/30 rounded-xl flex items-start gap-2.5">
                            <span className="text-xs">💰</span>
                            <div>
                              <strong className="text-white text-xs font-mono block">Contabilidad Local Segura de $IMP</strong>
                              <p className="text-[10px] text-teal-350 leading-relaxed mt-0.5">
                                Un ledger local seguro de acuñación que reacciona a los puntos de XP que consigues, minando $IMP de manera instantánea directo a tu nodo.
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-[#05171d]/60 border border-teal-900/30 rounded-xl flex items-start gap-2.5">
                            <span className="text-xs">🎁</span>
                            <div>
                              <strong className="text-white text-xs font-mono block">Marketplace de Generación de Descuentos</strong>
                              <p className="text-[10px] text-teal-350 leading-relaxed mt-0.5">
                                Sistema de reclamos de cupones con firmas asimétricas válidos para canjear descuentos reales en suplementos deportivos y pase de accesos VIP físicos.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Estado Actual (6.0) */}
                    {docSubTab === "status" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <Activity className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            6.0 ESTADO ACTUAL DEL PROYECTO
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          Actualmente, el proyecto se encuentra operando en fase <strong className="text-emerald-400">Live Alpha-Node v1.0.4</strong> de alta velocidad.
                        </p>

                        <div className="bg-[#05171d] p-4 rounded-xl border border-teal-900/40 space-y-2 mt-2">
                          <span className="text-[10px] font-mono text-[#14f195] font-bold block uppercase tracking-wide">ESTADO OPERACIONAL DIRECTO:</span>
                          <ul className="text-xs text-teal-200 list-disc list-inside space-y-1.5 leading-relaxed">
                            <li><strong className="text-white">Secciones Front-end:</strong> Completamente desarrolladas con interfaces adaptativas fluidas y estados con animations robustas por `motion`.</li>
                            <li><strong className="text-white">Caché unificado de Servidor:</strong> En nuestro backend full-stack habilitamos una inyección de caché pre-sembrada que evita el despliegue con base de datos en blanco. Resuelve el problema de latencia si la conexión a WorkoutX o ExerciseDB oficial excede límites de peticiones.</li>
                            <li><strong className="text-white">Traductor AI proxy:</strong> Encaminado server-side de llaves secretas seguras para evitar exhalación de API keys en el navegador.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Próximos pasos (7.0) */}
                    {docSubTab === "next" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <TrendingUp className="w-5 h-5 text-purple-400" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            7.0 PRÓXIMOS PASOS (HITOS & ROADMAP)
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          Para avanzar de la red Alpha-Node local a un ecosistema de escala global, nuestra planificación de ingeniería se divide en los siguientes desarrollos técnicos de alta prioridad:
                        </p>

                        <div className="space-y-3.5 pt-2">
                          <div className="p-3 bg-purple-950/20 border border-purple-900/30 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs font-mono">HITO A: Token real SPL acuñable en Solana Devnet</strong>
                              <span className="text-[9px] bg-purple-950 text-purple-300 font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">En diseño</span>
                            </div>
                            <p className="text-[11px] text-teal-300 leading-relaxed">
                              Creación de los contratos Anchor en Rust de Solana para permitir la transferencia automática de $IMP on-chain desde los monederos que validan los bloques deportivos, configurando pools de liquidez reales.
                            </p>
                          </div>

                          <div className="p-3 bg-purple-950/20 border border-purple-900/30 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs font-mono">HITO B: Integración directa de Smartwatches & Wearables</strong>
                              <span className="text-[9px] bg-purple-950 text-purple-300 font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Planificado</span>
                            </div>
                            <p className="text-[11px] text-teal-300 leading-relaxed">
                              Involucrar conectores IoT de HealthKit, Apple Watch, Google Fit y Fitbit para alimentar el validador biomecánico de forma desatendida mediante frecuencia cardíaca acelerada y calorías comprobadas físicamente de forma activa.
                            </p>
                          </div>

                          <div className="p-3 bg-purple-950/20 border border-purple-900/30 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs font-mono">HITO C: Consorcio multisig con Alianzas de Gimnasios</strong>
                              <span className="text-[9px] bg-purple-950 text-purple-300 font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Fidelización</span>
                            </div>
                            <p className="text-[11px] text-teal-300 leading-relaxed">
                              Involucrar pantallas interactivas de minado de bloques directamente en gimnasios premium, operando nodos locales de consorcio físico para verificar de forma segura a los atletas en sitio.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Roles y Trabajo (8.0) */}
                    {docSubTab === "roles" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <User className="w-5 h-5 text-indigo-400" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            8.0 ROLES EN EL EQUIPO Y TRABAJO DISTRIBUIDO
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-teal-200/95">
                          Para garantizar un desarrollo ágil y la robustez técnica del protocolo de fitness gamificado Ímpetu de Solana, nuestro equipo se estructura bajo los siguientes roles y pesos funcionales operativos:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs font-mono">👨‍💻 Front-End & UX/UI Engineer</strong>
                              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-400 px-1.5 rounded">35% Carga</span>
                            </div>
                            <p className="text-[10.5px] text-teal-300 leading-relaxed">
                              Responsable de construir toda la dApp, los loops interactivos, transiciones, estado local asíncrono e integración adaptativa responsive en el cliente.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs font-mono">⛓️ Solana Web3 Developer</strong>
                              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-400 px-1.5 rounded">25% Carga</span>
                            </div>
                            <p className="text-[10.5px] text-teal-300 leading-relaxed">
                              Encargado de la firma criptográfica segura con billeteras de Solana (Phantom/Solflare), conexión segura de RPCs de Solanas Devnet y Mainnet.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs font-mono">🤖 AI & LLM Systems Engineer</strong>
                              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-400 px-1.5 rounded">20% Carga</span>
                            </div>
                            <p className="text-[10.5px] text-teal-300 leading-relaxed">
                              Responsable del proxy seguro con el SDK de Gemini API para traducir semánticamente el catálogo de ejercicios biomecánicos y estructurar los consejos biomecánicos al instante.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs font-mono">💪 Atleta Validador / Advisor</strong>
                              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-400 px-1.5 rounded">20% Carga</span>
                            </div>
                            <p className="text-[10.5px] text-teal-300 leading-relaxed">
                              Asesores biomecánicos que definen las curvas fisiológicas de XP del gimnasio (ejemplo: mayor XP por sentadilla pesada que por curl de bíceps) del algoritmo de Proof-of-Sweat.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Especificaciones Técnicas (9.0) */}
                    {docSubTab === "technical" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-teal-950 pb-2">
                          <Cpu className="w-5 h-5 text-[#9945ff]" />
                          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest">
                            9.0 ESPECIFICACIONES TÉCNICAS (CONSENSO & TOKEN)
                          </h4>
                        </div>
                        
                        <div className="space-y-4 text-xs">
                          <div>
                            <span className="text-[10px] font-mono text-[#14f195] font-bold block uppercase tracking-wide">ALGORITMO DE MINADO DE $IMP (PROOF-OF-SWEAT):</span>
                            <p className="text-teal-200 mt-1 leading-relaxed">
                              El volumen total minado por ejercicio en el nodo se calcula dinámicamente bajo la siguiente parametrización de esfuerzo físico en el cliente:
                            </p>
                            <div className="bg-[#031318] p-3 rounded-xl font-mono text-[11px] text-[#14f195] border border-teal-900/40 my-2.5">
                              IMP_MINADO = Ejercicio_XP * 3.0 + P2P_Firmas_Mutual
                            </div>
                            <ul className="text-teal-300 list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
                              <li><strong className="text-white">Ejercicio_XP:</strong> Los puntos de experiencia asignados científicamente a cada ejercicio de acuerdo al desgaste de fibras (músculos principales vs secundarios).</li>
                              <li><strong className="text-white">P2P_Firmas_Mutual:</strong> Si un nodo compañero valida cercanía y corrobora el esfuerzo, se añade asimétricamente un subsidio adicional de <span className="text-white">+35 $IMP</span> por bloque verificado.</li>
                            </ul>
                          </div>

                          <div className="p-3 bg-[#082029]/45 border border-teal-850/50 rounded-xl">
                            <span className="text-[10px] text-purple-400 font-mono font-bold block uppercase mb-1">CUADRO DE DISTRIBUCIÓN DEL SUMINISTRO (TOKENOMICS):</span>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-teal-300">
                              <div className="flex justify-between border-b border-teal-950 pb-1">
                                <span>🏋️ Recompensa Minado Diario:</span>
                                <strong className="text-white">60%</strong>
                              </div>
                              <div className="flex justify-between border-b border-teal-950 pb-1">
                                <span>💧 Pools de Liquidez & Canjes:</span>
                                <strong className="text-white">20%</strong>
                              </div>
                              <div className="flex justify-between border-b border-teal-950 pb-1">
                                <span>🏢 Alianzas / Gimnasios:</span>
                                <strong className="text-white">10%</strong>
                              </div>
                              <div className="flex justify-between border-b border-teal-950 pb-1">
                                <span>👥 Equipo de Desarrollo:</span>
                                <strong className="text-white">10%</strong>
                              </div>
                            </div>
                            <div className="text-[10px] text-teal-400/90 mt-2 font-sans italic">
                              * El suministro máximo de tokens SPL está fijado en 10,000,000,000 $IMP. Los tokens del marketplace acumulados vuelven a recircular por consorcio local.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* PREVIOUS / NEXT CHAPTER QUICK FLIP PAGES (UX Masterpiece) */}
                  <div className="mt-8 pt-4 border-t border-teal-950 flex items-center justify-between font-mono text-xs select-none">
                    {/* Previous Button link */}
                    <button
                      disabled={docSubTab === "welcome"}
                      onClick={() => {
                        const order = ["welcome", "building", "audience", "problem", "action", "mvp", "status", "next", "roles", "technical"];
                        const currIndex = order.indexOf(docSubTab);
                        if (currIndex > 0) setDocSubTab(order[currIndex - 1]);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition duration-150 cursor-pointer ${
                        docSubTab === "welcome"
                          ? "opacity-30 border-teal-950 text-teal-600 pointer-events-none"
                          : "border-teal-900/50 hover:bg-teal-950/60 text-teal-400 hover:text-white"
                      }`}
                    >
                      &larr; ANT.
                    </button>

                    <span className="text-[10px] text-teal-500 font-mono">
                      Cap. {["welcome", "building", "audience", "problem", "action", "mvp", "status", "next", "roles", "technical"].indexOf(docSubTab) + 1} de 10
                    </span>

                    {/* Next Button link */}
                    <button
                      disabled={docSubTab === "technical"}
                      onClick={() => {
                        const order = ["welcome", "building", "audience", "problem", "action", "mvp", "status", "next", "roles", "technical"];
                        const currIndex = order.indexOf(docSubTab);
                        if (currIndex < order.length - 1) setDocSubTab(order[currIndex + 1]);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition duration-150 cursor-pointer ${
                        docSubTab === "technical"
                          ? "opacity-30 border-teal-950 text-teal-600 pointer-events-none"
                          : "border-teal-900/50 hover:bg-[#0c2e38] text-[#14f195] hover:text-white"
                      }`}
                    >
                      SIG. &rarr;
                    </button>
                  </div>

                </div>

              </div>

              {/* Sticky bottom close panel */}
              <div className="p-4 bg-[#05171d] border-t border-teal-900/60 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 hover:scale-[1.01] text-white font-mono font-extrabold text-xs transition uppercase cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(31,193,195,0.4)]"
                >
                  VOLVER AL PANEL DE ENTRENAMIENTO
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER SECTION */}
      <footer className="border-t border-gray-850 bg-[#07080d] mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          
          {/* Side-by-side Layout with short $IMP mining explanation paragraph next to the Documentation link */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full py-6 border-b border-gray-850/60 text-left">
            <div className="md:col-span-8 space-y-2">
              <h4 className="font-mono text-xs font-bold text-orange-400 tracking-wider uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" /> EL MINADO DE TOKENS $IMP
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                El motor descentralizado <strong className="text-white">Proof of Sweat</strong> convierte de forma autónoma cada bloque de ejercicio validado e intensidades de entrenamiento físico en combustible criptográfico utilitario ($IMP). Cada esfuerzo registrado en tu nodo local mina tokens de recompensa directa a una tasa acumulativa de <strong className="text-[#14f195]">3x tus XP</strong>, dándote un balance de simulación libre de costos de gas listo para canjear en el marketplace.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <button
                onClick={() => setShowDocModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gray-900 via-[#0b0c14] to-gray-950 hover:from-[#9945ff]/10 hover:to-[#14f195]/10 text-xs font-mono font-extrabold tracking-wider text-[#14f195] hover:text-white border border-gray-800 hover:border-[#14f195]/40 transition duration-300 w-full md:w-auto justify-center cursor-pointer shadow-lg"
              >
                <BookOpen className="w-4 h-4 text-[#14f195]" />
                DOCUMENTACIÓN OFICIAL
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500">
            <span>Powered by</span>
            <span className="text-gray-400">ExerciseDB Mirror API</span>
            <span>&bull;</span>
            <span className="text-[#9945ff]">Gemini Pro Brain</span>
          </div>

          <p className="text-xs text-gray-600 max-w-xl leading-relaxed text-center">
            Esta es una SPA innovadora construida con temática de Solana de alto contraste para propósitos de portafolio y fitness Web3. 
            Todas las interacciones de API se canalizan a través de un proxy full-stack para máxima seguridad y rapidez.
          </p>

          <p className="font-mono text-[9px] text-[#14f195] bg-gray-900 px-2.5 py-1 rounded border border-gray-855 tracking-wider uppercase text-center">
            Proof of Sweat consensus v1.0.3 - Solana {solanaNetwork === 'mainnet' ? 'Mainnet' : 'Devnet'}
          </p>
        </div>
      </footer>

    </div>
  );
}
