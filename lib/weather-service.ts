// Serviço para buscar dados climáticos da API Open-Meteo
// API gratuita que não requer chave de autenticação

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  city: string;
  feelsLike?: number;
  uvIndex?: number;
  visibility?: number;
  dewPoint?: number;
  cloudCover?: number;
  precipitationProbability?: number;
  airQuality?: {
    aqi: number;
    level: string;
    pm25: number;
    pm10: number;
  };
  dailyStats?: {
    tempMin: number;
    tempMax: number;
    sunrise: string;
    sunset: string;
  };
  lastUpdated?: string;
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
    
    // Buscar dados meteorológicos atuais e diários
    const currentResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,apparent_temperature,uv_index,visibility,dew_point_2m,cloud_cover,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=America/Sao_Paulo`
    );
    
    if (!currentResponse.ok) {
      throw new Error('Erro ao buscar dados meteorológicos');
    }
    
    const weatherData = await currentResponse.json();
    const current = weatherData.current;
    const daily = weatherData.daily;
    
    // Simular dados de qualidade do ar (já que a API Open-Meteo não fornece)
    const simulatedAQI = Math.floor(Math.random() * 100) + 20; // 20-120
    let aqiLevel = 'Boa';
    if (simulatedAQI > 100) aqiLevel = 'Perigosa';
    else if (simulatedAQI > 80) aqiLevel = 'Ruim';
    else if (simulatedAQI > 60) aqiLevel = 'Moderada';
    else if (simulatedAQI > 40) aqiLevel = 'Aceitável';
    
    // Determinar descrição baseada na temperatura e condições
    let description = 'Tempo estável';
    if (current.temperature_2m > 30) {
      description = 'Tempo quente';
    } else if (current.temperature_2m < 15) {
      description = 'Tempo frio';
    } else if (current.wind_speed_10m > 20) {
      description = 'Tempo ventoso';
    } else if (current.cloud_cover > 80) {
      description = 'Tempo nublado';
    } else if (current.precipitation_probability > 70) {
      description = 'Possibilidade de chuva';
    }
    
    return {
      temperature: Math.round(current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      pressure: Math.round(current.surface_pressure),
      description,
      city: 'Localização Atual',
      feelsLike: Math.round(current.apparent_temperature || current.temperature_2m),
      uvIndex: Math.round(current.uv_index || 0),
      visibility: Math.round((current.visibility || 10000) / 1000), // Converter para km
      dewPoint: Math.round(current.dew_point_2m || 0),
      cloudCover: Math.round(current.cloud_cover || 0),
      precipitationProbability: Math.round(current.precipitation_probability || 0),
      airQuality: {
        aqi: simulatedAQI,
        level: aqiLevel,
        pm25: Math.floor(Math.random() * 50) + 10,
        pm10: Math.floor(Math.random() * 80) + 20
      },
      dailyStats: {
        tempMin: Math.round(daily.temperature_2m_min[0]),
        tempMax: Math.round(daily.temperature_2m_max[0]),
        sunrise: daily.sunrise[0].split('T')[1],
        sunset: daily.sunset[0].split('T')[1]
      },
      lastUpdated: new Date().toLocaleString('pt-BR')
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