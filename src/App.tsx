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
        
        if (data.results.length === 0) {
          setErrorMsg("No se encontraron ejercicios que coincidan con la búsqueda. Intenta con otros filtros u otra palabra clave.");
        }
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
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-5 rounded-xl flex items-start gap-3.5 mb-10">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Fallo de Consenso de Red</h4>
              <p className="text-xs text-red-300/90 mt-1 leading-relaxed">{errorMsg}</p>
              <button 
                onClick={handleClearFilters}
                className="mt-3.5 px-3.5 py-1.5 text-[11px] font-mono bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 rounded transition uppercase font-bold"
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
              className="fixed inset-0 bg-[#020a0d]/85 backdrop-blur-md" 
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl bg-[#082029] border border-teal-800/80 rounded-2xl shadow-2xl overflow-hidden z-10 font-sans max-h-[85vh] flex flex-col"
            >
              
              {/* Modal Custom Top Glowing line */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-[#14f195] to-cyan-400" />

              {/* Header Box */}
              <div className="p-5 border-b border-teal-900/60 flex items-center justify-between bg-[#05171d]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">Documentación del Protocolo Ímpetu</h3>
                    <p className="text-[10px] text-teal-300 font-mono uppercase">Especificaciones del motor Proof-of-Sweat y minado de $IMP</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDocModal(false)}
                  className="p-1 px-2.5 rounded-lg bg-[#0d2d38] hover:bg-teal-900 text-teal-300 hover:text-white border border-teal-850/60 transition font-mono text-xs cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Scrollable content of Documentacion */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-left text-teal-100">
                
                {/* Section 1 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[#14f195] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14f195]" /> 1. Arquitectura del Protocolo Ímpetu
                  </h4>
                  <p className="text-xs text-teal-200/95 leading-relaxed">
                    Ímpetu es una aplicación descentralizada (dApp) híbrida diseñada para registrar, validar y premiar el esfuerzo atlético biomecánico sin incurrir en los altos costos de gas de las operaciones on-chain convencionales de Capa 1. Al combinar la potencia del motor de inteligencia artificial de Gemini con el catálogo unificado de ExerciseDB OSS, logramos estructurar rutinas en español de alto rendimiento con validación instantánea.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> 2. El Mecanismo de Minado de $IMP
                  </h4>
                  <p className="text-xs text-teal-200/95 leading-relaxed">
                    El token <strong className="text-white">$IMP</strong> es una unidad criptográfica utilitaria de simulación acumulada localmente en tu nodo cliente (Database de seguridad aislada). 
                  </p>
                  <ul className="text-xs text-teal-250 list-disc list-inside pl-2 space-y-1">
                    <li><strong className="text-teal-350">Acuñamiento Base:</strong> Al culminar series biomecánicas y presionar <span className="text-white">"Validar Bloque"</span>, se mina $IMP inmediatamente a una proporción de <span className="text-white">3x los puntos de XP</span> del ejercicio.</li>
                    <li><strong className="text-teal-350">Consenso P2P Mutuo:</strong> Utilizando el escaneo de confirmación física mutua entre compañeros de gimnasio, el protocolo asimétrico inyecta un bloque de firma mutua que libera un subsidio adicional de <span className="text-[#14f195]">+35 $IMP</span> directo a la billetera conectada.</li>
                    <li><strong className="text-teal-350">Cero Tarifa de Transacción:</strong> Al ejecutarse en un entorno simulado local e híbrido, los usuarios disfrutan de velocidades sub-segundo sin pagar gas de Solana.</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" /> 3. Canjes Reales en el Marketplace (Sponsorships)
                  </h4>
                  <p className="text-xs text-teal-200/95 leading-relaxed">
                    La utilidad del token $IMP se materializa en acceso exclusivo de marcas afiliadas a la salud física. Los tokens minados localmente se reducen de la billetera local para generar claves de cupones asimétricas válidas en canales físicos e informáticos como:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-[#05171d] p-2.5 rounded-xl border border-teal-900/60">
                      <h5 className="text-[10px] font-mono text-[#14f195] font-bold">GNC / PROSCIENCE</h5>
                      <span className="text-[9px] text-teal-400 block">Descuento del 25%</span>
                    </div>
                    <div className="bg-[#05171d] p-2.5 rounded-xl border border-teal-900/60">
                      <h5 className="text-[10px] font-mono text-orange-400 font-bold">SMARTFIT VIP</h5>
                      <span className="text-[9px] text-teal-400 block">Pase Libre de 7 Días</span>
                    </div>
                    <div className="bg-[#05171d] p-2.5 text-[10px] rounded-xl border border-teal-900/60">
                      <h5 className="text-[10px] font-mono text-cyan-400 font-bold">NIKE STORE</h5>
                      <span className="text-[9px] text-teal-400 block">Descuento de la Tienda</span>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> 4. Integración Directa con la Red Solana
                  </h4>
                  <p className="text-xs text-teal-200/95 leading-relaxed">
                    Puedes conectar tu billetera oficial de Solana (Phantom, Solflare o Backpack) a la interfaz. Nuestra dApp leerá con seguridad y sin comprometer claves privadas la firma pública para enlazar tu progreso y reflejar tus saldos de SOL reales en tiempo real a través de RPC de Solana.
                  </p>
                </div>

                <div className="bg-[#05171d]/90 border border-teal-850/60 p-4 rounded-xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-mono font-bold text-white">Seguridad de Nodo Local</h5>
                    <p className="text-[11px] leading-relaxed text-teal-350">
                      Para garantizar la accesibilidad y proteger tus finanzas, la aplicación almacena tu información de forma encriptada localmente y usa endpoints asíncronos y libres de coste. ¡Empieza a entrenar de forma inteligente hoy!
                    </p>
                  </div>
                </div>

              </div>

              {/* Sticky bottom close panel */}
              <div className="p-4 bg-[#05171d] border-t border-teal-900/60 flex justify-end gap-2">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 hover:scale-[1.02] text-white font-mono font-extrabold text-xs transition uppercase cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(31,193,195,0.4)]"
                >
                  ENTENDIDO, VOLVER AL PANEL
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
