import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Link, Users } from 'lucide-react';
import './Create.css';

const Create = () => {
  const navigate = useNavigate();

  const createOptions = [
    {
      title: 'BioLink',
      description: 'Create a shareable BioLink page with all your important links',
      icon: <Link size={32} />,
      color: '#19c37d',
      action: () => navigate('/biolinks')
    },
    {
      title: 'Content',
      description: 'Create new content for your audience',
      icon: <Plus size={32} />,
      color: '#ff7e5f',
      action: () => navigate('/Create')
    }
  ];

  return (
    <div className="create-page">
      <div className="create-header">
        <h1>Create</h1>
        <p>Choose what you'd like to create</p>
      </div>
      
      <div className="create-options">
        {createOptions.map((option, index) => (
          <div 
            key={index} 
            className="create-option-card"
            onClick={option.action}
            style={{ '--accent-color': option.color }}
          >
            <div className="option-icon" style={{ color: option.color }}>
              {option.icon}
            </div>
            <div className="option-content">
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
            <div className="option-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Create 