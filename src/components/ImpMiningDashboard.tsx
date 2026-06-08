import { useState, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  Cpu, 
  Check, 
  Copy, 
  Sparkles, 
  Gift, 
  Smartphone, 
  CheckCircle2, 
  Lock, 
  UserCheck 
} from "lucide-react";

interface RewardItem {
  id: string;
  title: string;
  sponsor: string;
  cost: number;
  description: string;
  category: string;
  codeTemplate: string;
  icon: "protein" | "gym" | "apparel";
}

const REWARDS: RewardItem[] = [
  {
    id: "reward_gnc_25",
    title: "DESCUENTO -25% GNC & PROSCIENCE",
    sponsor: "Nutrición & Suplementos Global",
    cost: 45,
    description: "Desbloquea 25% de descuento directo en cualquier compra de proteínas, creatinas o aminoácidos seleccionados.",
    category: "Suplementación",
    codeTemplate: "IMP-PRO25-",
    icon: "protein"
  },
  {
    id: "reward_vip_smartfit",
    title: "ACCESO VIP 7 DÍAS SMARTFIT",
    sponsor: "SmartFit Fitness Club",
    cost: 80,
    description: "Pase premium completo de 7 días consecutivos en cualquier sucursal SmartFit del país. Clases guiadas incluidas.",
    category: "Membresías",
    codeTemplate: "IMP-SFVIP-",
    icon: "gym"
  },
  {
    id: "reward_impetu_apparel",
    title: "VALOR DESCUENTO -15% NIKE STORE",
    sponsor: "Ímpetu & Nike Partner",
    cost: 30,
    description: "Cupón canjeable en tienda seleccionada o canal online para ropa de entrenamiento o calzado técnico de fuerza.",
    category: "Ropa Deportiva",
    codeTemplate: "IMP-NIKE15-",
    icon: "apparel"
  }
];

interface ImpMiningDashboardProps {
  userImpBalance: number;
  setUserImpBalance: Dispatch<SetStateAction<number>>;
  unlockedCoupons: string[];
  setUnlockedCoupons: Dispatch<SetStateAction<string[]>>;
}

export function ImpMiningDashboard({
  userImpBalance,
  setUserImpBalance,
  unlockedCoupons,
  setUnlockedCoupons
}: ImpMiningDashboardProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<"idle" | "scanning" | "success">("idle");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [p2pFeedback, setP2pFeedback] = useState("");

  const triggerP2PSign = () => {
    setIsScanning(true);
    setScanStep("scanning");
    
    // Simulate decentralized consensus checks
    setTimeout(() => {
      setScanStep("success");
      setUserImpBalance(prev => prev + 35);
      setP2pFeedback("¡Consenso logrado! Tu compañero ha firmado la validación de tu nodo. Se han acreditado +35 $IMP a tu billetera.");
      
      setTimeout(() => {
        setIsScanning(false);
        setScanStep("idle");
      }, 4000);
    }, 2000);
  };

  const handleUnlockReward = (reward: RewardItem) => {
    if (userImpBalance < reward.cost) {
      alert(`Balance de $IMP insuficiente. Continúa validando ejercicios o haz consenso P2P con tus compañeros para minar más tokens.`);
      return;
    }

    if (window.confirm(`¿Confirmas canjear ${reward.cost} $IMP por el beneficio de "${reward.title}"? Estos tokens se restarán de tu nodo local.`)) {
      setUserImpBalance(prev => prev - reward.cost);
      setUnlockedCoupons(prev => [...prev, reward.id]);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Generate a predictable, neat mock voucher based on user address / reward
  const generateVoucherCode = (reward: RewardItem) => {
    return `${reward.codeTemplate}${reward.id.toUpperCase().substring(7, 11)}-SWEAT88`;
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      
      {/* COLUMN 1: THE MINING ENGINE & LOCAL P2P CONSENSUS */}
      <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] bg-orange-950/50 border border-orange-800 text-orange-400 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase">
              Consenso de Nodo
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] text-teal-300 font-mono">MINANDO $IMP</span>
            </div>
          </div>

          <h4 className="text-sm font-mono font-extrabold text-white tracking-wide uppercase mb-1">
            Proof of Sweat Engine
          </h4>
          <p className="text-xs text-teal-250 leading-normal mb-5">
            Mina el token <strong className="text-orange-400">$IMP</strong> validando rutinas físicas complejas. Consolida la veracidad mediante consenso mutuo directo con tus compañeros de gimnasio de forma descentralizada.
          </p>

          {/* Interactive Node Metric Wrapper */}
          <div className="bg-[#05171d]/90 p-4 rounded-xl border border-teal-800/65 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-teal-400 font-mono tracking-wider font-bold">POTENCIA DE MINADO</span>
              <span className="text-[10px] text-orange-400 font-mono font-bold">~1.45 IMP/rep</span>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] text-teal-300 font-mono tracking-wider uppercase leading-none">Mi Nodo Local</p>
                <p className="text-2xl font-black font-mono text-orange-400 mt-1 flex items-baseline gap-1.5">
                  {userImpBalance.toFixed(0)} <span className="text-xs text-orange-500 font-extrabold">$IMP</span>
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-[9px] text-teal-300 font-mono tracking-wider uppercase leading-none">Cero Costo de Gas</p>
                <span className="inline-block text-[10px] text-[#14f195] font-mono font-extrabold bg-[#14f195]/10 px-1.5 py-0.5 rounded border border-[#14f195]/20 mt-1">
                  OFF-CHAIN DESCENTRALIZADO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* P2P Verification Action */}
        <div>
          <button
            onClick={triggerP2PSign}
            disabled={isScanning}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-black text-xs font-mono font-extrabold tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20 disabled:opacity-50"
          >
            <Smartphone className="w-4 h-4 text-black stroke-[2.5]" />
            CONSENSO P2P (ESCANEOS)
          </button>
          
          <p className="text-center text-[10px] text-teal-400 font-mono mt-2 leading-tight">
            Haz consenso con tu compañero cara a cara escaneando el código de confirmación física.
          </p>
        </div>

        {/* Dynamic scanning simulation overlays */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#05171d]/95 flex flex-col items-center justify-center p-6 text-center z-25"
            >
              {scanStep === "scanning" ? (
                <>
                  <div className="relative w-24 h-24 border-2 border-orange-500/80 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <motion.div 
                      animate={{ y: [-48, 48, -48] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="absolute w-full h-0.5 bg-orange-400 shadow-[0_0_10px_#e3a008]"
                    />
                    <Cpu className="w-10 h-10 text-orange-400 animate-pulse" />
                  </div>
                  <h5 className="font-mono text-xs font-extrabold text-orange-400 uppercase tracking-widest">
                    EJECUTANDO HASHING P2P
                  </h5>
                  <p className="text-[10px] text-teal-300 mt-1.5 font-mono max-w-xs">
                    Comprobando firmas asimétricas del validador de consenso corporal...
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#14f195]/10 border border-[#14f195]/40 rounded-full flex items-center justify-center mb-4 text-[#14f195]">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <h5 className="font-mono text-xs font-extrabold text-[#14f195] uppercase tracking-wider">
                    CONSENSO VERIFICADO
                  </h5>
                  <p className="text-[11px] text-gray-100 mt-1.5 font-mono max-w-xs leading-relaxed">
                    {p2pFeedback}
                  </p>
                  <span className="text-[9px] text-[#14f195] font-mono bg-[#14f195]/20 px-2 py-0.5 rounded border border-[#14f195]/40 mt-3 font-bold uppercase">
                    Consolidado en Local DB
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COLUMN 2 & 3: SPONSOR GIFT COUPOUNS MARKETPLACE */}
      <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 lg:col-span-2 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-teal-900/40">
          <div>
            <span className="text-[10px] bg-cyan-950/55 border border-cyan-800 text-cyan-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase">
              Casos de Uso Real (Sponsorship)
            </span>
            <h4 className="text-sm font-mono font-extrabold text-white tracking-wide uppercase mt-1">
              Beneficios Reales con $IMP Mined
            </h4>
          </div>
          <div className="flex items-center gap-1 bg-orange-950/30 px-2.5 py-1 rounded-lg border border-orange-900/30">
            <Gift className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400 font-mono font-extrabold">UTILIDAD DIRECTA</span>
          </div>
        </div>

        {/* GRID OF REWARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REWARDS.map((rew) => {
            const isUnlocked = unlockedCoupons.includes(rew.id);
            const canUnlock = userImpBalance >= rew.cost;
            const finalCode = generateVoucherCode(rew);

            return (
              <div 
                key={rew.id}
                className={`bg-[#05171d]/70 rounded-xl border p-4 transition flex flex-col justify-between relative ${
                  isUnlocked 
                    ? "border-[#14f195]/30 bg-[#14f195]/5" 
                    : "border-teal-800/60 hover:border-teal-700"
                }`}
              >
                {/* Cost Tag */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isUnlocked 
                      ? "bg-[#14f195]/20 text-[#14f195]" 
                      : "bg-orange-950/40 text-orange-400 border border-orange-900/30"
                  }`}>
                    {rew.cost} $IMP
                  </span>
                </div>

                <div>
                  <span className="text-[9px] text-teal-400 font-mono font-bold tracking-wider uppercase block">
                    {rew.category}
                  </span>
                  
                  <h5 className="text-[11px] font-bold font-mono text-white mt-1 leading-snug">
                    {rew.title}
                  </h5>
                  
                  <p className="text-[8px] text-teal-300 font-semibold mt-0.5 font-mono">
                    Canal: {rew.sponsor}
                  </p>

                  <p className="text-[10px] text-teal-200 leading-normal mt-3.5 mb-4">
                    {rew.description}
                  </p>
                </div>

                {/* Redeem Trigger */}
                <div className="pt-2 border-t border-teal-900/60">
                  {isUnlocked ? (
                    <div className="space-y-1.5">
                      <div className="w-full py-1.5 px-2 bg-black/60 rounded border border-teal-800/40 flex items-center justify-between text-[11px] font-mono font-bold select-all">
                        <span className="text-[#14f195] tracking-wider font-extrabold">{finalCode}</span>
                        <button 
                          onClick={() => copyCode(finalCode)}
                          className="text-gray-400 hover:text-white transition"
                          title="Copiar Código"
                        >
                          {copiedCode === finalCode ? (
                            <Check className="w-3.5 h-3.5 text-[#14f195]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-center text-[8px] text-[#14f195] font-mono uppercase font-bold tracking-widest">
                        CUPÓN DESBLOQUEADO
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlockReward(rew)}
                      className={`w-full py-2 rounded-lg text-[10px] font-mono font-extrabold tracking-wider transition uppercase cursor-pointer text-center ${
                        canUnlock 
                          ? "bg-teal-900/60 hover:bg-teal-800/80 text-white border border-teal-700/80" 
                          : "bg-teal-950/80 text-teal-600 border border-teal-900/40 cursor-not-allowed"
                      }`}
                    >
                      {canUnlock ? "CANJEAR CON $IMP" : "SALDO INSUFICIENTE"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
