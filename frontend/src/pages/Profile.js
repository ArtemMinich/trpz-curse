import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    region: user?.region || '',
    interests: user?.interests || [],
    educationLevel: user?.educationLevel || ''
  });
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(formData);
      
      if (avatar) {
        const formDataAvatar = new FormData();
        formDataAvatar.append('avatar', avatar);
        await authAPI.uploadAvatar(formDataAvatar);
      }
      
      setMessage('Профіль успішно оновлено!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Помилка оновлення профілю');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Мій профіль</h2>
      
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
            value={user?.email || ''}
            disabled
            style={{ backgroundColor: '#f8f9fa' }}
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

        <div className="form-group">
          <label>Аватар:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>

        {message && (
          <div className={message.includes('успішно') ? 'success' : 'error'}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Завантаження...' : 'Оновити профіль'}
        </button>
      </form>
    </div>
  );
};

export default Profile;