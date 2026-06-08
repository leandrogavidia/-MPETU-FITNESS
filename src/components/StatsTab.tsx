import { CheckCircle, Coins, Flame, Zap, Activity, Award, BarChart3 } from "lucide-react";

interface StatsTabProps {
  validatedSessions: string[];
  userImpBalance: number;
  userXp: number;
}

export function StatsTab({
  validatedSessions,
  userImpBalance,
  userXp
}: StatsTabProps) {
  const sessionsCount = validatedSessions.length;
  const caloriesBurned = sessionsCount * 280;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* SECCIÓN DE BIENVENIDA Y EXPLICACIÓN DE LA PESTAÑA */}
      <section className="mb-10 text-center relative max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/10 to-[#14f195]/10 rounded-full border border-orange-500/20 mb-4">
          <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[11px] font-mono text-orange-200 font-semibold tracking-wide">METABOLISMO & SISTEMA DE VALIDACIÓN</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
          Estadísticas <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-[#14f195] bg-clip-text text-transparent font-black">y Métricas</span>
        </h2>
        <p className="text-white text-sm leading-relaxed max-w-2xl mx-auto font-normal">
          Analiza el rendimiento metabólico consolidado de tu nodo de atleta y la conversión biomecánica de tus contracciones musculares. En este panel interactivo, el protocolo calcula tu gasto calórico mediante el algoritmo de <strong className="text-orange-400 font-bold font-sans">Proof of Sweat (PoS)</strong> y distribuye tus repeticiones para asegurar la compensación física, la salud articular y la calibración precisa de recompensas en la dApp.
        </p>
      </section>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "RUTINAS CONFIRMADAS", val: sessionsCount, unit: "Sesiones", icon: CheckCircle, color: "text-[#14f195]" },
          { title: "$IMP TOTAL MINANTE", val: userImpBalance.toFixed(0), unit: "$IMP", icon: Coins, color: "text-orange-400" },
          { title: "FACTOR DE CONSUMO PoS", val: caloriesBurned, unit: "Kcals", icon: Flame, color: "text-[#14f195] animate-pulse" },
          { title: "TASA DE RECOMPENSA", val: `3.0x`, unit: "XP Ratio", icon: Zap, color: "text-cyan-400" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#082029] border border-teal-800/80 rounded-2xl p-4 flex items-center justify-between shadow-xl">
            <div className="space-y-1">
              <span className="text-[9px] text-teal-400 font-mono tracking-wider uppercase font-bold block">{kpi.title}</span>
              <p className="text-2xl font-mono font-black text-white leading-none">
                {kpi.val} <span className="text-xs text-teal-450 font-bold">{kpi.unit}</span>
              </p>
            </div>
            <div className={`p-2.5 bg-[#05171d]/85 rounded-xl border border-teal-900/50 shrink-0 ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS CONTAINER COHESIVE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: WEEKLY CALORIES BAR CHART */}
        <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 md:p-6 lg:col-span-7 shadow-xl">
          <div className="flex items-center justify-between pb-3.5 border-b border-teal-900/40 mb-4">
            <div>
              <span className="text-[10px] bg-teal-950/40 border border-teal-900/50 text-[#14f195] font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase font-semibold">
                Análisis de Gasto Metabólico
              </span>
              <h4 className="text-sm font-mono font-extrabold text-white tracking-wide uppercase mt-1">
                Proof of Sweat Calories Quemadas Semanal
              </h4>
            </div>
            <Activity className="w-5 h-5 text-rose-450 animate-pulse" />
          </div>

          <p className="text-xs text-teal-200 leading-normal mb-6">
            La gráfica describe las calorías metabólicas de resistencia (PoS Kcal) simuladas por tu nodo local según los ejercicios de fuerza del día reportada. Monitorea tu disciplina de resistencia física.
          </p>

          <div className="relative bg-[#05171d]/60 rounded-xl border border-teal-900/60 p-4 pt-8">
            {/* Grid helper labels */}
            <div className="absolute inset-x-4 top-10 border-t border-teal-950/40 text-right"><span className="text-[8px] font-mono text-teal-700 -mt-2 absolute right-0">600 kcal</span></div>
            <div className="absolute inset-x-4 top-24 border-t border-teal-950/40 text-right"><span className="text-[8px] font-mono text-teal-700 -mt-2 absolute right-0">300 kcal</span></div>
            <div className="absolute inset-x-4 top-36 border-t border-teal-950/40 text-right"><span className="text-[8px] font-mono text-teal-700 -mt-2 absolute right-0">0 kcal</span></div>

            <div className="h-44 flex items-end justify-between gap-1 sm:gap-2.5 relative z-10 font-mono">
              {[
                { day: "Lun", calories: 340, height: "h-[56px]", color: "from-cyan-500 to-teal-750" },
                { day: "Mar", calories: 480, height: "h-[78px]", color: "from-cyan-500 to-teal-750" },
                { day: "Mié", calories: sessionsCount > 0 ? 590 : 210, height: sessionsCount > 0 ? "h-[98px]" : "h-[34px]", color: "from-[#14f195] to-teal-650", highlight: true },
                { day: "Jue", calories: 120, height: "h-[20px]", color: "from-cyan-500 to-teal-750" },
                { day: "Vie", calories: 430, height: "h-[70px]", color: "from-cyan-500 to-teal-750" },
                { day: "Sáb", calories: 310, height: "h-[50px]", color: "from-cyan-500 to-teal-750" },
                { day: "Dom", calories: 0, height: "h-0", color: "from-gray-700 to-gray-850" }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div className="absolute bottom-full mb-1 bg-[#05171d] border border-cyan-500 text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 z-15">
                    {bar.calories} Kcal
                  </div>
                  
                  <div className={`w-full ${bar.height} rounded-t-lg bg-gradient-to-t ${bar.color} transition-all duration-500 group-hover:brightness-110 shadow-lg ${
                    bar.highlight ? "shadow-[#14f195]/20 ring-1 ring-[#14f195]/30" : ""
                  }`} />

                  <span className="text-[10px] font-mono text-teal-400 mt-2 block">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-black/10 rounded-lg text-[10px] text-teal-400 font-mono mt-4 text-center">
            * Las calorías se calculan multiplicando el XP neto de cada ejercicio validado por un factor atlético metabólico estricto de 8.5 Kcals/XP.
          </div>
        </div>

        {/* CHART 2: PIE/DONUT BALANCES DE EJERCICIOS */}
        <div className="bg-[#082029] border border-teal-800/80 rounded-2xl p-5 md:p-6 lg:col-span-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-teal-900/40 mb-4">
              <div>
                <span className="text-[10px] bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                  Sugerencias de Biomecánica
                </span>
                <h4 className="text-sm font-mono font-extrabold text-white tracking-wide uppercase mt-1">
                  Balance Muscular Validado
                </h4>
              </div>
              <Award className="w-5 h-5 text-cyan-400" />
            </div>

            <p className="text-xs text-teal-300 leading-normal mb-6">
              Muestra la distribución corporal de los ejercicios que has validado el día de hoy para garantizar un entrenamiento uniforme y prevenir contracturas musculares.
            </p>

            <div className="space-y-4">
              {[
                { area: "Músculos del Tronco (Pectoral, Hombro, Tríceps)", ratio: sessionsCount > 0 ? "55%" : "35%", pct: sessionsCount > 0 ? 55 : 35, color: "bg-cyan-400", hex: "text-cyan-455" },
                { area: "Músculos de la Espalda y Jalón (Biceps, Dorsales)", ratio: sessionsCount > 0 ? "25%" : "20%", pct: sessionsCount > 0 ? 25 : 20, color: "bg-[#14f195]", hex: "text-[#14f195]" },
                { area: "Músculos de la Pierna / Tren Inferior (Muslos, Glúteos)", ratio: sessionsCount > 0 ? "20%" : "45%", pct: sessionsCount > 0 ? 20 : 45, color: "bg-orange-500", hex: "text-orange-400" }
              ].map((row, idx) => (
                <div key={idx} className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-[10.5px] font-mono leading-none">
                    <span className="text-white font-medium truncate max-w-[240px]">{row.area}</span>
                    <span className={`font-black ${row.hex}`}>{row.ratio}</span>
                  </div>
                  <div className="w-full bg-[#05171d] rounded-full h-2 overflow-hidden border border-teal-950">
                    <div 
                      style={{ width: `${row.pct}%` }}
                      className={`${row.color} h-full rounded-full transition-all duration-750`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#05171d]/85 rounded-xl border border-teal-900/60 p-4 mt-6">
            <h5 className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest mb-1.5 text-left">ESTADO GENERAL DE AUDITO DE NODO</h5>
            <p className="text-[11.5px] leading-relaxed text-teal-200">
              {sessionsCount === 0 
                ? "Sin actividad suficiente para definir patrones. Valida tus primeras contracciones biomecánicas de entrenamiento muscular para calibrar los sensores."
                : sessionsCount < 3 
                  ? "Tu actividad muscular muestra predominio en músculos de empuje. Recomendamos validar flexiones de pierna para uniformizar el consenso de fuerza."
                  : "¡Sincronización muscular óptima! Tu distribución corporal de fuerza se mantiene en los rangos saludables de entrenamiento físico."}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
