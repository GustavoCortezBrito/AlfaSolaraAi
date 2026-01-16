'use client';

import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = ['Localização', 'Consumo', 'Expansão', 'Revisão'];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {index > 0 && (
                <div className="flex-1 h-1 bg-gray-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > index ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                  currentStep >= index + 1
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: currentStep === index + 1 ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {index + 1}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gray-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > index + 1 ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
            <span className={`text-xs mt-2 text-center font-medium ${
              currentStep >= index + 1 ? 'text-cyan-400' : 'text-gray-500'
            }`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
