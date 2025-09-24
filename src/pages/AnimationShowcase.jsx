import React, { useState } from 'react';
import { 
  InteractiveButton, 
  InteractiveInput, 
  InteractiveCard,
  CardHeader,
  CardContent,
  CardActions,
  FadeIn,
  SlideIn,
  StaggeredAnimation,
  LoadingSpinner,
  HoverEffect
} from '../components';
import './AnimationShowcase.css';

const AnimationShowcase = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleButtonClick = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const validateInput = (value) => {
    if (!value) return { isValid: false, message: 'This field is required' };
    if (value.length < 3) return { isValid: false, message: 'Must be at least 3 characters' };
    return { isValid: true };
  };

  const cardData = [
    { id: 1, title: 'Fresh Tomatoes', price: '$4.99', image: '/api/placeholder/300/200' },
    { id: 2, title: 'Organic Carrots', price: '$2.99', image: '/api/placeholder/300/200' },
    { id: 3, title: 'Green Lettuce', price: '$1.99', image: '/api/placeholder/300/200' }
  ];

  return (
    <div className="animation-showcase">
      <div className="container mx-auto px-4 py-8">
        <FadeIn>
          <h1 className="text-4xl font-bold text-center mb-8">
            Animation & Interaction Showcase
          </h1>
        </FadeIn>

        {/* Button Interactions */}
        <section className="mb-12">
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-6">Interactive Buttons</h2>
          </SlideIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StaggeredAnimation>
              <InteractiveButton
                variant="primary"
                onClick={handleButtonClick}
                loading={isLoading}
                success={showSuccess}
                hoverEffect="lift"
                ripple={true}
              >
                Primary Button
              </InteractiveButton>
              
              <InteractiveButton
                variant="secondary"
                hoverEffect="glow"
                icon={<span>🚀</span>}
              >
                With Icon
              </InteractiveButton>
              
              <InteractiveButton
                variant="success"
                size="large"
                hoverEffect="scale"
              >
                Large Success
              </InteractiveButton>
              
              <InteractiveButton
                variant="ghost"
                hoverEffect="lift"
              >
                Ghost Button
              </InteractiveButton>
              
              <InteractiveButton
                variant="danger"
                size="small"
                hoverEffect="shake"
              >
                Small Danger
              </InteractiveButton>
              
              <InteractiveButton
                variant="warning"
                disabled
              >
                Disabled
              </InteractiveButton>
            </StaggeredAnimation>
          </div>
        </section>

        {/* Input Interactions */}
        <section className="mb-12">
          <SlideIn direction="right">
            <h2 className="text-2xl font-semibold mb-6">Interactive Form Fields</h2>
          </SlideIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <InteractiveInput
                label="Product Name"
                placeholder="Enter product name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                validator={validateInput}
                icon={<span>🥕</span>}
                maxLength={50}
                helperText="This will be displayed on your product listing"
              />
            </FadeIn>
            
            <FadeIn delay={200}>
              <InteractiveInput
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
              />
            </FadeIn>
            
            <FadeIn delay={300}>
              <InteractiveInput
                label="Price"
                placeholder="0.00"
                suffix={<span>USD</span>}
                icon={<span>💰</span>}
              />
            </FadeIn>
            
            <FadeIn delay={400}>
              <InteractiveInput
                label="Email"
                type="email"
                placeholder="john@example.com"
                success={true}
                helperText="Email verified successfully!"
              />
            </FadeIn>
          </div>
        </section>

        {/* Card Interactions */}
        <section className="mb-12">
          <SlideIn direction="up">
            <h2 className="text-2xl font-semibold mb-6">Interactive Cards</h2>
          </SlideIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaggeredAnimation>
              {cardData.map((product) => (
                <InteractiveCard
                  key={product.id}
                  variant="elevated"
                  hover={true}
                  press={true}
                  ripple={true}
                  onClick={() => console.log(`Clicked ${product.title}`)}
                  badge={<span className="bg-green-500 text-white px-2 py-1 rounded">Fresh</span>}
                >
                  <CardHeader>
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-4xl">🥬</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4">Fresh organic produce from local farms</p>
                    <p className="text-xl font-bold text-green-600">{product.price}</p>
                  </CardContent>
                  
                  <CardActions align="between">
                    <InteractiveButton size="small" variant="ghost">
                      <span>❤️</span>
                    </InteractiveButton>
                    <InteractiveButton size="small" variant="primary">
                      Add to Cart
                    </InteractiveButton>
                  </CardActions>
                </InteractiveCard>
              ))}
            </StaggeredAnimation>
          </div>
        </section>

        {/* Loading States */}
        <section className="mb-12">
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-6">Loading Animations</h2>
          </SlideIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn>
              <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h3 className="mb-4">Spinner</h3>
                <LoadingSpinner size="large" />
              </div>
            </FadeIn>
            
            <FadeIn delay={100}>
              <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h3 className="mb-4">Dots</h3>
                <LoadingSpinner variant="dots" size="large" />
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h3 className="mb-4">Pulse</h3>
                <LoadingSpinner variant="pulse" size="large" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Hover Effects */}
        <section className="mb-12">
          <SlideIn direction="right">
            <h2 className="text-2xl font-semibold mb-6">Hover Effects</h2>
          </SlideIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['lift', 'glow', 'tilt', 'shine', 'zoom', 'rotate'].map((effect, index) => (
              <FadeIn key={effect} delay={index * 100}>
                <HoverEffect effect={effect}>
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg text-center cursor-pointer">
                    <div className="text-2xl mb-2">✨</div>
                    <div className="font-medium capitalize">{effect}</div>
                  </div>
                </HoverEffect>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Feedback Messages */}
        {showSuccess && (
          <FadeIn>
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              ✅ Action completed successfully!
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default AnimationShowcase;