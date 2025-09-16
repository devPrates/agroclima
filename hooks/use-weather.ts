import { useState, useEffect, useCallback } from 'react';
import { 
  WeatherData, 
  getCurrentWeather, 
  getWeatherByCity 
} from '@/lib/weather-service';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
  getWeatherForCity: (cityName: string) => Promise<void>;
}

// Dados de fallback para Naviraí, MS
const fallbackWeatherData: WeatherData = {
  temperature: 28,
  humidity: 65,
  windSpeed: 12,
  pressure: 1013,
  description: 'Tempo estável',
  city: 'Naviraí, MS'
};

export function useWeather(autoFetch: boolean = true): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados da localização atual (sempre Naviraí, MS)
  const refreshWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeather();
      setWeatherData({
        ...data,
        city: 'Naviraí, MS'
      });
    } catch (err) {
      // Em caso de erro, usar dados de fallback silenciosamente
      console.warn('API indisponível, usando dados de fallback');
      setWeatherData({
        ...fallbackWeatherData,
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        city: 'Naviraí, MS'
      });
      // Não definir erro para não exibir mensagem de erro
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar dados meteorológicos (sempre retorna Naviraí, MS)
  const getWeatherForCity = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeather();
      setWeatherData({
        ...data,
        city: 'Naviraí, MS'
      });
    } catch (err) {
      // Em caso de erro, usar dados de fallback silenciosamente
      console.warn('API indisponível, usando dados de fallback');
      setWeatherData({
        ...fallbackWeatherData,
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        city: 'Naviraí, MS'
      });
      // Não definir erro para não exibir mensagem de erro
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar dados automaticamente na inicialização se autoFetch for true
  useEffect(() => {
    if (autoFetch) {
      refreshWeather();
    }
  }, [autoFetch, refreshWeather]);

  return {
    weatherData,
    loading,
    error,
    refreshWeather,
    getWeatherForCity
  };
}