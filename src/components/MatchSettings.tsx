import React from 'react';
import { Globe, Trophy } from 'lucide-react';
import type { Region, SkillLevel } from '../types/game';

interface MatchSettingsProps {
  region: Region;
  skillLevel: SkillLevel;
  onRegionChange: (region: Region) => void;
  onSkillLevelChange: (level: SkillLevel) => void;
  disabled: boolean;
}

export function MatchSettings({
  region,
  skillLevel,
  onRegionChange,
  onSkillLevelChange,
  disabled
}: MatchSettingsProps) {
  const regions: Region[] = ['AUTO', 'EU', 'NA', 'ASIA'];
  const skillLevels: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-yellow-600" />
          <span className="font-semibold text-yellow-800">Region</span>
        </div>
        <div className="flex gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              disabled={disabled}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${region === r
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-yellow-600" />
          <span className="font-semibold text-yellow-800">Skill Level</span>
        </div>
        <div className="flex gap-2">
          {skillLevels.map((level) => (
            <button
              key={level}
              onClick={() => onSkillLevelChange(level)}
              disabled={disabled}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${skillLevel === level
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}