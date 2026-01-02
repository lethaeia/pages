import { 
  Github, 
  Contact,
  Mail, 
  Music, 
  Heart, 
  Gamepad2, 
  Tv, 
} from 'lucide-react';
import { TileData, UserProfile } from './types';

export const CUSTOM_BACKGROUND_URL = "https://raw.githubusercontent.com/lethaeia/Pages/main/Background.png"; 

export const USER_PROFILE: UserProfile = {
  name: "浅曦",
  title: "INFJ-T ; 社恐",
  bio: `我会试着做的更好~珍惜每一次相遇的缘分~
  I will try to be a better person and treasure the serendipity of every encounter.`,
  avatarUrl: "https://raw.githubusercontent.com/lethaeia/Pages/main/Avater.jpg",
  location: "China"
};

export const TILES: TileData[] = [
  {
    id: '1',
    title: 'GitHub',
    description: '我的Github链接，还是萌新',
    icon: Github,
    url: 'https://github.com/lethaeia',
    size: 'medium',
  },
  {
    id: '2',
    title: 'VRC',
    description: 'VRC好友链接，可以一起玩',
    icon: Contact,
    url: 'https://vrchat.com/home/user/usr_44f78747-d822-4f29-a6d4-56b75ff31c99',
    size: 'small',
  },
  {
    id: '3',
    title: 'Email',
    description: 'secret0436@outlook.com 可能不怎么看邮件',
    icon: Mail,
    url: 'secret0436@outlook.com',
    size: 'small',
    customType: 'email',
  },
  {
    id: '4',
    title: '网易云音乐',
    description: '比较杂乱的歌单...',
    icon: Music,
    url: 'https://y.music.163.com/m/playlist?id=2352571405&creatorId=1546539951',
    size: 'medium',
  },
  {
    id: '5',
    title: '小游戏',
    description: '点我!',
    icon: Gamepad2,
    url: '#',
    size: 'wide',
    customType: 'dino'
  },
  {
    id: '6',
    title: 'Bilibili',
    description: 'B站主页',
    icon: Tv,
    url: 'https://space.bilibili.com/349507788',
    size: 'medium',
  },
  {
    id: '7',
    title: 'Tiktok',
    description: '抖音主页',
    icon: Heart,
    url: 'https://www.douyin.com/user/MS4wLjABAAAAFdYW_gE5a07kiT4TzIUeI92YhKS8q8x-oBl0nCJ4i1xXoFFsufrqmJMroUDvhvjN',
    size: 'small',
  }
];
