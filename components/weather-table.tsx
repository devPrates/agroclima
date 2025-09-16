'use client';

import { Thermometer, Droplets, Wind, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeather } from '@/hooks/use-weather';

interface WeatherTableProps {
  autoFetch?: boolean;
  showRefreshButton?: boolean;
  className?: string;
}

export function WeatherTable({ 
  autoFetch = true, 
  showRefreshButton = true,
  className = ""
}: WeatherTableProps) {
  const { weatherData, loading, error, refreshWeather } = useWeather(autoFetch);

  const weatherItems = [
    {
      key: 'temperature',
      icon: Thermometer,
      label: 'Temperatura',
      value: weatherData ? `${weatherData.temperature}°C` : '--',
      color: 'text-red-500'
    },
    {
      key: 'humidity',
      icon: Droplets,
      label: 'Umidade',
      value: weatherData ? `${weatherData.humidity}%` : '--',
      color: 'text-blue-500'
    },
    {
      key: 'wind',
      icon: Wind,
      label: 'Vento',
      value: weatherData ? `${weatherData.windSpeed} km/h` : '--',
      color: 'text-green-500'
    }
  ];

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-2 rounded-xl bg-white/30 dark:bg-gray-700/40 backdrop-blur-sm border border-white/40 dark:border-gray-600/50 shadow-md hover:bg-white/40 dark:hover:bg-gray-700/50 transition-all duration-200">
            <MapPin className="h-5 w-5 text-gray-700 dark:text-white/80 flex-shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white truncate">
              Dados Climáticos
            </h3>
            {weatherData && (
              <p className="text-xs md:text-sm text-gray-600 dark:text-white/70 truncate">
                {weatherData.city} • {weatherData.description}
              </p>
            )}
          </div>
        </div>
        
        {showRefreshButton && (
          <Button
            onClick={refreshWeather}
            disabled={loading}
            variant="outline"
            size="sm"
            className="bg-white/10 dark:bg-gray-800/20 border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Carregando dados meteorológicos...</span>
        </div>
      )}

      {!loading && weatherData && (
        <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
          {weatherItems.map((item) => (
            <div
              key={item.key}
              className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/50 shadow-lg 
                         p-2 sm:p-3 md:p-4 
                         flex flex-col items-center justify-center text-center 
                         gap-1 sm:gap-2 
                         min-h-[100px] sm:min-h-[110px] md:min-h-[120px] 
                         flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] 
                         max-w-[160px] sm:max-w-[180px] md:max-w-[200px]"
            >
              <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-lg bg-white/30 dark:bg-gray-700/40 backdrop-blur-sm border border-white/40 dark:border-gray-600/50 shadow-md hover:bg-white/40 dark:hover:bg-gray-700/50 transition-all duration-200 ${item.color}`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
              <div className="w-full flex flex-col justify-center flex-1">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 mb-0.5">
                  {item.label}
                </h3>
                <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rodapé com informações */}
      {weatherData && !loading && (
        <div className="mt-4 pt-4 border-t border-white/10 dark:border-gray-700/30">
          <p className="text-gray-500 dark:text-white/50 text-xs text-center">
            Dados fornecidos pela Agroclima • Atualizado em tempo real
          </p>
        </div>
      )}
    </div>
  );
}