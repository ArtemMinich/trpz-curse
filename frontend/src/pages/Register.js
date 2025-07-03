import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    region: '',
    interests: [],
    educationLevel: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const regions = ['Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро', 'Інший'];
  const interestOptions = ['Технології', 'Спорт', 'Мистецтво', 'Наука', 'Подорожі', 'Музика', 'Кіно', 'Книги'];
  const educationLevels = ['Середня', 'Бакалавр', 'Магістр', 'Доктор наук'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestChange = (interest) => {
    const updatedInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({
      ...formData,
      interests: updatedInterests
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
    } catch (error) {
      setError(error.response?.data?.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Реєстрація</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ім'я:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Регіон:</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">Оберіть регіон</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Рівень освіти:</label>
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            required
          >
            <option value="">Оберіть рівень освіти</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Інтереси:</label>
          <div className="checkbox-group">
            {interestOptions.map(interest => (
              <div key={interest} className="checkbox-item">
                <input
                  type="checkbox"
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                />
                <label htmlFor={interest}>{interest}</label>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Завантаження...' : 'Зареєструватися'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Вже є акаунт? <Link to="/login">Увійти</Link>
      </p>
    </div>
  );
};

export default Register;