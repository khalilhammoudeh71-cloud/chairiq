import React from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TreatmentOverviewCard = ({ procedureCount, estimatedTimeline, heroImage, heroImageAlt, currentLanguage }) => {
  const content = {
    en: {
      procedures: "Procedures",
      timeline: "Estimated Timeline",
      weeks: "weeks",
      overview: "Treatment Overview",
      description: "Your personalized treatment plan has been carefully designed by your dental team to restore your oral health and give you the smile you deserve."
    },
    es: {
      procedures: "Procedimientos",
      timeline: "Cronograma Estimado",
      weeks: "semanas",
      overview: "Resumen del Tratamiento",
      description: "Su plan de tratamiento personalizado ha sido cuidadosamente diseñado por su equipo dental para restaurar su salud bucal y darle la sonrisa que se merece."
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="treatment-overview-card bg-card border-2 border-border rounded-lg shadow-md overflow-hidden mb-8">
      <div className="relative h-[70vh] md:h-[75vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.1, 1.05, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
          className="w-full h-full"
        >
          <Image 
            src={heroImage}
            alt={heroImageAlt}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0.6 }}
          animate={{ 
            opacity: [0.6, 0.4, 0.5, 0.4, 0.6],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 bg-[var(--overlay)]" />
        </motion.div>

        <div className="absolute bottom-8 left-4 right-4 md:bottom-12 md:left-8 md:right-8">
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: [20, 0, 0, 0, 20],
              opacity: [0, 1, 1, 1, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.1, 0.45, 0.9, 1]
            }}
          >
            {text?.overview}
          </motion.h2>
          
          <motion.div
            className="h-1 bg-accent rounded-full"
            initial={{ width: '0%' }}
            animate={{ 
              width: ['0%', '60%', '60%', '0%']
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1]
            }}
          />
        </div>
      </div>
      <div className="p-6">
        <p className="text-base text-card-foreground leading-relaxed mb-6">
          {text?.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ClipboardList" size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-primary mb-1">
                {procedureCount}
              </p>
              <p className="text-sm text-muted-foreground">
                {text?.procedures}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-secondary/10 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-secondary mb-1">
                {estimatedTimeline}
              </p>
              <p className="text-sm text-muted-foreground">
                {text?.weeks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentOverviewCard;
