import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Download, RefreshCw, Ruler, DollarSign, Package, Info, Sparkles, ArrowRight, Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { H2, H3, Body, SectionBadge } from '../ui/Typography';

// Animated Counter
const AnimatedValue = ({ value, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 500;
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + (value - startValue) * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  
  return (
    <span>
      {prefix}{displayValue.toFixed(value % 1 === 0 ? 0 : 2)}{suffix}
    </span>
  );
};

// Input Field Component
const InputField = ({ label, value, onChange, placeholder, unit, icon: Icon }) => (
  <div className="space-y-2">
    <label className="text-sm text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-teal" />}
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-4 text-white text-lg font-medium placeholder-gray-600 focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20 transition-all"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          {unit}
        </span>
      )}
    </div>
  </div>
);

// Select Field Component
const SelectField = ({ label, value, onChange, options, icon: Icon }) => (
  <div className="space-y-2">
    <label className="text-sm text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-teal" />}
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-4 text-white text-lg font-medium focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20 transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-blue-300/15">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

// Result Card
const ResultCard = ({ icon: IconComponent, label, value, subValue, highlight = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`p-6 rounded-2xl border ${
      highlight 
        ? 'bg-linear-to-br from-teal/20 to-teal/5 border-teal/30' 
        : 'bg-blue-300/15 border-blue-200/25'
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        highlight ? 'bg-teal/20 text-teal' : 'bg-blue-300/10 text-slate-300'
      }`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <span className="text-slate-300 text-sm">{label}</span>
    </div>
    <div className={`text-3xl font-bold ${highlight ? 'gradient-text' : 'text-white'}`}>
      {value}
    </div>
    {subValue && (
      <div className="text-slate-400 text-sm mt-1">{subValue}</div>
    )}
  </motion.div>
);

export const MaterialCalculator = () => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('feet');
  const [wasteFactor, setWasteFactor] = useState(10);
  const [pricePerSqFt, setPricePerSqFt] = useState(125);
  const [showResults, setShowResults] = useState(false);
  
  const [results, setResults] = useState({
    area: 0,
    totalArea: 0,
    totalCost: 0,
    panelsNeeded: 0
  });

  const calculate = useCallback(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    
    if (w === 0 || h === 0) {
      setShowResults(false);
      setResults({ area: 0, totalArea: 0, totalCost: 0, panelsNeeded: 0 });
      return;
    }

    // Convert to sq ft
    let areaSqFt = w * h;
    if (unit === 'meters') {
      areaSqFt = areaSqFt * 10.764;
    }

    const wasteMultiplier = 1 + (wasteFactor / 100);
    const totalAreaSqFt = areaSqFt * wasteMultiplier;
    const totalCost = totalAreaSqFt * pricePerSqFt;
    
    // Assuming standard panel size covers approx 8.33 sq ft (10ft x 10inch)
    const panelArea = 8.33;
    const panelsNeeded = Math.ceil(totalAreaSqFt / panelArea);

    setResults({
      area: areaSqFt,
      totalArea: totalAreaSqFt,
      totalCost: totalCost,
      panelsNeeded: panelsNeeded
    });
    
    setShowResults(true);
  }, [width, height, unit, wasteFactor, pricePerSqFt]);

  useEffect(() => {
    if (width && height) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: auto-calculate when inputs change
      calculate();
    }
  }, [width, height, unit, wasteFactor, pricePerSqFt, calculate]);

  const reset = () => {
    setWidth('');
    setHeight('');
    setUnit('feet');
    setWasteFactor(10);
    setPricePerSqFt(125);
    setShowResults(false);
    setResults({ area: 0, totalArea: 0, totalCost: 0, panelsNeeded: 0 });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionBadge className="mb-6">
          <Calculator className="w-4 h-4" />
          Smart Calculator
        </SectionBadge>
        
        <H2 className="mb-4">
          Material <span className="gradient-text">Calculator</span>
        </H2>
        
        <Body className="max-w-2xl mx-auto text-slate-300">
          Calculate exactly how much material you need for your project. 
          Get instant estimates for area, cost, and number of panels required.
        </Body>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <H3>Enter Dimensions</H3>
                  <p className="text-slate-400 text-sm">Measure your wall or ceiling area</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Width"
                    value={width}
                    onChange={setWidth}
                    placeholder="0"
                    icon={Ruler}
                  />
                  <InputField
                    label="Height"
                    value={height}
                    onChange={setHeight}
                    placeholder="0"
                    icon={Ruler}
                  />
                </div>

                {/* Unit Selection */}
                <SelectField
                  label="Unit Type"
                  value={unit}
                  onChange={setUnit}
                  options={[
                    { value: 'feet', label: 'Feet' },
                    { value: 'meters', label: 'Meters' },
                  ]}
                />

                {/* Waste Factor */}
                <div className="space-y-3">
                  <label className="text-sm text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-teal" />
                      Waste Factor
                    </span>
                    <span className="text-teal font-medium">+{wasteFactor}%</span>
                  </label>
                  <div className="flex gap-2">
                    {[0, 5, 10, 15].map((factor) => (
                      <button
                        key={factor}
                        onClick={() => setWasteFactor(factor)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          wasteFactor === factor
                            ? 'bg-teal text-white'
                            : 'bg-blue-300/15 text-slate-300 hover:bg-blue-300/10'
                        }`}
                      >
                        +{factor}%
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    {wasteFactor === 10 ? '(Recommended)' : wasteFactor === 0 ? '(Exact fit)' : wasteFactor === 15 ? '(Complex patterns)' : ''}
                  </p>
                </div>

                {/* Price per sqft - For estimation */}
                <div className="space-y-2">
                  <InputField
                    label="Estimated Price per sqft"
                    value={pricePerSqFt}
                    onChange={(v) => setPricePerSqFt(Number(v))}
                    placeholder="125"
                    unit="Rs."
                    icon={DollarSign}
                  />
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Enter your dealer price for accurate estimates
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={reset}
                    icon={RefreshCw}
                    iconPosition="left"
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    onClick={calculate}
                    icon={Calculator}
                    iconPosition="left"
                    className="flex-1"
                    glow
                  >
                    Calculate
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <H3>Your Estimate</H3>
                  <p className="text-slate-400 text-sm">Calculated material requirements</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showResults ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Results Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <ResultCard
                        icon={Ruler}
                        label="Base Area"
                        value={<AnimatedValue value={results.area} suffix=" sqft" />}
                        subValue="Before waste"
                      />
                      <ResultCard
                        icon={Package}
                        label="Total Area"
                        value={<AnimatedValue value={results.totalArea} suffix=" sqft" />}
                        subValue={`+${wasteFactor}% waste included`}
                      />
                    </div>

                    <ResultCard
                      icon={Package}
                      label="Panels Needed"
                      value={<AnimatedValue value={results.panelsNeeded} suffix=" panels" />}
                      subValue="Standard size (10ft x 10in)"
                    />

                    <ResultCard
                      icon={DollarSign}
                      label="Estimated Cost"
                      value={<AnimatedValue value={results.totalCost} prefix="Rs." />}
                      subValue="Contact dealer for final pricing"
                      highlight
                    />

                    {/* Quick Info */}
                    <div className="p-4 rounded-xl bg-teal/10 border border-teal/20 mt-6">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-white font-medium mb-1">Ready to proceed?</p>
                          <p className="text-slate-300">
                            Get a detailed quote with installation options from our team.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" icon={Download} className="flex-1">
                        Download PDF
                      </Button>
                      <Button variant="primary" icon={ArrowRight} className="flex-1" glow>
                        Get Quote
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-80 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-blue-300/15 flex items-center justify-center mb-6">
                      <Calculator className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-400 mb-2">Enter dimensions to see results</p>
                    <p className="text-slate-300 text-sm">
                      Your calculated estimate will appear here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};



