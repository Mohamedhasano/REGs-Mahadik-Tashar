import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/50 to-yellow-600/50 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img 
          src="/regs-logo.jpg" 
          alt="REGs Global Logo" 
          className={`relative ${sizes[size]} object-contain group-hover:scale-110 transition-transform duration-300`}
        />
      </div>
      {showText && (
        <div>
          <div className={`font-black ${textSizes[size]} bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent`}>
            REGs GLOBAL
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">
            Powered by Sidra Chain
          </div>
        </div>
      )}
    </Link>
  );
}

