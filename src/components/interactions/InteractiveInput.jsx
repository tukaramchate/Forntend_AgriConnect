import React, { useState, useRef, useEffect } from 'react';
import { useFieldInteractions } from '../../hooks/useMicroInteractions';
import FadeIn from '../animations/FadeIn';
import './InteractiveInput.css';

const InteractiveInput = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  suffix,
  validator,
  helperText,
  maxLength,
  className = '',
  style = {},
  ...props
}) => {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentLength, setCurrentLength] = useState(value?.length || 0);

  const {
    isFocused,
    hasValue,
    isValid,
    validationMessage,
    fieldProps,
    validate,
    getFieldClasses,
    getFieldStyle
  } = useFieldInteractions();

  // Handle value changes
  const handleChange = (event) => {
    const newValue = event.target.value;
    setCurrentLength(newValue.length);
    
    fieldProps.onChange(event);
    
    if (onChange) {
      onChange(event);
    }
    
    // Validate on change if validator provided
    if (validator && newValue) {
      validate(newValue, validator);
    }
  };

  // Handle blur with validation
  const handleBlur = (event) => {
    fieldProps.onBlur(event);
    
    if (onBlur) {
      onBlur(event);
    }
    
    // Validate on blur
    if (validator) {
      validate(event.target.value, validator);
    }
  };

  // Handle focus
  const handleFocus = (event) => {
    fieldProps.onFocus(event);
    
    if (onFocus) {
      onFocus(event);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    inputRef.current?.focus();
  };

  // Auto-focus animation
  useEffect(() => {
    if (props.autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [props.autoFocus]);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = error || !isValid;
  const hasSuccess = success && !hasError;

  const containerClasses = [
    'interactive-input-container',
    getFieldClasses(),
    hasError ? 'has-error' : '',
    hasSuccess ? 'has-success' : '',
    disabled ? 'is-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'interactive-input',
    icon ? 'has-icon' : '',
    suffix || (type === 'password') ? 'has-suffix' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={style}>
      {/* Floating Label */}
      {label && (
        <label
          className={`input-label ${isFocused || hasValue ? 'floating' : ''}`}
          htmlFor={props.id}
        >
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="input-wrapper" style={getFieldStyle()}>
        {/* Leading Icon */}
        {icon && (
          <div className="input-icon leading">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type={inputType}
          className={inputClasses}
          placeholder={isFocused ? placeholder : ''}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          {...props}
        />

        {/* Trailing Elements */}
        <div className="input-suffix">
          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 1L23 23"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Custom Suffix */}
          {suffix && (
            <div className="input-icon trailing">
              {suffix}
            </div>
          )}

          {/* Status Icons */}
          {hasError && (
            <div className="status-icon error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          )}

          {hasSuccess && (
            <div className="status-icon success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="22,4 12,14.01 9,11.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar for max length */}
      {maxLength && isFocused && (
        <FadeIn>
          <div className="input-progress">
            <div
              className="progress-bar"
              style={{
                width: `${(currentLength / maxLength) * 100}%`,
                backgroundColor: currentLength > maxLength * 0.9 ? '#ef4444' : '#4a90e2'
              }}
            />
            <span className="character-count">
              {currentLength}/{maxLength}
            </span>
          </div>
        </FadeIn>
      )}

      {/* Helper Text or Error Message */}
      {(helperText || validationMessage || error) && (
        <FadeIn>
          <div className={`input-message ${hasError ? 'error' : 'helper'}`}>
            {error || validationMessage || helperText}
          </div>
        </FadeIn>
      )}
    </div>
  );
};

export default InteractiveInput;