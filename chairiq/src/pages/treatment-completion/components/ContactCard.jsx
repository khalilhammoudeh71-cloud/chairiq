import React from 'react';
import Icon from '../../../components/AppIcon';


const ContactCard = ({ currentLanguage = 'en' }) => {
  const content = {
    en: {
      title: 'Need Help?',
      subtitle: 'If you have questions about your treatment plan or need assistance.',
      contactOffice: 'Contact Your Dental Office',
      officeHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
      emergency: 'Emergency Contact',
      emergencyNote: 'For dental emergencies outside office hours',
      supportEmail: 'support@chairiq.com',
      emailNote: 'Technical support and questions about this app'
    },
    es: {
      title: '¿Necesita Ayuda?',
      subtitle: 'Si tiene preguntas sobre su plan de tratamiento o necesita asistencia.',
      contactOffice: 'Contacte Su Consultorio Dental',
      officeHours: 'Lunes - Viernes: 8:00 AM - 6:00 PM',
      emergency: 'Contacto de Emergencia',
      emergencyNote: 'Para emergencias dentales fuera del horario de oficina',
      supportEmail: 'support@chairiq.com',
      emailNote: 'Soporte técnico y preguntas sobre esta aplicación'
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">
          {text?.title}
        </h2>
        <p className="text-muted-foreground">
          {text?.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* Dental Office Contact */}
        <div className="flex gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Building2" size={24} className="text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground mb-2">
              {text?.contactOffice}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>{text?.officeHours}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Phone" size={16} className="text-primary" />
                <span className="text-primary font-medium">(555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="flex gap-4 p-4 rounded-lg bg-error/5 border border-error/10">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="text-error" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground mb-2">
              {text?.emergency}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {text?.emergencyNote}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Phone" size={16} className="text-error" />
              <span className="text-error font-medium">(555) 999-8888</span>
            </div>
          </div>
        </div>

        {/* App Support */}
        <div className="flex gap-4 p-4 rounded-lg bg-muted/20">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center">
              <Icon name="HelpCircle" size={24} className="text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground mb-2">
              ChairIQ Support
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {text?.emailNote}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Mail" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">{text?.supportEmail}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;