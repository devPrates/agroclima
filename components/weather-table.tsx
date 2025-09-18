'use client';

import { useWeather } from '@/hooks/use-weather';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge,
  RefreshCw,
  AlertCircle,
  Sun,
  Eye,
  CloudRain,
  Clock
} from 'lucide-react';

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

  if (loading) {
    return (
      <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 p-8 shadow-xl">
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-slate-700 dark:text-slate-300">Carregando dados meteorológicos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 p-8 shadow-xl">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-700 dark:text-slate-300 mb-4">{error}</p>
          <button
            onClick={refreshWeather}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Tentar novamente</span>
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-500';
    if (uv <= 5) return 'text-yellow-500';
    if (uv <= 7) return 'text-orange-500';
    if (uv <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  return (
    <div className={`bg-white/10 dark:bg-gray-900/10 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 p-6 shadow-xl ${className}`}>
      {/* Header com informações principais */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            Condições Atuais
          </h3>
          <p className="text-slate-600 dark:text-slate-400">{weatherData.city}</p>
        </div>
      </div>

      {/* Grid principal de dados meteorológicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Temperatura */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center space-x-3">
            <Thermometer className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weatherData.temperature}°C
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Temperatura</p>
            </div>
          </div>
        </div>

        {/* Sensação Térmica */}
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hidden md:block">
          <div className="flex items-center space-x-3">
            <Sun className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weatherData.feelsLike}°C
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Sensação</p>
            </div>
          </div>
        </div>

        {/* Umidade */}
        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center space-x-3">
            <Droplets className="h-8 w-8 text-cyan-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weatherData.humidity}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Umidade</p>
            </div>
          </div>
        </div>

        {/* Vento */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center space-x-3">
            <Wind className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weatherData.windSpeed} km/h
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Vento</p>
            </div>
          </div>
        </div>

        {/* Pressão */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hidden md:block">
          <div className="flex items-center space-x-3">
            <Gauge className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weatherData.pressure} hPa
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pressão</p>
            </div>
          </div>
        </div>

        {/* Índice UV */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center space-x-3">
            <Sun className="h-8 w-8 text-yellow-500" />
            <div>
              <p className={`text-2xl font-bold ${getUVColor(weatherData.uvIndex || 0)}`}>
                {weatherData.uvIndex}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Índice UV</p>
            </div>
          </div>
        </div>

        {/* Visibilidade */}
        <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl p-4 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 hover:shadow-lg hidden md:block">
          <div className="flex items-center space-x-3">
            <Eye className="h-8 w-8 text-indigo-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weatherData.visibility} km
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Visibilidade</p>
            </div>
          </div>
        </div>

        {/* Probabilidade de Chuva */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center space-x-3">
            <CloudRain className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {weatherData.precipitationProbability}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Chuva</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer com descrição e botão de atualização */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-gray-700/30">
        <div>
          <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
            {weatherData.description}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Condições meteorológicas atuais
          </p>
        </div>
        {showRefreshButton && (
          <button
            onClick={refreshWeather}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </button>
        )}
      </div>
    </div>
  );
}