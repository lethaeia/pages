import { LucideIcon } from 'lucide-react';

export interface TileData {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  url: string;
  color?: string; // Optional accent color for the icon
  size?: 'small' | 'medium' | 'large' | 'wide';
  customType?: 'dino' | 'link' | 'email'; // New field to identify special tiles
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  location: string;
}