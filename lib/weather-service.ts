// Serviço para buscar dados climáticos da API Open-Meteo
// API gratuita que não requer chave de autenticação

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  city: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Coordenadas fixas de Naviraí, MS
const NAVIRAI_COORDS = {
  latitude: -23.0647,
  longitude: -54.1906,
  city: 'Naviraí',
  state: 'MS'
};

// Função para obter coordenadas de Naviraí, MS (sempre retorna coordenadas fixas)
export async function getCityCoordinates(): Promise<Coordinates> {
  // Sempre retorna as coordenadas de Naviraí, MS
  return {
    latitude: NAVIRAI_COORDS.latitude,
    longitude: NAVIRAI_COORDS.longitude
  };
}

// Função para buscar dados meteorológicos usando coordenadas
export async function getWeatherData(coordinates: Coordinates): Promise<WeatherData> {
  try {
    const { latitude, longitude } = coordinates;
    
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&timezone=America/Sao_Paulo`
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar dados meteorológicos');
    }
    
    const data = await response.json();
    const current = data.current;
    
    // Determinar descrição baseada na temperatura
    let description = 'Tempo estável';
    if (current.temperature_2m > 30) {
      description = 'Tempo quente';
    } else if (current.temperature_2m < 15) {
      description = 'Tempo frio';
    } else if (current.wind_speed_10m > 20) {
      description = 'Tempo ventoso';
    }
    
    return {
      temperature: Math.round(current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      pressure: Math.round(current.surface_pressure),
      description,
      city: 'Localização Atual'
    };
  } catch (error) {
    console.error('Erro ao obter dados meteorológicos:', error);
    throw error;
  }
}

// Função para obter dados meteorológicos por nome da cidade (sempre usa Naviraí, MS)
export async function getWeatherByCity(): Promise<WeatherData> {
  try {
    // Sempre usa as coordenadas de Naviraí, MS
    const coords = await getCityCoordinates();
    const weatherData = await getWeatherData(coords);
    
    return {
      ...weatherData,
      city: `${NAVIRAI_COORDS.city}, ${NAVIRAI_COORDS.state}`
    };
  } catch (error) {
    console.error('Erro ao obter dados meteorológicos da cidade:', error);
    throw error;
  }
}

// Função para obter localização atual do usuário (agora retorna Naviraí, MS)
export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  // Sempre retorna as coordenadas de Naviraí, MS
  return {
    latitude: NAVIRAI_COORDS.latitude,
    longitude: NAVIRAI_COORDS.longitude
  };
}

// Função para obter dados meteorológicos da localização atual (sempre Naviraí, MS)
export async function getCurrentWeather(): Promise<WeatherData> {
  try {
    const location = await getCurrentLocation();
    const coords = { latitude: location.latitude, longitude: location.longitude };
    const weatherData = await getWeatherData(coords);
    
    return {
      ...weatherData,
      city: `${NAVIRAI_COORDS.city}, ${NAVIRAI_COORDS.state}`
    };
  } catch (error) {
    console.error('Erro ao obter dados meteorológicos atuais:', error);
    
    // Fallback com dados de exemplo de Naviraí, MS
    return {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
      description: 'Tempo estável',
      city: `${NAVIRAI_COORDS.city}, ${NAVIRAI_COORDS.state}`
    };
  }
}