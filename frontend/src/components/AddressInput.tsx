import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AddressInput.css';

interface AddressSuggestion {
  address: string;
  coordinates: [number, number];
}

interface AddressInputProps {
  onSelectAddress: (address: string, coordinates: [number, number]) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  onError?: (error: string) => void;
}

export default function AddressInput({ 
  onSelectAddress,
  onTextChange,
  placeholder = "Введите адрес",
  onError
}: AddressInputProps) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_YMAP_KEY;

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://geocode-maps.yandex.ru/v1/', {
        params: {
          apikey: apiKey,
          geocode: query,
          format: 'json',
          results: 5
        }
      });

      const items = response.data.response.GeoObjectCollection.featureMember || [];
      
      const results: AddressSuggestion[] = items.map((item: any) => {
        const geo = item.GeoObject;
        const address = geo.metaDataProperty.GeocoderMetaData.text;
        const [longitude, latitude] = geo.Point.pos.split(' ').map(Number);
        
        return {
          address,
          coordinates: [latitude, longitude]
        };
      });
      
      setSuggestions(results);
      setSelectedIndex(-1);
      
      if (results.length === 0) {
        setError('Адрес не найден');
      }
    } catch (error: any) {
      console.error('Ошибка геокодера:', error);
      
      if (error.response?.status === 403 || error.response?.status === 429) {
        const limitError = 'Превышен лимит запросов к геокодеру. Вы можете ввести координаты вручную.';
        setError(limitError);
        onError?.(limitError);
      } else {
        const networkError = 'Ошибка подключения к геокодеру. Проверьте интернет или введите координаты вручную.';
        setError(networkError);
        onError?.(networkError);
      }
      
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = (query: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      searchAddress(query);
    }, 500);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
    setError(null);
    
    if (newText.length >= 3) {
      debouncedSearch(newText);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    setText(suggestion.address);
    setShowDropdown(false);
    setSuggestions([]);
    setError(null);
    onSelectAddress(suggestion.address, suggestion.coordinates);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="address-input-container" ref={containerRef}>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onFocus={() => text.length >= 3 && setShowDropdown(true)}
        placeholder={placeholder}
        className={`address-input ${error ? 'address-input-error' : ''}`}
        autoComplete="off"
      />
      
      {loading && (
        <div className="address-loading">🔍 Поиск...</div>
      )}
      
      {error && (
        <div className="address-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}
      
      {showDropdown && suggestions.length > 0 && !error && (
        <ul className="address-suggestions">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className={`suggestion-item ${idx === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(suggestion)}
            >
              <span>📍</span>
              <span>{suggestion.address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}