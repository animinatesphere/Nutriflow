import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="absolute -top-1 right-0 transform translate-x-1/2">
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>
      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <motion.div
              key={step?.id}
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-success border-success text-success-foreground' 
                    : isCurrent 
                    ? 'bg-primary border-primary text-primary-foreground animate-pulse' 
                    : 'bg-muted border-border text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Icon name="Check" size={16} color="white" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              {/* Step Label */}
              <div className="text-center">
                <p
                  className={`
                    text-xs font-medium transition-colors duration-300
                    ${isCurrent 
                      ? 'text-primary' 
                      : isCompleted 
                      ? 'text-success' :'text-muted-foreground'
                    }
                  `}
                >
                  {step?.label}
                </p>
                {step?.description && (
                  <p className="text-xs text-muted-foreground mt-1 max-w-20 leading-tight">
                    {step?.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Current Step Info */}
      <motion.div
        className="mt-6 text-center"
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          {steps?.[currentStep - 1]?.title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {steps?.[currentStep - 1]?.subtitle}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProgressIndicator;