import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GameInterface = ({ game, onGameComplete, onExitGame }) => {
  const [gameState, setGameState] = useState('playing'); // playing, paused, completed, failed
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(game?.timeLimit || 300);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef(null);

  // Use steps from the game prop, fallback to empty array
  const steps = game?.steps || [];
  const currentStepData = steps?.[currentStep];

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setGameState('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef?.current);
    }

    return () => clearInterval(timerRef?.current);
  }, [gameState, timeRemaining]);

  const handleAnswer = (answer, isCorrect) => {
    if (isCorrect) {
      const stepScore = Math.max(50, 100 - (300 - timeRemaining) / 3);
      setScore(prev => prev + stepScore);
      setStreak(prev => prev + 1);
      setFeedback({ type: 'success', message: 'Excellent! Perfect technique!' });
      
      setTimeout(() => {
        if (currentStep < gameData?.steps?.length - 1) {
          setCurrentStep(prev => prev + 1);
          setFeedback(null);
        } else {
          setGameState('completed');
        }
      }, 1500);
    } else {
      setStreak(0);
      setFeedback({ type: 'error', message: 'Not quite right. Try again!' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSequenceSelect = (ingredient) => {
    if (selectedIngredients?.includes(ingredient?.id)) {
      setSelectedIngredients(prev => prev?.filter(id => id !== ingredient?.id));
    } else {
      setSelectedIngredients(prev => [...prev, ingredient?.id]);
    }
  };

  const checkSequence = () => {
    const isCorrect = JSON.stringify(selectedIngredients) === JSON.stringify(currentStepData?.correctOrder);
    handleAnswer(selectedIngredients, isCorrect);
    setSelectedIngredients([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const renderGameContent = () => {
    if (!currentStepData) return null;

    switch (currentStepData?.type) {
      case 'selection':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-semibold text-center text-card-foreground">
              {currentStepData?.instruction}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentStepData?.options?.map((option) => (
                <motion.button
                  key={option?.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option, option?.correct)}
                  className="bg-muted hover:bg-muted/80 rounded-lg p-4 transition-colors border-2 border-transparent hover:border-primary/20"
                >
                  <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                    <Image
                      src={option?.image}
                      alt={option?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-body font-medium text-card-foreground">{option?.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'sequence':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-semibold text-center text-card-foreground">
              {currentStepData?.instruction}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentStepData?.ingredients?.map((ingredient, index) => (
                <motion.button
                  key={ingredient?.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSequenceSelect(ingredient)}
                  className={`relative bg-muted hover:bg-muted/80 rounded-lg p-3 transition-colors border-2 ${
                    selectedIngredients?.includes(ingredient?.id)
                      ? 'border-primary bg-primary/10' :'border-transparent hover:border-primary/20'
                  }`}
                >
                  <div className="aspect-square mb-2 overflow-hidden rounded-lg">
                    <Image
                      src={ingredient?.image}
                      alt={ingredient?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-body font-medium text-card-foreground text-sm">{ingredient?.name}</p>
                  {selectedIngredients?.includes(ingredient?.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {selectedIngredients?.indexOf(ingredient?.id) + 1}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="text-center">
              <Button
                onClick={checkSequence}
                disabled={selectedIngredients?.length !== currentStepData?.ingredients?.length}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Check Order
              </Button>
            </div>
          </div>
        );

      case 'temperature':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-heading font-semibold text-card-foreground mb-2">
                {currentStepData?.instruction}
              </h3>
              <p className="text-muted-foreground">Scenario: {currentStepData?.scenario}</p>
            </div>
            <div className="space-y-3">
              {currentStepData?.options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswer(option, option?.correct)}
                  className="w-full bg-muted hover:bg-muted/80 rounded-lg p-4 text-left transition-colors border-2 border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="Thermometer" size={20} color="var(--color-primary)" />
                    <span className="font-body font-medium text-card-foreground">{option?.temp}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (gameState === 'completed') {
    const finalScore = Math.round((score / (gameData?.steps?.length * 100)) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="bg-success/10 border border-success/20 rounded-xl p-8">
          <Icon name="Trophy" size={48} color="var(--color-success)" className="mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-success mb-2">Game Complete!</h2>
          <p className="text-lg font-mono font-bold text-success">{finalScore}% Score</p>
          <p className="text-muted-foreground mt-2">
            You completed {gameData?.steps?.length} challenges with a {streak} step streak!
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Icon name="Clock" size={24} color="var(--color-primary)" className="mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Time Left</p>
            <p className="font-mono font-bold text-card-foreground">{formatTime(timeRemaining)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Icon name="Zap" size={24} color="var(--color-warning)" className="mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Best Streak</p>
            <p className="font-mono font-bold text-card-foreground">{streak}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <Icon name="Star" size={24} color="var(--color-success)" className="mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Final Score</p>
            <p className="font-mono font-bold text-card-foreground">{finalScore}%</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onExitGame}
            iconName="ArrowLeft"
            iconPosition="left"
            className="flex-1"
          >
            Back to Games
          </Button>
          <Button
            onClick={() => {
              setGameState('playing');
              setCurrentStep(0);
              setScore(0);
              setTimeRemaining(game?.timeLimit || 300);
              setStreak(0);
            }}
            iconName="RotateCcw"
            iconPosition="left"
            className="flex-1"
          >
            Play Again
          </Button>
        </div>
      </motion.div>
    );
  }

  if (gameState === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="bg-error/10 border border-error/20 rounded-xl p-8">
          <Icon name="Clock" size={48} color="var(--color-error)" className="mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-error mb-2">Time's Up!</h2>
          <p className="text-muted-foreground">
            Don't worry, practice makes perfect. Try again to improve your score!
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onExitGame}
            iconName="ArrowLeft"
            iconPosition="left"
            className="flex-1"
          >
            Back to Games
          </Button>
          <Button
            onClick={() => {
              setGameState('playing');
              setCurrentStep(0);
              setScore(0);
              setTimeRemaining(game?.timeLimit || 300);
              setStreak(0);
            }}
            iconName="RotateCcw"
            iconPosition="left"
            className="flex-1"
          >
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onExitGame}
          iconName="ArrowLeft"
          iconPosition="left"
          size="sm"
        >
          Exit Game
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} color="var(--color-error)" />
            <span className="font-mono font-bold text-error">{formatTime(timeRemaining)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Star" size={16} color="var(--color-success)" />
            <span className={`font-mono font-bold ${getScoreColor()}`}>{Math.round(score)}</span>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / gameData?.steps?.length) * 100}%` }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {gameData?.steps?.length}
        </p>
      </div>
      {/* Game Content */}
      <div className="bg-card border border-border rounded-xl p-6">
        {renderGameContent()}
      </div>
      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-center p-4 rounded-lg ${
              feedback?.type === 'success' ?'bg-success/10 border border-success/20 text-success' :'bg-error/10 border border-error/20 text-error'
            }`}
          >
            <Icon
              name={feedback?.type === 'success' ? 'CheckCircle' : 'XCircle'}
              size={24}
              color="currentColor"
              className="mx-auto mb-2"
            />
            <p className="font-body font-medium">{feedback?.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameInterface;