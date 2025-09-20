import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

const WeatherPage: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const mockWeatherData: WeatherData = {
    location: 'Москва',
    temperature: 24,
    condition: 'Солнечно',
    icon: 'Sun',
    humidity: 45,
    windSpeed: 12,
    pressure: 1013,
    uvIndex: 6
  };

  const mockForecastData: ForecastDay[] = [
    { day: 'Сегодня', high: 24, low: 15, condition: 'Солнечно', icon: 'Sun', precipitation: 0 },
    { day: 'Завтра', high: 22, low: 14, condition: 'Облачно', icon: 'Cloud', precipitation: 20 },
    { day: 'Ср', high: 18, low: 12, condition: 'Дождь', icon: 'CloudRain', precipitation: 80 },
    { day: 'Чт', high: 20, low: 13, condition: 'Переменно', icon: 'CloudSun', precipitation: 30 },
    { day: 'Пт', high: 25, low: 16, condition: 'Солнечно', icon: 'Sun', precipitation: 10 },
    { day: 'Сб', high: 27, low: 18, condition: 'Солнечно', icon: 'Sun', precipitation: 5 },
    { day: 'Вс', high: 23, low: 15, condition: 'Облачно', icon: 'Cloud', precipitation: 40 }
  ];

  const getLocationAndWeather = async () => {
    setIsLoading(true);
    
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        setTimeout(() => {
          setCurrentWeather(mockWeatherData);
          setForecast(mockForecastData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log('Геолокация недоступна, используем данные по умолчанию');
        setTimeout(() => {
          setCurrentWeather(mockWeatherData);
          setForecast(mockForecastData);
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentWeather({
          ...mockWeatherData,
          location: searchCity,
          temperature: Math.floor(Math.random() * 30) + 5
        });
        setIsLoading(false);
        setSearchCity('');
      }, 800);
    }
  };

  const addToFavorites = (city: string) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const getGradientClass = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'bg-gradient-to-br from-weather-orange to-weather-yellow';
    if (hour >= 12 && hour < 18) return 'bg-gradient-to-br from-weather-blue to-weather-lightBlue';
    return 'bg-gradient-to-br from-weather-purple to-weather-orange';
  };

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${getGradientClass()} flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Определяем ваше местоположение...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getGradientClass()} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon name="Cloud" size={40} className="text-white animate-float" />
            <h1 className="text-4xl font-light text-white">Cloud Weather</h1>
          </div>
          <p className="text-white/80 text-lg">Ваш персональный помощник по погоде</p>
        </div>

        {/* Search Header */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder="Введите название города..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70"
            />
            <Button 
              onClick={handleSearch}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
            >
              <Icon name="Search" size={20} />
            </Button>
          </div>
          <Button 
            onClick={getLocationAndWeather}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
          >
            <Icon name="MapPin" size={20} className="mr-2" />
            Моё местоположение
          </Button>
        </div>

        {/* Current Weather Card */}
        {currentWeather && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8 animate-fade-in">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <Icon name="MapPin" size={24} className="text-white/80" />
                    <h1 className="text-2xl font-light text-white">{currentWeather.location}</h1>
                    <Button
                      size="sm"
                      onClick={() => addToFavorites(currentWeather.location)}
                      className="ml-2 bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Icon name="Heart" size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <Icon name={currentWeather.icon as any} size={80} className="text-white animate-float" />
                    <div>
                      <div className="text-6xl font-light text-white">{currentWeather.temperature}°</div>
                      <div className="text-xl text-white/80">{currentWeather.condition}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-white">
                  <div className="text-center">
                    <Icon name="Droplets" size={24} className="mx-auto mb-2 text-white/80" />
                    <div className="text-sm text-white/70">Влажность</div>
                    <div className="text-lg font-medium">{currentWeather.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <Icon name="Wind" size={24} className="mx-auto mb-2 text-white/80" />
                    <div className="text-sm text-white/70">Ветер</div>
                    <div className="text-lg font-medium">{currentWeather.windSpeed} км/ч</div>
                  </div>
                  <div className="text-center">
                    <Icon name="Gauge" size={24} className="mx-auto mb-2 text-white/80" />
                    <div className="text-sm text-white/70">Давление</div>
                    <div className="text-lg font-medium">{currentWeather.pressure} мб</div>
                  </div>
                  <div className="text-center">
                    <Icon name="Sun" size={24} className="mx-auto mb-2 text-white/80" />
                    <div className="text-sm text-white/70">УФ-индекс</div>
                    <div className="text-lg font-medium">{currentWeather.uvIndex}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 7-Day Forecast */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-light text-white mb-6 text-center">Прогноз на неделю</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {forecast.map((day, index) => (
              <Card 
                key={index} 
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-white/80 font-medium mb-2">{day.day}</div>
                  <Icon name={day.icon as any} size={40} className="mx-auto mb-2 text-white" />
                  <div className="text-white/70 text-sm mb-2">{day.condition}</div>
                  <div className="flex justify-between text-white">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-white/60">{day.low}°</span>
                  </div>
                  {day.precipitation > 0 && (
                    <div className="flex items-center justify-center mt-2 text-white/70 text-xs">
                      <Icon name="CloudRain" size={12} className="mr-1" />
                      {day.precipitation}%
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-fade-in">
            <CardContent className="p-6">
              <h3 className="text-xl font-light text-white mb-4 flex items-center">
                <Icon name="Heart" size={24} className="mr-2" />
                Избранные города
              </h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map((city, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    onClick={() => {
                      setSearchCity(city);
                      handleSearch();
                    }}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;