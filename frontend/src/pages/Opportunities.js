import React, { useState, useEffect } from 'react';
import { opportunitiesAPI } from '../services/api';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    tags: ''
  });

  const opportunityTypes = [
    { value: 'job', label: 'Робота' },
    { value: 'course', label: 'Курси' },
    { value: 'news', label: 'Новини' },
    { value: 'project', label: 'Проекти' }
  ];

  useEffect(() => {
    loadOpportunities();
  }, [filters]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.region) params.region = filters.region;
      if (filters.tags) params.tags = filters.tags;

      const response = await opportunitiesAPI.getOpportunities(params);
      setOpportunities(response.data);
    } catch (error) {
      setError('Помилка завантаження можливостей');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const triggerParsing = async () => {
    try {
      await opportunitiesAPI.triggerParsing();
      alert('Парсинг запущено! Оновіть сторінку через кілька хвилин.');
    } catch (error) {
      alert('Помилка запуску парсингу');
    }
  };

  const getTypeLabel = (type) => {
    const typeObj = opportunityTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Можливості</h1>
        <button onClick={triggerParsing} className="btn btn-secondary">
          Оновити дані
        </button>
      </div>

      <div className="filters">
        <div className="filters-row">
          <div className="filter-group">
            <label>Тип:</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">Всі типи</option>
              {opportunityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Регіон:</label>
            <input
              type="text"
              name="region"
              value={filters.region}
              onChange={handleFilterChange}
              placeholder="Введіть регіон"
            />
          </div>

          <div className="filter-group">
            <label>Теги:</label>
            <input
              type="text"
              name="tags"
              value={filters.tags}
              onChange={handleFilterChange}
              placeholder="Введіть тег"
            />
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="opportunities-grid">
        {opportunities.length === 0 ? (
          <p>Можливості не знайдено</p>
        ) : (
          opportunities.map(opportunity => (
            <div key={opportunity._id} className="opportunity-card">
              <h3>{opportunity.title}</h3>
              <p><strong>Тип:</strong> {getTypeLabel(opportunity.type)}</p>
              <p><strong>Регіон:</strong> {opportunity.region}</p>
              <p>{opportunity.description}</p>
              
              {opportunity.tags && opportunity.tags.length > 0 && (
                <div className="opportunity-tags">
                  {opportunity.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              
              <p><strong>Дата:</strong> {new Date(opportunity.date).toLocaleDateString('uk-UA')}</p>
              
              {opportunity.link && (
                <a 
                  href={opportunity.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-block', marginTop: '10px' }}
                >
                  Детальніше
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Opportunities;