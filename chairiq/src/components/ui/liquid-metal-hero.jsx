import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function LiquidMetalHero({
  badge,
  title,
  subtitle,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  features = [],
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <LiquidMetal
        {...liquidMetalPresets?.[2]}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center space-y-8">
          {badge && (
            <div className="flex justify-center">
              <Badge 
                variant="secondary" 
                className="bg-foreground/10 text-foreground border-foreground/20"
              >
                {badge}
              </Badge>
            </div>
          )}
          
          <div className="space-y-6">
            <h1 
              role="heading" 
              aria-level={1}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-tight tracking-tight"
            >
              {title}
            </h1>
            
            <p 
              className="max-w-3xl mx-auto text-xl sm:text-2xl text-foreground/90 leading-relaxed"
            >
              {subtitle}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onPrimaryCtaClick}
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6 font-semibold"
            >
              {primaryCtaLabel}
            </Button>
            
            {secondaryCtaLabel && onSecondaryCtaClick && (
              <Button 
                onClick={onSecondaryCtaClick}
                variant="outline"
                size="lg"
                className="border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 text-lg px-8 py-6 font-semibold"
              >
                {secondaryCtaLabel}
              </Button>
            )}
          </div>
          
          {features?.length > 0 && (
            <div className="pt-12">
              <Card className="bg-foreground/10 border-foreground/20">
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features?.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-center text-center"
                      >
                        <p className="text-foreground/90 font-medium text-lg">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}