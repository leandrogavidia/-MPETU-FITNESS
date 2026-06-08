import { Trophy, Award } from "lucide-react";

interface ExperienceTabProps {
  walletConnected: boolean;
  walletAddress: string | null;
  userXp: number;
  profileName: string;
  userImpBalance: number;
  setActiveTab: (tab: string) => void;
}

export function ExperienceTab({
  walletConnected,
  walletAddress,
  userXp,
  profileName,
  userImpBalance,
  setActiveTab
}: ExperienceTabProps) {
  const currentLvl = Math.floor(userXp / 100) + 1;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECCIÓN DE BIENVENIDA Y EXPLICACIÓN DE LA PESTAÑA */}
      <section className="text-center relative max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/10 to-[#14f195]/10 rounded-full border border-orange-500/20 mb-4">
          <Trophy className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[11px] font-mono text-orange-200 font-semibold tracking-wide uppercase">Consenso & Multiplicador</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
          Ruta XP <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-[#14f195] bg-clip-text text-transparent font-black">niveles & rango</span>
        </h2>
        <div className="text-sm leading-relaxed max-w-2xl mx-auto font-normal">
          <p className="font-bold text-orange-400 mb-1.5 text-base font-sans">Ruta de Experiencia</p>
          <p className="text-white">
            El protocolo Ímpetu cataloga tu rango de minado físico según tu sudor acumulado (XP). Aumentar tu nivel expande tu multiplier de consensus lo que te faculta a acuñar más $IMP tokens por cada rutina física.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* COLUMN 1: LINEAR PROGRESS ROADMAP (NIVELES) */}
        <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 md:p-6 lg:col-span-7 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-teal-900/40 mb-5">
            <div>
              <span className="text-[9px] bg-orange-950/50 border border-orange-850 text-orange-400 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                Rango Deportivo Cripto
              </span>
              <h4 className="text-sm font-mono font-extrabold text-white tracking-wide uppercase mt-1">
                Milestones Track
              </h4>
            </div>
            <Trophy className="w-5 h-5 text-orange-400" />
          </div>

          {/* Progress Milestones Tracker Timeline */}
          <div className="space-y-8 relative pl-5 border-l-2 border-teal-900/50 ml-2.5">
          {[
            { level: 1, title: "Iniciado del Sudor", xp: "0 - 99 XP", desc: "Acuñamiento básico en la red Solana. Tasa normal de 1x $IMP.", unlocked: userXp >= 0 },
            { level: 2, title: "Validador de Fuerza", xp: "100 - 290 XP", desc: "Consolida tu base corporal. Desbloquea bonificación pasiva en consenso P2P de +5%.", unlocked: userXp >= 100 },
            { level: 3, title: "Minero del Ácido Láctico", xp: "300 - 590 XP", desc: "Rutinas avanzadas de alta intensidad biomecánica. Sube el multiplier a 1.2x $IMP por repetición validada.", unlocked: userXp >= 300 },
            { level: 4, title: "Coloso de Solana On-Chain", xp: "600+ XP", desc: "Fisioculturista de protocolo de consenso absoluto. Libera las bonificaciones VIP en Nike y SmartFit de mayor nivel.", unlocked: userXp >= 600 }
          ].map((item) => {
            const isActiveLevel = currentLvl === item.level;
            return (
              <div key={item.level} className="relative text-left">
                
                <span className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-mono font-bold transition z-10 ${
                  isActiveLevel 
                    ? "bg-black text-[#14f195] border-[#14f195] ring-4 ring-[#14f195]/20 animate-pulse" 
                    : item.unlocked 
                      ? "bg-[#14f195] text-black border-[#14f195]" 
                      : "bg-[#05171d] text-teal-700 border-teal-900/60"
                }`}>
                  {item.level}
                </span>

                <div className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                  isActiveLevel 
                    ? "bg-[#0d2d38] border-[#14f195]/40 shadow-md shadow-[#14f195]/5" 
                    : item.unlocked 
                      ? "bg-[#05171d]/80 border-teal-800/60" 
                      : "bg-teal-950/20 border-teal-950 text-teal-750"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h5 className={`font-mono text-xs font-bold leading-none uppercase ${isActiveLevel ? "text-[#14f195]" : item.unlocked ? "text-white" : "text-teal-500"}`}>
                      {item.title}
                    </h5>
                    <span className="text-[10px] font-mono font-extrabold uppercase text-cyan-300">
                      {item.xp}
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-teal-200 mt-1">
                    {item.desc}
                  </p>
                  
                  {isActiveLevel && (
                    <div className="mt-3.5 pt-2.5 border-t border-teal-800/40 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#14f195] tracking-widest font-black uppercase font-bold">MI NIVEL ACTIVO ACTUAL</span>
                      <span className="text-[9px] text-teal-300 font-mono font-bold">Multiplicador: x1.{item.level} $IMP</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: LEADERBOARD SYSTEM (RANKING DE NIVELES) */}
      <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 md:p-6 lg:col-span-12 lg:col-span-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-teal-900/40 mb-4">
            <div>
              <span className="text-[9px] bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase font-semibold">
                Líderes de Consenso
              </span>
              <h4 className="text-sm font-mono font-extrabold text-white tracking-wide uppercase mt-1">
                Ranking De Niveles Global
              </h4>
            </div>
            <Award className="w-5 h-5 text-cyan-400" />
          </div>

          <p className="text-xs text-teal-300 leading-normal mb-5 text-left">
            Los top validadores de fuerza en la dApp. Cada bloque de ejercicio firmado en red incrementa su nivel. Conecta tu wallet para competir y aparecer en el ledger público de Solana.
          </p>

          <div className="grid grid-cols-12 gap-1 text-[9px] font-mono text-teal-400 uppercase tracking-wider mb-2 font-bold border-b border-teal-900/40 pb-2.5 px-2">
            <div className="col-span-2">RANK</div>
            <div className="col-span-5">VALIDADOR</div>
            <div className="col-span-2 text-center">NIVEL</div>
            <div className="col-span-3 text-right">XP TOTAL</div>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, user: "vitalik_sweating.sol", level: 12, xp: "1,240 XP", mined: "3,720 $IMP", isSelf: false },
              { rank: 2, user: "sol_validator.sol", level: 8, xp: "810 XP", mined: "2,430 $IMP", isSelf: false },
              { rank: 3, user: "beast_mode_69.sol", level: 5, xp: "540 XP", mined: "1,620 $IMP", isSelf: false },
              { 
                rank: 4, 
                user: walletConnected ? `${walletAddress?.substring(0, 8)}... (${profileName})` : `${profileName} (Tú)`, 
                level: currentLvl, 
                xp: `${userXp} XP`, 
                mined: `${userImpBalance.toFixed(0)} $IMP`, 
                isSelf: true 
              },
              { rank: 5, user: "pump_fun_coach.sol", level: 3, xp: "240 XP", mined: "720 $IMP", isSelf: false }
            ].map((row) => (
              <div 
                key={row.rank}
                className={`grid grid-cols-12 gap-1 items-center py-2.5 px-2.5 text-xs rounded-xl font-mono border text-left transition ${
                  row.isSelf 
                    ? "bg-[#14f195]/10 border-[#14f195]/30 text-white shadow-[0_0_8px_rgba(20,241,149,0.1)] font-bold" 
                    : "bg-[#05171d]/85 border-teal-900/40 hover:bg-[#0c2a35]/40"
                }`}
              >
                <div className="col-span-2 font-bold flex items-center justify-start gap-1">
                  {row.rank === 1 ? (
                    <span className="text-yellow-400">🥇 1</span>
                  ) : row.rank === 2 ? (
                    <span className="text-gray-300">🥈 2</span>
                  ) : row.rank === 3 ? (
                    <span className="text-amber-500">🥉 3</span>
                  ) : (
                    <span className="text-teal-400 pl-1">{row.rank}</span>
                  )}
                </div>
                
                <div className={`col-span-5 truncate text-[11.5px] font-semibold ${row.isSelf ? "text-[#14f195]" : "text-white"}`}>
                  {row.user}
                </div>

                <div className="col-span-2 text-center font-bold">
                  <span className="px-1.5 py-0.5 rounded bg-teal-950/80 border border-teal-900/50 text-[#14f195] text-[10px]">
                    Lvl {row.level}
                  </span>
                </div>

                <div className="col-span-3 text-right">
                  <span className="font-bold text-white block">{row.xp}</span>
                  <span className="text-[9px] text-[#14f195] font-semibold">{row.mined}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[#05171d]/90 border border-teal-900/50 flex flex-col gap-2.5 text-center">
          <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-widest font-black font-bold">Consola De Competencia</span>
          <p className="text-[10px] leading-relaxed text-teal-400">
            Reclama puntos de experiencia validando tus entrenamientos para subir de nivel y multiplicar tus recompensas.
          </p>
          <button
            onClick={() => setActiveTab("exercises")}
            className="w-full py-2 bg-[#0c2a35] hover:bg-teal-900 text-teal-305 hover:text-white border border-teal-800 text-xs font-mono font-bold tracking-wide transition rounded-lg uppercase cursor-pointer"
          >
            VALIDAR NUEVOS COMPROMISOS
          </button>
        </div>

      </div>

    </div>
  </div>
  );
}
